// src/components/Footer.js
import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  Divider,
  IconButton,
  TextField,
  Button,
} from '@mui/material';
import {
  Facebook,
  Twitter,
  Instagram,
  YouTube,
  LinkedIn,
  Phone,
  Email,
  LocationOn,
  ArrowForward,
} from '@mui/icons-material';

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        background: 'linear-gradient(135deg, #34657c 50%, #132c38 50%, #56b7f3 100%)',
        color: '#ffffff',
        pt: { xs: 4, sm: 5, md: 6 },
        pb: { xs: 2, sm: 2.5, md: 3 },
        borderTop: '4px solid #c9a84c',
        textAlign: 'left',
      }}
    >
      <Container
        maxWidth={false}
        sx={{
          width: { xs: '95%', sm: '92%', md: '90%' },
          maxWidth: '1450px',
          mx: 'auto',
          textAlign: 'left',
          px: { xs: 1, sm: 2, md: 3 },
        }}
      >
        <Grid container spacing={{ xs: 3, sm: 4, md: 5 }}>
          {/* Quick Links Section */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }} sx={{ textAlign: "left" }}>
            <Typography
              variant="h6"
              sx={{
                color: '#c9a84c',
                fontWeight: 600,
                mb: { xs: 1.5, md: 2 },
                fontSize: { xs: '1rem', sm: '1.05rem', md: '1.1rem' },
                letterSpacing: '0.5px',
                textAlign: 'left',
              }}
            >
              Quick Links
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'flex-start', 
              gap: { xs: 0.5, sm: 0.75, md: 1 } 
            }}>
              <Link href="/academics/gallery" color="inherit" underline="hover" sx={{ 
                fontSize: { xs: '0.85rem', sm: '0.88rem', md: '0.9rem' },
                py: { xs: 0.5, sm: 0.3, md: 0.2 },
                display: 'inline-block',
                width: '100%',
                transition: 'all 0.3s ease',
                '&:hover': {
                  color: '#c9a84c',
                  transform: 'translateX(5px)',
                },
              }}>
                Gallery
              </Link>
              <Link href="/academics/CoursesOffered" color="inherit" underline="hover" sx={{ 
                fontSize: { xs: '0.85rem', sm: '0.88rem', md: '0.9rem' },
                py: { xs: 0.5, sm: 0.3, md: 0.2 },
                display: 'inline-block',
                width: '100%',
                transition: 'all 0.3s ease',
                '&:hover': {
                  color: '#c9a84c',
                  transform: 'translateX(5px)',
                },
              }}>
                CourseOffered
              </Link>
              <Link
                href="https://exams1.bdu.ac.in/"
                target="_blank"
                rel="noopener noreferrer"
                color="inherit"
                underline="hover"
                sx={{ 
                  fontSize: { xs: "0.85rem", sm: "0.88rem", md: "0.9rem" },
                  py: { xs: 0.5, sm: 0.3, md: 0.2 },
                  display: 'inline-block',
                  width: '100%',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    color: '#c9a84c',
                    transform: 'translateX(5px)',
                  },
                }}
              >
                Exam Portal
              </Link>
              <Link href="https://naanmudhalvan.tn.gov.in/" target="_blank" rel="noopener noreferrer" color="inherit" underline="hover" sx={{ 
                fontSize: { xs: '0.85rem', sm: '0.88rem', md: '0.9rem' },
                py: { xs: 0.5, sm: 0.3, md: 0.2 },
                display: 'inline-block',
                width: '100%',
                transition: 'all 0.3s ease',
                '&:hover': {
                  color: '#c9a84c',
                  transform: 'translateX(5px)',
                },
              }}>
                Naanmudhalvan
              </Link>
              <Link href="https://umisdashboard.tnega.org/homepage" target="_blank" rel="noopener noreferrer" color="inherit" underline="hover" sx={{ 
                fontSize: { xs: '0.85rem', sm: '0.88rem', md: '0.9rem' },
                py: { xs: 0.5, sm: 0.3, md: 0.2 },
                display: 'inline-block',
                width: '100%',
                transition: 'all 0.3s ease',
                '&:hover': {
                  color: '#c9a84c',
                  transform: 'translateX(5px)',
                },
              }}>
                UMIS
              </Link>
              <Link href="https://www.tngasa.in/" target="_blank" rel="noopener noreferrer" color="inherit" underline="hover" sx={{ 
                fontSize: { xs: '0.85rem', sm: '0.88rem', md: '0.9rem' },
                py: { xs: 0.5, sm: 0.3, md: 0.2 },
                display: 'inline-block',
                width: '100%',
                transition: 'all 0.3s ease',
                '&:hover': {
                  color: '#c9a84c',
                  transform: 'translateX(5px)',
                },
              }}>
                tngasa
              </Link>
            </Box>
          </Grid>
          
          {/* Feedback Section - Commented out */}
          {/* <Grid size={{ xs: 12, sm: 6, md: 3 }} sx={{ textAlign: "left" }}>
            <Typography
              variant="h6"
              sx={{
                color: '#c9a84c',
                fontWeight: 600,
                mb: { xs: 1.5, md: 2 },
                fontSize: { xs: '1rem', sm: '1.05rem', md: '1.1rem' },
                letterSpacing: '0.5px',
                textAlign: 'left',
              }}
            >
              Feedback
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'flex-start', 
              gap: { xs: 0.5, sm: 0.75, md: 1 } 
            }}>
              <Link href="/Feedback/AluminiFeedback" color="inherit" underline="hover" sx={{ 
                fontSize: { xs: '0.85rem', sm: '0.88rem', md: '0.9rem' },
                py: { xs: 0.5, sm: 0.3, md: 0.2 },
                display: 'inline-block',
                width: '100%',
                transition: 'all 0.3s ease',
                '&:hover': {
                  color: '#c9a84c',
                  transform: 'translateX(5px)',
                },
              }}>
                From Alumini
              </Link>
              <Link href="/Feedback/StudentFeedback" color="inherit" underline="hover" sx={{ 
                fontSize: { xs: '0.85rem', sm: '0.88rem', md: '0.9rem' },
                py: { xs: 0.5, sm: 0.3, md: 0.2 },
                display: 'inline-block',
                width: '100%',
                transition: 'all 0.3s ease',
                '&:hover': {
                  color: '#c9a84c',
                  transform: 'translateX(5px)',
                },
              }}>
                From Student
              </Link>
              <Link href="/Feedback/ParentFeedback" color="inherit" underline="hover" sx={{ 
                fontSize: { xs: '0.85rem', sm: '0.88rem', md: '0.9rem' },
                py: { xs: 0.5, sm: 0.3, md: 0.2 },
                display: 'inline-block',
                width: '100%',
                transition: 'all 0.3s ease',
                '&:hover': {
                  color: '#c9a84c',
                  transform: 'translateX(5px)',
                },
              }}>
                From Parent
              </Link>
            </Box>
          </Grid> */}
          
          {/* Get in Touch Section */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }} sx={{ textAlign: "left" }}>
            <Typography
              variant="h6"
              sx={{
                color: '#c9a84c',
                fontWeight: 600,
                mb: { xs: 1.5, md: 2 },
                fontSize: { xs: '1rem', sm: '1.05rem', md: '1.1rem' },
                letterSpacing: '0.5px',
                textAlign: 'left',
              }}
            >
              Get in touch
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: { xs: 1, sm: 1.2, md: 1.5 } }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'flex-start', 
                gap: { xs: 1, sm: 1.2, md: 1.5 },
                width: '100%',
              }}>
                <LocationOn sx={{ 
                  color: '#c9a84c', 
                  fontSize: { xs: 18, sm: 19, md: 20 }, 
                  flexShrink: 0, 
                  mt: '2px' 
                }} />
                <Typography variant="body2" sx={{ 
                  fontSize: { xs: '0.8rem', sm: '0.82rem', md: '0.85rem' }, 
                  lineHeight: 1.4, 
                  textAlign: 'left',
                  wordBreak: 'break-word',
                }}>
                  Thiruvarur Main Road, EB Office Opposite, Nannilam-610105
                </Typography>
              </Box>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: { xs: 1, sm: 1.2, md: 1.5 },
                width: '100%',
              }}>
                <Phone sx={{ 
                  color: '#c9a84c', 
                  fontSize: { xs: 18, sm: 19, md: 20 }, 
                  flexShrink: 0 
                }} />
                <Typography variant="body2" sx={{ 
                  fontSize: { xs: '0.8rem', sm: '0.82rem', md: '0.85rem' }, 
                  textAlign: 'left',
                  wordBreak: 'break-word',
                }}>
                  04366296270
                </Typography>
              </Box>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'flex-start', 
                gap: { xs: 1, sm: 1.2, md: 1.5 },
                width: '100%',
              }}>
                <Email sx={{ 
                  color: '#c9a84c', 
                  fontSize: { xs: 18, sm: 19, md: 20 }, 
                  flexShrink: 0, 
                  alignSelf: 'flex-start', 
                  mt: '2px' 
                }} />
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: { xs: '0.8rem', sm: '0.82rem', md: '0.85rem' },
                    textAlign: 'left',
                    lineHeight: 1.6,
                    wordBreak: 'break-word',
                  }}
                >
                  <a
                    href="https://mail.google.com/mail/?view=cm&fs=1&to=princibun@bdu.ac.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: 'inherit', textDecoration: 'none' }}
                  >
                    princibun@bdu.ac.in
                  </a>
                  <br />
                  <a
                    href="https://mail.google.com/mail/?view=cm&fs=1&to=gascnannilam2023@gmail.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: 'inherit', textDecoration: 'none' }}
                  >
                    gascnannilam2023@gmail.com
                  </a>
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Map Section - Enhanced Mobile Responsive */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }} sx={{ textAlign: "left" }}>
            <Typography
              variant="h6"
              sx={{
                color: '#c9a84c',
                fontWeight: 600,
                mb: { xs: 1.5, md: 2 },
                fontSize: { xs: '1rem', sm: '1.05rem', md: '1.1rem' },
                letterSpacing: '0.5px',
                textAlign: 'left',
                display: { xs: 'block', sm: 'block' },
              }}
            >
              Location
            </Typography>
            <Box sx={{ 
              width: { xs: '100%', sm: '100%', md: '220%' },
              height: { xs: 200, sm: 200, md: 220, lg: 280 }, 
              borderRadius: 2, 
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
              mt: { xs: 0, sm: 0 },
              position: 'relative',
            }}>
              <iframe
                title="College Location"
                src="https://www.google.com/maps?q=Government+Arts+and+Science+College+Nannilam&z=19&t=k&output=embed"
                width="100%"
                height="100%"
                style={{ 
                  border: 0,
                  position: 'absolute',
                  top: 0,
                  left: 0,
                }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </Box>
            <Typography
              variant="caption"
              sx={{
                color: 'rgba(255,255,255,0.5)',
                fontSize: '0.6rem',
                display: 'block',
                mt: 0.5,
                textAlign: 'center',
              }}
            >
              © Google Maps
            </Typography>
          </Grid>
        </Grid>

        {/* Divider */}
        <Divider sx={{ my: { xs: 3, sm: 3.5, md: 4 }, borderColor: 'rgba(255,255,255,0.1)' }} />

        {/* Bottom Footer */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: { xs: 1.5, sm: 2 },
          }}
        >
          <Typography
            variant="body2"
            sx={{
              fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8rem' },
              color: '#ffffff',
              textAlign: { xs: 'center', md: 'left' },
              px: { xs: 1, sm: 0 },
            }}
          >
            2026 Powered by Lider Technology Solutions Pvt Ltd
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer;