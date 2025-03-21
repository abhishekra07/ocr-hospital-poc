require("dotenv").config();
const express = require("express");
const multer = require("multer");
const fs = require("fs");
const pdfParse = require("pdf-parse");
const Tesseract = require("tesseract.js");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const port = 5000;
app.use(express.json());
app.use(require("cors")());

const upload = multer({ dest: "uploads/" });
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// Extract text from an image using Tesseract OCR
async function extractTextFromImage(imagePath) {
  try {
    const {
      data: { text },
    } = await Tesseract.recognize(imagePath, "eng");
    return text.trim();
  } catch (error) {
    throw new Error("Error extracting text from image.");
  }
}

// Extract text from a PDF
async function extractTextFromPDF(pdfPath) {
  try {
    const dataBuffer = fs.readFileSync(pdfPath);
    const pdfData = await pdfParse(dataBuffer);
    return pdfData.text.trim();
  } catch (error) {
    throw new Error("Error extracting text from PDF.");
  }
}

// Function to process text using Gemini AI
async function processWithAI(extractedText) {
  const prompt = `
    Extract the following details from the provided paragraph: name, age, dob, contact number, gender, doctor name, qualification, reginstration no, clinic details, obervations if any, diagnosi if any.
    Please return **only** a valid JSON object without any extra text or comments.
    The result should be in the following JSON structure:
    {
      "patientDetails": {
        "name": "Full name extracted from the paragraph",
        "age": "Age extracted from the paragraph",
        "dob": "Date of birth extracted from the paragraph, please validate the date, it shouldn't be prescription date",
        "gender": "Gender extracted from the paragraph",
        "contactNumber": "Contact Number extracted from the paragraph"
      },
      "doctorDetails":
        {
          "doctorName": "Course name extracted from the paragraph",
          "qualification": "Institute name extracted from the paragraph",
          "registrationNo": "Board/University name extracted from the paragraph"
        },
      "clinicDetails":
        {
          "clinicName": "Clinic Name extracted from the paragraph",
          "address": "Address extracted from the paragraph",
          "phoneNumber": "Phone Number extracted from the paragraph",
          "zipcode": "Zip Code extracted from the paragraph"
        },
      "observations": ["Extract observations from the paragraph"],
      "diagnosis": ["Extract Diagnosis from the paragraph"]
    }
    Paragraph: ${extractedText}
  `;

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const generatedText = await response.text();

  // Clean and parse JSON
  const cleanText = generatedText.replace(/```json|```/g, "").trim();
  return JSON.parse(cleanText);
}

// API to upload and process a file
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    let extractedText = "";

    if (req.file.mimetype === "application/pdf") {
      extractedText = await extractTextFromPDF(req.file.path);
    } else {
      extractedText = await extractTextFromImage(req.file.path);
    }

    if (!extractedText) {
      return res.status(400).json({ error: "No text extracted from file" });
    }

    const responseData = await processWithAI(extractedText);
    fs.unlinkSync(req.file.path); // Delete the file after processing

    res.json({ success: true, data: responseData });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
