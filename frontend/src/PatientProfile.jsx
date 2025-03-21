import React, { useState } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import {
  TextField,
  Button,
  Grid,
  Paper,
  Typography,
  Divider,
  Box,
  Container,
  Snackbar,
  Alert,
  Card,
  CardContent,
  LinearProgress,
  Dialog,
  DialogContent,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

const PatientProfile = () => {
  const [patientData, setPatientData] = useState({
    name: "",
    age: "",
    dob: "",
    gender: "",
    contactNumber: "",
  });

  const [doctorData, setDoctorData] = useState({
    doctorName: "",
    qualification: "",
    registrationNo: "",
  });

  const [clinicData, setClinicData] = useState({
    clinicName: "",
    address: "",
    phoneNumber: "",
    zipcode: "",
  });

  const [observations, setObservations] = useState([]);
  const [diagnosis, setDiagnosis] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [filePreview, setFilePreview] = useState(null);
  const [openPreview, setOpenPreview] = useState(false);

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop: async (acceptedFiles) => {
      setLoading(true);
      const file = acceptedFiles[0];
      setFilePreview(URL.createObjectURL(file)); // Store file preview URL

      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await axios.post(
          "http://localhost:5000/upload",
          formData
        );

        console.log("response.data ", response.data);
        const extractedData = response.data.data;

        setPatientData(extractedData.patientDetails || {});
        setDoctorData(extractedData.doctorDetails || {});
        setClinicData(extractedData.clinicDetails || {});
        setObservations(extractedData.observations || []);
        setDiagnosis(extractedData.diagnosis || []);

        // Show success notification
        setOpenSnackbar(true);
      } catch (error) {
        alert("Error processing image");
      }
      setLoading(false);
    },
  });

  const handleChange = (event, section, key) => {
    const { value } = event.target;
    if (section === "patient") setPatientData({ ...patientData, [key]: value });
    if (section === "doctor") setDoctorData({ ...doctorData, [key]: value });
    if (section === "clinic") setClinicData({ ...clinicData, [key]: value });
  };

  const clearForm = () => {
    setPatientData({
      name: "",
      age: "",
      dob: "",
      gender: "",
      contactNumber: "",
    });
    setDoctorData({
      doctorName: "",
      qualification: "",
      registrationNo: "",
    });
    setClinicData({
      clinicName: "",
      address: "",
      phoneNumber: "",
      zipcode: "",
    });
    setObservations([]);
    setDiagnosis([]);
    setFilePreview(null);
  };

  return (
    <Container>
      <Paper elevation={3} sx={{ p: 4, mt: 4, textAlign: "center" }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Patient Profile
        </Typography>

        {loading && <LinearProgress sx={{ my: 2 }} />}

        {/* File Upload Section */}
        <Box
          {...getRootProps()}
          sx={{
            border: "2px dashed #0096C7",
            padding: "20px",
            textAlign: "center",
            my: 3,
            cursor: "pointer",
            borderRadius: "8px",
            backgroundColor: "#f9f9f9",
          }}
        >
          <input {...getInputProps()} />
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            Drag & drop a document here, or click to upload
          </Typography>
        </Box>

        {/* Grid Layout */}
        <Grid container spacing={3}>
          {/* File Preview Section */}
          {filePreview && (
            <>
              <Grid item xs={6} md={6}>
                <Section title="Uploaded File">
                  <Box
                    sx={{
                      textAlign: "center",
                      cursor: "pointer",
                      border: "1px solid #ddd",
                      padding: "10px",
                      borderRadius: "8px",
                      backgroundColor: "#f5f5f5",
                    }}
                    onClick={() => setOpenPreview(true)}
                  >
                    {filePreview.endsWith(".pdf") ? (
                      <>
                        <PictureAsPdfIcon color="error" fontSize="large" />
                        <Typography variant="body2">
                          Click to view PDF
                        </Typography>
                      </>
                    ) : (
                      <img
                        src={filePreview}
                        alt="Uploaded"
                        width="100%"
                        height="150px"
                      />
                    )}
                  </Box>
                </Section>
              </Grid>
              <Grid item xs={6} md={6}></Grid>
            </>
          )}

          <Grid item xs={12} md={6}>
            <Section title="Patient Details">
              {renderTextFields(patientData, "patient")}
            </Section>
          </Grid>

          <Grid item xs={12} md={6}>
            <Section title="Doctor Details">
              {renderTextFields(doctorData, "doctor")}
            </Section>
          </Grid>

          <Grid item xs={12} md={6}>
            <Section title="Clinic Details">
              {renderTextFields(clinicData, "clinic")}
            </Section>
          </Grid>

          <Grid item xs={12} md={6}>
            <ObservationsCard title="Observations" data={observations} />
            <ObservationsCard title="Diagnosis" data={diagnosis} />
          </Grid>
        </Grid>

        {/* Action Buttons */}
        <Box mt={3} display="flex" justifyContent="center" gap={2}>
          <Button variant="contained" color="primary">
            Save Profile
          </Button>
          <Button variant="contained" color="error" onClick={clearForm}>
            Clear
          </Button>
        </Box>

        {/* Success Snackbar */}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={2000}
          onClose={() => setOpenSnackbar(false)}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert severity="success" sx={{ width: "100%" }}>
            Data successfully extracted!
          </Alert>
        </Snackbar>
      </Paper>

      {/* Full-Screen Preview Dialog */}
      <Dialog
        open={openPreview}
        onClose={() => setOpenPreview(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogContent>
          <IconButton
            onClick={() => setOpenPreview(false)}
            sx={{ position: "absolute", top: 8, right: 8 }}
          >
            <CloseIcon />
          </IconButton>

          {filePreview?.endsWith(".pdf") ? (
            <iframe
              src={filePreview}
              width="100%"
              height="600px"
              title="PDF Preview"
            ></iframe>
          ) : (
            <img src={filePreview} alt="Full View" style={{ width: "100%" }} />
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
};

// Reusable Section Component
const Section = ({ title, children }) => (
  <Box sx={{ textAlign: "left" }}>
    <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
      {title}
    </Typography>
    <Divider sx={{ mb: 2 }} />
    {children}
  </Box>
);

// Reusable TextFields Renderer
const renderTextFields = (data, section) => (
  <Grid container spacing={2}>
    {Object.keys(data).map((key) => (
      <Grid item xs={12} sm={6} key={key}>
        <TextField
          fullWidth
          label={formatLabel(key)}
          value={data[key] || ""}
          onChange={(e) => handleChange(e, section, key)}
          variant="outlined"
        />
      </Grid>
    ))}
  </Grid>
);

// Reusable Observations & Diagnosis Card
const ObservationsCard = ({ title, data }) => (
  <Card sx={{ mt: 2, borderRadius: 2, backgroundColor: "#f5f5f5" }}>
    <CardContent>
      <Typography variant="h6" fontWeight="bold">
        {title}
      </Typography>
      <Divider sx={{ my: 1 }} />
      {data.length > 0 ? (
        data.map((item, index) => (
          <Typography key={index} variant="body1" sx={{ my: 0.5 }}>
            • {item}
          </Typography>
        ))
      ) : (
        <Typography variant="body2" color="textSecondary">
          No {title.toLowerCase()} found.
        </Typography>
      )}
    </CardContent>
  </Card>
);

// Helper function to format labels
const formatLabel = (key) =>
  key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());

export default PatientProfile;
