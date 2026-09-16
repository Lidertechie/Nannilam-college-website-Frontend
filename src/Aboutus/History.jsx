import React from "react";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import Footer from "../Common/Footer";

const GradientBorderBox = styled(Box)({
  marginTop: "50px",
  padding: "45px 50px",
  background: "linear-gradient(135deg, #f8f4ff 0%, #f0ecf9 100%)",
  borderRadius: "16px",
  border: "2px solid transparent",
  backgroundClip: "padding-box",
  boxShadow: "0 10px 40px rgba(26, 62, 140, 0.12)",
  textAlign: "center",
  maxWidth: "850px",
  marginLeft: "auto",
  marginRight: "auto",
  position: "relative",
  overflow: "hidden",
  "& .gradient-border": {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "6px",
    background: "linear-gradient(90deg, #1a3e8c, #4a7bc4, #1a3e8c)",
    backgroundSize: "200% 100%",
    animation: "gradientMove 3s linear infinite",
  },
  "@keyframes gradientMove": {
    "0%": { backgroundPosition: "200% 0" },
    "100%": { backgroundPosition: "-200% 0" },
  },
});

export default function History() {
  return (
    <>
      <Box sx={{ maxWidth: "1500px", margin: "0 auto", padding: "40px 20px", fontFamily: "Arial, Helvetica, sans-serif", color: "#1f2937", lineHeight: 1.7 }}>
        {/* Heading */}
        <Typography sx={{ fontSize: "32px", fontWeight: 800, color: "#1a3e8c", borderBottom: "3px solid #1a3e8c", paddingBottom: "10px", marginBottom: "24px", textAlign: "center" }}>
          HISTORY OF THE COLLEGE
        </Typography>

        {/* Logo below heading - centered */}
        <Box sx={{ display: "flex", justifyContent: "center", marginBottom: "30px" }}>
          <Box
            component="img"
            src="/collegelogo.jpeg"
            alt="College Logo"
            sx={{ width: "120px", height: "120px", objectFit: "contain" }}
          />
        </Box>

        <Typography sx={{ fontSize: "15.5px", textAlign: "justify", marginBottom: "16px", lineHeight: 1.7 }}>
          In the 2011-2012 academic year, under the leadership of Tamil Nadu
          Chief Minister Dr. Selvi J. Jayalalithaa, as per a policy decision
          made in the Tamil Nadu Legislative Assembly, it was resolved to
          establish 41 new colleges affiliated with the existing universities
          of Tamil Nadu that were already functioning as per law. Of these, 10
          colleges were allotted to Bharathidasan University, Tiruchirappalli.
          Our Nannilam College is one among them.
        </Typography>

        <Typography sx={{ fontSize: "15.5px", textAlign: "justify", marginBottom: "16px", lineHeight: 1.7 }}>
          The long-standing request of the people of the Nannilam area was
          placed before the Legislative Assembly by the local Assembly member,
          who was then the Minister for Food and Civil Supplies and Consumer
          Protection, Thiru R. Kamaraj. The request was subsequently accepted
          by the Chief Minister. With the concurrence of the Higher Education
          Minister Thiru Pon. Muneeswaran, five departments — Tamil, English,
          Commerce, Business Administration, and Mathematics — were sanctioned.
          Professor Dr. C. Gopendran, from the Department of Sociology at
          Bharathidasan University, was appointed as the first
          Principal-in-Charge, along with 10 teaching staff and 2 non-teaching
          staff. With the support of the Nannilam Government Boys Higher
          Secondary School, a portion of the school campus was converted into
          the college, and this college was formally inaugurated on 25-07-2011
          by Chief Minister Selvi J. Jayalalithaa through a video conference.
        </Typography>

        <Typography sx={{ fontSize: "15.5px", textAlign: "justify", marginBottom: "16px", lineHeight: 1.7 }}>
          In the first academic year (2011-2012), the college admitted 260
          students, and due to shortage of space, the college began
          functioning on a shift system.
        </Typography>

        <Typography sx={{ fontSize: "15.5px", textAlign: "justify", marginBottom: "16px", lineHeight: 1.7 }}>
          In 2012-13, in response to the request of students and parents, a
          Distance Education Centre of Bharathidasan University was
          established for the first time in the district, and more than 100
          people — including working professionals and homemakers — enrolled.
          The same year, the National Service Scheme (NSS) and the Red Ribbon
          Club were also introduced.
        </Typography>

        <Typography sx={{ fontSize: "15.5px", textAlign: "justify", marginBottom: "16px", lineHeight: 1.7 }}>
          In the 2013-2014 academic year, the increasing number of students
          led to a shortage of space. Regarding this, through the efforts of
          the Nannilam Assembly member and then Minister for Food and Civil
          Supplies, Thiru R. Kamaraj, about 13.20 acres of land belonging to the
          Arulmigu Kailasanathar Temple Mapplilaikuppam (under the administration of the Hindu
          Religious and Charitable Endowments Department) was transferred by
          the Department to the Tamil Nadu Government for the college's use.
          In the same year, at an estimated cost of about Rs. 7.25 crore, the
          foundation stone for a new college building was laid on 12-02-2014
          by Chief Minister Selvi J. Jayalalithaa through video conference.
        </Typography>

        <Typography sx={{ fontSize: "15.5px", textAlign: "justify", marginBottom: "16px", lineHeight: 1.7 }}>
          <Box component="span" sx={{ fontWeight: "bold" }}>2014-2015:</Box> In this academic year, a Postgraduate
          programme was introduced for the first time, in the Department of
          Tamil.
        </Typography>

        <Typography sx={{ fontSize: "15.5px", textAlign: "justify", marginBottom: "16px", lineHeight: 1.7 }}>
          <Box component="span" sx={{ fontWeight: "bold" }}>2016-2017:</Box> As a step towards resolving the shortage
          of space, the building under construction was completed and was
          inaugurated on 7-03-2017 by Chief Minister Thiru K. Palaniswami
          through video conference, and handed over for the students' use.
        </Typography>

        <Typography sx={{ fontSize: "15.5px", textAlign: "justify", marginBottom: "16px", lineHeight: 1.7 }}>
          In the same academic year, in response to the requests of students
          and parents, the Departments of History and Computer Science were
          newly introduced. In addition, an extra section was sanctioned in
          the English and Commerce departments.
        </Typography>

        <Typography sx={{ fontSize: "15.5px", textAlign: "justify", marginBottom: "16px", lineHeight: 1.7 }}>
          <Box component="span" sx={{ fontWeight: "bold" }}>2017-2018:</Box> As per the request of the students' and
          parents' associations, and through the efforts of the college
          administration and the Parent-Teacher Association, two new
          Postgraduate programmes — Mathematics and Management — were
          further introduced.
        </Typography>

        <Typography sx={{ fontSize: "15.5px", textAlign: "justify", marginBottom: "16px", lineHeight: 1.7 }}>
          <Box component="span" sx={{ fontWeight: "bold" }}>2019-2020:</Box> As per government policy, this college
          was converted into a Government College under Government Act Rule
          110. Following this, the Postgraduate Management section alone
          was discontinued from the college in the 2020-2021 academic
          year. Since December 2020, the college has been rendering its
          services to students as a Government Arts and Science College.
        </Typography>

        {/* DESIGN 1: Elegant Card with Gradient Border */}
        <GradientBorderBox>
          <Box className="gradient-border" />
          <Typography sx={{ fontSize: "19px", lineHeight: "2.2", color: "#1f2937", fontWeight: 400, marginBottom: "8px", letterSpacing: "0.3px" }}>
            In this world, we (women) have come to rule kingdoms and to make laws.
          </Typography>
          <Typography sx={{ fontSize: "19px", lineHeight: "2.2", color: "#1f2937", fontWeight: 400, marginBottom: "8px", letterSpacing: "0.3px" }}>
            Bow down and see — in the eight kinds of knowledge, is there truly
          </Typography>
          <Typography sx={{ fontSize: "19px", lineHeight: "2.2", color: "#1f2937", fontWeight: 400, marginBottom: "8px", letterSpacing: "0.3px" }}>
            no place here for woman beside man?
          </Typography>
          <Typography sx={{ fontSize: "19px", lineHeight: "2.2", color: "#1f2937", fontWeight: 400, marginBottom: "8px", letterSpacing: "0.3px" }}>
            Woman is not lacking, even a little, compared to man, in knowledge
          </Typography>
          <Typography sx={{ fontSize: "19px", lineHeight: "2.2", color: "#1f2937", fontWeight: 400, marginBottom: "8px", letterSpacing: "0.3px" }}>
            or in skill — saying so, he encourages women.
          </Typography>
          <Box sx={{ width: "120px", height: "3px", background: "linear-gradient(90deg, transparent, #1a3e8c, transparent)", margin: "20px auto", borderRadius: "2px" }} />
          <Typography sx={{ fontSize: "22px", fontWeight: 700, color: "#1a3e8c", marginTop: "20px", letterSpacing: "2px", textTransform: "uppercase" }}>
            — Bharathiyar
          </Typography>
        </GradientBorderBox>
      </Box>
      <Footer />
    </>
  );
}