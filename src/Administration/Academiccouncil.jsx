import React, { useState, useEffect } from "react";
import { Container, Paper, Typography, Box } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import instance from "../AxiosInstance/AxiosInstance";
import Reusabletable from "../Common/Reusabletable";

export default function StaffTable() {
    const theme = useTheme();
    const [staffData, setStaffData] = useState([]);

    useEffect(() => {
        const fetchStaff = async () => {
            try {
                const { data } = await instance.get("/subject-allocations");
                setStaffData(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error(err);
            }
        };

        fetchStaff();
    }, []);

    const tableHeaders = ["S.No.", "Name", "Qualification", "Designation"];
    const allowedDesignations = [
        "Guest Lecturer & HOD",
        "Asst. Professor & HoD",
        "Associate Professor (AU) & HoD",
    ];

    const filtered = staffData.filter((row) =>
        allowedDesignations.includes((row.staffDesignation || "").trim())
    );

    const tableRows = filtered.map((row, index) => [
        index + 1,
        row.staffName ?? "",
        row.staffQualification ?? "",
        row.staffDesignation ?? "",
    ]);
    return (

        <Container maxWidth="xl" sx={{ mt: 4 }}>
            <Box
                sx={{
                    textAlign: "center",
                    mb: 4,
                    position: "relative",
                }}
            >
                <Typography
                    variant="h3"
                    component="h1"
                    sx={{
                        fontSize: { xs: "28px", sm: "36px", md: "44px" },
                        fontWeight: 800,
                        color: "#1f2937",
                        position: "relative",
                        display: "inline-block",
                        "&::after": {
                            content: '""',
                            position: "absolute",
                            bottom: -8,
                            left: "50%",
                            transform: "translateX(-50%)",
                            width: "80px",
                            height: "4px",
                            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${alpha(theme.palette.primary.main, 0.3)})`,
                            borderRadius: "2px",
                        },
                    }}
                >
                    HOD
                </Typography>
                <Typography
                    variant="subtitle1"
                    sx={{
                        mt: 3,
                        color: "text.secondary",
                        fontSize: "15px",
                        maxWidth: "600px",
                        margin: "24px auto 0",
                    }}
                >
                    HOD of • Government Arts & Science College
                </Typography>
            </Box>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 500, mb: 3, textTransform: 'uppercase' }}>
                    Staff Details
                </Typography>

                <Reusabletable
                    headers={tableHeaders}
                    rows={tableRows}
                />
            </Paper>
        </Container>
    );
}

