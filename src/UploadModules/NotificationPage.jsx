import { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  MenuItem,
  Chip,
  Stack,
  Snackbar,
  Alert,
  Divider,
  CircularProgress,
  Avatar,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  Tooltip,
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  Notifications,
  Event,
  School,
  Campaign,
  Description,
  CalendarToday,
  Close,
  FiberManualRecord,
  CloudUpload,
  Image as ImageIcon,
  CheckCircle,
  Error as ErrorIcon,
  Visibility,
} from "@mui/icons-material";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PageHeader from "./Pageheader";
import instance from "../AxiosInstance/AxiosInstance";
import { uploadFileToCloudinary } from "../Common/Fileupload";
import ReusableTable from "../Common/Reusabletable";
import useFormFieldErrors from "../Common/useFormFieldErrors";

// Fields tracked for inline backend validation errors on this form
const NOTIFICATION_FIELD_NAMES = ["title", "date", "description", "academicYearId"];

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingYears, setFetchingYears] = useState(false);

  // Dialog states
  const [openDialog, setOpenDialog] = useState(false);
  const [editingNotification, setEditingNotification] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    description: "",
    academicYearId: "",
    imageUrl: "",
  });

  // Reusable field-error handling (parses backend VALIDATION errors too)
  const {
    formErrors,
    clearFieldErrors,
    clearFieldError,
    setFieldErrors,
    applyBackendFieldErrors,
    fieldProps,
  } = useFormFieldErrors(NOTIFICATION_FIELD_NAMES);

  // Image upload states
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // View dialog states
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [viewNotification, setViewNotification] = useState(null);

  // Snackbar states
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  // Fetch academic years
  const fetchAcademicYears = async () => {
    setFetchingYears(true);
    try {
      const response = await instance.get("/academic-years");
      console.log("Academic Years:", response.data);
      setAcademicYears(response.data);
    } catch (error) {
      console.error("Error fetching academic years:", error);
      toast.error("Failed to fetch academic years");
      setSnackbar({
        open: true,
        message: "Failed to fetch academic years",
        severity: "error"
      });
    } finally {
      setFetchingYears(false);
    }
  };

  // Fetch notifications
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await instance.get("/notifications");
      console.log("Notifications:", response.data);
      setNotifications(response.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast.error(error.response?.data?.message || "Failed to fetch notifications");
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Failed to fetch notifications",
        severity: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    fetchAcademicYears();
  }, []);

  // Handle form input changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    clearFieldError(name); // Clear error for this field when user types
  };

  // Handle CRUD
  const handleOpenDialog = (notification = null) => {
    if (notification) {
      setEditingNotification(notification);
      setFormData({
        title: notification.title || "",
        date: notification.date ? notification.date.split('T')[0] : "",
        description: notification.description || "",
        academicYearId: notification.academicYearId || "",
        imageUrl: notification.imageUrl || "",
      });
      setImagePreview(notification.imageUrl || null);
      setImageFile(null);
    } else {
      setEditingNotification(null);
      setFormData({
        title: "",
        date: "",
        description: "",
        academicYearId: "",
        imageUrl: "",
      });
      setImagePreview(null);
      setImageFile(null);
    }
    clearFieldErrors(); // Clear any previous field errors
    setIsUploadingImage(false);
    setUploadProgress(0);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingNotification(null);
    setFormData({
      title: "",
      date: "",
      description: "",
      academicYearId: "",
      imageUrl: "",
    });
    setImagePreview(null);
    setImageFile(null);
    setIsUploadingImage(false);
    setUploadProgress(0);
    clearFieldErrors(); // Clear errors when closing
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error("Please upload a valid image file");
        setSnackbar({
          open: true,
          message: "Please upload a valid image file",
          severity: "error"
        });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        setSnackbar({
          open: true,
          message: "Image size should be less than 5MB",
          severity: "error"
        });
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setFormData({ ...formData, imageUrl: "" });
  };

  const handleSaveNotification = async () => {
    setLoading(true);
    clearFieldErrors(); // Clear previous errors before API call

    try {
      let imageUrl = formData.imageUrl;

      // Upload image to Cloudinary if new image selected
      if (imageFile) {
        try {
          setIsUploadingImage(true);
          setUploadProgress(20);
          imageUrl = await uploadFileToCloudinary(imageFile);
          setUploadProgress(100);
          setIsUploadingImage(false);
        } catch (uploadError) {
          console.error("Image upload error:", uploadError);
          toast.error("Failed to upload image: " + uploadError.message);
          setSnackbar({
            open: true,
            message: "Failed to upload image: " + uploadError.message,
            severity: "error"
          });
          setLoading(false);
          setIsUploadingImage(false);
          return;
        }
      }

      const notificationData = {
        title: formData.title,
        date: formData.date,
        description: formData.description,
        academicYearId: parseInt(formData.academicYearId),
        imageUrl: imageUrl || null,
      };

      let response;
      if (editingNotification) {
        // Update notification
        response = await instance.put(`/notifications/${editingNotification.id}`, notificationData);
        console.log("Updated:", response.data);
        toast.success("Notification updated successfully");
        setSnackbar({
          open: true,
          message: "Notification updated successfully",
          severity: "success"
        });
      } else {
        // Create notification
        response = await instance.post("/notifications/create", notificationData);
        console.log("Created:", response.data);
        toast.success("Notification created successfully");
        setSnackbar({
          open: true,
          message: "Notification created successfully",
          severity: "success"
        });
      }
      handleCloseDialog();
      await fetchNotifications();
    } catch (error) {
      console.error("Error saving notification:", error);
      const handledAsFieldErrors = applyBackendFieldErrors(error);
      if (!handledAsFieldErrors) {
        const errorMessage = error.response?.data?.message || "Failed to save notification";
        toast.error(errorMessage);
        setSnackbar({
          open: true,
          message: errorMessage,
          severity: "error"
        });
      }
    } finally {
      setLoading(false);
      setIsUploadingImage(false);
    }
  };

  const handleDeleteNotification = async (id) => {
    if (!window.confirm("Are you sure you want to delete this notification?")) return;

    setLoading(true);
    try {
      await instance.delete(`/notifications/${id}`);
      toast.success("Notification deleted successfully");
      setSnackbar({
        open: true,
        message: "Notification deleted successfully",
        severity: "success"
      });
      await fetchNotifications();
    } catch (error) {
      console.error("Error deleting notification:", error);
      const errorMessage = error.response?.data?.message || "Failed to delete notification";
      toast.error(errorMessage);
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewNotification = (notification) => {
    setViewNotification(notification);
    setOpenViewDialog(true);
  };

  const getAcademicYearLabel = (id) => {
    const year = academicYears.find(y => y.id === id);
    return year ? year.yearLabel : "N/A";
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
  const getStatusChip = (active) => {
    return active !== false ? (
      <Chip
        label="Active"
        size="small"
        sx={{
          bgcolor: "#E8F5E9",
          color: "#2E7D32",
          fontWeight: 600,
          fontSize: "0.65rem",
          height: 20,
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
          fontSize: "0.65rem",
          height: 20,
        }}
      />
    );
  };

  // Prepare table data for ReusableTable - ALL COLUMNS CENTER ALIGNED, NO BULLET
  const tableHeaders = [
    'S.No',
    'Title',
    'Description',
    'Date',
    'Academic Year',
    'Actions'
  ];
  
  const tableRows = notifications.map((notification, index) => {
    // Title - CENTER ALIGNED (no bullet)
    const titleDisplay = (
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Typography
          sx={{
            color: "#1E3A8A",
            fontWeight: 600,
            fontSize: "0.95rem",
            "&:hover": { textDecoration: "underline", cursor: "pointer" },
          }}
          onClick={() => handleViewNotification(notification)}
        >
          {notification.title}
        </Typography>
      </Box>
    );

    // Description - CENTER ALIGNED with tooltip for long text
    const descriptionDisplay = (
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Tooltip title={notification.description || "-"}>
          <Typography
            variant="body2"
            sx={{
              maxWidth: 250,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              textAlign: "center",
            }}
          >
            {notification.description || "-"}
          </Typography>
        </Tooltip>
      </Box>
    );

    // Date with icon - CENTER ALIGNED
    const dateDisplay = (
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5 }}>
        <Event sx={{ fontSize: 14, color: "#6B7280" }} />
        <Typography variant="body2">{formatDate(notification.date)}</Typography>
      </Box>
    );

    // Academic year with icon - CENTER ALIGNED
    const academicYearDisplay = (
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5 }}>
        <CalendarToday sx={{ fontSize: 14, color: "#6B7280" }} />
        <Typography variant="body2">{getAcademicYearLabel(notification.academicYearId)}</Typography>
      </Box>
    );

    // Actions - CENTER ALIGNED
    const actions = (
      <Box sx={{ display: "flex", justifyContent: "center", gap: 0.5 }}>
        <Tooltip title="View">
          <IconButton
            size="small"
            onClick={() => handleViewNotification(notification)}
            sx={{ color: "#8B5CF6", p: 0.5 }}
          >
            <Visibility fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Edit">
          <IconButton
            size="small"
            onClick={() => handleOpenDialog(notification)}
            sx={{ color: "#1E293B", p: 0.5 }}
          >
            <Edit fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton
            size="small"
            onClick={() => handleDeleteNotification(notification.id)}
            sx={{ color: "#EF4444", p: 0.5 }}
          >
            <Delete fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    );

    return [
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        {index + 1}
      </Box>,
      titleDisplay,
      descriptionDisplay,
      dateDisplay,
      academicYearDisplay,
      actions
    ];
  });

  return (
    <Box sx={{ bgcolor: "#f5f7fa", minHeight: "100vh", py: 4 }}>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <PageHeader title="NOTIFICATIONS" subtitle="Manage college notifications" />

      <Box sx={{ px: { xs: 2, md: 4 } }}>
        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            border: "1px solid #E8ECF1",
            p: { xs: 2, md: 4 },
          }}
        >
          {/* Title bar */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              pb: 2,
              mb: 3,
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Box>
              <Typography
                variant="h4"
                sx={{ fontWeight: 800, color: "#1E293B", fontSize: { xs: "1.5rem", md: "2rem" } }}
              >
                Notification 
              </Typography>

            </Box>
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
              Create Notification
            </Button>
          </Box>

          {/* Table using ReusableTable */}
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
              <CircularProgress />
            </Box>
          ) : notifications.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 6 }}>
              <Notifications sx={{ fontSize: 56, color: "#D1D5DB" }} />
              <Typography variant="h6" sx={{ color: "#6B7280", mt: 2 }}>
                No notifications found
              </Typography>
              <Typography variant="body2" sx={{ color: "#9CA3AF" }}>
                Create a new notification to get started
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

      {/* Create/Edit Notification Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>
          {editingNotification ? "Edit Notification" : "Create New Notification"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            {/* Image Upload Section */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="caption" sx={{ color: "#6B7280", fontWeight: 600, display: "block", mb: 1 }}>
                Notification Image (Optional)
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                {imagePreview ? (
                  <Box sx={{ position: "relative", width: 80, height: 80, flexShrink: 0 }}>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: 8,
                        border: "2px solid #E8ECF1",
                      }}
                    />
                    {!isUploadingImage && (
                      <IconButton
                        size="small"
                        onClick={handleRemoveImage}
                        sx={{
                          position: "absolute",
                          top: -8,
                          right: -8,
                          bgcolor: "#EF4444",
                          color: "#fff",
                          "&:hover": { bgcolor: "#DC2626" },
                          width: 20,
                          height: 20,
                          "& .MuiSvgIcon-root": { fontSize: 14 },
                        }}
                      >
                        <Close />
                      </IconButton>
                    )}
                  </Box>
                ) : (
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      bgcolor: "#F3F4F6",
                      border: "2px dashed #D1D5DB",
                    }}
                  >
                    <ImageIcon sx={{ fontSize: 32, color: "#9CA3AF" }} />
                  </Avatar>
                )}
                <Box sx={{ flex: 1 }}>
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<CloudUpload />}
                    disabled={isUploadingImage}
                    fullWidth
                    sx={{
                      borderRadius: 2,
                      textTransform: "none",
                      fontWeight: 600,
                      borderColor: "#D1D5DB",
                      color: "#6B7280",
                      "&:hover": {
                        borderColor: "#1565C0",
                        color: "#1565C0",
                      },
                    }}
                  >
                    {isUploadingImage ? "Uploading..." : "Upload Image"}
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUploadingImage}
                    />
                  </Button>
                  <Typography variant="caption" sx={{ color: "#9CA3AF", display: "block", mt: 0.5 }}>
                    JPG, PNG, GIF • Max 5MB
                  </Typography>
                  {isUploadingImage && (
                    <Box sx={{ mt: 1 }}>
                      <CircularProgress size={20} />
                      <Typography variant="caption" sx={{ ml: 1, color: "#1565C0" }}>
                        Uploading to Cloudinary...
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>

            <TextField
              autoFocus
              margin="dense"
              label="Notification Title"
              name="title"
              fullWidth
              value={formData.title}
              onChange={handleFormChange}
              {...fieldProps("title")}
              sx={{ mb: 2 }}
            />

            <Typography
              variant="caption"
              sx={{ color: "#6B7280", fontWeight: 600, display: "block", mb: 0.5, ml: 0.25 }}
            >
              Date
            </Typography>
            <TextField
              margin="dense"
              name="date"
              fullWidth
              type="date"
              value={formData.date}
              onChange={handleFormChange}
              {...fieldProps("date")}
              sx={{ mt: 0, mb: 2 }}
            />

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Academic Year</InputLabel>
              <Select
                name="academicYearId"
                value={formData.academicYearId}
                onChange={handleFormChange}
                label="Academic Year"
                error={!!formErrors.academicYearId}
              >
                <MenuItem value="">Select Academic Year</MenuItem>
                {academicYears.map((year) => (
                  <MenuItem key={year.id} value={year.id}>
                    {year.yearLabel}
                  </MenuItem>
                ))}
              </Select>
              {formErrors.academicYearId && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                  {formErrors.academicYearId}
                </Typography>
              )}
            </FormControl>

            <TextField
              margin="dense"
              label="Description"
              name="description"
              fullWidth
              multiline
              rows={4}
              value={formData.description}
              onChange={handleFormChange}
              {...fieldProps("description")}
              placeholder="Enter notification details..."
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={handleCloseDialog} disabled={loading || isUploadingImage}>
            Cancel
          </Button>
          <Button
            onClick={handleSaveNotification}
            variant="contained"
            disabled={loading || isUploadingImage}
            sx={{ bgcolor: "#1E293B" }}
          >
            {loading ? <CircularProgress size={24} /> : (editingNotification ? "Update" : "Create")}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Notification Dialog */}
      <Dialog
        open={openViewDialog}
        onClose={() => setOpenViewDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        {viewNotification && (
          <>
            <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="h6" fontWeight={700}>
                  Notification Details
                </Typography>
                <IconButton onClick={() => setOpenViewDialog(false)} size="small">
                  <Close />
                </IconButton>
              </Box>
            </DialogTitle>
            <Divider />
            <DialogContent>
              <Box>
                {viewNotification.imageUrl && (
                  <Box sx={{ mb: 3 }}>
                    <img
                      src={viewNotification.imageUrl}
                      alt={viewNotification.title}
                      style={{
                        width: "100%",
                        maxHeight: 200,
                        objectFit: "cover",
                        borderRadius: 8,
                        border: "1px solid #E8ECF1",
                      }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = "none";
                      }}
                    />
                  </Box>
                )}

                <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                  {viewNotification.title}
                </Typography>

                <Divider sx={{ mb: 2 }} />

                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Box>
                    <Typography variant="caption" sx={{ color: "#9CA3AF", fontWeight: 600, display: "block", mb: 0.5 }}>
                      DESCRIPTION
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#1A1A1A" }}>
                      {viewNotification.description}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                    <Box>
                      <Typography variant="caption" sx={{ color: "#9CA3AF", fontWeight: 600, display: "block", mb: 0.5 }}>
                        DATE
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Event sx={{ fontSize: 18, color: "#6B7280" }} />
                        <Typography variant="body2" sx={{ color: "#1A1A1A", fontWeight: 500 }}>
                          {formatDate(viewNotification.date)}
                        </Typography>
                      </Box>
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: "#9CA3AF", fontWeight: 600, display: "block", mb: 0.5 }}>
                        ACADEMIC YEAR
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <CalendarToday sx={{ fontSize: 18, color: "#6B7280" }} />
                        <Typography variant="body2" sx={{ color: "#1A1A1A", fontWeight: 500 }}>
                          {getAcademicYearLabel(viewNotification.academicYearId)}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Box>
                    <Typography variant="caption" sx={{ color: "#9CA3AF", fontWeight: 600, display: "block", mb: 0.5 }}>
                      POSTED ON
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#6B7280" }}>
                      {formatDate(viewNotification.createdAt)}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 3, pt: 1 }}>
              <Button onClick={() => setOpenViewDialog(false)}>Close</Button>
              <Button
                onClick={() => {
                  setOpenViewDialog(false);
                  handleOpenDialog(viewNotification);
                }}
                variant="contained"
                sx={{ bgcolor: "#1E293B" }}
                startIcon={<Edit />}
              >
                Edit
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default NotificationPage;