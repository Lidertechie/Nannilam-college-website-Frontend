import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Chip,
  Divider,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Button,
  Paper,
  Card,
  CardContent,
  Grid,
  Stack,
  IconButton,
  Tooltip,
  Fade,
  Zoom,
  alpha,
} from "@mui/material";
import {
  School,
  Badge,
  Work,
  ViewList,
  ViewModule,
} from "@mui/icons-material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "../Common/Footer";
import instance from "../AxiosInstance/AxiosInstance";
import ReusableTable from "../Common/Reusabletable";

export default function NaanMudhalvanCoordinator() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const [viewMode, setViewMode] = useState(isMobile ? "card" : "table");

  const [schemeName, setSchemeName] = useState("Naan Mudhalvan Scheme Co-Ordinator");
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch coordinator data from API
  const fetchCoordinators = async () => {
    try {
      setLoading(true);
      const response = await instance.get("/naan-mudhalvan-scheme");
      console.log("Naan Mudhalvan Coordinators:", response.data);

      const data = response.data;
      // API returns either a plain array of coordinators, or { name, members: [...] }
      const rawList = Array.isArray(data) ? data : Array.isArray(data?.members) ? data.members : [];

      // Normalize field names coming from the backend to what the UI expects
      const normalized = rawList.map((item) => ({
        id: item.id,
        name: item.coordinatorName || item.name || "—",
        qual: item.qualification || item.qual || "—",
  
        position: item.position || "—",
        verified: item.verified,
        academicYear: item.academicYear,
      }));

      setSchemeName(data?.name || "Naan Mudhalvan Scheme Co-Ordinator");
      setMembers(normalized);
      setError(null);
    } catch (error) {
      console.error("Error fetching coordinators:", error);
      const errorMsg = error.response?.data?.message || "Failed to fetch coordinator details";
      setError(errorMsg);
      toast.error("❌ " + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoordinators();
  }, []);

  useEffect(() => {
    if (isMobile) {
      setViewMode("card");
    }
  }, [isMobile]);

  // Prepare table data
  const tableHeaders = ["S.No", "Coordinator Name", "Qualification", "Position"];

  const tableRows = members.map((member, index) => [
    index + 1,
    member.name || "—",
    member.qual || "—",
    member.position || "—",
  ]);

  // Loading state
  if (loading) {
    return (
      <>
        <Box
          sx={{
            bgcolor: "#f5f9ff",
            minHeight: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            py: 8,
          }}
        >
          <CircularProgress size={60} sx={{ color: "#1a237e" }} />
        </Box>
        <Footer />
      </>
    );
  }

  // Error state
  if (error) {
    return (
      <>
        <Box
          sx={{
            bgcolor: "#f5f9ff",
            minHeight: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            py: 8,
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography variant="h6" color="error">
            ❌ Failed to load coordinator details
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {error}
          </Typography>
          <Button
            variant="contained"
            onClick={fetchCoordinators}
            sx={{ mt: 2, bgcolor: "#1a237e" }}
          >
            Retry
          </Button>
        </Box>
        <Footer />
      </>
    );
  }

  // No data state
  if (members.length === 0) {
    return (
      <>
        <Box
          sx={{
            bgcolor: "#f5f9ff",
            minHeight: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            py: 8,
            flexDirection: "column",
            gap: 2,
          }}
        >
          <School sx={{ fontSize: 60, color: "#1a237e", opacity: 0.3 }} />
          <Typography variant="h6" color="textSecondary">
            No coordinator records found
          </Typography>
        </Box>
        <Footer />
      </>
    );
  }

  // Card View Component
  const CoordinatorCard = ({ member, index }) => {
    const colors = [
      "#1a237e", "#2e7d32", "#c62828", "#e65100", "#6a1b9a", "#00695c",
      "#4527a0", "#bf360c", "#283593", "#004d40", "#880e4f", "#4a148c",
    ];
    const avatarColor = colors[index % colors.length];

    return (
      <Zoom in={true} style={{ transitionDelay: `${index * 50}ms` }}>
        <Card
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            borderRadius: 2,
            border: "1px solid",
            borderColor: "#E8ECF1",
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow: (theme) => `0 8px 30px ${alpha(theme.palette.primary.main, 0.1)}`,
              borderColor: "primary.main",
            },
            position: "relative",
            overflow: "visible",
            bgcolor: "#ffffff",
          }}
        >
          {/* Status Bar */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "4px",
              bgcolor: avatarColor,
              borderRadius: "2px 2px 0 0",
            }}
          />

          <CardContent
            sx={{
              p: 3,
              flex: 1,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Header - Name and Position */}
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: "#0d47a1",
                  fontSize: { xs: "1.1rem", sm: "1.2rem" },
                  mb: 0.5,
                  lineHeight: 1.2,
                }}
              >
                {member.name || "—"}
              </Typography>
              <Chip
                label={member.position || "SPOC"}
                size="small"
                sx={{
                  bgcolor: alpha(theme.palette.primary.main, 0.08),
                  color: "#1a237e",
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  "& .MuiChip-label": { px: 2 },
                }}
              />
            </Box>

            {/* Details Section */}
            <Stack spacing={1.5} sx={{ flex: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Badge sx={{ color: "#1a237e", fontSize: 18 }} />
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                  Qualification:
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500, color: "#1a237e" }}>
                  {member.qual || "—"}
                </Typography>
              </Box>

              {/* <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Work sx={{ color: "#1a237e", fontSize: 18 }} />
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                  Department:
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500, color: "#1a237e" }}>
                  {member.dept || "—"}
                </Typography>
              </Box> */}
            </Stack>
          </CardContent>
        </Card>
      </Zoom>
    );
  };

  return (
    <>
      <Box
        sx={{
          bgcolor: "#f5f9ff",
          minHeight: "100vh",
          py: { xs: 4, md: 8 },
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "300px",
            background: "linear-gradient(180deg, #e8eaf6 0%, transparent 100%)",
            opacity: 0.5,
          },
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            position: "relative",
            zIndex: 1,
            px: { xs: 2, sm: 3, md: 4 },
          }}
        >
          {/* Heading */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
                fontWeight: 800,
                fontFamily: "'Georgia', serif",
                background: "linear-gradient(135deg, #1a237e, #3949ab)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 1,
                letterSpacing: "-0.02em",
              }}
            >
              {schemeName}
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: "1rem", sm: "1.2rem" },
                color: "#c62828",
                fontFamily: "'Georgia', serif",
                fontWeight: 600,
                opacity: 0.9,
              }}
            >
              Scheme Coordinators
            </Typography>
            <Divider
              sx={{
                width: { xs: "60px", sm: "80px" },
                mx: "auto",
                mt: 2,
                borderColor: "#1a237e",
                borderWidth: 3,
                borderRadius: 2,
              }}
            />
          </Box>

          {/* Main Content */}
          <Paper
            elevation={0}
            sx={{
              borderRadius: 3,
              border: "1px solid #E8ECF1",
              overflow: "hidden",
              p: { xs: 2, md: 3 },
              bgcolor: "#ffffff",
            }}
          >
            {/* Header with Controls */}
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: { xs: "flex-start", sm: "center" },
                justifyContent: "space-between",
                mb: 3,
                gap: 2,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: "#0d47a1",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  fontSize: { xs: "1rem", sm: "1.25rem" },
                }}
              >
                <School sx={{ fontSize: 24 }} />
                Coordinators List
                <Chip
                  label={`${members.length} Coordinator${members.length !== 1 ? "s" : ""}`}
                  size="small"
                  sx={{
                    ml: 1,
                    bgcolor: "#1a237e",
                    color: "#fff",
                    fontWeight: 600,
                    fontSize: "0.7rem",
                  }}
                />
              </Typography>

              {/* View Toggle */}
              {!isMobile && (
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Tooltip title="Table View">
                    <IconButton
                      size="small"
                      onClick={() => setViewMode("table")}
                      sx={{
                        bgcolor: viewMode === "table" ? "#1a237e" : "transparent",
                        color: viewMode === "table" ? "#fff" : "#1a237e",
                        borderRadius: 2,
                        "&:hover": {
                          bgcolor: viewMode === "table" ? "#0d47a1" : alpha("#1a237e", 0.08),
                        },
                      }}
                    >
                      <ViewList />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Card View">
                    <IconButton
                      size="small"
                      onClick={() => setViewMode("card")}
                      sx={{
                        bgcolor: viewMode === "card" ? "#1a237e" : "transparent",
                        color: viewMode === "card" ? "#fff" : "#1a237e",
                        borderRadius: 2,
                        "&:hover": {
                          bgcolor: viewMode === "card" ? "#0d47a1" : alpha("#1a237e", 0.08),
                        },
                      }}
                    >
                      <ViewModule />
                    </IconButton>
                  </Tooltip>
                </Box>
              )}
            </Box>

            {/* Render based on view mode */}
            <Fade in={true}>
              <Box>
                {viewMode === "table" && !isMobile ? (
                  <ReusableTable headers={tableHeaders} rows={tableRows} />
                ) : (
                  <Grid container spacing={{ xs: 2, sm: 2, md: 3 }} alignItems="stretch">
                    {members.map((member, index) => (
                      <Grid item xs={12} sm={6} md={4} key={member.id ?? index} sx={{ display: "flex" }}>
                        <CoordinatorCard member={member} index={index} />
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Box>
            </Fade>
          </Paper>
        </Container>
      </Box>
      <Footer />

      {/* Toast Container */}
      <ToastContainer
        position="bottom-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ zIndex: 9999 }}
      />
    </>
  );
}