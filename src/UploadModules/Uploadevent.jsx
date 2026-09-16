import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  CircularProgress,
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery,
  alpha,
  Grid,
  FormHelperText,
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  Event,
  LocationOn,
  CalendarToday,
  CheckCircle,
} from "@mui/icons-material";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import instance from "../AxiosInstance/AxiosInstance";
import PageHeader from "../UploadModules/Pageheader";
import ReusableTable from "../Common/Reusabletable";
import useFormFieldErrors from "../Common/useFormFieldErrors";

// Fields tracked for inline backend validation errors on this form
const EVENT_FIELD_NAMES = ["eventTitle", "startDate", "endDate", "venue"];

const Uploadevent = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // States
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  // Dialog states
  const [openDialog, setOpenDialog] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    eventTitle: "",
    startDate: "",
    endDate: "",
    venue: "",
    description: "",
  });

  // Reusable field-error handling (parses backend VALIDATION errors too)
  const {
    formErrors,
    clearFieldErrors,
    clearFieldError,
    applyBackendFieldErrors,
    fieldProps,
  } = useFormFieldErrors(EVENT_FIELD_NAMES);

  // Delete dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);

  // Fetch events
  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await instance.get("/events/all");
      console.log("Events:", response.data);
      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching events:", error);
      const errorMsg = error.response?.data?.message || "Failed to fetch events";
      toast.error("❌ " + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    clearFieldError(name);
  };

  // Open dialog for create/edit
  const handleOpenDialog = (event = null) => {
    if (event) {
      setEditingEvent(event);
      setFormData({
        eventTitle: event.eventTitle || "",
        startDate: event.startDate ? event.startDate.split('T')[0] : "",
        endDate: event.endDate ? event.endDate.split('T')[0] : "",
        venue: event.venue || "",
        description: event.description || "",
      });
    } else {
      setEditingEvent(null);
      setFormData({
        eventTitle: "",
        startDate: "",
        endDate: "",
        venue: "",
        description: "",
      });
    }
    clearFieldErrors();
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingEvent(null);
    setFormData({
      eventTitle: "",
      startDate: "",
      endDate: "",
      venue: "",
      description: "",
    });
    clearFieldErrors();
  };

  // Create event
  const handleCreate = async () => {
    // No frontend static validation — let the backend validate and
    // return field-level errors via `details`, shown inline below.
    clearFieldErrors();

    setLoading(true);
    try {
      const response = await instance.post("/events", {
        eventTitle: formData.eventTitle.trim(),
        startDate: formData.startDate,
        endDate: formData.endDate,
        venue: formData.venue.trim(),
        description: formData.description.trim(),
      });
      console.log("Created:", response.data);
      toast.success("✅ Event created successfully!");
      handleCloseDialog();
      fetchEvents();
    } catch (error) {
      console.error("Create error:", error);
      const handledAsFieldErrors = applyBackendFieldErrors(error);
      if (!handledAsFieldErrors) {
        const errorMsg = error?.response?.data?.message || error?.message || "Failed to create event";
        toast.error("❌ " + errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  // Update event
  const handleUpdate = async () => {
    // No frontend static validation — let the backend validate and
    // return field-level errors via `details`, shown inline below.
    clearFieldErrors();

    setLoading(true);
    try {
      const response = await instance.put(`/events/${editingEvent.id}`, {
        eventTitle: formData.eventTitle.trim(),
        startDate: formData.startDate,
        endDate: formData.endDate,
        venue: formData.venue.trim(),
        description: formData.description.trim(),
      });
      console.log("Updated:", response.data);
      toast.success("✅ Event updated successfully!");
      handleCloseDialog();
      fetchEvents();
    } catch (error) {
      console.error("Update error:", error);
      const handledAsFieldErrors = applyBackendFieldErrors(error);
      if (!handledAsFieldErrors) {
        const errorMsg = error?.response?.data?.message || error?.message || "Failed to update event";
        toast.error("❌ " + errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  // Delete event
  const handleDeleteClick = (event) => {
    setEventToDelete(event);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!eventToDelete) return;

    try {
      await instance.delete(`/events/${eventToDelete.id}`);
      toast.success(`✅ "${eventToDelete.eventTitle}" deleted successfully!`);
      setDeleteDialogOpen(false);
      setEventToDelete(null);
      fetchEvents();
    } catch (error) {
      console.error("Delete error:", error);
      const errorMsg = error.response?.data?.message || "Failed to delete event";
      toast.error("❌ " + errorMsg);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setEventToDelete(null);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  // Get status chip
  const getStatusChip = (status) => {
    const statusColors = {
      'UPCOMING': { bg: '#E3F2FD', color: '#1565C0' },
      'ONGOING': { bg: '#FFF3E0', color: '#E65100' },
      'COMPLETED': { bg: '#E8F5E9', color: '#2E7D32' },
      'CANCELLED': { bg: '#FFEBEE', color: '#C62828' },
    };

    const colors = statusColors[status] || { bg: '#F5F5F5', color: '#616161' };

    return (
      <Chip
        label={status || "N/A"}
        size="small"
        sx={{
          bgcolor: colors.bg,
          color: colors.color,
          fontWeight: 600,
          fontSize: "0.7rem",
        }}
      />
    );
  };

  // Prepare table data
  const tableHeaders = ["S.No", "Event Title", "Start Date", "End Date", "Venue", "Status", "Actions"];

  const tableRows = events.map((event, index) => [
    index + 1,
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Event sx={{ fontSize: 18, color: theme.palette.primary.main }} />
      <Typography fontWeight={500}>{event.eventTitle}</Typography>
    </Box>,
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
      <CalendarToday sx={{ fontSize: 14, color: "#6B7280" }} />
      {formatDate(event.startDate)}
    </Box>,
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
      <CalendarToday sx={{ fontSize: 14, color: "#6B7280" }} />
      {formatDate(event.endDate)}
    </Box>,
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
      <LocationOn sx={{ fontSize: 14, color: "#6B7280" }} />
      {event.venue || "—"}
    </Box>,
    getStatusChip(event.status),
    <Box sx={{ display: "flex", gap: 0.5, justifyContent: "center" }}>
      <Tooltip title="Edit">
        <IconButton
          size="small"
          onClick={() => handleOpenDialog(event)}
          sx={{
            color: "#1976D2",
            "&:hover": {
              bgcolor: alpha("#1976D2", 0.08),
            },
          }}
        >
          <Edit fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Delete">
        <IconButton
          size="small"
          onClick={() => handleDeleteClick(event)}
          sx={{
            color: "#D32F2F",
            "&:hover": {
              bgcolor: alpha("#D32F2F", 0.08),
            },
          }}
        >
          <Delete fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  ]);

  return (
    <Box sx={{ bgcolor: "#f5f7fa", minHeight: "100vh", py: 4 }}>
      <PageHeader
        title="EVENTS MANAGEMENT"
        subtitle="Manage college events"
      />

      <Box sx={{ px: { xs: 2, md: 4 } }}>
        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            border: "1px solid #E8ECF1",
            p: { xs: 2, md: 4 },
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              pb: 2,
              mb: 3,
              borderBottom: "3px solid #1E293B",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Typography
              variant="h4"
              sx={{ fontWeight: 800, color: "#1E293B", fontSize: { xs: "1.5rem", md: "2rem" } }}
            >
              Events
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => handleOpenDialog()}
              sx={{
                bgcolor: "#1E293B",
                borderRadius: 2,
                "&:hover": { bgcolor: "#0F172A" },
                textTransform: "none",
                fontWeight: 600,
                flexShrink: 0,
              }}
            >
              Add Event
            </Button>
          </Box>

          {/* Events List - Table View */}
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
              <CircularProgress />
            </Box>
          ) : events.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 6 }}>
              <Event sx={{ fontSize: 56, color: "#D1D5DB" }} />
              <Typography variant="h6" sx={{ color: "#6B7280", mt: 2 }}>
                No events found
              </Typography>
              <Typography variant="body2" sx={{ color: "#9CA3AF" }}>
                Add an event to get started
              </Typography>
            </Box>
          ) : (
            <ReusableTable
              headers={tableHeaders}
              rows={tableRows}
            />
          )}
        </Paper>
      </Box>

      {/* Create/Edit Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: { xs: 1, sm: 2 },
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
          {editingEvent ? "Edit Event" : "Add New Event"}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Box sx={{ mt: 1 }}>
            {/* Event Title */}
            <Box sx={{ mb: 2.5 }}>
              <Typography
                component="label"
                sx={{
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  color: "#1A1A1A",
                  display: "block",
                  mb: 0.5,
                }}
              >
                Event Title <span style={{ color: "#D32F2F" }}>*</span>
              </Typography>
              <TextField
                fullWidth
                name="eventTitle"
                value={formData.eventTitle}
                onChange={handleChange}
                placeholder="Enter event title"
                {...fieldProps("eventTitle")}
                variant="outlined"
                size="medium"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    bgcolor: "#FAFBFC",
                  },
                }}
              />
            </Box>

            {/* Start Date & End Date */}
            <Grid container spacing={2} sx={{ mb: 2.5 }}>
              <Grid item xs={12} sm={6}>
                <Typography
                  component="label"
                  sx={{
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    color: "#1A1A1A",
                    display: "block",
                    mb: 0.5,
                  }}
                >
                  Start Date <span style={{ color: "#D32F2F" }}>*</span>
                </Typography>
                <TextField
                  fullWidth
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleChange}
                  {...fieldProps("startDate")}
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                  size="medium"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      bgcolor: "#FAFBFC",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography
                  component="label"
                  sx={{
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    color: "#1A1A1A",
                    display: "block",
                    mb: 0.5,
                  }}
                >
                  End Date <span style={{ color: "#D32F2F" }}>*</span>
                </Typography>
                <TextField
                  fullWidth
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={handleChange}
                  {...fieldProps("endDate")}
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                  size="medium"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      bgcolor: "#FAFBFC",
                    },
                  }}
                />
              </Grid>
            </Grid>

            {/* Venue */}
            <Box sx={{ mb: 2.5 }}>
              <Typography
                component="label"
                sx={{
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  color: "#1A1A1A",
                  display: "block",
                  mb: 0.5,
                }}
              >
                Venue <span style={{ color: "#D32F2F" }}>*</span>
              </Typography>
              <TextField
                fullWidth
                name="venue"
                value={formData.venue}
                onChange={handleChange}
                placeholder="Enter venue"
                {...fieldProps("venue")}
                variant="outlined"
                size="medium"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    bgcolor: "#FAFBFC",
                  },
                }}
              />
            </Box>

            {/* Description */}
            <Box sx={{ mb: 1 }}>
              <Typography
                component="label"
                sx={{
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  color: "#1A1A1A",
                  display: "block",
                  mb: 0.5,
                }}
              >
                Description
              </Typography>
              <TextField
                fullWidth
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter event description"
                multiline
                rows={3}
                variant="outlined"
                size="medium"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    bgcolor: "#FAFBFC",
                  },
                }}
              />
            </Box>

            {editingEvent && (
              <Box sx={{ mt: 2, p: 1.5, bgcolor: "#FFF3E0", borderRadius: 2 }}>
                <Typography variant="caption" sx={{ color: "#EF6C00", display: "flex", alignItems: "center", gap: 1 }}>
                  <Event sx={{ fontSize: 14 }} />
                  Editing: {editingEvent.eventTitle}
                </Typography>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1, gap: 1 }}>
          <Button
            onClick={handleCloseDialog}
            variant="outlined"
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              borderColor: "#D1D5DB",
              color: "#6B7280",
              "&:hover": {
                borderColor: "#9CA3AF",
                bgcolor: "#F9FAFB",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={editingEvent ? handleUpdate : handleCreate}
            variant="contained"
            disabled={loading}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              bgcolor: "#1E293B",
              "&:hover": {
                bgcolor: "#0F172A",
              },
            }}
          >
            {loading ? <CircularProgress size={24} /> : (editingEvent ? "Update" : "Create")}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        PaperProps={{
          sx: {
            borderRadius: 3,
            minWidth: 400,
          },
        }}
      >
        <DialogTitle sx={{ pb: 1, fontWeight: 600 }}>
          Delete Event
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: "#6B7280" }}>
            Are you sure you want to delete the event{" "}
            <strong>{eventToDelete ? eventToDelete.eventTitle : ""}</strong>?
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button
            onClick={handleDeleteCancel}
            variant="outlined"
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              borderColor: "#D1D5DB",
              color: "#6B7280",
              "&:hover": {
                borderColor: "#9CA3AF",
                bgcolor: "#F9FAFB",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              bgcolor: "#D32F2F",
              "&:hover": {
                bgcolor: "#C62828",
              },
            }}
          >
            Delete
          </Button>
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
    </Box>
  );
};

export default Uploadevent;