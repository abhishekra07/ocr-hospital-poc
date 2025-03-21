import React from "react";
import PatientProfile from "./PatientProfile";
import { Container, Typography, Box } from "@mui/material";

const App = () => {
  return (
    <Container
      maxWidth={false} // Full width
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        minHeight: "100vh", // Make it take full height
        textAlign: "center",
      }}
    >
      <Box mb={4}>
        <Typography variant="h4" fontWeight="bold">
          OCR-Based Hospital Data Entry
        </Typography>
      </Box>
      <PatientProfile />
    </Container>
  );
};

export default App;
