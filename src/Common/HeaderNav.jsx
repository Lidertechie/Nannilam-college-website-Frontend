import React, { useState, useEffect, useRef } from 'react';
import {
    AppBar, Toolbar, Typography, Box, Button, IconButton, List, ListItem, ListItemText, Divider, alpha, useTheme, useMediaQuery, Drawer, Collapse, Popper,
    Paper, ClickAwayListener, Container, CircularProgress,
} from '@mui/material';
import {
    Menu as MenuIcon,
    Close as CloseIcon,
    Home as HomeIcon,
    School as SchoolIcon,
    Science as ScienceIcon,
    AdminPanelSettings as AdminIcon,
    Assignment as ExamIcon,
    ContactMail as ContactIcon,
    AccountBalance as AccountIcon,
    Psychology as IqacIcon,
    Dashboard as CellIcon,
    KeyboardArrowDown as ArrowDownIcon,
    ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import instance from '../AxiosInstance/AxiosInstance';
import useNavbarHeightVar from '../Common/UseNavbarHeightVar';

const HeaderNav = () => {
    const theme = useTheme();
    const location = useLocation();
    const navigate = useNavigate();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
    const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

    // FIX: ref attached to the AppBar below — measures its live height
    // (ResizeObserver + window resize) and keeps --navbar-height in sync
    // across every breakpoint and orientation change automatically.
    const navRef = useNavbarHeightVar();

    const [mobileOpen, setMobileOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [logoError, setLogoError] = useState(false);
    const [academicYears, setAcademicYears] = useState([]);
    const [loadingYears, setLoadingYears] = useState(false);

    const [activeDeptItem, setActiveDeptItem] = useState(null);
    const [activeGroup, setActiveGroup] = useState(null);
    const [hoverTimeout, setHoverTimeout] = useState(null);

    const [mobileExpanded, setMobileExpanded] = useState({});
    const [mobileExpandedGroup, setMobileExpandedGroup] = useState({});


    const logoClickTimer = useRef(null);

    const handleLogoClick = () => {
        if (logoClickTimer.current) {
            clearTimeout(logoClickTimer.current);
            logoClickTimer.current = null;

            navigate("/login");
            return;
        }

        logoClickTimer.current = setTimeout(() => {
            logoClickTimer.current = null;
        }, 300);
    };

    const activeColor = '#ffc107';

    // Fetch academic years
    const fetchAcademicYears = async () => {
        setLoadingYears(true);
        try {
            const response = await instance.get("/academic-years");
            console.log("Academic Years:", response.data);
            setAcademicYears(response.data);
        } catch (error) {
            console.error("Error fetching academic years:", error);
        } finally {
            setLoadingYears(false);
        }
    };

    useEffect(() => {
        fetchAcademicYears();
    }, []);

    const isItemActive = (item) => {
        if (!item || !item.path) return false;
        if (item.path === '/') {
            return location.pathname === '/';
        }
        return location.pathname === item.path || location.pathname.startsWith(item.path + '/');
    };

    const isDropdownActive = (item) => {
        if (!item.dropdown) return false;
        return item.dropdown.some(subItem =>
            location.pathname === subItem.path || location.pathname.startsWith(subItem.path + '/')
        );
    };

    // Build academic calendar children from API
    const academicCalendarChildren = academicYears.map((year) => ({
        title: year.yearLabel,
        path: `/academics/academic-calendar/${year.id}`,
        yearId: year.id,
        active: year.active
    }));

    const navItems = [
        { label: 'HOME', path: '/', icon: <HomeIcon /> },
        {
            label: 'ABOUT US',
            path: '/about',
            icon: <AccountIcon />,
            dropdown: [
                { label: 'History Of The College', path: '/about/history' },
                // { label: 'List Of Staffs', path: '/about/Listofstaffs' },
                { label: 'Vision & Mission', path: '/about/VisionMission' },
                { label: 'Student Support & Progression', path: '/about/student-support' },
                { label: 'Innovative Practices', path: '/about/innovative-practices' },
                { label: 'Admission Details', path: '/about/admissiondetails' },
            ]
        },
        {
            label: "ACADEMICS",
            path: "/academics",
            icon: <SchoolIcon />,
            megaMenu: true,
            columns: [
                {
                    items: [
                        {
                            label: "Academic Calendar",
                            path: "/academics/academic-calendar",
                            children: academicCalendarChildren.length > 0 ? academicCalendarChildren : [
                                { title: "Loading...", path: "/academics/academic-calendar" }
                            ],
                        },
                        {
                            label: "Departments",
                            path: "/academics/departments",
                            children: [
                                {
                                    title: "Arts",
                                    items: [
                                        { label: "Tamil", path: "/academics/departments/tamil" },
                                        { label: "English", path: "/academics/departments/english" },
                                        { label: "History", path: "/academics/departments/history" },
                                    ],
                                },
                                {
                                    title: "Science",
                                    items: [
                                        { label: "Mathematics", path: "/academics/departments/mathematics" },
                                        { label: "Computer Science", path: "/academics/departments/computer-science" },
                                    ],
                                },
                                {
                                    title: "Commerce",
                                    items: [
                                        { label: "Commerce", path: "/academics/departments/commerce" },
                                    ],
                                },
                                {
                                    title: "Business Administration",
                                    items: [
                                        { label: "BBA", path: "/academics/departments/bba" },
                                    ],
                                },
                                {
                                    title: "Allied Physics",
                                    items: [
                                        { label: "Physics", path: "/academics/departments/Alliedphysics" },
                                    ],
                                },
                                {
                                    title: "Physical Education",
                                    items: [
                                        { label: "Physical Education", path: "/academics/departments/Physicaleducation" },
                                    ],
                                },

                            ],
                        },
                        { label: "Courses", path: "/academics/CoursesOffered" },
                        {
                            label: "Syllabus",
                            target: "_blank",
                            rel: "noopener noreferrer",
                            path: "https://www.bdu.ac.in/academics/syllabi.php",
                        },
                        {
                            label: "Teaching, Learning and Evaluation",
                            path: "/academics/teaching-learning",
                        },
                    ],
                },
            ],
        },
        {
            label: "NOTIFICATION CIRCULAR",
            path: "/examination",
            icon: <ExamIcon />,
            megaMenu: true,
            columns: [
                {
                    items: [
                        {
                            label: "Notification",
                            path: "/examination/notification-circular",
                        },
                        {
                            label: "Circular",
                            path: "/examinations/circular",
                        },
                        {
                            label: "Event",
                            path: "/Examinations/Event",
                        },
                    ],
                },
            ],
        },
        {
            label: 'ADMINISTRATION',
            path: '/administration',
            icon: <AdminIcon />,
            dropdown: [
                { label: 'Principal', path: '/about/Listofprincipal' },
                { label: 'Academic Council', path: '/administration/Academiccouncil' },
                // { label: 'Finance Committee', path: '/administration/finance-committee' },
                { label: 'Non-Teaching Staff ', path: '/administration/non-teaching' },
            ]
        },
        {
            label: 'CELLS',
            path: '/cells',
            icon: <CellIcon />,
            dropdown: [
                { label: 'Scholarship Nodal Officers', path: '/Cells/ScholarshipNodalOfficers' },
                { label: 'Naan Mudhalvan Scheme', path: '/Cells/NaanMudhalvanScheme' },
                { label: 'NSS', path: '/Cells/Nss' },
                { label: 'YRC', path: '/cells/Yrc' },
                { label: 'RRC', path: '/cells/Rrc' },
                { label: 'CCC', path: '/cells/Ccc' },
                { label: 'PTA', path: '/cells/Pta' },
                { label: 'OSA', path: '/cells/Osa' },
                { label: 'Commite', path: '/cells/Commite' },
            ]
        },
        { label: "Gallery", path: "/gallery", icon: <ContactIcon /> },
        { label: 'CONTACT', path: '/contact', icon: <ContactIcon /> },
    ];

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleDropdownOpen = (event, label) => {
        if (hoverTimeout) {
            clearTimeout(hoverTimeout);
            setHoverTimeout(null);
        }
        setAnchorEl(event.currentTarget);
        setActiveDropdown(label);
        setActiveDeptItem(null);
        setActiveGroup(null);
    };

    const handleDropdownClose = () => {
        const timeout = setTimeout(() => {
            setAnchorEl(null);
            setActiveDropdown(null);
            setActiveDeptItem(null);
            setActiveGroup(null);
        }, 100);
        setHoverTimeout(timeout);
    };

    const handleDropdownCloseImmediate = () => {
        if (hoverTimeout) {
            clearTimeout(hoverTimeout);
            setHoverTimeout(null);
        }
        setAnchorEl(null);
        setActiveDropdown(null);
        setActiveDeptItem(null);
        setActiveGroup(null);
    };

    const handleMobileDropdownToggle = (label) => {
        setMobileExpanded(prev => ({
            ...prev,
            [label]: !prev[label]
        }));
    };

    const handleMobileSubMenuToggle = (parentLabel, childLabel) => {
        const key = `${parentLabel}-${childLabel}`;
        setMobileExpandedGroup(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const drawer = (
        <Box sx={{
            width: { xs: 280, sm: 300 },
            height: '100%',
            bgcolor: '#414a1a',
            overflowX: 'hidden',
        }}>
            <Box sx={{
                p: { xs: 1.5, sm: 2 },
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: `1px solid ${alpha('#fff', 0.1)}`,
            }}>
                <Typography variant="h6" sx={{
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: { xs: '0.85rem', sm: '1rem' }
                }}>
                    Menu
                </Typography>
                <IconButton onClick={handleDrawerToggle} sx={{ color: '#fff', p: 0.5 }}>
                    <CloseIcon sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />
                </IconButton>
            </Box>
            <List sx={{ pt: 0.5, pb: 1 }}>
                {navItems.map((item) => {
                    const isExpanded = mobileExpanded[item.label] || false;

                    return (
                        <React.Fragment key={item.label}>
                            <ListItem
                                component={(item.dropdown || item.megaMenu) ? 'div' : Link}
                                to={item.path}
                                onClick={() => {
                                    if (item.dropdown || item.megaMenu) {
                                        handleMobileDropdownToggle(item.label);
                                    } else {
                                        handleDrawerToggle();
                                    }
                                }}
                                sx={{
                                    color: (isItemActive(item) || isDropdownActive(item)) ? activeColor : '#fff',
                                    '&:hover': { bgcolor: alpha('#fff', 0.08) },
                                    display: 'flex',
                                    alignItems: 'center',
                                    py: { xs: 0.8, sm: 1 },
                                    px: { xs: 1.5, sm: 2 },
                                    cursor: 'pointer',
                                    bgcolor: (isItemActive(item) || isDropdownActive(item)) ? alpha(activeColor, 0.12) : 'transparent',
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, sm: 2 }, width: '100%' }}>
                                    <Box sx={{
                                        color: (isItemActive(item) || isDropdownActive(item)) ? activeColor : alpha('#fff', 0.7),
                                        display: 'flex',
                                        alignItems: 'center',
                                        '& svg': { fontSize: { xs: '1.1rem', sm: '1.3rem' } }
                                    }}>
                                        {item.icon}
                                    </Box>
                                    <ListItemText
                                        primary={item.label}
                                        primaryTypographyProps={{
                                            fontSize: { xs: '0.78rem', sm: '0.9rem' },
                                            fontWeight: (isItemActive(item) || isDropdownActive(item)) ? 700 : 500,
                                            color: (isItemActive(item) || isDropdownActive(item)) ? activeColor : '#fff',
                                            letterSpacing: '0.3px',
                                            noWrap: false,
                                        }}
                                    />
                                    {(item.dropdown || item.megaMenu) && (
                                        <ArrowDownIcon
                                            sx={{
                                                transition: 'transform 0.3s',
                                                transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                                                color: (isItemActive(item) || isDropdownActive(item)) ? activeColor : alpha('#fff', 0.6),
                                                fontSize: { xs: '0.9rem', sm: '1.1rem' },
                                            }}
                                        />
                                    )}
                                </Box>
                            </ListItem>

                            {item.dropdown && (
                                <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                                    <List sx={{ pl: { xs: 3.5, sm: 4 }, bgcolor: alpha('#fff', 0.04) }}>
                                        {item.dropdown.map((subItem) => {
                                            const isSubItemActive = location.pathname === subItem.path || location.pathname.startsWith(subItem.path + '/');
                                            return (
                                                <ListItem
                                                    key={subItem.label}
                                                    component={Link}
                                                    to={subItem.path}
                                                    onClick={handleDrawerToggle}
                                                    sx={{
                                                        color: isSubItemActive ? activeColor : alpha('#fff', 0.75),
                                                        '&:hover': { bgcolor: alpha('#fff', 0.08), color: '#fff' },
                                                        py: { xs: 0.6, sm: 0.8 },
                                                        px: { xs: 1.5, sm: 2 },
                                                        bgcolor: isSubItemActive ? alpha(activeColor, 0.1) : 'transparent',
                                                    }}
                                                >
                                                    <ListItemText
                                                        primary={subItem.label}
                                                        primaryTypographyProps={{
                                                            fontSize: { xs: '0.72rem', sm: '0.85rem' },
                                                            fontWeight: isSubItemActive ? 600 : 400,
                                                            color: isSubItemActive ? activeColor : alpha('#fff', 0.75),
                                                            noWrap: false,
                                                        }}
                                                    />
                                                </ListItem>
                                            );
                                        })}
                                    </List>
                                </Collapse>
                            )}

                            {item.megaMenu && (
                                <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                                    <List sx={{ pl: { xs: 2, sm: 2.5 }, bgcolor: alpha('#fff', 0.04) }}>
                                        {item.columns[0].items.map((menu) => {
                                            const menuKey = `${item.label}-${menu.label}`;
                                            const isMenuExpanded = mobileExpandedGroup[menuKey] || false;

                                            return (
                                                <React.Fragment key={menu.label}>
                                                    <ListItem
                                                        component={menu.children ? 'div' : Link}
                                                        to={menu.children ? undefined : menu.path}
                                                        onClick={() => {
                                                            if (menu.children) {
                                                                handleMobileSubMenuToggle(item.label, menu.label);
                                                            } else {
                                                                if (menu.target === "_blank") {
                                                                    window.open(menu.path, "_blank");
                                                                } else {
                                                                    navigate(menu.path);
                                                                }
                                                                handleDrawerToggle();
                                                            }
                                                        }}
                                                        sx={{
                                                            py: { xs: 0.6, sm: 0.8 },
                                                            px: { xs: 1.5, sm: 2 },
                                                            cursor: 'pointer',
                                                            color: activeDeptItem?.label === menu.label ? activeColor : '#fff',
                                                            bgcolor: activeDeptItem?.label === menu.label ? alpha(activeColor, 0.1) : 'transparent',
                                                            '&:hover': { bgcolor: alpha('#fff', 0.06) }
                                                        }}
                                                    >
                                                        <ListItemText
                                                            primary={menu.label}
                                                            primaryTypographyProps={{
                                                                fontSize: { xs: '0.74rem', sm: '0.85rem' },
                                                                fontWeight: activeDeptItem?.label === menu.label ? 600 : 400,
                                                                color: activeDeptItem?.label === menu.label ? activeColor : '#fff',
                                                                noWrap: false,
                                                            }}
                                                        />
                                                        {menu.children && (
                                                            <ChevronRightIcon
                                                                sx={{
                                                                    fontSize: { xs: 16, sm: 18 },
                                                                    color: activeDeptItem?.label === menu.label ? activeColor : alpha('#fff', 0.5),
                                                                    transform: isMenuExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                                                                    transition: 'transform 0.3s'
                                                                }}
                                                            />
                                                        )}
                                                    </ListItem>

                                                    {menu.children && (
                                                        <Collapse in={isMenuExpanded} timeout="auto" unmountOnExit>
                                                            <List sx={{ pl: { xs: 2, sm: 2.5 } }}>
                                                                {menu.children.map((group) => {
                                                                    const hasItems = (Array.isArray(group.items) && group.items.length > 0) ||
                                                                        (Array.isArray(group.children) && group.children.length > 0);
                                                                    const groupItems = group.items || group.children || [];
                                                                    const groupKey = `${menuKey}-${group.title}`;
                                                                    const isGroupExpanded = mobileExpandedGroup[groupKey] || false;

                                                                    return (
                                                                        <React.Fragment key={group.title}>
                                                                            <ListItem
                                                                                component={(!hasItems && group.path) ? Link : 'div'}
                                                                                to={(!hasItems && group.path) ? group.path : undefined}
                                                                                onClick={() => {
                                                                                    if (hasItems) {
                                                                                        handleMobileSubMenuToggle(menuKey, group.title);
                                                                                    } else {
                                                                                        handleDrawerToggle();
                                                                                    }
                                                                                }}
                                                                                sx={{
                                                                                    py: { xs: 0.5, sm: 0.6 },
                                                                                    px: { xs: 1.5, sm: 2 },
                                                                                    cursor: 'pointer',
                                                                                    color: hasItems ? (isGroupExpanded ? activeColor : alpha('#fff', 0.8)) : alpha('#fff', 0.7),
                                                                                    bgcolor: isGroupExpanded ? alpha(activeColor, 0.08) : 'transparent',
                                                                                    '&:hover': { bgcolor: alpha('#fff', 0.05) }
                                                                                }}
                                                                            >
                                                                                <ListItemText
                                                                                    primary={group.title}
                                                                                    primaryTypographyProps={{
                                                                                        fontSize: { xs: '0.68rem', sm: '0.78rem' },
                                                                                        fontWeight: hasItems ? (isGroupExpanded ? 600 : 500) : 400,
                                                                                        color: hasItems ? (isGroupExpanded ? activeColor : alpha('#fff', 0.8)) : alpha('#fff', 0.7),
                                                                                        noWrap: false,
                                                                                    }}
                                                                                />
                                                                                {hasItems && (
                                                                                    <ChevronRightIcon
                                                                                        sx={{
                                                                                            fontSize: { xs: 14, sm: 16 },
                                                                                            color: isGroupExpanded ? activeColor : alpha('#fff', 0.4),
                                                                                            transform: isGroupExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                                                                                            transition: 'transform 0.3s'
                                                                                        }}
                                                                                    />
                                                                                )}
                                                                            </ListItem>

                                                                            {hasItems && (
                                                                                <Collapse in={isGroupExpanded} timeout="auto" unmountOnExit>
                                                                                    <List sx={{ pl: { xs: 2, sm: 2.5 } }}>
                                                                                        {groupItems.map((dept) => (
                                                                                            <ListItem
                                                                                                key={dept.label || dept.title}
                                                                                                component={Link}
                                                                                                to={dept.path}
                                                                                                onClick={handleDrawerToggle}
                                                                                                sx={{
                                                                                                    py: { xs: 0.4, sm: 0.5 },
                                                                                                    px: { xs: 1.5, sm: 2 },
                                                                                                    color: alpha('#fff', 0.7),
                                                                                                    '&:hover': { bgcolor: alpha('#fff', 0.05), color: '#fff' }
                                                                                                }}
                                                                                            >
                                                                                                <ListItemText
                                                                                                    primary={dept.label || dept.title}
                                                                                                    primaryTypographyProps={{
                                                                                                        fontSize: { xs: '0.65rem', sm: '0.75rem' },
                                                                                                        color: alpha('#fff', 0.7),
                                                                                                        noWrap: false,
                                                                                                    }}
                                                                                                />
                                                                                            </ListItem>
                                                                                        ))}
                                                                                    </List>
                                                                                </Collapse>
                                                                            )}
                                                                        </React.Fragment>
                                                                    );
                                                                })}
                                                            </List>
                                                        </Collapse>
                                                    )}
                                                </React.Fragment>
                                            );
                                        })}
                                    </List>
                                </Collapse>
                            )}

                            <Divider sx={{ bgcolor: alpha('#fff', 0.04) }} />
                        </React.Fragment>
                    );
                })}
            </List>
        </Box>
    );

    return (
        <>
            <AppBar
                ref={navRef}
                position="sticky"
                sx={{
                    top: 0,
                    zIndex: (theme) => theme.zIndex.appBar + 1,
                    background: "linear-gradient(135deg, #be7622 0%, #c91818 50%, #be7622 100%)",
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    borderBottom: `3px solid ${theme.palette.primary.main}`,
                }}
            >
                <Container maxWidth="xl">
                    <Toolbar
                        disableGutters
                        sx={{
                            minHeight: "auto",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            py: 0,
                            position: "relative",
                            flexDirection: { xs: "row", md: "column" },
                            gap: { xs: 0, md: 0.5 },
                        }}
                    >

                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: "100%",
                                py: { xs: 0.5, sm: 0.8, md: 0.5 },
                            }}
                        >
                            {/* Left Logo */}
                            {/* Left Logo + Code */}
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    mr: { xs: 2, md: 4 },
                                }}
                            >
                                <Box
                                    component="img"
                                    src="/gvtlogo.png"
                                    alt="Left Logo"
                                    sx={{
                                        height: { xs: 40, sm: 50, md: 70, lg: 85, xl: 95 },
                                        width: { xs: 40, sm: 50, md: 70, lg: 85, xl: 95 },
                                        bgcolor: "#fff",
                                        borderRadius: "50%",
                                        p: 0.5,
                                        objectFit: "contain",
                                        position: "relative",
                                        left: "-2px",
                                    }}
                                />
                                College Code - 1051016
                                <Typography
                                    sx={{
                                        mt: 0.5,
                                        color: "#ffffff",
                                        fontWeight: 400,
                                        textAlign: "center",
                                        fontSize: {
                                            xs: "0.45rem",
                                            sm: "0.55rem",
                                            md: "0.7rem",
                                            lg: "0.85rem",
                                            xl: "0.95rem",
                                        },
                                    }}
                                >

                                </Typography>
                            </Box>

                            {/* College Text */}
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    textAlign: "center",
                                    mx: { xs: 1, md: 3 },
                                }}
                            >
                                <Typography
                                    sx={{
                                        color: "#fff",
                                        fontSize: {
                                            xs: "0.9rem",
                                            sm: "1.1rem",
                                            md: "1.6rem",
                                            lg: "2rem",
                                            xl: "2.3rem",
                                        },
                                        fontWeight: 400,
                                        lineHeight: 1.2,
                                    }}
                                >
                                    Government Arts And Science College
                                </Typography>

                                <Typography
                                    sx={{
                                        color: "#FFD54F",
                                        fontWeight: 500,
                                        fontSize: {
                                            xs: "0.5rem",
                                            sm: "0.6rem",
                                            md: "0.75rem",
                                            lg: "0.9rem",
                                            xl: "1rem",
                                        },
                                    }}
                                >
                                    [Affiliated To Bharathidasan University, Tiruchirappalli-TamilNadu]
                                </Typography>

                                <Typography
                                    sx={{
                                        color: "#ffffff",
                                        fontWeight: 400,
                                        fontSize: {
                                            xs: "0.45rem",
                                            sm: "0.55rem",
                                            md: "0.7rem",
                                            lg: "0.85rem",
                                            xl: "0.95rem",
                                        },
                                    }}
                                >
                                    Nannilam- 610 105
                                </Typography>
                            </Box>

                            {/* Right Logo + College Code */}
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    ml: { xs: 2, md: 4 },
                                }}
                            >
                                <Box
                                    component="img"
                                    src="/collegelogo.jpeg"
                                    alt="Right Logo"
                                    onClick={handleLogoClick}
                                    sx={{
                                        mt: 2.5,
                                        height: { xs: 40, sm: 50, md: 70, lg: 85, xl: 95 },
                                        width: { xs: 40, sm: 50, md: 70, lg: 85, xl: 95 },
                                        bgcolor: "#fff",
                                        borderRadius: "50%",
                                        p: 0.5,
                                        objectFit: "contain",
                                        cursor: "pointer",
                                        userSelect: "none",
                                        WebkitUserSelect: "none",
                                        WebkitTapHighlightColor: "transparent",
                                    }}
                                />

                                <Typography
                                    sx={{
                                        mt: 0.5,
                                        color: "#ffffff",
                                        fontWeight: 400,
                                        textAlign: "center",
                                        fontSize: {
                                            xs: "0.45rem",
                                            sm: "0.55rem",
                                            md: "0.7rem",
                                            lg: "0.85rem",
                                            xl: "0.95rem",
                                        },
                                    }}
                                >
                                    AISHE Code - C-35862
                                </Typography>
                            </Box>
                        </Box>

                        <Box
                            sx={{
                                display: { xs: 'none', md: 'flex' },
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: 'linear-gradient(90deg, #50a8e2 0%, #274b63 50%, #50a8e2 100%)',
                                width: '100vw',
                                gap: { md: 0.5, lg: 1, xl: 1.5 },
                                flexWrap: 'nowrap',
                                pt: 2,
                                pb: 1,
                                mt: 0,
                            }}
                        >
                            {navItems.map((item) => {
                                const isActive = isItemActive(item) || isDropdownActive(item);

                                return (
                                    <Box key={item.label}>
                                        {item.dropdown || item.megaMenu ? (
                                            <>
                                                <Button
                                                    onMouseEnter={(e) => handleDropdownOpen(e, item.label)}
                                                    endIcon={<ArrowDownIcon />}
                                                    sx={{
                                                        color: isActive ? activeColor : "#fff",
                                                        fontWeight: 600,
                                                        fontSize: { md: '10px', lg: '12px', xl: '13px' },
                                                        whiteSpace: "nowrap",
                                                        minWidth: "fit-content",
                                                        px: { md: 0.8, lg: 1.2, xl: 1.5 },
                                                        py: 0.5,
                                                        textTransform: "uppercase",
                                                        letterSpacing: "0.5px",
                                                        "& .MuiButton-endIcon": {
                                                            marginLeft: "2px",
                                                        },
                                                        borderBottom: isActive ? `2px solid ${activeColor}` : '2px solid transparent',
                                                        borderRadius: 0,
                                                        '&:hover': {
                                                            bgcolor: alpha('#fff', 0.08),
                                                            color: activeColor,
                                                        },
                                                    }}
                                                >
                                                    {item.label}
                                                </Button>

                                                <Popper
                                                    open={Boolean(anchorEl) && activeDropdown === item.label}
                                                    anchorEl={anchorEl}
                                                    placement="bottom-start"
                                                    sx={{ zIndex: 1500 }}
                                                >
                                                    <ClickAwayListener onClickAway={handleDropdownCloseImmediate}>
                                                        <Paper
                                                            onMouseLeave={handleDropdownClose}
                                                            sx={{
                                                                bgcolor: "#17324d",
                                                                color: "#fff",
                                                                display: "flex",
                                                                alignItems: "flex-start",
                                                                borderRadius: 1,
                                                                overflow: "hidden",
                                                                boxShadow: "0 8px 25px rgba(0,0,0,.35)",
                                                                mt: 0.5,
                                                            }}
                                                        >
                                                            <Box sx={{
                                                                width: "fit-content",
                                                                maxWidth: { md: 250, lg: 280, xl: 300 },
                                                                alignSelf: "flex-start",
                                                                height: "fit-content",
                                                                bgcolor: "#0b2d4e",
                                                                py: 0.5
                                                            }}>
                                                                {item.megaMenu ? (
                                                                    item.columns[0].items.map((menu) => (
                                                                        <Box
                                                                            key={menu.label}
                                                                            component={menu.children ? "div" : Link}
                                                                            to={menu.children ? undefined : menu.path}
                                                                            onClick={(e) => {
                                                                                if (!menu.children) {
                                                                                    if (menu.target === "_blank") {
                                                                                        e.preventDefault();
                                                                                        window.open(menu.path, "_blank");
                                                                                    }
                                                                                    handleDropdownCloseImmediate();
                                                                                }
                                                                            }}
                                                                            onMouseEnter={() => {
                                                                                setActiveDeptItem(menu.children ? menu : null);
                                                                                setActiveGroup(null);
                                                                            }}
                                                                            sx={{
                                                                                display: "flex",
                                                                                alignItems: "center",
                                                                                justifyContent: "space-between",
                                                                                textDecoration: "none",
                                                                                color: activeDeptItem?.label === menu.label ? "#ffc107" : "#fff",
                                                                                px: { md: 2, lg: 2.5 },
                                                                                py: { md: 1, lg: 1.2 },
                                                                                fontWeight: 500,
                                                                                cursor: "pointer",
                                                                                fontSize: { md: '0.75rem', lg: '0.85rem' },
                                                                                bgcolor: activeDeptItem?.label === menu.label ? "#20476a" : "transparent",
                                                                                "&:hover": { bgcolor: "#20476a", color: "#ffc107" },
                                                                            }}
                                                                        >
                                                                            {menu.label}
                                                                            {menu.children && (
                                                                                <ChevronRightIcon sx={{ fontSize: { md: 14, lg: 16 } }} />
                                                                            )}
                                                                        </Box>
                                                                    ))
                                                                ) : (
                                                                    item.dropdown.map((sub) => (
                                                                        <Box
                                                                            key={sub.label}
                                                                            component={Link}
                                                                            to={sub.path}
                                                                            onClick={handleDropdownCloseImmediate}
                                                                            sx={{
                                                                                display: "block",
                                                                                textDecoration: "none",
                                                                                color: "#fff",
                                                                                px: { md: 2, lg: 2.5 },
                                                                                py: { md: 1, lg: 1.2 },
                                                                                fontWeight: 500,
                                                                                fontSize: { md: '0.75rem', lg: '0.85rem' },
                                                                                "&:hover": { bgcolor: "#20476a", color: "#ffc107" },
                                                                            }}
                                                                        >
                                                                            {sub.label}
                                                                        </Box>
                                                                    ))
                                                                )}
                                                            </Box>

                                                            {item.megaMenu && activeDeptItem && (
                                                                <Box
                                                                    sx={{
                                                                        width: "fit-content",
                                                                        maxWidth: { md: 240, lg: 260, xl: 280 },
                                                                        alignSelf: "flex-start",
                                                                        height: "fit-content",
                                                                        bgcolor: "#132943",
                                                                        py: 0.5,
                                                                        borderLeft: `1px solid ${alpha('#fff', 0.08)}`,
                                                                    }}
                                                                >
                                                                    {activeDeptItem.children.map((group) => {
                                                                        const hasItems = (Array.isArray(group.items) && group.items.length > 0) ||
                                                                            (Array.isArray(group.children) && group.children.length > 0);
                                                                        const groupItems = group.items || group.children || [];
                                                                        const isLeafLink = !hasItems && Boolean(group.path);
                                                                        const isClickable = hasItems || isLeafLink;
                                                                        return (
                                                                            <Box
                                                                                key={group.title}
                                                                                component={isLeafLink ? Link : "div"}
                                                                                to={isLeafLink ? group.path : undefined}
                                                                                onClick={() => {
                                                                                    if (isLeafLink) handleDropdownCloseImmediate();
                                                                                }}
                                                                                onMouseEnter={() => {
                                                                                    if (hasItems) setActiveGroup(group);
                                                                                    else setActiveGroup(null);
                                                                                }}
                                                                                sx={{
                                                                                    display: "flex",
                                                                                    alignItems: "center",
                                                                                    justifyContent: "space-between",
                                                                                    textDecoration: "none",
                                                                                    color: hasItems && activeGroup?.title === group.title ? "#ffc107" : "#fff",
                                                                                    px: { md: 2, lg: 2.5 },
                                                                                    py: { md: 1, lg: 1.2 },
                                                                                    fontWeight: hasItems ? 600 : 500,
                                                                                    fontSize: { md: '0.75rem', lg: '0.85rem' },
                                                                                    cursor: isClickable ? "pointer" : "default",
                                                                                    bgcolor: hasItems && activeGroup?.title === group.title ? "#20476a" : "transparent",
                                                                                    "&:hover": isClickable ? { bgcolor: "#20476a", color: "#ffc107" } : {},
                                                                                }}
                                                                            >
                                                                                {group.title}
                                                                                {hasItems && (
                                                                                    <ChevronRightIcon sx={{ fontSize: { md: 14, lg: 16 } }} />
                                                                                )}
                                                                            </Box>
                                                                        );
                                                                    })}
                                                                </Box>
                                                            )}

                                                            {item.megaMenu && activeDeptItem && activeGroup &&
                                                                ((Array.isArray(activeGroup.items) && activeGroup.items.length > 0) ||
                                                                    (Array.isArray(activeGroup.children) && activeGroup.children.length > 0)) && (
                                                                    <Box
                                                                        sx={{
                                                                            width: "fit-content",
                                                                            maxWidth: { md: 220, lg: 240, xl: 260 },
                                                                            alignSelf: "flex-start",
                                                                            height: "fit-content",
                                                                            bgcolor: "#0f2337",
                                                                            py: 0.5,
                                                                            borderLeft: `1px solid ${alpha('#fff', 0.08)}`,
                                                                        }}
                                                                    >
                                                                        {(activeGroup.items || activeGroup.children || []).map((dept) => (
                                                                            <Box
                                                                                key={dept.label || dept.title}
                                                                                component={Link}
                                                                                to={dept.path}
                                                                                onClick={handleDropdownCloseImmediate}
                                                                                sx={{
                                                                                    display: "block",
                                                                                    textDecoration: "none",
                                                                                    color: "#fff",
                                                                                    px: { md: 2, lg: 2.5 },
                                                                                    py: { md: 1, lg: 1.2 },
                                                                                    fontWeight: 500,
                                                                                    fontSize: { md: '0.75rem', lg: '0.85rem' },
                                                                                    "&:hover": { bgcolor: "#20476a", color: "#ff3907" },
                                                                                }}
                                                                            >
                                                                                {dept.label || dept.title}
                                                                            </Box>
                                                                        ))}
                                                                    </Box>
                                                                )}
                                                        </Paper>
                                                    </ClickAwayListener>
                                                </Popper>
                                            </>
                                        ) : (
                                            <Button
                                                component={Link}
                                                to={item.path}
                                                sx={{
                                                    color: isActive ? activeColor : '#fff',
                                                    fontWeight: 600,
                                                    fontSize: { md: '10px', lg: '12px', xl: '13px' },
                                                    textTransform: 'uppercase',
                                                    whiteSpace: 'nowrap',
                                                    minWidth: 'auto',
                                                    px: { md: 0.5, lg: 0.8, xl: 1 },
                                                    py: 0.5,
                                                    lineHeight: 1,
                                                    borderBottom: isActive ? `2px solid ${activeColor}` : '2px solid transparent',
                                                    borderRadius: 0,
                                                    letterSpacing: "0.5px",
                                                    '&:hover': {
                                                        bgcolor: alpha('#fff', 0.08),
                                                        color: activeColor,
                                                    },
                                                }}
                                            >
                                                {item.label}
                                            </Button>
                                        )}
                                    </Box>
                                );
                            })}
                        </Box>


                        <IconButton
                            edge="end"
                            onClick={handleDrawerToggle}
                            sx={{
                                display: { xs: 'flex', md: 'none' },
                                color: '#fff',
                                p: { xs: 0.5, sm: 0.8 },
                                position: 'absolute',
                                right: { xs: 4, sm: 8 },
                                top: '50%',
                                transform: 'translateY(-50%)',
                                '& svg': { fontSize: { xs: '1.2rem', sm: '1.5rem' } }
                            }}
                        >
                            <MenuIcon />
                        </IconButton>
                    </Toolbar>
                </Container>
            </AppBar>

            <Drawer
                variant="temporary"
                anchor="left"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{ keepMounted: true }}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                        width: { xs: 280, sm: 300 },
                        bgcolor: '#1a2a4a',
                        overflowX: 'hidden',
                    },
                }}
            >
                {drawer}
            </Drawer>
        </>
    );
};

export default HeaderNav;