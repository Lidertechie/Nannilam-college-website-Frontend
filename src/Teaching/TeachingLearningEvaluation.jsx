import React from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
  Divider,
  Avatar,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  School,
  Groups,
  Videocam,
  Computer,
  TravelExplore,
  Assignment,
  RecordVoiceOver,
  VolunteerActivism,
  Psychology,
  EmojiEvents,
  SpeakerNotes,
  Book,
  Chat,
  WorkspacePremium,
  Lightbulb
} from '@mui/icons-material';


const teachingData = {
  title: "Teaching-Learning and Evaluation",
  paragraphs: [
    `The college practices a teaching methodology which focuses on imparting education through a student centric approach. This methodology helps to transform students from being relegated to the role of passive recipients to active and involved stake holders, apart from boosting their confidence and encouraging independence. Since students vary in their ability to comprehend and absorb it is not possible to address the needs and expectations of individual students and expect a uniform learning outcome from them all in a teacher centric class. The teacher facilitates learning by allowing each individual student to comprehend at their personal level. By ensuring their involvement in class activities so that they can absorb and grasp information at their own pace. Teachers make classes as interactive as possible and encourage innovative thought and novel interpretations.`,
    
    `Audio-Visual methodology, Language Lab, Google Classroom, Industrial Visits, Field Work and Projects are some of the means used by departments to boost student participation. Students are encouraged to reflect and analyse by eliciting responses to the subject under discussion. Discussions and debates on contemporary issues are encouraged and students get an opportunity to express and air their views apart from learning to respect perspectives of the other. Guest lectures are organized and competitions held to involve students in activities that help to exhibit and hone their talents.`,
    
    `Extracurricular activities like participation in NSS and NCC have been introduced to encourage students participate and learn. Internal assessments are so planned so as to encourage students to work independently. Written Assignments are required to be submitted by students and these need to be done individually by researching on the given topic so as to enhance confidence, develop writing skills and hone style, apart from inculcating an interest in research activities. Seminars, which form the second component of internal assessment, help students present their assignments before the entire class helping them overcome stage fear and develop oratory prowess.`
  ],
  teachingMethods: [
    { label: "Audio-Visual Methodology", icon: <Videocam /> },
    { label: "Language Lab", icon: <RecordVoiceOver /> },
    { label: "Google Classroom", icon: <Computer /> },
    { label: "Industrial Visits", icon: <TravelExplore /> },
    { label: "Field Work", icon: <School /> },
    { label: "Projects", icon: <Assignment /> },
    { label: "Discussions & Debates", icon: <Chat /> },
    { label: "Guest Lectures", icon: <SpeakerNotes /> },
  ],
  assessmentComponents: [
    {
      title: "Written Assignments",
      description: "Individual research on given topics to enhance confidence, develop writing skills and hone style",
      icon: <Assignment sx={{ color: '#1a3e8c' }} />
    },
    {
      title: "Seminars",
      description: "Present assignments before the class to overcome stage fear and develop oratory prowess",
      icon: <RecordVoiceOver sx={{ color: '#1a3e8c' }} />
    },
    {
      title: "Internal Assessments",
      description: "Planned to encourage students to work independently and develop research aptitude",
      icon: <Psychology sx={{ color: '#1a3e8c' }} />
    }
  ],
  extracurricular: [
    { label: "NSS - National Service Scheme", icon: <VolunteerActivism /> },
    // { label: "NCC - National Cadet Corps", icon: <WorkspacePremium /> },
    { label: "Competitions", icon: <EmojiEvents /> },
    // { label: "Guest Lectures", icon: <SpeakerNotes /> },
  ],
  keyBenefits: [
    "Student-centric approach",
    "Interactive and engaging classes",
    "Innovative thought encouraged",
    "Practical exposure through visits",
    "Research aptitude development",
    "Communication skills enhancement",
    "Confidence building",
    "Respect for diverse perspectives"
  ]
};

// ---------- Styled Components ----------

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: 4,
  boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
  background: '#fff',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2.5),
  }
}));

const DividerStyled = styled(Box)(({ theme }) => ({
  width: 60,
  height: 4,
  background: '#1a3e8c',
  borderRadius: 2,
  marginBottom: theme.spacing(3),
}));

const HighlightBox = styled(Box)(({ theme }) => ({
  background: '#f0ecf9',
  borderLeft: '4px solid #1a3e8c',
  padding: theme.spacing(2, 3),
  borderRadius: '0 8px 8px 0',
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  borderRadius: 8,
  border: '1px solid #e8edf5',
  transition: 'all 0.2s ease',
  fontFamily: 'Arial, Helvetica, sans-serif',
  '&:hover': {
    boxShadow: '0 4px 16px rgba(26, 62, 140, 0.1)',
    transform: 'translateY(-2px)',
  },
}));

const MethodChip = styled(Chip)(({ theme }) => ({
  borderRadius: 20,
  padding: theme.spacing(0.5),
  fontFamily: 'Arial, Helvetica, sans-serif',
  borderColor: '#1a3e8c',
  color: '#1a3e8c',
  '& .MuiChip-icon': {
    color: '#1a3e8c',
  },
  '&:hover': {
    background: '#f0ecf9',
  },
}));

const BenefitItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  padding: theme.spacing(0.75, 0),
  borderBottom: '1px solid #e8edf5',
  fontFamily: 'Arial, Helvetica, sans-serif',
  '&:last-child': {
    borderBottom: 'none',
  },
}));

const BenefitDot = styled(Box)(({ theme }) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  background: '#1a3e8c',
  flexShrink: 0,
}));

// ---------- Main Component ----------

export default function TeachingLearningEvaluation() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <StyledPaper elevation={0}>
        {/* Title */}
        <Typography
          component="h1"
          sx={{
            fontFamily: 'Arial, Helvetica, sans-serif',
            fontWeight: 800,
            fontSize: {
              xs: "30px",
              sm: "34px",
              md: "38px",
            },
            color: "#1a3e8c",
            mb: 2,
            borderBottom: '3px solid #1a3e8c',
            paddingBottom: '10px',
          }}
        >
          {teachingData.title}
        </Typography>

        {/* Paragraphs */}
        {teachingData.paragraphs.map((text, index) => (
          <Typography
            key={index}
            sx={{
              fontFamily: 'Arial, Helvetica, sans-serif',
              fontSize: '17px',
              fontWeight: 400,
              lineHeight: 1.9,
              color: "#1f2937",
              textAlign: "justify",
              letterSpacing: "0px",
              mb: 3,
            }}
          >
            {text}
          </Typography>
        ))}

        {/* Highlight Box */}
        <HighlightBox>
          <Typography
            variant="subtitle2"
            fontWeight={700}
            color="#1a3e8c"
            sx={{
              mb: 0.5,
              fontFamily: 'Arial, Helvetica, sans-serif',
              fontSize: 16,
            }}
          >
            🎯 Teaching Methodology
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: '#1f2937',
              lineHeight: 1.7,
              fontFamily: 'Arial, Helvetica, sans-serif',
              fontSize: 15,
            }}
          >
            Student-centric approach transforming passive recipients into active stakeholders,
            boosting confidence and encouraging independence through interactive learning.
          </Typography>
        </HighlightBox>

        {/* Teaching Methods Section */}
        <Typography
          variant="h6"
          fontWeight={700}
          color="#1a3e8c"
          sx={{
            mt: 4,
            mb: 2,
            fontFamily: 'Arial, Helvetica, sans-serif',
            fontSize: 22,
            textAlign: 'left',
          }}
        >
          Teaching Methods
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 3 }}>
          {teachingData.teachingMethods.map((method, index) => (
            <MethodChip
              key={index}
              icon={method.icon}
              label={method.label}
              variant="outlined"
            />
          ))}
        </Box>

        <Divider sx={{ my: 3, borderColor: '#e8edf5' }} />

        {/* Assessment Components */}
        <Typography
          variant="h6"
          fontWeight={700}
          color="#1a3e8c"
          sx={{
            mb: 2,
            fontFamily: 'Arial, Helvetica, sans-serif',
            fontSize: 22,
            textAlign: 'left',
          }}
        >
          Assessment Components
        </Typography>

        <Grid container spacing={2.5} sx={{ mb: 4 }}>
          {teachingData.assessmentComponents.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <StyledCard>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                    {item.icon}
                    <Typography
                      variant="subtitle2"
                      fontWeight={700}
                      color="#1a3e8c"
                      sx={{
                        fontFamily: 'Arial, Helvetica, sans-serif',
                        fontSize: 15,
                      }}
                    >
                      {item.title}
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#1f2937',
                      lineHeight: 1.6,
                      fontFamily: 'Arial, Helvetica, sans-serif',
                      fontSize: 14,
                    }}
                  >
                    {item.description}
                  </Typography>
                </CardContent>
              </StyledCard>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 3, borderColor: '#e8edf5' }} />

        {/* Extracurricular Activities */}
        <Typography
          variant="h6"
          fontWeight={700}
          color="#1a3e8c"
          sx={{
            mb: 2,
            fontFamily: 'Arial, Helvetica, sans-serif',
            fontSize: 22,
            textAlign: 'left',
          }}
        >
          Extracurricular Activities
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 3 }}>
          {teachingData.extracurricular.map((item, index) => (
            <Chip
              key={index}
              icon={item.icon}
              label={item.label}
              variant="outlined"
              sx={{
                borderColor: '#1a3e8c',
                color: '#1a3e8c',
                fontFamily: 'Arial, Helvetica, sans-serif',
                fontSize: 13,
                '&:hover': {
                  background: '#f0ecf9',
                },
              }}
            />
          ))}
        </Box>

        <Divider sx={{ my: 3, borderColor: '#e8edf5' }} />

        {/* Key Benefits */}
        <Typography
          variant="h6"
          fontWeight={700}
          color="#1a3e8c"
          sx={{
            mb: 2,
            fontFamily: 'Arial, Helvetica, sans-serif',
            fontSize: 22,
            textAlign: 'left',
          }}
        >
          Key Benefits
        </Typography>

        <Grid container spacing={2}>
          {teachingData.keyBenefits.map((benefit, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <BenefitItem>
                <BenefitDot />
                <Typography
                  variant="body2"
                  sx={{
                    color: '#1f2937',
                    fontFamily: 'Arial, Helvetica, sans-serif',
                    fontSize: 14,
                  }}
                >
                  {benefit}
                </Typography>
              </BenefitItem>
            </Grid>
          ))}
        </Grid>

        {/* Footer Note */}
        <Box sx={{ mt: 4, pt: 2, borderTop: '1px solid #e8edf5' }}>
          <Typography
            variant="caption"
            sx={{
              color: '#8a7e63',
              display: 'block',
              fontFamily: 'Arial, Helvetica, sans-serif',
              fontSize: 13,
            }}
          >
            * Internal assessments include written assignments and seminars to develop research aptitude and communication skills.
          </Typography>
        </Box>
      </StyledPaper>
    </Container>
  );
}