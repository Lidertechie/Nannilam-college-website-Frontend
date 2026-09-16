// components/CoursesOffered.jsx
import React from "react";
import { Container, Typography, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import Table from "../Common/Reusabletable";
import Footer from "../Common/Footer";

const coursesHeaders = [
  "S.No",
  "Course Offered",
  "Medium of Instruction",
];

const ugRows = [
  ["1", "B.A., Tamil", "Tamil"],
  ["2", "B.A., English", "English"],
  ["3", "B.A., History", "English"],
  ["4", "B.Sc., Mathematics", "English"],
  ["5", "B.Sc., Computer Science", "English"],
  ["6", "B.Com., (Commerce)", "English"],
  ["7", "B.B.A., (Business Administration)", "English"],
];

const pgRows = [
  ["1", "M.A., Tamil", "Tamil"],
  ["2", "M.Sc., Mathematics", "English"],
];

const StyledContainer = styled(Container)({
  marginTop: "36px",
  maxWidth: "1500px",
  marginLeft: "auto",
  marginRight: "auto",
  padding: "0 16px",
});

const SectionTitle = styled(Typography)({
  fontSize: "22px",
  fontWeight: 700,
  color: "#1a3e8c",
  marginTop: "36px",
  marginBottom: "14px",
});

const SubSectionTitle = styled(Typography)({
  fontSize: "17px",
  fontWeight: 700,
  color: "#374151",
  marginTop: "20px",
  marginBottom: "10px",
});

const DescriptionText = styled(Typography)({
  fontSize: "15.5px",
  textAlign: "justify",
  marginBottom: "16px",
});

const TableWrapper = styled(Box)({
  overflowX: "auto",
});

export default function CoursesOffered() {
  return (
    <>
      <StyledContainer maxWidth={false}>
        <SectionTitle variant="h2">
          Courses Offered
        </SectionTitle>

        <DescriptionText style={{ textAlign: "center" }}>
          Undergraduate and Postgraduate programmes currently offered.
        </DescriptionText>

        <SubSectionTitle variant="h3">
          B.A. / B.Sc. / B.Com. / B.B.A. (Courses)
        </SubSectionTitle>

        <TableWrapper>
          <Table
            headers={coursesHeaders}
            rows={ugRows}
          />
        </TableWrapper>

        <SubSectionTitle variant="h3" sx={{ marginTop: "32px" }}>
          M.A. / M.Sc. (Courses)
        </SubSectionTitle>

        <TableWrapper  sx={{ mb: 10 }}>
          <Table
            headers={coursesHeaders}
            rows={pgRows}
          />
        </TableWrapper>
      </StyledContainer>
      <Footer />
    </>
  );
}