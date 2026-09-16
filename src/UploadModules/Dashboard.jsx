import { useNavigate, useLocation, Outlet } from "react-router-dom";
import React, { useState, useEffect } from "react";
import {
    Box,
    IconButton,
    Badge,
    Typography,
    Paper,
    Menu,
    MenuItem,
    Divider,
    ListItemIcon,
    Drawer,
    useMediaQuery,
    useTheme,
    SwipeableDrawer,
    Fade,
    Backdrop,
} from "@mui/material";

import {
    ArrowBackIosNew,
    NotificationsNone,
    AccountCircle,
    Dashboard as DashboardIcon,
    Event,
    PersonAdd,
    Groups2,
    School,
    MenuBook,
    Person,
    Logout,
    Menu as MenuIcon,
    CalendarToday,
    PhotoLibrary,
    Announcement,
    Notifications,
    Subject,
    AccountTree,
    Group,
    MilitaryTech,
    EmojiEvents,
    WorkspacePremium,
    Assignment,
    LibraryBooks,
    FolderSpecial,
    Business,
    KeyboardArrowDown,
    Close,
} from "@mui/icons-material";
import Campaign from "@mui/icons-material/Campaign";
import ManageAccounts from "@mui/icons-material/ManageAccounts";

const MENU_ITEMS = [
    { key: "academic-year", label: "Academic Year", icon: <CalendarToday />, path: "Uploadacademicyear" },
    { key: "add-principal", label: "Add Principal", icon: <WorkspacePremium />, path: "Addprincipal" },
    {
        key: "cell",
        label: "Cell",
        icon: <Groups2 />,
        path: "Uploadcells",
        children: [
            { key: "cell", label: "Cell", icon: <Groups2 />, path: "Uploadcells",},
            { key: "commite", label: "Commite", icon: <Group />, path: "Uploadcommite" },
            { key: "group", label: "ScholarShip Category", icon: <FolderSpecial />, path: "ScholarShipCategory" },
            { key: "officers", label: "ScholarShip Officers", icon: <EmojiEvents />, path: "ScholarShipOfficers" },
            { key: "naanMudhalvan", label: "Naan Mudhalvan", icon: <MilitaryTech />, path: "NaanMudhalvan" },
        ]
    },
    {
        key: "notification-circular",
        label: "Notification & Circular",
        icon: <Campaign />,
        children: [
            {
                key: "event",
                label: "Event",
                icon: <Event />,
                path: "Uploadevent",
            },
            {
                key: "circular",
                label: "Circular",
                icon: <Announcement />,
                path: "Uploadcircular",
            },
            {
                key: "notification",
                label: "Notification",
                icon: <Notifications />,
                path: "Uploadnotification",
            },
        ],
    },
    {
        key: "staff-allocation",
        label: "Staff Allocation",
        icon: <ManageAccounts />,
        children: [
            {
                key: "department",
                label: "Department",
                icon: <Business />,
                path: "Uploaddepartments",
            },
            {
                key: "newCourse",
                label: "New Course",
                icon: <School />,
                path: "NewCoursePage",
            },
            {
                key: "subject",
                label: "Subject",
                icon: <Subject />,
                path: "Uploadsubject",
            },
            {
                key: "add-staff",
                label: "Add Staff",
                icon: <PersonAdd />,
                path: "Addstaff",
            },
            {
                key: "subject-allocate",
                label: "Subject Allocate",
                icon: <Assignment />,
                path: "Subjectallocate",
            },
        ],
    },
    { key: "gallery", label: "Gallery", icon: <PhotoLibrary />, path: "Uploadgallery" },
    { key: "galllery", label: "Academic Calendar", icon: <LibraryBooks />, path: "AcademicGallery" },
];

const NAVY = "#0A1F44";
const NAVY_DARK = "#071633";
const ACTIVE_BLUE = "#3B82F6";

const OverviewFallback = () => (
    <Paper
        elevation={0}
        sx={{
            p: { xs: 2, sm: 3, md: 4 },
            borderRadius: { xs: 2, sm: 3 },
            border: "1px solid #EDEFF3",
            maxWidth: 1250,
            // mt: { xs: 10, sm: 15, md: 25 },
            mx: "auto",
            textAlign: "center",
            backgroundColor: "#eaf1f7",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: 700
            // minHeight: { xs: 150, sm: 200, md: 250 }
        }}
    >
        <Box sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: { xs: 1.5, sm: 2, md: 4 },
            width: "100%",
            mb: 2,
            flexDirection: { xs: "column", sm: "row" }
        }}>
            {/* Left Logo */}
            <Box
                component="img"
                src="/gvtlogo.png"
                alt="College Logo"
                sx={{
                    height: { xs: 50, sm: 70, md: 100 },
                    width: { xs: 50, sm: 70, md: 100 },
                    objectFit: "contain",
                    flexShrink: 0
                }}
            />

            {/* Center Text */}
            <Box sx={{ flex: 1, px: { xs: 1, sm: 2 } }}>
                <Typography
                    sx={{
                        fontWeight: 800,
                        fontSize: { xs: 14, sm: 20, md: 30 },
                        color: NAVY,
                        mb: 0.5,
                        letterSpacing: 0.5,
                        lineHeight: 1.2
                    }}
                >
                    Government Arts And Science College
                </Typography>
                <Typography
                    sx={{
                        fontSize: { xs: 9, sm: 12, md: 16 },
                        color: "text.secondary",
                        fontWeight: 500,
                        mb: 0.3
                    }}
                >
                    [Affiliated To Bharathidasan University, Tiruchirapalli-TamilNadu]
                </Typography>
                <Typography
                    sx={{
                        fontSize: { xs: 9, sm: 12, md: 16 },
                        color: "text.secondary",
                        mb: 1
                    }}
                >
                    Nanmilan - 610 105
                </Typography>
                <Divider sx={{ width: { xs: "60%", sm: "80%" }, mx: "auto", my: 1 }} />
                <Typography
                    sx={{
                        fontSize: { xs: 11, sm: 14, md: 17 },
                        fontWeight: 600,
                        color: NAVY,
                        bgcolor: "rgba(59, 130, 246, 0.1)",
                        px: { xs: 2, sm: 3 },
                        py: { xs: 0.5, sm: 0.8 },
                        borderRadius: 2,
                        display: "inline-block"
                    }}
                >
                    College Code - 1051016
                </Typography>
            </Box>

            {/* Right Logo */}
            <Box
                component="img"
                src="/collegelogo.jpeg"
                alt="College Logo"
                sx={{
                    height: { xs: 50, sm: 70, md: 100 },
                    width: { xs: 50, sm: 70, md: 100 },
                    objectFit: "contain",
                    flexShrink: 0
                }}
            />
        </Box>
    </Paper>
);

const DashboardLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // Profile Menu
    const [anchorEl, setAnchorEl] = useState(null);
    // Mobile sidebar drawer
    const [mobileOpen, setMobileOpen] = useState(false);
    // Track open state for nested menus
    const [openMenus, setOpenMenus] = useState({});
    // Touch feedback state
    const [touchedItem, setTouchedItem] = useState(null);

    const open = Boolean(anchorEl);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleProfile = () => {
        handleMenuClose();
        navigate("/profile");
    };

    const handleLogout = () => {
        handleMenuClose();
        localStorage.clear();
        navigate("/");
    };

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleNavigation = (path) => {
        navigate(`/dashboard/${path}`);
        if (isMobile) {
            setMobileOpen(false);
        }
    };

    const toggleMenu = (key) => {
        setOpenMenus(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const currentSegment = location.pathname.replace(/^\/dashboard\/?/, "");
    const isExactDashboard = currentSegment === "";

    const getPageTitle = () => {
        if (isExactDashboard) {
            return "Overview Dashboard";
        }
        for (const item of MENU_ITEMS) {
            if (item.path === currentSegment) {
                return item.label;
            }
            if (item.children) {
                const child = item.children.find(c => c.path === currentSegment);
                if (child) return child.label;
            }
        }
        return "STAFF MANAGEMENT";
    };

    const handleBack = () => navigate("/login");

    useEffect(() => {
        MENU_ITEMS.forEach(item => {
            if (item.children) {
                const hasActiveChild = item.children.some(child => child.path === currentSegment);
                if (hasActiveChild && !openMenus[item.key]) {
                    setOpenMenus(prev => ({
                        ...prev,
                        [item.key]: true
                    }));
                }
            }
        });
    }, [currentSegment]);

    // Mobile sidebar content with touch optimizations
    const sidebarContent = (
        <Box
            sx={{
                width: { xs: 280, sm: 264 },
                height: "100%",
                background: `linear-gradient(180deg, ${NAVY} 0%, ${NAVY_DARK} 100%)`,
                color: "#fff",
                display: "flex",
                flexDirection: "column",
                py: { xs: 1, sm: 1 },
                overflow: "hidden",
            }}
        >
            {/* Close button for mobile */}
            {isMobile && (
                <Box sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    px: 2,
                    pt: 1,
                    pb: 0.5
                }}>
                    <IconButton
                        onClick={handleDrawerToggle}
                        sx={{
                            color: "rgba(255,255,255,0.7)",
                            p: 0.5,
                            '&:hover': {
                                color: "#fff"
                            }
                        }}
                    >
                        <Close />
                    </IconButton>
                </Box>
            )}

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    py: { xs: 0.5, sm: 1 },
                    flexShrink: 0,
                }}
            >
                <Box
                    component="img"
                    src="/collegelogo.jpeg"
                    alt="LIDER Logo"
                    sx={{
                        height: { xs: 60, sm: 70 },
                        width: { xs: 60, sm: 75 },
                    }}
                />
            </Box>

            <Box sx={{
                mt: 1,
                display: "flex",
                flexDirection: "column",
                gap: { xs: 0.3, sm: 0.5 },
                overflowY: "auto",
                flex: 1,
                pb: 2,
                px: { xs: 0.5, sm: 0 },
                "&::-webkit-scrollbar": {
                    width: "4px",
                },
                "&::-webkit-scrollbar-track": {
                    background: "transparent",
                },
                "&::-webkit-scrollbar-thumb": {
                    background: "rgba(255,255,255,0.2)",
                    borderRadius: "4px",
                },
                // Smooth scrolling for mobile
                "-webkit-overflow-scrolling": "touch",
            }}>
                {MENU_ITEMS.map((item) => {
                    const hasChildren = item.children && item.children.length > 0;
                    const isActive = currentSegment === item.path ||
                        (hasChildren && item.children.some(child => currentSegment === child.path));
                    const isOpen = openMenus[item.key] || false;

                    if (hasChildren) {
                        return (
                            <Box key={item.key}>
                                <Box
                                    onClick={() => toggleMenu(item.key)}
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        gap: 1.5,
                                        px: { xs: 1.5, sm: 2.5 },
                                        py: { xs: 1, sm: 1.4 },
                                        mx: { xs: 0.5, sm: 1 },
                                        cursor: "pointer",
                                        color: isActive ? "#fff" : "rgba(255,255,255,0.75)",
                                        bgcolor: isActive ? ACTIVE_BLUE : "transparent",
                                        borderRadius: "8px",
                                        transition: "all 0.15s ease",
                                        flexShrink: 0,
                                        // Touch feedback
                                        touchAction: "manipulation",
                                        WebkitTapHighlightColor: "transparent",
                                        "&:active": {
                                            transform: "scale(0.98)",
                                        },
                                        "&:hover": {
                                            bgcolor: isActive ? ACTIVE_BLUE : "rgba(255,255,255,0.06)",
                                        },
                                    }}
                                >
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                        <Box sx={{ display: "flex", fontSize: { xs: 18, sm: 20 } }}>
                                            {item.icon}
                                        </Box>
                                        <Typography
                                            sx={{
                                                fontSize: { xs: 11, sm: 13 },
                                                fontWeight: 700,
                                                letterSpacing: 0.4,
                                                textTransform: "uppercase",
                                            }}
                                        >
                                            {item.label}
                                        </Typography>
                                    </Box>
                                    <Box sx={{
                                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                                        transition: 'transform 0.2s ease'
                                    }}>
                                        <KeyboardArrowDown sx={{ fontSize: { xs: 16, sm: 18 } }} />
                                    </Box>
                                </Box>

                                {isOpen && (
                                    <Box
                                        sx={{
                                            pl: { xs: 3, sm: 4 },
                                            mt: 0.5,
                                            mb: 0.5,
                                            ml: { xs: 1.5, sm: 2 },
                                            borderLeft: `2px solid rgba(255,255,255,0.15)`,
                                            position: 'relative',
                                            '&::before': {
                                                content: '""',
                                                position: 'absolute',
                                                left: -2,
                                                top: 0,
                                                width: '2px',
                                                height: '100%',
                                                background: isActive ? ACTIVE_BLUE : 'rgba(255,255,255,0.15)',
                                                borderRadius: '0 2px 2px 0',
                                            }
                                        }}
                                    >
                                        {item.children.map((child) => {
                                            const isChildActive = currentSegment === child.path;
                                            return (
                                                <Box
                                                    key={child.key}
                                                    onClick={() => handleNavigation(child.path)}
                                                    sx={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: 1.5,
                                                        px: { xs: 1.5, sm: 2.5 },
                                                        py: { xs: 0.8, sm: 1.2 },
                                                        mx: { xs: 0.5, sm: 1 },
                                                        my: 0.5,
                                                        cursor: "pointer",
                                                        color: isChildActive ? "#fff" : "rgba(255,255,255,0.7)",
                                                        bgcolor: isChildActive ? ACTIVE_BLUE : "rgba(255,255,255,0.05)",
                                                        borderRadius: "8px",
                                                        border: isChildActive ? `2px solid ${ACTIVE_BLUE}` : `1px solid rgba(255,255,255,0.1)`,
                                                        transition: "all 0.15s ease",
                                                        flexShrink: 0,
                                                        touchAction: "manipulation",
                                                        WebkitTapHighlightColor: "transparent",
                                                        "&:active": {
                                                            transform: "scale(0.97)",
                                                        },
                                                        "&:hover": {
                                                            bgcolor: isChildActive ? ACTIVE_BLUE : "rgba(255,255,255,0.12)",
                                                            border: isChildActive ? `2px solid ${ACTIVE_BLUE}` : `1px solid rgba(255,255,255,0.2)`,
                                                            transform: 'translateX(4px)',
                                                        },
                                                    }}
                                                >
                                                    <Box sx={{
                                                        display: "flex",
                                                        fontSize: { xs: 16, sm: 18 },
                                                        opacity: 0.8,
                                                    }}>
                                                        {child.icon}
                                                    </Box>
                                                    <Typography
                                                        sx={{
                                                            fontSize: { xs: 10, sm: 12 },
                                                            fontWeight: isChildActive ? 700 : 500,
                                                            letterSpacing: 0.3,
                                                            textTransform: "uppercase",
                                                        }}
                                                    >
                                                        {child.label}
                                                    </Typography>
                                                </Box>
                                            );
                                        })}
                                    </Box>
                                )}
                            </Box>
                        );
                    }

                    return (
                        <Box
                            key={item.key}
                            onClick={() => handleNavigation(item.path)}
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1.5,
                                px: { xs: 1.5, sm: 2.5 },
                                py: { xs: 1, sm: 1.4 },
                                mx: { xs: 0.5, sm: 1 },
                                cursor: "pointer",
                                color: isActive ? "#fff" : "rgba(255,255,255,0.75)",
                                bgcolor: isActive ? ACTIVE_BLUE : "transparent",
                                borderRadius: "8px",
                                transition: "all 0.15s ease",
                                flexShrink: 0,
                                touchAction: "manipulation",
                                WebkitTapHighlightColor: "transparent",
                                "&:active": {
                                    transform: "scale(0.98)",
                                },
                                "&:hover": {
                                    bgcolor: isActive ? ACTIVE_BLUE : "rgba(255,255,255,0.06)",
                                },
                            }}
                        >
                            <Box sx={{ display: "flex", fontSize: { xs: 18, sm: 20 } }}>
                                {item.icon}
                            </Box>
                            <Typography
                                sx={{
                                    fontSize: { xs: 11, sm: 13 },
                                    fontWeight: 700,
                                    letterSpacing: 0.4,
                                    textTransform: "uppercase",
                                }}
                            >
                                {item.label}
                            </Typography>
                        </Box>
                    );
                })}
            </Box>
        </Box>
    );

    return (
        <Box sx={{
            display: "flex",
            height: "100vh",
            overflow: "hidden",
            bgcolor: "#F4F6FA"
        }}>
            {/* Desktop Sidebar */}
            {!isMobile && (
                <Box
                    sx={{
                        width: 264,
                        flexShrink: 0,
                        display: { xs: "none", md: "block" },
                        height: "100vh",
                        overflow: "hidden",
                    }}
                >
                    {sidebarContent}
                </Box>
            )}

            {/* Mobile Swipeable Drawer */}
            <SwipeableDrawer
                variant="temporary"
                anchor="left"
                open={mobileOpen}
                onOpen={handleDrawerToggle}
                onClose={handleDrawerToggle}
                swipeAreaWidth={0}
                ModalProps={{
                    keepMounted: true,
                    BackdropComponent: Backdrop,
                    BackdropProps: {
                        sx: {
                            backdropFilter: 'blur(4px)',
                            backgroundColor: 'rgba(0,0,0,0.5)',
                        }
                    }
                }}
                sx={{
                    display: { xs: "block", md: "none" },
                    "& .MuiDrawer-paper": {
                        boxSizing: "border-box",
                        width: { xs: 280, sm: 264 },
                        height: "100vh",
                        overflow: "hidden",
                        borderTopRightRadius: { xs: 12, sm: 16 },
                        borderBottomRightRadius: { xs: 12, sm: 16 },
                    },
                }}
            >
                {sidebarContent}
            </SwipeableDrawer>

            {/* Main Content Area */}
            <Box sx={{
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
                height: "100vh",
                overflow: "hidden",
            }}>
                {/* Top Bar */}
                <Box
                    sx={{
                        height: { xs: 50, sm: 56, md: 64 },
                        bgcolor: NAVY,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        px: { xs: 1, sm: 1.5, md: 3 },
                        color: "#fff",
                        flexShrink: 0,
                        zIndex: 1100,
                        position: "sticky",
                        top: 0,
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    }}
                >
                    {/* Mobile Menu Button */}
                    {isMobile && (
                        <IconButton
                            onClick={handleDrawerToggle}
                            sx={{
                                color: "#fff",
                                mr: 1,
                                p: 0.5,
                                '&:hover': {
                                    bgcolor: 'rgba(255,255,255,0.1)'
                                }
                            }}
                        >
                            <MenuIcon sx={{ fontSize: { xs: 24, sm: 28 } }} />
                        </IconButton>
                    )}

                    {/* Scrolling Text - Hidden on very small screens */}
                    <Box
                        sx={{
                            flex: 1,
                            mx: { xs: 1, sm: 2, md: 3 },
                            overflow: "hidden",
                            position: "relative",
                            height: { xs: 30, sm: 35 },
                            display: "flex",
                            alignItems: "center",
                            display: { xs: "none", sm: "flex" }
                        }}
                    >
                        <Typography
                            sx={{
                                position: "absolute",
                                whiteSpace: "nowrap",
                                color: "#fff",
                                fontWeight: 100,
                                fontSize: { xs: 11, sm: 13, md: 14 },
                                animation: "marquee 18s linear infinite",
                                "@keyframes marquee": {
                                    "0%": {
                                        transform: "translateX(100%)",
                                    },
                                    "100%": {
                                        transform: "translateX(-100%)",
                                    },
                                },
                            }}
                        >
                            🎓 Government Arts and Science College, Nannilam - 610 105 | Affiliated to Bharathidasan University | College Code: 1051016
                        </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 0.5, sm: 1, md: 2 } }}>
                        <IconButton
                            onClick={handleMenuOpen}
                            sx={{
                                p: { xs: 0.3, sm: 0.5 },
                                '&:hover': {
                                    bgcolor: 'rgba(255,255,255,0.1)'
                                }
                            }}
                            size={isSmallMobile ? "small" : "medium"}
                        >
                            <AccountCircle
                                sx={{
                                    color: "#fff",
                                    fontSize: { xs: 28, sm: 30, md: 32 },
                                    cursor: "pointer",
                                }}
                            />
                        </IconButton>

                        <Menu
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleMenuClose}
                            PaperProps={{
                                elevation: 5,
                                sx: {
                                    mt: 1.5,
                                    minWidth: { xs: 160, sm: 190 },
                                    borderRadius: 3,
                                    overflow: "visible",
                                    "&:before": {
                                        content: '""',
                                        display: "block",
                                        position: "absolute",
                                        top: 0,
                                        right: { xs: 12, sm: 18 },
                                        width: 10,
                                        height: 10,
                                        bgcolor: "background.paper",
                                        transform: "translateY(-50%) rotate(45deg)",
                                        zIndex: 0,
                                    },
                                },
                            }}
                        >
                            <Divider />
                            <MenuItem
                                onClick={handleLogout}
                                sx={{
                                    py: { xs: 1.2, sm: 1.5 },
                                    px: { xs: 1.5, sm: 2 },
                                }}
                            >
                                <ListItemIcon>
                                    <Logout fontSize="small" color="error" />
                                </ListItemIcon>
                                <Typography sx={{ fontSize: { xs: 14, sm: 16 } }}>
                                    Logout
                                </Typography>
                            </MenuItem>
                        </Menu>
                    </Box>
                </Box>

                {/* Scrollable Content */}
                <Box sx={{
                    p: { xs: 1.5, sm: 2, md: 4 },
                    flexGrow: 1,
                    overflowY: "auto",
                    height: "100%",
                    bgcolor: "#F4F6FA",
                    "&::-webkit-scrollbar": {
                        width: "6px",
                    },
                    "&::-webkit-scrollbar-track": {
                        background: "#f1f1f1",
                        borderRadius: "3px",
                    },
                    "&::-webkit-scrollbar-thumb": {
                        background: "#888",
                        borderRadius: "3px",
                    },
                    "&::-webkit-scrollbar-thumb:hover": {
                        background: "#555",
                    },
                    // Smooth scrolling for mobile
                    "-webkit-overflow-scrolling": "touch",
                }}>
                    {isExactDashboard ? <OverviewFallback /> : <Outlet />}
                </Box>
            </Box>
        </Box>
    );
};

export default DashboardLayout;