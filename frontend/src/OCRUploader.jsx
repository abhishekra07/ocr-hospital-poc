import React, { useState } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";

const OCRUploader = () => {
  const [extractedText, setExtractedText] = useState("");
  const [loading, setLoading] = useState(false);

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop: async (acceptedFiles) => {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", acceptedFiles[0]);

      try {
        const response = await axios.post(
          "http://localhost:5000/upload",
          formData
        );
        setExtractedText(response.data.extractedText);
      } catch (error) {
        alert("Error processing image");
      }
      setLoading(false);
    },
  });

  return (
    <div>
      <div
        {...getRootProps()}
        style={{
          border: "2px dashed #0096C7",
          padding: "20px",
          textAlign: "center",
        }}
      >
        <input {...getInputProps()} />
        <p>Drag & drop a patient form image here, or click to select one.</p>
      </div>
      {loading ? <p>Processing...</p> : <pre>{extractedText}</pre>}
    </div>
  );
};

export default OCRUploader;
