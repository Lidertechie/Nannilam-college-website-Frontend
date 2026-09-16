import React, { useState, useEffect } from "react";
import {Container, Paper, Typography, Box, Card, Avatar, Grid, Link, Chip, Divider, Skeleton, Button,} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import instance from "../../../AxiosInstance/AxiosInstance";
import Reusabletable from "../../../Common/Reusabletable";
import DescriptionIcon from "@mui/icons-material/Description";
import PersonIcon from "@mui/icons-material/Person";
import SchoolIcon from "@mui/icons-material/School";
import WorkIcon from "@mui/icons-material/Work";
import ScienceIcon from "@mui/icons-material/Science";
import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";

export default function StaffTable() {
  const theme = useTheme();
  const [staffData, setStaffData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        setLoading(true);
        const { data } = await instance.get("/subject-allocations");
        const filteredData = (Array.isArray(data) ? data : []).filter(
          (row) =>
            (row.subjectName || "").trim().toLowerCase() === "allied physics"
        );
        setStaffData(filteredData);
      } catch (err) {
        console.error("Error fetching staff data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, []);

  // Prepare table data
  const tableHeaders = ["S.No.", "Name", "Qualification", "Designation", "Document"];
  const tableRows = staffData.map((row, index) => [
    index + 1,
    row.staffName ?? "",
    row.staffQualification ?? "",
    row.staffDesignation ?? "",
    row.documentUrl ? (
      <Link
        href={row.documentUrl}
        target="_blank"
        rel="noopener noreferrer"
        sx={{
          display: "inline-flex",
          alignItems: "center",
          gap: 0.5,
          color: theme.palette.primary.main,
          textDecoration: "none",
          fontWeight: 500,
          "&:hover": {
            textDecoration: "underline",
          },
        }}
      >
        <DescriptionIcon fontSize="small" />
        View Doc
      </Link>
    ) : (
      <span style={{ color: "#999", fontSize: "13px" }}>No document</span>
    ),
  ]);

  // Faculty Card Component
  const FacultyCard = ({ faculty, index }) => {
    const [imageError, setImageError] = useState(false);

    return (
      <Card
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "center", sm: "flex-start" },
          gap: 3,
          p: 3,
          borderRadius: 3,
          background: "linear-gradient(135deg, #ffffff 0%, #f8faff 100%)",
          boxShadow: "0 4px 20px rgba(26, 62, 140, 0.08)",
          transition: "all 0.3s ease",
          border: "1px solid rgba(26, 62, 140, 0.05)",
          "&:hover": {
            transform: "translateY(-6px)",
            boxShadow: "0 12px 40px rgba(26, 62, 140, 0.15)",
            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
          },
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${alpha(
              theme.palette.primary.main,
              0.3
            )})`,
          },
        }}
      >

        {/* Avatar Section */}
        <Box sx={{ position: "relative" }}>
          <Avatar
            src={!imageError ? faculty.staffImageUrl : null}
            alt={faculty.staffName}
            sx={{
              width: { xs: 120, sm: 140 },
              height: { xs: 120, sm: 140 },
              border: `4px solid ${theme.palette.primary.main}`,
              boxShadow: "0 8px 24px rgba(26, 62, 140, 0.15)",
              flexShrink: 0,
              backgroundColor: alpha(theme.palette.primary.main, 0.08),
            }}
            onError={() => setImageError(true)}
          >
            {imageError || !faculty.staffImageUrl ? (
              <PersonIcon sx={{ fontSize: 60, color: theme.palette.primary.main }} />
            ) : null}
          </Avatar>
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              right: 0,
              backgroundColor: theme.palette.info.main,
              width: 24,
              height: 24,
              borderRadius: "50%",
              border: `2px solid white`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ScienceIcon sx={{ fontSize: 14, color: "white" }} />
          </Box>
        </Box>

        {/* Content Section */}
        <Box sx={{ flex: 1, textAlign: { xs: "center", sm: "left" } }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: "#1f2937",
              mb: 1,
              fontSize: { xs: "22px", sm: "26px" },
            }}
          >
            {faculty.staffName}
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1,
              mb: 2,
              justifyContent: { xs: "center", sm: "flex-start" },
            }}
          >
            <Chip
              icon={<WorkIcon sx={{ fontSize: 16 }} />}
              label={faculty.staffDesignation}
              size="medium"
              sx={{
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
                fontWeight: 600,
                borderRadius: "20px",
                "& .MuiChip-icon": {
                  color: theme.palette.primary.main,
                },
              }}
            />
            {faculty.staffType && (
              <Chip
                label={faculty.staffType}
                size="medium"
                sx={{
                  backgroundColor: alpha(theme.palette.success.main, 0.1),
                  color: theme.palette.success.main,
                  fontWeight: 500,
                  borderRadius: "20px",
                }}
              />
            )}
            {faculty.subjectName && (
              <Chip
                label={faculty.subjectName}
                size="medium"
                sx={{
                  backgroundColor: alpha(theme.palette.info.main, 0.1),
                  color: theme.palette.info.main,
                  fontWeight: 500,
                  borderRadius: "20px",
                }}
              />
            )}
          </Box>

          <Divider sx={{ my: 1.5 }} />

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: { xs: 1, sm: 3 },
              alignItems: { xs: "center", sm: "flex-start" },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <SchoolIcon sx={{ color: theme.palette.primary.main, fontSize: 20 }} />
              <Typography variant="body2" color="text.secondary">
                <strong>Qualification:</strong> {faculty.staffQualification}
              </Typography>
            </Box>
          </Box>

          {/* Action Buttons */}
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1.5,
              mt: 2,
              justifyContent: { xs: "center", sm: "flex-start" },
            }}
          >
            {faculty.documentUrl && (
              <Button
                variant="contained"
                size="small"
                startIcon={<DownloadIcon />}
                href={faculty.documentUrl}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  borderRadius: "20px",
                  textTransform: "none",
                  fontWeight: 600,
                  boxShadow: "none",
                  "&:hover": {
                    boxShadow: "0 4px 12px rgba(26, 62, 140, 0.3)",
                  },
                }}
              >
                View Document
              </Button>
            )}
          </Box>
        </Box>
      </Card>
    );
  };

  // Skeleton loader
  const LoadingSkeleton = () => (
    <Card sx={{ p: 3, display: "flex", gap: 3, borderRadius: 3 }}>
      <Skeleton variant="circular" width={140} height={140} />
      <Box sx={{ flex: 1 }}>
        <Skeleton variant="text" width="60%" height={40} />
        <Skeleton variant="text" width="40%" height={30} />
        <Skeleton variant="text" width="80%" height={20} />
        <Skeleton variant="rectangular" width="50%" height={40} sx={{ mt: 2, borderRadius: 2 }} />
      </Box>
    </Card>
  );

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 6 }}>
      {/* Header Section */}
      <Box
        sx={{
          textAlign: "center",
          mb: 5,
          position: "relative",
          py: 4,
          background: `linear-gradient(135deg, ${alpha(
            theme.palette.primary.main,
            0.04
          )} 0%, ${alpha(theme.palette.primary.main, 0.01)} 100%)`,
          borderRadius: 4,
        }}
      >
        <Box sx={{ position: "relative", display: "inline-block" }}>
          <ScienceIcon
            sx={{
              fontSize: 60,
              color: alpha(theme.palette.primary.main, 0.1),
              position: "absolute",
              top: -30,
              right: -40,
              transform: "rotate(-15deg)",
            }}
          />
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
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${alpha(
                  theme.palette.primary.main,
                  0.3
                )})`,
                borderRadius: "2px",
              },
            }}
          >
            Allied Physics
          </Typography>
        </Box>
        <Typography
          variant="subtitle1"
          sx={{
            mt: 4,
            color: "text.secondary",
            fontSize: "15px",
            maxWidth: "600px",
            margin: "24px auto 0",
          }}
        >
          Department of Allied Physics • Government Arts & Science College
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 2,
            mt: 2,
            flexWrap: "wrap",
          }}
        >
          <Chip
            icon={<PersonIcon />}
            label={`${staffData.length} Faculty Members`}
            sx={{
              backgroundColor: alpha(theme.palette.primary.main, 0.08),
              color: theme.palette.primary.main,
              fontWeight: 600,
            }}
          />
          {staffData.some((s) => s.documentUrl) && (
            <Chip
              icon={<DescriptionIcon />}
              label="Documents Available"
              sx={{
                backgroundColor: alpha(theme.palette.success.main, 0.08),
                color: theme.palette.success.main,
                fontWeight: 600,
              }}
            />
          )}
        </Box>
      </Box>

      {/* Faculty Cards Section */}
      {staffData.length > 0 && (
        <Box sx={{ mb: 5 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: "#1f2937",
              mb: 3,
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              "&::before": {
                content: '""',
                width: "4px",
                height: "28px",
                backgroundColor: theme.palette.primary.main,
                borderRadius: "2px",
              },
            }}
          >
            Faculty Members
          </Typography>

          <Grid container spacing={3}>
            {loading
              ? Array.from({ length: 2 }).map((_, index) => (
                  <Grid item xs={12} key={index}>
                    <LoadingSkeleton />
                  </Grid>
                ))
              : staffData.map((faculty, index) => (
                  <Grid item xs={12} key={faculty.id || index}>
                    <FacultyCard faculty={faculty} index={index} />
                  </Grid>
                ))}
          </Grid>
        </Box>
      )}
    </Container>
  );
}