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
  LocationOn,
  Schedule,
  EventNote,
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

const EventsContainer = styled(Box)(({ theme }) => ({
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

const EventCard = styled(Card)(({ theme, status }) => ({
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
    background: status === 'UPCOMING' 
      ? 'linear-gradient(180deg, #2196f3 0%, #64b5f6 100%)'
      : status === 'ONGOING'
      ? 'linear-gradient(180deg, #4caf50 0%, #81c784 100%)'
      : 'linear-gradient(180deg, #ff9800 0%, #ffb74d 100%)',
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

const StatusChip = styled(Chip)(({ theme, status }) => {
  const getStatusColors = () => {
    switch(status) {
      case 'UPCOMING':
        return { bg: '#e3f2fd', color: '#1565c0' };
      case 'ONGOING':
        return { bg: '#e8f5e9', color: '#2e7d32' };
      case 'COMPLETED':
        return { bg: '#fff3e0', color: '#e65100' };
      default:
        return { bg: '#f5f5f5', color: '#616161' };
    }
  };
  const colors = getStatusColors();
  return {
    backgroundColor: colors.bg,
    color: colors.color,
    fontWeight: 700,
    fontSize: '11px',
    height: 28,
    borderRadius: 20,
    '& .MuiChip-icon': {
      fontSize: 16,
      color: colors.color,
    },
  };
});

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

export default function Events() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  // Refs
  const eventsContainerRef = useRef(null);
  const scrollToTopRef = useRef(null);
  
  // State
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = isMobile ? 3 : 5;

  // Fetch events
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await instance.get(`/events/current`);
      
      const sortedData = response.data.sort((a, b) => 
        new Date(a.startDate) - new Date(b.startDate)
      );
      
      setEvents(sortedData);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Unable to load events. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  // Pagination
  const totalPages = Math.ceil(events.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEvents = events.slice(startIndex, endIndex);

  // Scroll to top of events container with smooth scrolling
  const scrollToTopOfEvents = () => {
    if (eventsContainerRef.current) {
      eventsContainerRef.current.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
      // Smooth scroll to top of events container
      setTimeout(() => {
        scrollToTopOfEvents();
      }, 100);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      // Smooth scroll to top of events container
      setTimeout(() => {
        scrollToTopOfEvents();
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

  const formatDateRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start.toDateString() === end.toDateString()) {
      return formatDate(startDate);
    }
    
    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
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

  const getStatusIcon = (status) => {
    switch(status) {
      case 'UPCOMING':
        return <Schedule sx={{ fontSize: 16 }} />;
      case 'ONGOING':
        return <EventNote sx={{ fontSize: 16 }} />;
      case 'COMPLETED':
        return <CheckCircle sx={{ fontSize: 16 }} />;
      default:
        return <Event sx={{ fontSize: 16 }} />;
    }
  };

  // Loading Skeleton
  const LoadingSkeleton = () => (
    <Box>
      {[1, 2, 3].map((item) => (
        <Card key={item} sx={{ mb: 2.5, borderRadius: 3, p: 2 }}>
          <Box>
            <Skeleton variant="text" width="80%" height={32} />
            <Skeleton variant="text" width="60%" height={24} />
            <Skeleton variant="text" width="100%" height={20} />
            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
              <Skeleton variant="rounded" width={100} height={32} />
              <Skeleton variant="rounded" width={120} height={32} />
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
              <Event sx={{ fontSize: 28 }} />
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
                Events
              </Typography>
            </Box>
          </TitleSection>

          {/* Scrollable Events Container */}
          <EventsContainer ref={eventsContainerRef}>
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
                    <Button color="inherit" size="small" onClick={fetchEvents}>
                      Retry
                    </Button>
                  }
                >
                  {error}
                </Alert>
              </Fade>
            )}

            {/* No Events */}
            {!loading && !error && events.length === 0 && (
              <Fade in>
                <Paper
                  sx={{
                    p: 6,
                    textAlign: 'center',
                    borderRadius: 16,
                    background: 'linear-gradient(135deg, #f8faff 0%, #f0f4ff 100%)',
                  }}
                >
                  <Event sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
                  <Typography variant="h6" color="textSecondary" gutterBottom>
                    No Events Available
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    There are no current events at this time.
                  </Typography>
                </Paper>
              </Fade>
            )}

            {/* Events List */}
            {!loading && !error && events.length > 0 && (
              <Fade in>
                <Box>
                  {currentEvents.map((event, index) => (
                    <Zoom
                      key={event.id || index}
                      in={true}
                      style={{ transitionDelay: `${index * 50}ms` }}
                    >
                      <EventCard status={event.status}>
                        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                          <Box>
                            {/* Title and Status */}
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1.5 }}>
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
                                {event.eventTitle}
                              </Typography>
                              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexShrink: 0 }}>
                                {isNew(event.createdAt) && (
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
                                    }}
                                  />
                                )}
                                <StatusChip
                                  label={event.status}
                                  status={event.status}
                                  size="small"
                                  icon={getStatusIcon(event.status)}
                                />
                              </Box>
                            </Box>

                            {/* Date Range */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                              <Event sx={{ fontSize: 18, color: '#1a3e8c' }} />
                              <Typography
                                variant="body2"
                                sx={{
                                  fontFamily: 'Arial, sans-serif',
                                  fontWeight: 600,
                                  color: '#1a3e8c',
                                }}
                              >
                                {formatDateRange(event.startDate, event.endDate)}
                              </Typography>
                            </Box>

                            {/* Description */}
                            {event.description && (
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
                                {event.description}
                              </Typography>
                            )}

                            {/* Venue and Details - Centered */}
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
                              {event.venue && (
                                <Chip
                                  icon={<LocationOn sx={{ fontSize: 14 }} />}
                                  label={event.venue}
                                  size="small"
                                  variant="outlined"
                                  sx={{
                                    fontSize: '12px',
                                    borderRadius: 20,
                                    borderColor: '#4a7cf7',
                                    color: '#1a3e8c',
                                    '& .MuiChip-icon': {
                                      color: '#1a3e8c',
                                    },
                                  }}
                                />
                              )}
                              <Chip
                                icon={<AccessTime sx={{ fontSize: 14 }} />}
                                label={`Posted: ${formatDateTime(event.createdAt)}`}
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
                              />
                              {event.active && (
                                <Chip
                                  label="Active"
                                  size="small"
                                  icon={<CheckCircle sx={{ fontSize: 14 }} />}
                                  sx={{
                                    backgroundColor: '#e8f5e9',
                                    color: '#2e7d32',
                                    fontWeight: 600,
                                    fontSize: '11px',
                                    height: 24,
                                    borderRadius: 20,
                                    '& .MuiChip-icon': {
                                      color: '#2e7d32',
                                    },
                                  }}
                                />
                              )}
                            </Box>
                          </Box>
                        </CardContent>
                      </EventCard>
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
                          badgeContent={events.length}
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
          </EventsContainer>
        </StyledPaper>
      </Container>
      <Footer />
    </>
  );
}