import React from "react";
import { Box, Container, Typography, Breadcrumbs, Link, Stack } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import Footer from "../Common/Footer";

export default function VisionMission() {
  return (
    <>
    <Box sx={{ bgcolor: "#f5f5f5", minHeight: "50vh" }}>
      <Container sx={{ py: 6 }}>
        <Typography
          variant="h4"
          align="center"
          sx={{ fontWeight: 700, color: "#0f2747", mb: 2 }}
        >
          Vision & Mission
        </Typography>
        <Stack spacing={2}>
          {[
            "Our vision is to empower our students to be the architects of their future, to embrace tradition, and drive progress.",
            "Our mission is to educate our students about the importance of sustainable practices and to instill values of social responsibility, ethics, and leadership in every graduate."
          ].map((text, i) => (
            <Box key={i} sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
              <CheckIcon sx={{ color: "#4caf50", mt: 0.3 }} />
              <Typography sx={{ fontSize: "1.1rem", lineHeight: 1.8 }}>
                {text}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Container>
    </Box>
    <Footer />
    </>
  );
}