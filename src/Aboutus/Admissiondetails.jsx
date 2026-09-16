import React from "react";
import {Container, Typography, Box, Paper,} from "@mui/material";
import Table from "../Common/Reusabletable";
import Footer from "../Common/Footer";

const coursesHeaders = [
  "S.No",
  "Course Offered",
  "Medium of Instruction",
  "Section I",
  "Section II",
  "Total",
];

const ugRows = [
  ["1", "B.A., Tamil", "Tamil", "60", "-", "60"],
  ["2", "B.A., English", "English", "60", "60", "120"],
  ["3", "B.A., History", "English", "60", "-", "60"],
  ["4", "B.Sc., Mathematics", "English", "60", "-", "60"],
  ["5", "B.Sc., Computer Science", "English", "60", "-", "60"],
  ["6", "B.Com., (Commerce)", "English", "60", "60", "120"],
  ["7", "B.B.A., (Business Administration)", "English", "60", "-", "60"],
];

const ugTotalRow = ["", "Total Seats", "", "420", "120", "540"];

const pgRows = [
  ["1", "M.A., Tamil", "Tamil", "35", "-", "35"],
  ["2", "M.Sc., Mathematics", "English", "35", "-", "35"],
];

const pgTotalRow = ["", "Total Seats", "", "70", "0", "70"];

const CoursesOffered = () => {
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
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: "#1a3e8c",
              mb: 2,
            }}
          >
            Courses Offered
          </Typography>

          <Typography
            variant="body1"
            sx={{
              fontSize: "15.5px",
              textAlign: "center",
              mb: 4,
              lineHeight: 1.8,
            }}
          >
            Undergraduate and Postgraduate programmes currently offered.
          </Typography>

          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: "#374151",
              mb: 2,
            }}
          >
            B.A. / B.Sc. / B.Com. / B.B.A. (Courses and Sanctioned Seats)
          </Typography>

          <Box sx={{ overflowX: "auto", mb: 5 }}>
            <Table
              headers={coursesHeaders}
              rows={ugRows}
              totalRow={ugTotalRow}
            />
          </Box>

          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: "#374151",
              mb: 2,
            }}
          >
            M.A. / M.Sc. (Courses and Sanctioned Seats)
          </Typography>

          <Box sx={{ overflowX: "auto" }}>
            <Table
              headers={coursesHeaders}
              rows={pgRows}
              totalRow={pgTotalRow}
            />
          </Box>
        </Paper>
      </Container>

      <Footer />
    </>
  );
};

export default CoursesOffered;