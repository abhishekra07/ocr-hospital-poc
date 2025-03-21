# 🏥 Patient Profile OCR Automation

This project automates hospital data entry using **OCR (Optical Character Recognition)**. It extracts patient details, doctor information, clinic details, and medical observations from uploaded images or PDFs. The extracted data is displayed in a structured format with an intuitive **React** frontend.

## 🚀 Features

- ✅ **Upload Images/PDFs** – Drag & Drop support for easy file selection.
- 🔍 **OCR Extraction** – Automatically extracts patient, doctor, and clinic details.
- 📋 **Observations & Diagnosis** – Displays extracted medical notes in structured cards.
- 📷 **File Preview** – Users can preview uploaded images or PDFs before processing.
- 🖼 **Full-Screen View** – Click on the preview to open it in a full-screen modal.
- 🎭 **Snackbar Notification** – Success toast notification after successful OCR processing.
- ⏳ **Loading Indicator** – Displays a progress bar while processing.
- 🧹 **Clear Form** – Button to reset all extracted data.

## 📦 Tech Stack

- **Frontend**: React, Material UI
- **Backend**: Node.js, Express.js
- **OCR Engine**: Tesseract.js
- **Styling**: Material UI Components

## 🛠 Setup & Installation

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-repo/patient-profile-ocr.git
cd patient-profile-ocr
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Start the Development Server

```bash
npm start
```

The app will be available at **http://localhost:5000**

---

## 📌 How to Use

1. **Upload an image or PDF** (containing patient details, prescriptions, or medical forms).
2. **Wait for the OCR processing** (A progress bar appears while processing).
3. **View extracted details** (Patient, doctor, and clinic details are automatically filled).
4. **Check Observations & Diagnosis** (Medical observations are displayed in structured cards).
5. **Preview the uploaded file** (Click on the thumbnail to view it in full-screen mode).
6. **Save Profile or Clear Data** (Use action buttons to save or reset the form).

---

## 📷 UI Screenshots

| File Upload                               | Extracted Data                                      | File Preview                                    |
| ----------------------------------------- | --------------------------------------------------- | ----------------------------------------------- |
| ![Upload](screenshots/prescription-1.png) | ![Extracted Data](screenshots/data-extracted-1.png) | ![Full Preview](screenshots/file-preview-1.png) |

---

## 🛠 Future Enhancements

- 🌐 **API Integration** – Connect extracted data to a hospital database.
- 📊 **Analytics Dashboard** – View trends in patient data.
- 🏥 **Multi-File Upload Support** – Process multiple documents in one go.
- 🔎 **Enhanced OCR Accuracy** – Use AI-based text recognition for better accuracy.

---

👨‍💻 **Developed by:** _Abhishek Rathore_
