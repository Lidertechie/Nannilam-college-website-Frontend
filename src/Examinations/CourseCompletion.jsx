import React from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Description, TrendingUp, School, AutoStories } from '@mui/icons-material';
import Footer from '../Common/Footer';

// ---------- Data ----------

const courseCompletionData = [
  "Course Completion 2021 Analysis",
  "Course Completion 2020 Analysis",
  "Course Completion 2019 Analysis",
  "Course Completion 2018 Analysis",
  "Course Completion 2017 Analysis",
];

const statsData = [
  { label: "Total Reports", value: "5", icon: <Description sx={{ color: '#1a3e8c' }} /> },
  { label: "Years Covered", value: "2017-2021", icon: <TrendingUp sx={{ color: '#1a3e8c' }} /> },
  { label: "Courses Analyzed", value: "25+", icon: <School sx={{ color: '#1a3e8c' }} /> },
];

// ---------- Styled Components ----------

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: 4,
  boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
  background: '#fff',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2.5),
  },
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

const StyledCard = styled(Box)(({ theme }) => ({
  background: '#faf8ff',
  padding: theme.spacing(2, 3),
  borderRadius: 8,
  border: '1px solid #e8edf5',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  transition: 'all 0.2s ease',
  '&:hover': {
    boxShadow: '0 4px 16px rgba(26, 62, 140, 0.08)',
    transform: 'translateY(-2px)',
    background: '#fff',
  },
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  padding: '14px 0',
  borderBottom: '1px solid #e8edf5',
  '&:last-child': {
    borderBottom: 'none',
  },
  '&:hover': {
    backgroundColor: '#f0ecf9',
    borderRadius: 4,
    paddingLeft: 12,
    transition: 'all 0.2s ease',
  },
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: 16,
  color: '#1a3e8c',
  background: '#f0ecf9',
  padding: 8,
  borderRadius: '50%',
  minWidth: 40,
  minHeight: 40,
}));

// ---------- Main Component ----------

export default function CourseCompletion() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <>
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <StyledPaper elevation={0}>
          {/* Title */}
          <Typography
            component="h1"
            sx={{
              fontFamily: 'Arial, Helvetica, sans-serif',
              fontSize: {
                xs: '30px',
                md: '32px',
              },
              fontWeight: 800,
              color: '#1a3e8c',
              textAlign: 'left',
              mb: 2,
              borderBottom: '3px solid #1a3e8c',
              paddingBottom: '10px',
            }}
          >
            Course Completion
          </Typography>

          {/* Stats Cards */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
            {statsData.map((stat, index) => (
              <StyledCard key={index} sx={{ flex: '1 1 150px' }}>
                {stat.icon}
                <Box>
                  <Typography
                    sx={{
                      fontFamily: 'Arial, Helvetica, sans-serif',
                      fontSize: 13,
                      color: '#8a7e63',
                      fontWeight: 500,
                    }}
                  >
                    {stat.label}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: 'Arial, Helvetica, sans-serif',
                      fontSize: 18,
                      color: '#1a3e8c',
                      fontWeight: 700,
                    }}
                  >
                    {stat.value}
                  </Typography>
                </Box>
              </StyledCard>
            ))}
          </Box>

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
              📊 Course Completion Overview
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
              Analysis of course completion rates across multiple academic years,
              providing insights into student performance and program effectiveness.
            </Typography>
          </HighlightBox>

          <Divider sx={{ my: 3, borderColor: '#e8edf5' }} />

          {/* List */}
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
            Course Completion Reports
          </Typography>

          <List sx={{ width: '100%', bgcolor: 'background.paper', pt: 0 }}>
            {courseCompletionData.map((item, index) => (
              <StyledListItem key={index}>
                <IconWrapper>
                  <Description sx={{ fontSize: 22 }} />
                </IconWrapper>
                <ListItemText
                  primary={
                    <Typography
                      sx={{
                        fontFamily: 'Arial, Helvetica, sans-serif',
                        fontSize: '17px',
                        color: '#1f2937',
                        lineHeight: 1.9,
                        fontWeight: 400,
                        textAlign: 'justify',
                        '&:before': {
                          content: `"${String(index + 1).padStart(2, '0')}. "`,
                          color: '#1a3e8c',
                          fontWeight: 700,
                          fontSize: '16px',
                        },
                      }}
                    >
                      {item}
                    </Typography>
                  }
                />
              </StyledListItem>
            ))}
          </List>

          {/* Footer Note */}
          <Box
            sx={{
              mt: 3,
              pt: 2,
              borderTop: '1px solid #e8edf5',
            }}
          >
            <Typography
              sx={{
                fontFamily: 'Arial, Helvetica, sans-serif',
                fontSize: 13,
                color: '#8a7e63',
                textAlign: 'left',
              }}
            >
              * Total Reports: {courseCompletionData.length} | Last updated: {new Date().toLocaleDateString()}
            </Typography>
          </Box>
        </StyledPaper>
      </Container>
      <Footer />
    </>
  );
}