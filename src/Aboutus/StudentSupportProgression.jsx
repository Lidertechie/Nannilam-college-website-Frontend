import React from "react";
import { Container, Typography, Box, Breadcrumbs, Link } from "@mui/material";
import { styled } from "@mui/material/styles";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Footer from "../Common/Footer";

const StyledContainer = styled(Box)(({ theme }) => ({
  background: "#F7F7F7",
  minHeight: "100%",
  padding: "0 24px 56px",
  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
}));

const ContentWrapper = styled(Container)({
  maxWidth: 1180,
  margin: "0 auto",
  padding: 0,
});

const StyledBreadcrumbs = styled(Breadcrumbs)({
  justifyContent: "center",
  padding: "14px 0 6px",
  "& .MuiBreadcrumbs-separator": {
    color: "#9AA0A6",
  },
  "& a": {
    color: "#4A90D9",
    textDecoration: "none",
    fontSize: 13,
    "&:hover": {
      textDecoration: "underline",
    },
  },
});

const StyledTypography = styled(Typography)({
  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  fontSize: 15.5,
  lineHeight: 1.9,
  color: "#2A2A2A",
  textAlign: "justify",
  textIndent: "2.5em",
  margin: 0,
});

export default function StudentSupportProgression() {
  return (
    <>
      <StyledContainer>
        {/* Title */}
        <Typography
          variant="h1"
          sx={{
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
            fontSize: { xs: "26px", sm: "clamp(26px, 3.2vw, 32px)" },
            fontWeight: 600,
            textAlign: "center",
            color: "#1A1A1A",
            margin: "18px 0 36px",
          }}
        >
          Student Support and Progression
        </Typography>

        {/* Body */}
        <ContentWrapper>
          <StyledTypography>
            Students with academic competencies are nominated as Class
            representatives and Students representative are nominated for
            Cultural, Sports, N.S.S etc. This is the form of the
            composition of the Student Council. Student Volunteers disseminate
            information from College administration and other committees to
            all students. They assist the teachers in planning, organizing and
            executing various student oriented activities. They act as
            mediators between students and teachers to share, discuss and
            Solve their problems, if any and have free access to the
            Principal. Students actively participate in cultural activities by
            promoting our customs and traditions. They take initiative in
            organizing events as varied and diverse as Pongal celebration,
            women&rsquo;s day celebration etc. Students also take active part
            in conducting Days like Traditional Day, Teacher&rsquo;s Day,
            Farewell functions and also take the responsibility of maintaining
            discipline on the Campus. N.S. S is one of the active units in our
            college that enhances the social and interpersonal skills of the
            students. Students are involved in planning and executing the year
            long activities of N.S. S including the field work. Students also
            show lot of enthusiastic support in innovative practices and best
            practices of the college, that include participation in activities
            related to gender consciousness, gender equity, our college also
            takes pride in engaging the students in value- added courses that
            help in creating a socially, ethically responsible citizen. They
            also work as conscious citizens by promoting environmental
            awareness through preparation of projects and environment related
            activities. Students avail of the opportunity of developing the
            soft skills that enhance their employability and make them more
            confident and presentable. All these practices show the active
            engagement of our students in all the activities that can lead
            them to over all personality development and enhance their
            communicative and professional skills. On various committees of
            the college, the representation has been given to the students.
          </StyledTypography>
        </ContentWrapper>
      </StyledContainer>
      <Footer />
    </>
  );
}