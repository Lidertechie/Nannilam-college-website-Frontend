import React, { useState, useRef, useEffect } from 'react';
import { Box, DialogContent, DialogTitle, Dialog, Container, Typography, Grid, Stack, Avatar, Divider, alpha, IconButton, Paper, Button, Card, CardContent, Chip } from '@mui/material';
import {
    CampaignOutlined as NewsIcon, ArrowBackIos as ArrowLeftIcon, ArrowForwardIos as ArrowRightIcon, Download as DownloadIcon, Description as FileIcon,
    Notifications as NotificationIcon, PictureAsPdf as PdfIcon, InsertDriveFile as DocIcon, Visibility as ViewIcon, VolumeUp as VolumeIcon, Close as CloseIcon,
} from '@mui/icons-material';
import Footer from '../Common/Footer';
import instance from "../AxiosInstance/AxiosInstance";

const heroSlides = [
    {
        image: "/image1.jpeg",
        title: (
            <> Empowering and inspiring all students to excel as{" "} <Box component="span" sx={{ fontWeight: 800 }}>  life long learners </Box> </>
        ),
        subtitle: "Quality Education for a Better Tomorrow",
    },
    {
        image: "/image3.jpeg",
        title: (
            <> Excellence in{" "}<Box component="span" sx={{ fontWeight: 800 }}>   Teaching and Learning</Box></>
        ),
        subtitle: "Providing Quality Education for a Brighter Future",
    },
    {
        image: "/image5.jpeg",
        title: (
            <> Empowering Students Through{" "} <Box component="span" sx={{ fontWeight: 800 }}> Academic Excellence </Box> </>
        ),
        subtitle: "Inspiring Knowledge, Innovation, and Lifelong Learning",
    },
    {
        image: "/image2.jpeg",
        title: (
            <> Building Future Leaders Through{" "}<Box component="span" sx={{ fontWeight: 800 }}> Innovation & Excellence </Box> </>
        ),
        subtitle: "Empowering Rural Students",
    },
    {
        image: "/image9.jpeg",
        title: (
            <> Empowering and inspiring all students to excel as{" "} <Box component="span" sx={{ fontWeight: 800 }}>  life long learners </Box></>
        ),
        subtitle: "Quality Education for a Better Tomorrow",
    },
    {
        image: "/image7.jpeg",
        title: (
            <> Together for a{" "} <Box component="span" sx={{ fontWeight: 800 }}>  Better Society </Box> </>
        ),
        subtitle: "Students Promoting Awareness and Social Responsibility"
    },
    {
        image: "/image8.jpeg",
        title: (
            <> Promoting{" "}  <Box component="span" sx={{ fontWeight: 800 }}> Civic Responsibility</Box>{" "}  and Public Awareness </>
        ),
        subtitle: "Committed to Community Service and Social Development",
    },
    {
        image: "/image10.jpeg",
        title: <>Building a Legacy of <Box component="span" sx={{ fontWeight: 800 }}>Learning</Box> and Service</>,
        subtitle: "Empowering Students Through Quality Education and Modern Learning",
    },
    {
        image: "/image11.jpeg",
        title: <>Fostering <Box component="span" sx={{ fontWeight: 800 }}>Creativity & Research</Box> for Tomorrow</>,
        subtitle: "Encouraging Innovation, Discovery, and Academic Growth",
    },
    {
        image: "/image12.jpeg",
        title: <>Nurturing <Box component="span" sx={{ fontWeight: 800 }}>Character and Leadership</Box> in Every Student</>,
        subtitle: "Shaping Responsible Citizens with Values and Vision",
    },
];

const quickLinks = [
    { label: "EXAM PORTAL", href: "https://exams1.bdu.ac.in/" },
    { label: "GALLERY", href: "/academics/gallery" },
    { label: "NAANMUDHALVAN", href: "https://naanmudhalvan.tn.gov.in/" },
    { label: "TNGASA", href: "https://www.tngasa.in/" },
];

const admissionLinks = [
    { label: 'COLLEGE ADMISSION STATUS AS ON 26TH JUNE 2026-12:00PM', href: '#', badge: 'NEW' },
    { label: 'UG ADMISSION 2026-27 RANKLIST', href: '#', badge: 'NEW', icon: '🏅' },
    { label: 'CODE OF CONDUCT', href: '#', icon: '👑' },
    { label: 'RIGHT TO INFORMATION', href: '#', icon: '👑' },
];

const principal = {
    name: 'Dr V. Rameshkumar,M.A., M.Phil., Ph.D., B.Ed., NET.,',
    designation: 'Principal (FAC)',
    photo: '/principalimg.jpeg',
    message: [
        `Government Arts And Scinece College - Nannilam extends a hearty welcome to you. Established in 2011 with a vision to provide the youth with quality higher education, with nationalistic and moralistic spirit in order to empower them to overcome social and economical backwardness and to equip them to meet the standards of academic knowledge and research at the national and international level, the college has been a centre for higher education for students from all strata of the society especially to those who are socially and economically challenged in the Nannilam.`,
        `The college is also a pioneering institution in providing quality higher education to the rural students to equip themselves with the capacity and capabilities to overcome the challenge of the rural-urban divide in the spheres of career opportunities and entrepreneurship.`,
        `I hope your tour into our website will give you a fair idea about our earnest and sincere efforts in all the spheres of our activities to achieve our vision and mission.`,
    ],
};

// Downloads Data
const studentDownloads = [
    { label: 'Bonafide Certificate', icon: <PdfIcon />, href: '/downloads/Bonafide Certificate.pdf' },
    { label: 'No Due Form', icon: <PdfIcon />, href: '/downloads/No Due Form.pdf' },
    { label: 'Convocation Application', icon: <PdfIcon />, href: '/downloads/convocationApplication.pdf' },
    { label: 'Migration Application', icon: <PdfIcon />, href: '/downloads/migrationApplication.pdf' },
    { label: 'Re-Doingcourse Application', icon: <PdfIcon />, href: '/downloads/Re-DoingCourse Application.pdf' },
    { label: 'Re-Valution', icon: <PdfIcon />, href: '/downloads/Re-Valuation.pdf' },
    { label: 'Re-Totalling', icon: <PdfIcon />, href: '/downloads/Re-Totalling.pdf' },
    { label: 'Tatkal', icon: <PdfIcon />, href: '/downloads/Tatkal.pdf' },
    { label: 'DuplicateMarkStatement Application', icon: <PdfIcon />, href: '/downloads/duplicateMarkStatementApplication-Form.pdf' },
    { label: 'Requisition For Transfer Certificate', icon: <PdfIcon />, href: '/downloads/Requisition For Transfer Certificate.pdf' },

];

const facultyDownloads = [
    { label: 'CL Form Department', icon: <PdfIcon />, href: '/downloads/CL FORM Department.pdf', },
    { label: 'CL Form Offce', icon: <PdfIcon />, href: '/downloads/CL FORM Offce.pdf' },
    { label: 'COL Leave', icon: <PdfIcon />, href: '/downloads/COL LEAVE.pdf' },
    { label: 'Fitness Certificate Format', icon: <PdfIcon />, href: '/downloads/Fitness_Certificate_Format.pdf' },
    { label: 'Medical Certificate', icon: <PdfIcon />, href: '/downloads/Medical_Certificate.pdf' },
    { label: 'ML and EL', icon: <PdfIcon />, href: '/downloads/ML and EL (1).pdf' },
    { label: 'On Other Duty', icon: <PdfIcon />, href: '/downloads/ON OTHER DUTY.pdf' },
    { label: 'OD EL ML joining Report', icon: <PdfIcon />, href: '/downloads/OD EL ML  joining report.pdf' },
];

const NAVY = '#294a1a';
const GOLD = '#f0c93a';

// News Ticker Component - Fixed animation
const NewsTicker = ({ events }) => {
    // If no events, show a default message
    const displayEvents = events && events.length > 0 ? events : [
        { eventTitle: 'No upcoming events available', startDate: '' }
    ];

    // For seamless infinite scroll, duplicate only if we have more than 1 event
    const duplicatedEvents = displayEvents.length > 1 ? [...displayEvents, ...displayEvents, ...displayEvents] : displayEvents;

    return (
        <Box
            sx={{
                width: "100%",
                bgcolor: NAVY,
                borderBottom: `3px solid ${GOLD}`,
                overflow: "hidden",
                position: "relative",
                display: "flex",
                alignItems: "center",
                py: 1,
            }}
        >
            <Box
                sx={{
                    position: "absolute",
                    left: 20,
                    zIndex: 5,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    bgcolor: GOLD,
                    color: NAVY,
                    px: 2.5,
                    py: 0.8,
                    borderRadius: 1,
                    fontWeight: 800,
                    fontSize: "0.85rem",
                    letterSpacing: 1,
                    boxShadow: "0 2px 8px rgba(0,0,0,.25)",
                }}
            >
                <VolumeIcon sx={{ fontSize: 20 }} />
                LATEST EVENTS
            </Box>

            <Box
                sx={{
                    width: "100%",
                    overflow: "hidden",
                    pl: "230px",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        width: "100%",
                        whiteSpace: "nowrap",
                        animation: displayEvents.length > 0 ? "marquee 6s linear infinite" : "none",
                        "@keyframes marquee": {
                            "0%": {
                                transform: "translateX(0)",
                            },
                            "100%": {
                                transform: "translateX(-33.33%)",
                            },
                        },
                        "&:hover": {
                            animationPlayState: displayEvents.length > 0 ? "paused" : "none",
                        },
                    }}
                >
                    {duplicatedEvents.map((event, index) => (
                        <Typography
                            key={index}
                            sx={{
                                color: "#fff",
                                textDecoration: "none",
                                display: "inline-flex",
                                alignItems: "center",
                                mx: 4,
                                fontSize: "0.9rem",
                                fontWeight: 500,
                                whiteSpace: "nowrap",
                            }}
                        >
                            {event.eventTitle}
                            {event.startDate && (
                                <Box
                                    component="span"
                                    sx={{
                                        ml: 1,
                                        px: 1,
                                        py: 0.25,
                                        borderRadius: 1,
                                        bgcolor: alpha(GOLD, 0.2),
                                        color: GOLD,
                                        fontSize: "0.7rem",
                                        fontWeight: 700,
                                    }}
                                >
                                    {new Date(event.startDate).toLocaleDateString('en-IN', {
                                        day: '2-digit',
                                        month: 'short',
                                        year: 'numeric'
                                    })}
                                </Box>
                            )}
                            {event.description && (
                                <Box
                                    component="span"
                                    sx={{
                                        ml: 1,
                                        px: 1,
                                        py: 0.25,
                                        borderRadius: 1,
                                        bgcolor: alpha('#fff', 0.1),
                                        color: '#fff',
                                        fontSize: "0.7rem",
                                        fontWeight: 500,
                                    }}
                                >
                                    {event.description}
                                </Box>
                            )}
                            {event.status && (
                                <Box
                                    component="span"
                                    sx={{
                                        ml: 1,
                                        px: 1,
                                        py: 0.25,
                                        borderRadius: 1,
                                        bgcolor: event.status === 'UPCOMING' ? alpha('#4caf50', 0.3) : alpha('#ff9800', 0.3),
                                        color: event.status === 'UPCOMING' ? '#4caf50' : '#ff9800',
                                        fontSize: "0.65rem",
                                        fontWeight: 700,
                                        textTransform: "uppercase",
                                    }}
                                >
                                    {event.status}
                                </Box>
                            )}
                        </Typography>
                    ))}
                </Box>
            </Box>
        </Box>
    );
};

const HomePage = () => {
    const [activeSlide, setActiveSlide] = useState(0);
    const [isHovering, setIsHovering] = useState(false);
    const [popupOpen, setPopupOpen] = useState(true);
    const [circulars, setCirculars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [notificationsLoading, setNotificationsLoading] = useState(true);
    const [notificationsError, setNotificationsError] = useState(null);
    const [events, setEvents] = useState([]);
    const [eventsLoading, setEventsLoading] = useState(true);
    const [eventsError, setEventsError] = useState(null);

    // Fetch circulars from API
    useEffect(() => {
        const fetchCirculars = async () => {
            try {
                setLoading(true);
                const response = await instance.get('/circulars/active-academic-year');
                setCirculars(response.data);
                setError(null);
            } catch (err) {
                console.error('Error fetching circulars:', err);
                setError('Failed to load circulars. Please try again later.');
                setCirculars([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCirculars();
    }, []);

    // Fetch notifications from API
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                setNotificationsLoading(true);
                const response = await instance.get('/notifications/active-academic-year');
                setNotifications(response.data);
                setNotificationsError(null);
            } catch (err) {
                console.error('Error fetching notifications:', err);
                setNotificationsError('Failed to load notifications. Please try again later.');
                setNotifications([]);
            } finally {
                setNotificationsLoading(false);
            }
        };

        fetchNotifications();
    }, []);

    // Fetch events from API
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setEventsLoading(true);
                const response = await instance.get('/events/current');
                setEvents(response.data);
                setEventsError(null);
            } catch (err) {
                console.error('Error fetching events:', err);
                setEventsError('Failed to load events. Please try again later.');
                setEvents([]);
            } finally {
                setEventsLoading(false);
            }
        };

        fetchEvents();
    }, []);

    // Auto-slide functionality
    useEffect(() => {
        if (isHovering || heroSlides.length <= 1) return;
        const id = setInterval(() => {
            setActiveSlide((prev) => (prev + 1) % heroSlides.length);
        }, 4000);
        return () => clearInterval(id);
    }, [isHovering]);

    const handlePrevSlide = () => {
        setActiveSlide((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1));
    };

    const handleNextSlide = () => {
        setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    };

    const handleDotClick = (index) => {
        setActiveSlide(index);
    };

    // Format date function
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const listRef = useRef(null);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        const el = listRef.current;
        if (!el) return;

        const id = setInterval(() => {
            if (isPaused) return;

            if (el.scrollTop + el.clientHeight >= el.scrollHeight - 1) {
                el.scrollTop = 0;
            } else {
                el.scrollTop += 1;
            }
        }, 30);

        return () => clearInterval(id);
    }, [isPaused]);

    const slide = heroSlides[activeSlide];

    // Find the first notification with an image to show in popup
    const notificationWithImage = notifications.find(notif => notif.imageUrl);

    // Get first 4 events for admission links
    const firstFourEvents = events.slice(0, 3);

    return (
        <Box sx={{ bgcolor: '#f7f7f5' }}>
            <Dialog
                open={popupOpen && !notificationsLoading && notificationWithImage}
                onClose={() => setPopupOpen(false)}
                maxWidth="md"
            >
                <DialogTitle sx={{ p: 0 }}>
                    <IconButton
                        onClick={() => setPopupOpen(false)}
                        sx={{ position: 'absolute', right: 8, top: 8, color: 'red', zIndex: 1 }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent sx={{ p: 0 }}>
                    {notificationWithImage ? (
                        <img
                            src={notificationWithImage.imageUrl}
                            alt={notificationWithImage.title || "Notification"}
                            style={{ width: '100%', display: 'block' }}
                        />
                    ) : notifications.length > 0 && (
                        <Box sx={{ p: 3, textAlign: 'center' }}>
                            <Typography variant="h6" sx={{ mb: 1, fontWeight: 700, color: NAVY }}>
                                {notifications[0].title}
                            </Typography>
                            {notifications[0].description && (
                                <Typography sx={{ color: '#555', mb: 1 }}>
                                    {notifications[0].description}
                                </Typography>
                            )}
                            <Typography sx={{ color: '#888', fontSize: '0.9rem' }}>
                                {formatDate(notifications[0].date)}
                            </Typography>
                        </Box>
                    )}
                </DialogContent>
            </Dialog>

            {/* Pass events to NewsTicker */}
            <NewsTicker events={events} />

            <Box
                sx={{
                    position: 'relative',
                    height: { xs: 500, md: 700 },
                    overflow: 'hidden',
                }}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
            >
                <Box
                    sx={{
                        position: 'relative',
                        height: '100%',
                        width: '100%',
                        backgroundImage: `linear-gradient(180deg, rgba(10,15,30,0.35) 0%, rgba(10,15,30,0.65) 100%), url(${slide.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        transition: 'background-image 0.8s ease-in-out',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Container maxWidth="md" sx={{ textAlign: 'center', zIndex: 2 }}>
                        <Typography
                            sx={{
                                color: '#fff',
                                fontWeight: 700,
                                fontFamily: '"Georgia", "Times New Roman", serif',
                                fontSize: { xs: '1.6rem', md: '2.5rem' },
                                lineHeight: 1.3,
                                textShadow: '0 2px 12px rgba(0,0,0,0.35)',
                                animation: 'fadeIn 0.8s ease-in-out',
                                '@keyframes fadeIn': {
                                    '0%': { opacity: 0, transform: 'translateY(20px)' },
                                    '100%': { opacity: 1, transform: 'translateY(0)' },
                                },
                            }}
                        >
                            {slide.title}
                        </Typography>
                        {slide.subtitle && (
                            <Typography
                                sx={{
                                    color: alpha('#fff', 0.85),
                                    fontSize: { xs: '0.9rem', md: '1.2rem' },
                                    mt: 1.5,
                                    fontWeight: 400,
                                    letterSpacing: 1,
                                    animation: 'fadeIn 1s ease-in-out',
                                }}
                            >
                                {slide.subtitle}
                            </Typography>
                        )}
                    </Container>
                </Box>

                <IconButton
                    onClick={handlePrevSlide}
                    sx={{
                        position: 'absolute',
                        left: { xs: 8, md: 16 },
                        top: '50%',
                        transform: 'translateY(-50%)',
                        bgcolor: alpha('#fff', 0.2),
                        color: '#fff',
                        '&:hover': {
                            bgcolor: alpha('#fff', 0.35),
                        },
                        zIndex: 3,
                        width: { xs: 36, md: 48 },
                        height: { xs: 36, md: 48 },
                        backdropFilter: 'blur(4px)',
                        border: '1px solid rgba(255,255,255,0.2)',
                    }}
                >
                    <ArrowLeftIcon sx={{ fontSize: { xs: 20, md: 28 } }} />
                </IconButton>

                <IconButton
                    onClick={handleNextSlide}
                    sx={{
                        position: 'absolute',
                        right: { xs: 8, md: 16 },
                        top: '50%',
                        transform: 'translateY(-50%)',
                        bgcolor: alpha('#fff', 0.2),
                        color: '#fff',
                        '&:hover': {
                            bgcolor: alpha('#fff', 0.35),
                        },
                        zIndex: 3,
                        width: { xs: 36, md: 48 },
                        height: { xs: 36, md: 48 },
                        backdropFilter: 'blur(4px)',
                        border: '1px solid rgba(255,255,255,0.2)',
                    }}
                >
                    <ArrowRightIcon sx={{ fontSize: { xs: 20, md: 28 } }} />
                </IconButton>

                <Box
                    sx={{
                        position: 'absolute',
                        bottom: 18,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 3,
                    }}
                >
                    <Stack direction="row" spacing={1.5} alignItems="center">
                        {heroSlides.map((_, i) => (
                            <Box
                                key={i}
                                onClick={() => handleDotClick(i)}
                                sx={{
                                    width: i === activeSlide ? 28 : 10,
                                    height: 10,
                                    borderRadius: 5,
                                    cursor: 'pointer',
                                    bgcolor: i === activeSlide ? '#fff' : alpha('#fff', 0.4),
                                    transition: 'all 0.3s ease-in-out',
                                    '&:hover': {
                                        bgcolor: '#fff',
                                        transform: 'scale(1.1)',
                                    },
                                }}
                            />
                        ))}

                        <Typography
                            sx={{
                                color: alpha('#fff', 0.7),
                                fontSize: '0.7rem',
                                ml: 1,
                                fontWeight: 500,
                                letterSpacing: 1,
                            }}
                        >
                            {String(activeSlide + 1).padStart(2, '0')} / {String(heroSlides.length).padStart(2, '0')}
                        </Typography>
                    </Stack>
                </Box>
            </Box>

            {/* Quick Links bar - keeping as is */}
            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
                <Box
                    sx={{
                        mt: -1,
                        bgcolor: GOLD,
                        borderRadius: 1,
                        boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                        py: 2.5,
                        px: 4,
                        textAlign: 'center',
                    }}
                >
                    <Typography
                        sx={{
                            color: NAVY,
                            fontWeight: 700,
                            letterSpacing: 1,
                            fontSize: '1rem',
                            mb: 2,
                        }}
                    >
                        QUICK LINKS
                    </Typography>

                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: 2,
                        }}
                    >
                        {quickLinks.map((link, index) => (
                            <React.Fragment key={link.label}>
                                <Typography
                                    component="a"
                                    href={link.href}
                                    target={link.href.startsWith("http") ? "_blank" : undefined}
                                    rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                                    sx={{
                                        color: NAVY,
                                        fontSize: '0.78rem',
                                        fontWeight: 700,
                                        letterSpacing: 0.5,
                                        textDecoration: 'none',
                                        whiteSpace: 'nowrap',
                                        '&:hover': {
                                            textDecoration: 'underline',
                                        },
                                    }}
                                >
                                    {link.label}
                                </Typography>

                                {index !== quickLinks.length - 1 && (
                                    <Box
                                        sx={{
                                            width: '1px',
                                            height: 18,
                                            bgcolor: alpha(NAVY, 0.35),
                                        }}
                                    />
                                )}
                            </React.Fragment>
                        ))}
                    </Box>
                </Box>
            </Container>

            {/* Main content */}
            <Container
                maxWidth={false}
                sx={{
                    width: "92%",
                    maxWidth: "1450px",
                    py: 5,
                    mx: "auto",
                }}
            >
                <Grid container spacing={4}>
                    {/* LEFT */}
                    {/* LEFT */}
                    <Grid size={{ xs: 12, md: 8 }}>
                        <SectionHeading>About College</SectionHeading>

                        {/* Full width text - no photo */}
                        <Grid container spacing={3} sx={{ mt: 2 }}>
                            <Grid size={{ xs: 12 }}>
                                <Typography
                                    sx={{
                                        fontSize: "18px",
                                        lineHeight: 2,
                                        textAlign: "justify",
                                        color: "#222",
                                    }}
                                >
                                    {principal.message[0]}
                                </Typography>
                            </Grid>
                        </Grid>

                        {principal.message.slice(1).map((para, i) => (
                            <Typography
                                key={i}
                                sx={{
                                    fontSize: '18px',
                                    lineHeight: 1.9,
                                    textAlign: 'justify',
                                    color: '#333',
                                    mt: 2,
                                }}
                            >
                                {para}
                            </Typography>
                        ))}
                    </Grid>

                    {/* RIGHT */}
                    {/* RIGHT */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        {/* Upcoming Events */}
                        <Box
                            sx={{
                                mt: 3,
                                p: { xs: 2, sm: 2.5 },
                                borderRadius: 3,
                                bgcolor: alpha(NAVY, 0.035),
                                border: `1px solid ${alpha(NAVY, 0.08)}`,
                            }}
                        >
                            {/* Header */}
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    gap: 2,
                                    mb: 2,
                                }}
                            >
                                <Box sx={{ minWidth: 0 }}>
                                    <Typography
                                        sx={{
                                            color: NAVY,
                                            fontWeight: 800,
                                            fontSize: { xs: "1rem", sm: "1.1rem" },
                                        }}
                                    >
                                        Upcoming Events
                                    </Typography>

                                    <Typography
                                        sx={{
                                            mt: 0.3,
                                            color: "text.secondary",
                                            fontSize: "0.78rem",
                                        }}
                                    >
                                        Stay updated with the latest events
                                    </Typography>
                                </Box>

                                <Chip
                                    label={`${firstFourEvents.length} Events`}
                                    size="small"
                                    sx={{
                                        bgcolor: alpha(GOLD, 0.18),
                                        color: NAVY,
                                        fontWeight: 700,
                                        borderRadius: 2,
                                        flexShrink: 0,
                                    }}
                                />
                            </Box>

                            {/* Scrollable Event List */}
                            <Box
                                sx={{
                                    maxHeight: 360,
                                    overflowY: "auto",
                                    pr: 0.5,

                                    "&::-webkit-scrollbar": {
                                        width: "5px",
                                    },

                                    "&::-webkit-scrollbar-track": {
                                        background: alpha(NAVY, 0.04),
                                        borderRadius: "10px",
                                    },

                                    "&::-webkit-scrollbar-thumb": {
                                        background: alpha(NAVY, 0.25),
                                        borderRadius: "10px",
                                    },

                                    "&::-webkit-scrollbar-thumb:hover": {
                                        background: alpha(NAVY, 0.4),
                                    },
                                }}
                            >
                                {eventsLoading ? (
                                    <Box
                                        sx={{
                                            py: 5,
                                            textAlign: "center",
                                            bgcolor: "#fff",
                                            borderRadius: 2.5,
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                color: "text.secondary",
                                                fontSize: "0.85rem",
                                            }}
                                        >
                                            Loading events...
                                        </Typography>
                                    </Box>
                                ) : eventsError ? (
                                    <Box
                                        sx={{
                                            py: 4,
                                            px: 2,
                                            textAlign: "center",
                                            bgcolor: "#fff",
                                            borderRadius: 2.5,
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                color: "#c0392b",
                                                fontSize: "0.85rem",
                                            }}
                                        >
                                            {eventsError}
                                        </Typography>
                                    </Box>
                                ) : firstFourEvents.length === 0 ? (
                                    <Box
                                        sx={{
                                            py: 5,
                                            textAlign: "center",
                                            bgcolor: "#fff",
                                            borderRadius: 2.5,
                                            border: `1px dashed ${alpha(NAVY, 0.15)}`,
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                color: NAVY,
                                                fontWeight: 700,
                                                fontSize: "0.95rem",
                                            }}
                                        >
                                            No Upcoming Events
                                        </Typography>

                                        <Typography
                                            sx={{
                                                mt: 0.5,
                                                color: "text.secondary",
                                                fontSize: "0.78rem",
                                            }}
                                        >
                                            New events will appear here.
                                        </Typography>
                                    </Box>
                                ) : (
                                    <Stack spacing={1.5}>
                                        {firstFourEvents.map((event, index) => (
                                            <Box
                                                key={event.id ?? index}
                                                sx={{
                                                    display: "flex",
                                                    gap: 1.5,
                                                    p: { xs: 1.5, sm: 2 },
                                                    bgcolor: "#fff",
                                                    borderRadius: 2.5,
                                                    border: `1px solid ${alpha(
                                                        NAVY,
                                                        0.08
                                                    )}`,
                                                    boxShadow:
                                                        "0 2px 8px rgba(0,0,0,0.05)",
                                                    transition:
                                                        "transform .2s ease, box-shadow .2s ease",

                                                    "&:hover": {
                                                        transform: "translateY(-2px)",
                                                        boxShadow:
                                                            "0 6px 18px rgba(0,0,0,0.10)",
                                                    },
                                                }}
                                            >
                                                {/* Event Number */}
                                                <Box
                                                    sx={{
                                                        width: 48,
                                                        minWidth: 48,
                                                        height: 48,
                                                        borderRadius: 2,
                                                        bgcolor: alpha(NAVY, 0.07),
                                                        border: `1px solid ${alpha(
                                                            NAVY,
                                                            0.08
                                                        )}`,
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                    }}
                                                >
                                                    <Typography
                                                        sx={{
                                                            fontSize: "0.6rem",
                                                            color: "text.secondary",
                                                            fontWeight: 700,
                                                        }}
                                                    >
                                                        EVENT
                                                    </Typography>

                                                    <Typography
                                                        sx={{
                                                            fontSize: "1rem",
                                                            lineHeight: 1.2,
                                                            color: NAVY,
                                                            fontWeight: 800,
                                                        }}
                                                    >
                                                        {index + 1}
                                                    </Typography>
                                                </Box>

                                                {/* Event Details */}
                                                <Box
                                                    sx={{
                                                        flex: 1,
                                                        minWidth: 0,
                                                        display: "flex",
                                                        flexDirection: "column",
                                                    }}
                                                >
                                                    {/* Title + Status */}
                                                    <Box
                                                        sx={{
                                                            display: "flex",
                                                            justifyContent: "space-between",
                                                            alignItems: "flex-start",
                                                            gap: 1,
                                                        }}
                                                    >
                                                        <Typography
                                                            sx={{
                                                                color: NAVY,
                                                                fontWeight: 700,
                                                                fontSize: {
                                                                    xs: "0.88rem",
                                                                    sm: "0.95rem",
                                                                },
                                                                lineHeight: 1.4,
                                                                flex: 1,
                                                                minWidth: 0,
                                                            }}
                                                        >
                                                            {event.eventTitle ||
                                                                event.title ||
                                                                "Untitled Event"}
                                                        </Typography>

                                                        {event.status && (
                                                            <Chip
                                                                label={event.status}
                                                                size="small"
                                                                sx={{
                                                                    height: 22,
                                                                    flexShrink: 0,
                                                                    fontSize: "0.62rem",
                                                                    fontWeight: 700,
                                                                    bgcolor:
                                                                        event.status === "UPCOMING"
                                                                            ? alpha("#4caf50", 0.12)
                                                                            : alpha("#ff9800", 0.12),
                                                                    color:
                                                                        event.status === "UPCOMING"
                                                                            ? "#2e7d32"
                                                                            : "#ed6c02",
                                                                }}
                                                            />
                                                        )}
                                                    </Box>

                                                    {/* Full Description */}
                                                    {event.description && (
                                                        <Typography
                                                            sx={{
                                                                mt: 0.6,
                                                                color: "#666",
                                                                fontSize: "0.76rem",
                                                                lineHeight: 1.5,

                                                                // Show complete content
                                                                whiteSpace: "normal",
                                                                wordBreak: "break-word",
                                                                overflowWrap: "anywhere",
                                                            }}
                                                        >
                                                            {event.description}
                                                        </Typography>
                                                    )}

                                                    {/* Date */}
                                                    {event.startDate && (
                                                        <Typography
                                                            sx={{
                                                                mt: 0.8,
                                                                color: "text.secondary",
                                                                fontSize: "0.72rem",
                                                                fontWeight: 600,
                                                                lineHeight: 1.4,

                                                                display: "flex",
                                                                alignItems: "center",
                                                                gap: 0.5,

                                                                whiteSpace: "nowrap",
                                                            }}
                                                        >
                                                            <span>📅</span>

                                                            <span>
                                                                {formatDate(event.startDate)}
                                                                {event.endDate &&
                                                                    ` - ${formatDate(event.endDate)}`}
                                                            </span>
                                                        </Typography>
                                                    )}
                                                </Box>
                                            </Box>
                                        ))}
                                    </Stack>
                                )}
                            </Box>
                        </Box>

                        {/* Circular Section */}
                        <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            <SectionHeading sx={{ mt: 7 }}>
                                Circular
                            </SectionHeading>
                        </Stack>

                        <Box
                            ref={listRef}
                            onMouseEnter={() => setIsPaused(true)}
                            onMouseLeave={() => setIsPaused(false)}
                            sx={{
                                maxHeight: 350,
                                overflowY: "auto",
                                mt: 1.5,
                                pr: 1,

                                "&::-webkit-scrollbar": {
                                    width: "5px",
                                },

                                "&::-webkit-scrollbar-track": {
                                    background: alpha(NAVY, 0.04),
                                    borderRadius: 10,
                                },

                                "&::-webkit-scrollbar-thumb": {
                                    background: alpha(NAVY, 0.25),
                                    borderRadius: 10,
                                },
                            }}
                        >
                            {loading ? (
                                <Box sx={{ textAlign: "center", py: 3 }}>
                                    <Typography
                                        sx={{
                                            fontSize: "16px",
                                            color: "#666",
                                        }}
                                    >
                                        Loading circulars...
                                    </Typography>
                                </Box>
                            ) : error ? (
                                <Box sx={{ textAlign: "center", py: 2 }}>
                                    <Typography
                                        sx={{
                                            fontSize: "14px",
                                            color: "#c0392b",
                                        }}
                                    >
                                        {error}
                                    </Typography>
                                </Box>
                            ) : circulars.length === 0 ? (
                                <Box sx={{ textAlign: "center", py: 2 }}>
                                    <Typography
                                        sx={{
                                            fontSize: "14px",
                                            color: "#666",
                                        }}
                                    >
                                        No circulars available
                                    </Typography>
                                </Box>
                            ) : (
                                <Stack
                                    divider={
                                        <Divider
                                            sx={{
                                                borderColor: alpha(NAVY, 0.1),
                                            }}
                                        />
                                    }
                                >
                                    {circulars.map((item, i) => (
                                        <Stack
                                            key={item.id || i}
                                            direction="row"
                                            spacing={1.5}
                                            alignItems="flex-start"
                                            sx={{ py: 1.2 }}
                                        >
                                            <NewsIcon
                                                sx={{
                                                    fontSize: 16,
                                                    color: NAVY,
                                                    mt: 0.4,
                                                    flexShrink: 0,
                                                }}
                                            />

                                            <Typography
                                                sx={{
                                                    flex: 1,
                                                    textAlign: "left",
                                                    fontSize: "18px",
                                                    lineHeight: 1.6,
                                                    color: "#333",
                                                    wordBreak: "break-word",
                                                }}
                                            >
                                                <Box
                                                    component="span"
                                                    sx={{
                                                        color: "#1a4fa0",
                                                    }}
                                                >
                                                    {item.circularTitle ||
                                                        item.text}
                                                </Box>

                                                {item.description && (
                                                    <Box
                                                        component="span"
                                                        sx={{
                                                            display: "block",
                                                            fontSize: "14px",
                                                            color: "#666",
                                                            mt: 0.5,
                                                        }}
                                                    >
                                                        {item.description}
                                                    </Box>
                                                )}

                                                {item.date && (
                                                    <Box
                                                        component="span"
                                                        sx={{
                                                            display: "inline-block",
                                                            mt: 0.5,
                                                            px: 1,
                                                            py: 0.25,
                                                            borderRadius: 1,
                                                            bgcolor: alpha(
                                                                NAVY,
                                                                0.1
                                                            ),
                                                            color: NAVY,
                                                            fontSize: "12px",
                                                            fontWeight: 700,
                                                        }}
                                                    >
                                                        {formatDate(item.date)}
                                                    </Box>
                                                )}
                                            </Typography>
                                        </Stack>
                                    ))}
                                </Stack>
                            )}
                        </Box>
                    </Grid>
                </Grid>

                {/* Downloads Section */}
                <Box sx={{ mt: 6 }}>
                    <SectionHeading>Downloads</SectionHeading>

                    <Grid container spacing={3} justifyContent="center" sx={{ mt: 1 }}>
                        {/* Students Downloads */}
                        <Grid size={{ xs: 12, md: 5 }}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3,
                                    borderRadius: 2,
                                    border: '1px solid #e0e0e0',
                                    height: '90%',
                                    bgcolor: '#fff',
                                }}
                            >
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 700,
                                        color: NAVY,
                                        mb: 2,
                                        pb: 1,
                                        borderBottom: `3px solid ${GOLD}`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                    }}
                                >
                                    <DownloadIcon sx={{ color: GOLD }} />
                                    For Students
                                </Typography>

                                <Grid container spacing={1}>
                                    {studentDownloads.map((item, index) => (
                                        <Grid key={index} size={{ xs: 12, sm: 6 }}>
                                            <Button
                                                component="a"
                                                href={item.href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                fullWidth
                                                startIcon={item.icon}
                                                sx={{
                                                    justifyContent: 'flex-start',
                                                    color: '#333',
                                                    textTransform: 'none',
                                                    fontSize: '14px',
                                                    fontWeight: 500,
                                                    py: 1,
                                                    px: 1.5,
                                                    borderRadius: 1,
                                                    '&:hover': {
                                                        bgcolor: alpha(NAVY, 0.05),
                                                        color: NAVY,
                                                    },
                                                }}
                                            >
                                                {item.label}
                                            </Button>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Paper>
                        </Grid>

                        {/* Faculty Downloads */}
                        <Grid size={{ xs: 12, md: 5 }}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3,
                                    borderRadius: 2,
                                    border: '1px solid #e0e0e0',
                                    height: '90%',
                                    bgcolor: '#fff',
                                }}
                            >
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 700,
                                        color: NAVY,
                                        mb: 2,
                                        pb: 1,
                                        borderBottom: `3px solid ${GOLD}`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                    }}
                                >
                                    <DownloadIcon sx={{ color: GOLD }} />
                                    For Faculty
                                </Typography>

                                <Grid container spacing={1}>
                                    {facultyDownloads.map((item, index) => (
                                        <Grid key={index} size={{ xs: 12, sm: 6 }}>
                                            <Button
                                                component="a"
                                                href={item.href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                fullWidth
                                                startIcon={item.icon}
                                                sx={{
                                                    justifyContent: 'flex-start',
                                                    color: '#333',
                                                    textTransform: 'none',
                                                    fontSize: '14px',
                                                    fontWeight: 500,
                                                    py: 1,
                                                    px: 1.5,
                                                    borderRadius: 1,
                                                    '&:hover': {
                                                        bgcolor: alpha(NAVY, 0.05),
                                                        color: NAVY,
                                                    },
                                                }}
                                            >
                                                {item.label}
                                            </Button>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Paper>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
            <Footer />
        </Box>
    );
};

const SectionHeading = ({ children, sx = {} }) => (
    <Box
        sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            mb: 2,
            ...sx,
        }}
    >
        <Typography
            sx={{
                position: 'relative',
                pl: 1.5,
                ml: 0,
                textAlign: 'left',
                width: '100%',
                fontSize: '26px',
                fontWeight: 700,
                color: '#1a1a1a',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    left: 0,
                    top: 4,
                    bottom: 4,
                    width: 4,
                    bgcolor: '#c0392b',
                },
            }}
        >
            {children}
        </Typography>
    </Box>
);

export default HomePage;