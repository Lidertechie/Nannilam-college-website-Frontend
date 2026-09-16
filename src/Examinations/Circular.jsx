import React, { useState, useEffect, useRef } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Button,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Chip,
  Skeleton,
  Fade,
  Zoom,
  Badge,
  alpha,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  ChevronLeft,
  ChevronRight,
  Event,
  AccessTime,
  CheckCircle,
  CalendarToday,
  Announcement,
  FiberNew,
  Description,
  Visibility,
  Download,
  InsertDriveFile,
} from '@mui/icons-material';
import Footer from '../Common/Footer';
import instance from '../AxiosInstance/AxiosInstance';

// ---------- Styled Components ----------

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: 16,
  boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
  background: 'linear-gradient(135deg, #ffffff 0%, #f8faff 100%)',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
    borderRadius: 12,
  },
}));

const CircularsContainer = styled(Box)(({ theme }) => ({
  maxHeight: '600px', // Adjust this value as needed
  overflowY: 'auto',
  paddingRight: theme.spacing(1),
  scrollBehavior: 'smooth',
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: '#f0f4ff',
    borderRadius: '10px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#1a3e8c',
    borderRadius: '10px',
    '&:hover': {
      background: '#0d2b6b',
    },
  },
  [theme.breakpoints.down('sm')]: {
    maxHeight: '400px',
    paddingRight: theme.spacing(0.5),
    '&::-webkit-scrollbar': {
      width: '5px',
    },
  },
}));

const CircularCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2.5),
  borderRadius: 16,
  boxShadow: '0 2px 12px rgba(26, 62, 140, 0.08)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  border: '1px solid rgba(26, 62, 140, 0.06)',
  background: '#ffffff',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 30px rgba(26, 62, 140, 0.15)',
    borderColor: 'rgba(26, 62, 140, 0.2)',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '4px',
    height: '100%',
    background: 'linear-gradient(180deg, #1a3e8c 0%, #4a7cf7 100%)',
    borderRadius: '4px 0 0 4px',
  },
  [theme.breakpoints.down('sm')]: {
    borderRadius: 12,
    marginBottom: theme.spacing(2),
    '&::before': {
      width: '3px',
    },
  },
}));

const StatusChip = styled(Chip)(({ theme, status }) => ({
  backgroundColor: status === 'active' ? '#e8f5e9' : '#fff3e0',
  color: status === 'active' ? '#2e7d32' : '#e65100',
  fontWeight: 600,
  fontSize: '11px',
  height: 24,
  '& .MuiChip-icon': {
    fontSize: 14,
  },
}));

const PaginationButton = styled(Button)(({ theme }) => ({
  fontFamily: 'Arial, Helvetica, sans-serif',
  fontSize: 14,
  fontWeight: 600,
  color: '#1a3e8c',
  borderColor: '#1a3e8c',
  textTransform: 'none',
  padding: '8px 28px',
  borderRadius: 10,
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: alpha('#1a3e8c', 0.08),
    borderColor: '#1a3e8c',
    transform: 'scale(1.02)',
  },
  '&.Mui-disabled': {
    borderColor: '#ddd',
    color: '#bbb',
  },
  [theme.breakpoints.down('sm')]: {
    padding: '10px 20px',
    fontSize: 13,
    width: '100%',
  },
}));

const DocButton = styled(Button)(({ theme }) => ({
  fontFamily: 'Arial, Helvetica, sans-serif',
  fontSize: 12,
  fontWeight: 600,
  textTransform: 'none',
  borderRadius: 20,
  padding: '4px 14px',
  minWidth: 'auto',
}));

const TitleSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(3),
  paddingBottom: theme.spacing(2),
  borderBottom: '3px solid #1a3e8c',
  position: 'relative',
  [theme.breakpoints.down('sm')]: {
    flexWrap: 'wrap',
    gap: theme.spacing(1.5),
    marginBottom: theme.spacing(2),
  },
}));

const TitleIcon = styled(Box)(({ theme }) => ({
  backgroundColor: '#1a3e8c',
  color: 'white',
  width: 48,
  height: 48,
  borderRadius: 12,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  [theme.breakpoints.down('sm')]: {
    width: 40,
    height: 40,
    '& svg': {
      fontSize: 24,
    },
  },
}));

// ---------- Main Component ----------

export default function Circular() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  // Refs
  const circularsContainerRef = useRef(null);
  
  // State
  const [circulars, setCirculars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = isMobile ? 3 : 5;

  // Fetch circulars
  useEffect(() => {
    fetchCirculars();
  }, []);

  const fetchCirculars = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await instance.get(`/circulars/active-academic-year`);
      
      const sortedData = response.data.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      
      setCirculars(sortedData);
    } catch (err) {
      console.error('Error fetching circulars:', err);
      setError('Unable to load circulars. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  // Pagination
  const totalPages = Math.ceil(circulars.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCirculars = circulars.slice(startIndex, endIndex);

  // Scroll to top of circulars container with smooth scrolling
  const scrollToTopOfCirculars = () => {
    if (circularsContainerRef.current) {
      circularsContainerRef.current.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
      // Smooth scroll to top of circulars container
      setTimeout(() => {
        scrollToTopOfCirculars();
      }, 100);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      // Smooth scroll to top of circulars container
      setTimeout(() => {
        scrollToTopOfCirculars();
      }, 100);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const isNew = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  };

  // Open the document in a new tab (view)
  const handleViewDocument = (url) => {
    if (!url) return;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Force-download the document.
  // Cloudinary URLs support the fl_attachment flag which makes the browser
  // download the file instead of navigating to it.
  const getDownloadUrl = (url) => {
    if (!url) return url;
    if (url.includes('res.cloudinary.com') && url.includes('/upload/')) {
      if (url.includes('fl_attachment')) return url;
      return url.replace('/upload/', '/upload/fl_attachment/');
    }
    return url;
  };

  const handleDownloadDocument = (url, title) => {
    if (!url) return;
    const link = document.createElement('a');
    link.href = getDownloadUrl(url);
    link.setAttribute('download', title || 'circular-document');
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Loading Skeleton
  const LoadingSkeleton = () => (
    <Box>
      {[1, 2, 3].map((item) => (
        <Card key={item} sx={{ mb: 2.5, borderRadius: 3, p: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width="80%" height={32} />
              <Skeleton variant="text" width="100%" height={20} />
              <Skeleton variant="text" width="60%" height={20} />
              <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                <Skeleton variant="rounded" width={100} height={32} />
                <Skeleton variant="rounded" width={120} height={32} />
              </Box>
            </Box>
          </Box>
        </Card>
      ))}
    </Box>
  );

  return (
    <>
      <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 4, md: 5 } }}>
        <StyledPaper elevation={0}>
          {/* Title Section - Centered */}
          <TitleSection sx={{ justifyContent: 'center' }}>
            <TitleIcon>
              <Description sx={{ fontSize: 28 }} />
            </TitleIcon>
            <Box sx={{ flex: 1, textAlign: 'center' }}>
              <Typography
                variant="h4"
                sx={{
                  fontFamily: 'Arial, Helvetica, sans-serif',
                  fontWeight: 800,
                  color: '#1a3e8c',
                  fontSize: {
                    xs: '22px',
                    sm: '28px',
                    md: '32px',
                  },
                  letterSpacing: '-0.5px',
                }}
              >
                Circulars
              </Typography>
            </Box>
          </TitleSection>

          {/* Academic Year Banner - Centered */}
          {circulars.length > 0 && (
            <Box
              sx={{
                mb: 3,
                p: 2,
                borderRadius: 12,
                background: 'linear-gradient(135deg, #f0f4ff 0%, #e8edf9 100%)',
                border: '1px solid rgba(26, 62, 140, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
                flexWrap: 'wrap',
              }}
            >
              <CalendarToday sx={{ color: '#1a3e8c', fontSize: 20 }} />
              <Typography variant="body2" sx={{ fontFamily: 'Arial, sans-serif', fontWeight: 600 }}>
                Academic Year: {circulars[0]?.academicYearLabel || 'N/A'}
              </Typography>
              <Chip
                size="small"
                label="Current"
                color="success"
                sx={{ height: 20, fontSize: '10px', fontWeight: 700 }}
              />
            </Box>
          )}

          {/* Scrollable Circulars Container */}
          <CircularsContainer ref={circularsContainerRef}>
            {/* Loading State */}
            {loading && <LoadingSkeleton />}

            {/* Error State */}
            {error && (
              <Fade in>
                <Alert
                  severity="error"
                  sx={{
                    borderRadius: 12,
                    mb: 3,
                    '& .MuiAlert-icon': { fontSize: 28 },
                  }}
                  action={
                    <Button color="inherit" size="small" onClick={fetchCirculars}>
                      Retry
                    </Button>
                  }
                >
                  {error}
                </Alert>
              </Fade>
            )}

            {/* No Circulars */}
            {!loading && !error && circulars.length === 0 && (
              <Fade in>
                <Paper
                  sx={{
                    p: 6,
                    textAlign: 'center',
                    borderRadius: 16,
                    background: 'linear-gradient(135deg, #f8faff 0%, #f0f4ff 100%)',
                  }}
                >
                  <Description sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
                  <Typography variant="h6" color="textSecondary" gutterBottom>
                    No Circulars Available
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    There are no circulars for the current academic year.
                  </Typography>
                </Paper>
              </Fade>
            )}

            {/* Circulars List */}
            {!loading && !error && circulars.length > 0 && (
              <Fade in>
                <Box>
                  {currentCirculars.map((circular, index) => (
                    <Zoom
                      key={circular.id || index}
                      in={true}
                      style={{ transitionDelay: `${index * 50}ms` }}
                    >
                      <CircularCard>
                        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                          <Box>
                            {/* Title Section */}
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1 }}>
                              <Typography
                                variant="h6"
                                sx={{
                                  fontFamily: 'Arial, sans-serif',
                                  fontWeight: 700,
                                  color: '#1a3e8c',
                                  fontSize: isMobile ? '16px' : '20px',
                                  lineHeight: 1.3,
                                  flex: 1,
                                }}
                              >
                                {circular.circularTitle}
                              </Typography>
                              {isNew(circular.createdAt) && (
                                <Chip
                                  label="New"
                                  size="small"
                                  icon={<FiberNew sx={{ fontSize: 14 }} />}
                                  sx={{
                                    backgroundColor: '#ff1744',
                                    color: 'white',
                                    fontWeight: 700,
                                    height: 24,
                                    fontSize: '10px',
                                    ml: 1,
                                    flexShrink: 0,
                                  }}
                                />
                              )}
                            </Box>

                            {/* Description */}
                            {circular.description && (
                              <Typography
                                variant="body2"
                                sx={{
                                  fontFamily: 'Arial, sans-serif',
                                  color: '#555',
                                  mb: 2,
                                  lineHeight: 1.6,
                                  display: '-webkit-box',
                                  WebkitLineClamp: 3,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden',
                                }}
                              >
                                {circular.description}
                              </Typography>
                            )}

                            {/* Document Section */}
                            {circular.documentUrl && (
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  flexWrap: 'wrap',
                                  gap: 1,
                                  mb: 2,
                                  p: 1.25,
                                  borderRadius: 10,
                                  backgroundColor: 'rgba(26, 62, 140, 0.04)',
                                  border: '1px solid rgba(26, 62, 140, 0.08)',
                                }}
                              >
                                <InsertDriveFile sx={{ color: '#1a3e8c', fontSize: 18, mr: 0.5 }} />
                                <Typography
                                  variant="caption"
                                  sx={{
                                    fontFamily: 'Arial, sans-serif',
                                    color: '#455a7c',
                                    fontWeight: 600,
                                    flex: 1,
                                    minWidth: 100,
                                  }}
                                >
                                  Attached document
                                </Typography>
                                <DocButton
                                  size="small"
                                  variant="outlined"
                                  startIcon={<Visibility sx={{ fontSize: 16 }} />}
                                  onClick={() => handleViewDocument(circular.documentUrl)}
                                  sx={{
                                    color: '#1a3e8c',
                                    borderColor: '#1a3e8c',
                                    '&:hover': {
                                      backgroundColor: alpha('#1a3e8c', 0.08),
                                      borderColor: '#1a3e8c',
                                    },
                                  }}
                                >
                                  View
                                </DocButton>
                                <DocButton
                                  size="small"
                                  variant="contained"
                                  startIcon={<Download sx={{ fontSize: 16 }} />}
                                  onClick={() =>
                                    handleDownloadDocument(circular.documentUrl, circular.circularTitle)
                                  }
                                  sx={{
                                    backgroundColor: '#1a3e8c',
                                    '&:hover': { backgroundColor: '#0d2b6b' },
                                  }}
                                >
                                  Download
                                </DocButton>
                              </Box>
                            )}

                            {/* Chips Section - Centered */}
                            <Box
                              sx={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: 1.5,
                                alignItems: 'center',
                                justifyContent: 'center',
                                mt: 2,
                                pt: 1,
                                borderTop: '1px solid rgba(26, 62, 140, 0.08)',
                              }}
                            >
                              <Chip
                                icon={<Event sx={{ fontSize: 14 }} />}
                                label={formatDate(circular.date)}
                                size="small"
                                variant="outlined"
                                sx={{
                                  fontSize: '12px',
                                  borderRadius: 20,
                                  borderColor: '#1a3e8c',
                                  color: '#1a3e8c',
                                  '& .MuiChip-icon': {
                                    color: '#1a3e8c',
                                  },
                                }}
                              />
                              {/* <Chip
                                icon={<AccessTime sx={{ fontSize: 14 }} />}
                                label={formatDateTime(circular.createdAt)}
                                size="small"
                                variant="outlined"
                                sx={{
                                  fontSize: '12px',
                                  borderRadius: 20,
                                  borderColor: '#78909c',
                                  color: '#78909c',
                                  '& .MuiChip-icon': {
                                    color: '#78909c',
                                  },
                                }}
                              /> */}
                              {circular.active && (
                                <StatusChip
                                  label="Active"
                                  status="active"
                                  size="small"
                                  icon={<CheckCircle sx={{ fontSize: 14 }} />}
                                  sx={{ borderRadius: 20 }}
                                />
                              )}
                            </Box>
                          </Box>
                        </CardContent>
                      </CircularCard>
                    </Zoom>
                  ))}

                  {/* Pagination Controls - Centered */}
                  {totalPages > 1 && (
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        mt: 4,
                        pt: 3,
                        borderTop: '2px solid rgba(26, 62, 140, 0.08)',
                        flexDirection: isMobile ? 'column' : 'row',
                        gap: isMobile ? 2 : 3,
                        flexWrap: 'wrap',
                      }}
                    >
                      <PaginationButton
                        variant="outlined"
                        startIcon={<ChevronLeft />}
                        onClick={handlePrevious}
                        disabled={currentPage === 0}
                      >
                        Previous
                      </PaginationButton>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography
                          sx={{
                            fontFamily: 'Arial, sans-serif',
                            fontSize: 14,
                            color: '#666',
                            fontWeight: 500,
                          }}
                        >
                          Page {currentPage + 1} of {totalPages}
                        </Typography>
                        <Badge
                          badgeContent={circulars.length}
                          color="primary"
                          sx={{
                            '& .MuiBadge-badge': {
                              fontSize: 11,
                              fontWeight: 700,
                              backgroundColor: '#1a3e8c',
                            },
                          }}
                        >
                          <Typography variant="caption" color="textSecondary">
                            Total
                          </Typography>
                        </Badge>
                      </Box>

                      <PaginationButton
                        variant="outlined"
                        endIcon={<ChevronRight />}
                        onClick={handleNext}
                        disabled={currentPage === totalPages - 1}
                      >
                        Next
                      </PaginationButton>
                    </Box>
                  )}
                </Box>
              </Fade>
            )}
          </CircularsContainer>
        </StyledPaper>
      </Container>
      <Footer />
    </>
  );
}