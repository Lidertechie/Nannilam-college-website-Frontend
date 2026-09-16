import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Paper,
  Chip,
  CircularProgress,
  Button,
  Divider,
  useTheme,
  useMediaQuery,
  alpha,
  Breadcrumbs,
  Link,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
} from "@mui/material";
import {
  CalendarToday,
  School,
  Description,
  CheckCircle,
  ArrowForward,
  Home,
  Event,
  CloudDownload,
  InsertDriveFile,
  Close,
  Visibility,
} from "@mui/icons-material";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import instance from "../../AxiosInstance/AxiosInstance";
import Footer from "../../Common/Footer";
import ReusableTable from "../../Common/Reusabletable";

const AcademicCalendarDetail = () => {
  const { yearId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const [calendars, setCalendars] = useState([]);
  const [academicYear, setAcademicYear] = useState(null);
  const [loading, setLoading] = useState(true);
  const [yearLoading, setYearLoading] = useState(true);
  
  // File view dialog states
  const [openFileDialog, setOpenFileDialog] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedCalendarTitle, setSelectedCalendarTitle] = useState("");

  // Fetch academic year details
  const fetchAcademicYear = async () => {
    setYearLoading(true);
    try {
      const response = await instance.get(`academic-calendars/${yearId}`);
      console.log("Academic Year:", response.data);
      setAcademicYear(response.data);
    } catch (error) {
      console.error("Error fetching academic year:", error);
    //   toast.error("❌ Failed to fetch academic year details");
    } finally {
      setYearLoading(false);
    }
  };

  // Fetch calendars for the selected academic year
  const fetchCalendars = async () => {
    setLoading(true);
    try {
      const response = await instance.get(`/academic-calendars?academicYearId=${yearId}`);
      console.log("Calendars:", response.data);
      setCalendars(response.data);
    } catch (error) {
      console.error("Error fetching calendars:", error);
      const errorMsg = error.response?.data?.message || "Failed to fetch calendars";
      toast.error("❌ " + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (yearId) {
      fetchAcademicYear();
      fetchCalendars();
    }
  }, [yearId]);

  const handleDownloadFile = (file) => {
    if (file.fileUrl) {
      window.open(file.fileUrl, '_blank');
    } else {
      toast.info("Download URL not available");
    }
  };

  // Open file view dialog
  const handleViewFiles = (files, title) => {
    if (files && files.length > 0) {
      setSelectedFiles(files);
      setSelectedCalendarTitle(title);
      setOpenFileDialog(true);
    } else {
      toast.info("No files attached to this calendar");
    }
  };

  // Close file view dialog
  const handleCloseFileDialog = () => {
    setOpenFileDialog(false);
    setSelectedFiles([]);
    setSelectedCalendarTitle("");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  // Prepare table data
  const tableHeaders = ["S.No", "Title", "Description", "Status", "Files", "Posted On"];
  
  const tableRows = calendars.map((calendar, index) => [
    index + 1,
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <CalendarToday sx={{ fontSize: 18, color: theme.palette.primary.main }} />
      <Typography fontWeight={600} sx={{ color: "#0d47a1" }}>
        {calendar.title}
      </Typography>
    </Box>,
    calendar.description || "—",
    calendar.active !== false ? (
      <Chip
        icon={<CheckCircle sx={{ fontSize: 14 }} />}
        label="Active"
        size="small"
        sx={{
          bgcolor: "#E8F5E9",
          color: "#2E7D32",
          fontWeight: 600,
          fontSize: "0.7rem",
        }}
      />
    ) : (
      <Chip
        label="Inactive"
        size="small"
        sx={{
          bgcolor: "#FFEBEE",
          color: "#C62828",
          fontWeight: 600,
          fontSize: "0.7rem",
        }}
      />
    ),
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
      <Tooltip title="View Files">
        <IconButton
          size="small"
          onClick={() => handleViewFiles(calendar.files, calendar.title)}
          sx={{
            color: "#1976D2",
            "&:hover": {
              bgcolor: alpha("#1976D2", 0.08),
            },
          }}
        >
          <Visibility fontSize="small" />
        </IconButton>
      </Tooltip>
      <Chip
        icon={<Description sx={{ fontSize: 14 }} />}
        label={`${calendar.fileCount || 0} files`}
        size="small"
        sx={{
          bgcolor: alpha(theme.palette.info.main, 0.08),
          color: "#0288D1",
          fontWeight: 600,
          fontSize: "0.7rem",
        }}
      />
    </Box>,
    formatDate(calendar.createdAt),
  ]);

  // Loading state
  if (loading || yearLoading) {
    return (
      <>
        <Box
          sx={{
            bgcolor: "#f5f9ff",
            minHeight: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <CircularProgress size={60} sx={{ color: "#1565c0" }} />
          <Typography variant="body1" color="textSecondary">
            Loading academic calendar...
          </Typography>
        </Box>
        <Footer />
      </>
    );
  }

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
            background: "linear-gradient(180deg, #e3f2fd 0%, transparent 100%)",
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
          {/* Header */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
                fontWeight: 800,
                fontFamily: "'Georgia', serif",
                background: "linear-gradient(135deg, #0d47a1, #1565c0)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 1,
                letterSpacing: "-0.02em",
              }}
            >
              Academic Calendar
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
              {academicYear?.yearLabel || "Academic Year"}
            </Typography>
            <Divider
              sx={{
                width: { xs: "60px", sm: "80px" },
                mx: "auto",
                mt: 2,
                borderColor: "#1565c0",
                borderWidth: 3,
                borderRadius: 2,
              }}
            />
          </Box>

          {/* Year Info Card */}
          {academicYear && (
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2, sm: 3 },
                mb: 4,
                borderRadius: 3,
                border: "1px solid #E8ECF1",
                bgcolor: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Event sx={{ fontSize: 28, color: "#1565c0" }} />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: "#0d47a1" }}>
                    {academicYear.academicYearLabel}
                  </Typography>
                </Box>
              </Box>
              <Chip
                label={academicYear.active ? "Active" : "Inactive"}
                sx={{
                  bgcolor: academicYear.active ? "#E8F5E9" : "#FFEBEE",
                  color: academicYear.active ? "#2E7D32" : "#C62828",
                  fontWeight: 600,
                }}
              />
            </Paper>
          )}

          {/* Calendar Table */}
          {calendars.length === 0 ? (
            <Paper
              elevation={0}
              sx={{
                p: 6,
                textAlign: "center",
                borderRadius: 3,
                border: "1px solid #E8ECF1",
                bgcolor: "#ffffff",
              }}
            >
              <CalendarToday sx={{ fontSize: 64, color: "#D1D5DB" }} />
              <Typography variant="h6" sx={{ color: "#6B7280", mt: 2 }}>
                No academic calendars found
              </Typography>
              <Typography variant="body2" sx={{ color: "#9CA3AF" }}>
                No calendars available for {academicYear?.yearLabel || "this academic year"}.
              </Typography>
            </Paper>
          ) : (
            <Paper
              elevation={0}
              sx={{
                borderRadius: 3,
                border: "1px solid #E8ECF1",
                overflow: "hidden",
                bgcolor: "#ffffff",
              }}
            >
              <Box sx={{ p: { xs: 2, sm: 3 } }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: "#0d47a1",
                    mb: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <CalendarToday sx={{ fontSize: 24 }} />
                  Academic Calendars {academicYear?.yearLabel}
                </Typography>
                <ReusableTable
                  headers={tableHeaders}
                  rows={tableRows}
                />
              </Box>
            </Paper>
          )}

        </Container>
      </Box>
      <Footer />

      {/* File View Dialog */}
      <Dialog
        open={openFileDialog}
        onClose={handleCloseFileDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            maxHeight: "80vh",
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Box>
              <Typography variant="h6" fontWeight={700}>
                Attached Files
              </Typography>
              <Typography variant="caption" sx={{ color: "#6B7280" }}>
                {selectedCalendarTitle}
              </Typography>
            </Box>
            <IconButton onClick={handleCloseFileDialog} size="small">
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <Divider />
        <DialogContent>
          {selectedFiles.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Description sx={{ fontSize: 48, color: "#D1D5DB" }} />
              <Typography variant="body1" sx={{ color: "#6B7280", mt: 2 }}>
                No files attached
              </Typography>
            </Box>
          ) : (
            <List sx={{ width: "100%" }}>
              {selectedFiles.map((file, index) => (
                <React.Fragment key={file.id || index}>
                  <ListItem
                    sx={{
                      borderRadius: 2,
                      transition: "all 0.2s ease",
                      "&:hover": {
                        bgcolor: alpha(theme.palette.primary.main, 0.04),
                      },
                    }}
                  >
                    <ListItemIcon>
                      <InsertDriveFile sx={{ color: theme.palette.primary.main }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography fontWeight={600} sx={{ fontSize: "0.95rem" }}>
                          {file.fileName || `File ${index + 1}`}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="caption" sx={{ color: "#6B7280", display: "block", mt: 0.5 }}>
                          Uploaded: {formatDate(file.createdAt)}
                        </Typography>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Tooltip title="Download">
                        <IconButton
                          edge="end"
                          onClick={() => handleDownloadFile(file)}
                          sx={{
                            color: "#1976D2",
                            "&:hover": {
                              bgcolor: alpha("#1976D2", 0.08),
                            },
                          }}
                        >
                          <CloudDownload />
                        </IconButton>
                      </Tooltip>
                    </ListItemSecondaryAction>
                  </ListItem>
                  {index < selectedFiles.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={handleCloseFileDialog}>Close</Button>
        </DialogActions>
      </Dialog>

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
};

export default AcademicCalendarDetail;