import React from "react";
import { Container,Paper,Typography,Box,} from "@mui/material";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import Footer from "../Common/Footer";

const practices = [
  "Continuous Monitoring of Student Attendance through tutorial system",
  "Maintenance of the plantation",
  "Maintenance of solar lights",
  "Quality check at various levels and quality enhancement protocols implemented",
  "Digitalization of Admission process",
  "Decentralization in the admission process",
  "Conducting of Administrative and Academic Audit by External Experts",
  "Analysis of research articles in journals published by the faculty members",
  "Plantation of trees throughout the campus",
  "Digitalization of Library",
];

const InnovativePractices = () => {
  return (
    <>
      <Container maxWidth="xl" sx={{ py: 5 }}>
        <Paper
          elevation={3}
          sx={{
            p: { xs: 2, md: 4 },
            borderRadius: 3,
            bgcolor: "#fff",
          }}
        >
          {/* Title */}
          <Typography
            variant="h4"
            align="center"
            sx={{
              fontWeight: 700,
              color: "#1a3e8c",
              textTransform: "uppercase",
              mb: 4,
            }}
          >
            Innovative Practices
          </Typography>

          {/* Practice List */}
          <Box>
            {practices.map((text, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  mb: 2.5,
                }}
              >
                <ArrowRightAltIcon
                  sx={{
                    color: "#1976d2",
                    mr: 1.5,
                    mt: "2px",
                    fontSize: 28,
                  }}
                />

                <Typography
                  variant="body1"
                  sx={{
                    fontSize: "15.5px",
                    lineHeight: 1.8,
                    textAlign: "justify",
                  }}
                >
                  {text}
                </Typography>
              </Box>
            ))}
          </Box>
        </Paper>
      </Container>

      <Footer />
    </>
  );
};

export default InnovativePractices;