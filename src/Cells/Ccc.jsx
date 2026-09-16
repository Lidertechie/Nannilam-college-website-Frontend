import { Box, Container, Typography, Grid, Card, CardContent, CircularProgress, Alert } from "@mui/material";
import { School, Work } from "@mui/icons-material";
import Footer from "../Common/Footer";
import { useEffect, useState } from "react";
import instance from "../AxiosInstance/AxiosInstance";

export default function NSS() {
    const [cellData, setCellData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const objectives = [
        "To develop awareness among youth about the importance of blood.",
        "To create awareness about AIDS.",
        "To create awareness about the prevention of drug/substance abuse."
    ];

    useEffect(() => {
        const fetchCellData = async () => {
            try {
                const response = await instance.get('/cells', {
                    params: { category: 'CCC' }
                });
                // Store the entire array
                setCellData(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCellData();
    }, []);

    // Map API data to programming officers (handle both array and single object)
    const programmingOfficers = cellData ? (Array.isArray(cellData) ? cellData : [cellData]).map(item => ({
        name: item.staffName,
        qual: item.staffDesignation,
        dept: item.departmentName,
        position: "Programming Officer",
    })) : [];

    if (loading) {
        return (
            <>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                    <CircularProgress />
                </Box>
                <Footer />
            </>
        );
    }

    if (error) {
        return (
            <>
                <Box sx={{ p: 3 }}>
                    <Alert severity="error">Error loading cell data: {error}</Alert>
                </Box>
                <Footer />
            </>
        );
    }

    if (!cellData || (Array.isArray(cellData) && cellData.length === 0)) {
        return (
            <>
                <Box sx={{ p: 3 }}>
                    <Alert severity="warning">No cell data available</Alert>
                </Box>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Box sx={{ bgcolor: "#fff", minHeight: "100vh", py: 6 }}>
                <Container
                    maxWidth={false}
                    sx={{
                        width: "100%",
                        px: { xs: 3, md: 6, lg: 8 },
                        py: 6,
                    }}
                >
                    {/* <Typography
                        sx={{
                            textAlign: "center",
                            color: "#1565c0",
                            fontSize: 15,
                            mb: 5,
                        }}
                    >
                        Home &nbsp;→&nbsp; Cells &nbsp;→&nbsp;
                        <span style={{ color: "red" }}> Citizen Consumer Club</span>
                    </Typography> */}

                    {/* Logo & Heading */}
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: 3,
                            mb: 6,
                            flexWrap: "wrap",
                        }}
                    >
                        <Box
                            component="img"
                            src="/Ccc.png"
                            alt="RRC Logo"
                            sx={{
                                width: 110,
                                height: 110,
                            }}
                        />

                        <Typography
                            sx={{
                                color: "red",
                                fontSize: { xs: 32, md: 42 },
                                fontFamily: "Georgia",
                                fontWeight: 400,
                            }}
                        >
                            Citizen Consumer Club
                        </Typography>
                    </Box>

                    {/* Main Content */}
                    <Box
                        sx={{
                            maxWidth: "1120px",
                            mx: "auto",
                        }}
                    >
                        {/* Objectives Heading */}
                        <Typography
                            sx={{
                                fontSize: "1.35rem",
                                fontFamily: "Georgia",
                                mb: 3,
                                textAlign: "left",
                            }}
                        >
                            The objectives of{" "}
                            <Box component="span" sx={{ color: "red" }}>
                                Citizen Consumer Club (CCC)
                            </Box>{" "}
                            are
                        </Typography>

                        {/* Objectives */}
                        <Box
                            component="ul"
                            sx={{
                                pl: 3,
                                mt: 0,
                                mb: 0,

                                "& li": {
                                    fontFamily: "Georgia",
                                    fontSize: "1.12rem",
                                    lineHeight: 2,
                                    textAlign: "left",
                                    mb: 0.5,
                                },
                            }}
                        >
                            {objectives.map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </Box>

                        {/* Enrollment */}
                        <Typography
                            sx={{
                                textAlign: "left",
                                mt: 6,
                                fontSize: "1.45rem",
                                fontFamily: "Georgia",
                                mb: 2,
                            }}
                        >
                            Enrollment
                        </Typography>

                        <Typography
                            sx={{
                                textAlign: "left",
                                fontSize: "1.1rem",
                                lineHeight: 2,
                                fontFamily: "Georgia",
                            }}
                        >
                            Students studying in first-year degree classes can join this. They must continue to participate in Consumer Club activities for the following two years.
                        </Typography>
                    </Box>

                    {/* Programming Officer - API Data */}
                    <Box sx={{ mt: 10 }}>
                        <Typography
                            variant="h4"
                            sx={{
                                textAlign: "center",
                                fontWeight: 700,
                                color: "#0d47a1",
                                fontFamily: "Georgia",
                                mb: 1,
                            }}
                        >
                            Citizen Consumer Club (CCC)
                        </Typography>

                        <Typography
                            sx={{
                                textAlign: "center",
                                color: "#b71c1c",
                                fontSize: "1.15rem",
                                mb: 6,
                                fontFamily: "Georgia",
                                letterSpacing: 1,
                            }}
                        >
                            Programming Officer
                        </Typography>

                        <Grid container spacing={4} justifyContent="center">
                            {programmingOfficers.map((officer, index) => (
                                <Grid item xs={12} md={8} lg={6} key={index}>
                                    <Card
                                        elevation={0}
                                        sx={{
                                            borderRadius: 4,
                                            border: "1px solid #e5e7eb",
                                            borderLeft: "6px solid #1565c0",
                                            overflow: "hidden",
                                            bgcolor: "#fff",
                                            transition: "0.35s",
                                            "&:hover": {
                                                transform: "translateY(-6px)",
                                                boxShadow: "0 12px 35px rgba(0,0,0,0.12)",
                                            },
                                        }}
                                    >
                                        <CardContent sx={{ p: 1 }}>
                                            <Box sx={{ textAlign: "center" }}>
                                                <Typography
                                                    sx={{
                                                        fontSize: { xs: "1.5rem", md: "1.8rem" },
                                                        fontWeight: 700,
                                                        color: "#0d47a1",
                                                        fontFamily: "Georgia",
                                                        mb: 0.8,
                                                    }}
                                                >
                                                    {officer.name}
                                                </Typography>

                                                <Typography
                                                    sx={{
                                                        color: "#d32f2f",
                                                        fontWeight: 600,
                                                        fontSize: "1.05rem",
                                                        mb: 4,
                                                    }}
                                                >
                                                    {officer.position}
                                                </Typography>

                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: 2,
                                                        mb: 3,
                                                        p: 2,
                                                        borderRadius: 3,
                                                        bgcolor: "#f8fbff",
                                                    }}
                                                >
                                                    <Box
                                                        sx={{
                                                            width: 46,
                                                            height: 46,
                                                            borderRadius: "50%",
                                                            bgcolor: "#e3f2fd",
                                                            display: "flex",
                                                            justifyContent: "center",
                                                            alignItems: "center",
                                                            flexShrink: 0,
                                                        }}
                                                    >
                                                        <School sx={{ color: "#1565c0", fontSize: 24 }} />
                                                    </Box>

                                                    <Box sx={{ textAlign: "left" }}>
                                                        <Typography
                                                            sx={{
                                                                fontWeight: 700,
                                                                fontSize: "1.05rem",
                                                                color: "#424242",
                                                                fontFamily: "Georgia",
                                                            }}
                                                        >
                                                            Qualification
                                                        </Typography>

                                                        <Typography
                                                            sx={{
                                                                fontSize: "0.98rem",
                                                                color: "#555",
                                                                lineHeight: 1.6,
                                                            }}
                                                        >
                                                            {officer.qual}
                                                        </Typography>
                                                    </Box>
                                                </Box>

                                                {/* <Box
                                                    sx={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: 2,
                                                        p: 2,
                                                        borderRadius: 3,
                                                        bgcolor: "#f8fbff",
                                                    }}
                                                >
                                                    <Box
                                                        sx={{
                                                            width: 46,
                                                            height: 46,
                                                            borderRadius: "50%",
                                                            bgcolor: "#e3f2fd",
                                                            display: "flex",
                                                            justifyContent: "center",
                                                            alignItems: "center",
                                                            flexShrink: 0,
                                                        }}
                                                    >
                                                        <Work sx={{ color: "#1565c0", fontSize: 24 }} />
                                                    </Box>

                                                    <Box sx={{ textAlign: "left" }}>
                                                        <Typography
                                                            sx={{
                                                                fontWeight: 700,
                                                                fontSize: "1.05rem",
                                                                color: "#424242",
                                                                fontFamily: "Georgia",
                                                            }}
                                                        >
                                                            Department
                                                        </Typography>

                                                        <Typography
                                                            sx={{
                                                                fontSize: "0.98rem",
                                                                color: "#555",
                                                                lineHeight: 1.6,
                                                            }}
                                                        >
                                                            {officer.dept}
                                                        </Typography>
                                                    </Box>
                                                </Box> */}
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </Container>
            </Box>
            <Footer />
        </>
    );
}