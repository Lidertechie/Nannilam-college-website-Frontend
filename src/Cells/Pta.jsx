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
        "This association aims to achieve the following goals: improving the academic environment in the college; establishing good coordination between parents, teachers, and students; taking necessary steps to enhance higher education standards; instilling discipline among students and encouraging them to participate in social work; raising funds in accordance with government regulations to provide research facilities; supporting the development of libraries, art centers, classroom buildings, and environmental protection; promoting the mother tongue, national integration, and Tamil art and culture among students; and helping to fully implement the Tamil Nadu Government's education policy."
    ];

    useEffect(() => {
        const fetchCellData = async () => {
            try {
                const response = await instance.get('/cells', {
                    params: { category: 'PTA' }
                });
                // Store the entire array instead of just the first item
                setCellData(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCellData();
    }, []);

    // Map API data to PTA members with different positions
    const programmingOfficers = cellData ? (Array.isArray(cellData) ? cellData : [cellData]).map((item, index) => {
        // Assign different positions based on index
        const positions = ["President","Secretary","Treasurer","Member"];
        return {
            name: item.staffName,
            qual: item.staffDesignation,
            dept: item.departmentName,
            position: positions[index] || `Member`,
        };
    }) : [];

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
                        <span style={{ color: "red" }}> Parent-Teacher Association</span>
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
                            src="/Pta.jpg"
                            alt="PTA Logo"
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
                            Parent-Teacher Association
                        </Typography>
                    </Box>

                    {/* Main Content */}
                    <Box
                        sx={{
                            maxWidth: "1120px",
                            mx: "auto",
                        }}
                    >
                        {/* Description */}
                        <Typography
                            sx={{
                                fontSize: "1.15rem",
                                fontFamily: "Georgia",
                                lineHeight: 2,
                                textAlign: "left",
                                color: "#222",
                                mb: 5,
                            }}
                        >
                            The College Parent-Teacher Association has been established to build good relations between the teachers working in the college,
                            the students studying there, and the parents/guardians of the students, in order to achieve improvement in higher education standards.
                        </Typography>

                        {/* Objectives Heading */}
                        <Typography
                            sx={{
                                fontSize: "1.35rem",
                                fontFamily: "Georgia",
                                mb: 3,
                                textAlign: "left",
                            }}
                        >

                            <Box component="span" sx={{ color: "red" }}>
                                Parent-Teacher Association (PTA)
                            </Box>{" "}
                            Goals
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
                    </Box>
                    {/* PTA Members */}
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
                            Parent-Teacher Association (PTA)
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
                            Office Bearers
                        </Typography>

                        <Grid container spacing={4} justifyContent="center">
                            {programmingOfficers.map((officer, index) => (
                                <Grid item xs={12} md={6} lg={4} key={index}>
                                    <Card
                                        elevation={0}
                                        sx={{
                                            borderRadius: 4,
                                            border: "1px solid #e5e7eb",
                                            borderLeft: "6px solid #1565c0",
                                            overflow: "hidden",
                                            bgcolor: "#fff",
                                            transition: "0.35s",
                                            height: "100%",
                                            "&:hover": {
                                                transform: "translateY(-6px)",
                                                boxShadow: "0 12px 35px rgba(0,0,0,0.12)",
                                            },
                                        }}
                                    >
                                        <CardContent sx={{ p: 2 }}>
                                            <Box sx={{ textAlign: "center" }}>
                                                <Typography
                                                    sx={{
                                                        fontSize: { xs: "1.4rem", md: "1.6rem" },
                                                        fontWeight: 700,
                                                        color: "#0d47a1",
                                                        fontFamily: "Georgia",
                                                        mb: 1,
                                                    }}
                                                >
                                                    {officer.name}
                                                </Typography>

                                                <Typography
                                                    sx={{
                                                        color: "#d32f2f",
                                                        fontWeight: 600,
                                                        fontSize: "1.05rem",
                                                        mb: 3,
                                                    }}
                                                >
                                                    {officer.position}
                                                </Typography>

                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: 2,
                                                        mb: 2,
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
                                                                color: "#424242",
                                                                fontSize: "1rem",
                                                                fontFamily: "Georgia",
                                                            }}
                                                        >
                                                            Designation
                                                        </Typography>

                                                        <Typography
                                                            sx={{
                                                                color: "#555",
                                                                fontSize: "0.95rem",
                                                                lineHeight: 1.6,
                                                            }}
                                                        >
                                                            {officer.qual}
                                                        </Typography>
                                                    </Box>
                                                </Box>
{/* 
                                                <Box
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
                                                                color: "#424242",
                                                                fontSize: "1rem",
                                                                fontFamily: "Georgia",
                                                            }}
                                                        >
                                                            Department
                                                        </Typography>

                                                        <Typography
                                                            sx={{
                                                                color: "#555",
                                                                fontSize: "0.95rem",
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