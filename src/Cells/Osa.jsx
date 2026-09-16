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
        "To develop a sense of national consciousness among youth.",
        "To create awareness about social relationships.",
        "To develop concern for social welfare.",
        "To make educated people realize the importance of labor/work.",
        "To build and develop a spirit of service and sacrifice among the younger generation."
    ];

    useEffect(() => {
        const fetchCellData = async () => {
            try {
                const response = await instance.get('/cells', {
                    params: { category: 'OSA' }
                });

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
const programmingOfficers = cellData
    ? (Array.isArray(cellData) ? cellData : [cellData]).map((item, index) => {
        const positions = ["President", "Secretary", "Treasurer", "Member"];

        return {
            name: item.staffName,
            qual: item.staffDesignation,
            dept: item.departmentName,
            position: positions[index] || "Member",
        };
    })
    : [];

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
                        <Typography
                            sx={{
                                color: "red",
                                fontSize: { xs: 32, md: 42 },
                                fontFamily: "Georgia",
                                fontWeight: 400,
                            }}
                        >
                            Old Student Association
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
                        <Box sx={{ mb: 5 }}>
                            {/* Description */}
                            <Typography
                                sx={{
                                    fontSize: "1.15rem",
                                    fontFamily: "Georgia",
                                    lineHeight: 2,
                                    textAlign: "center",
                                    color: "#222",
                                    mb: 5,
                                }}
                            >
                                CERTIFICATE OF REGISTRATION OF SOCIETIES
                                <br />
                                Form No. II . SI. No. SRG/Thiruvarur/6/2026
                            </Typography>
                        </Box>


                        <Typography
                            sx={{
                                textAlign: "left",
                                fontSize: "1.1rem",
                                lineHeight: 2,
                                fontFamily: "Georgia",
                            }}
                        >
                            I hereby certify that முன்னாள் மாணவர்கள் சங்கம் அரசு கலை மற்றும் அறிவியல் கல்லூரி நன்னிலம் (ALUMNI ASSOCIATION GOVERNMENT ARTS AND SCIENCE COLLEGE, NANNILAM) has this day been registered under the Tamil Nadu Societies Registration Act, 1975 (Tamil Nadu Act 27 of 1975).

                            Given under my hand at Thiruvarur this 17th day of February, 2026
                        </Typography>

                    </Box>
                    {/* Programming Officers */}
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
                            Old Student Association (OSA)
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
                            Programming Officers
                        </Typography>

                        <Grid container spacing={4}>
                            {programmingOfficers.map((officer, index) => (
                                <Grid item xs={12} md={6} key={index}>
                                    <Card
                                        elevation={0}
                                        sx={{
                                            borderRadius: 4,
                                            border: "1px solid #e5e7eb",
                                            borderLeft: "6px solid #1565c0",
                                            overflow: "hidden",
                                            transition: "0.35s",
                                            bgcolor: "#fff",

                                            "&:hover": {
                                                transform: "translateY(-6px)",
                                                boxShadow: "0 12px 35px rgba(0,0,0,0.12)",
                                            },
                                        }}
                                    >
                                        <CardContent sx={{ p: 1 }}>
                                            <Box sx={{ textAlign: "center" }}>
                                                {/* Name */}
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

                                                {/* Position */}
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

                                                {/* Qualification */}
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
                                                            Designation
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

                                                {/* Department */}
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