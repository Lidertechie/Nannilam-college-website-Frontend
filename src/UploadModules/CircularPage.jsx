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
  Divider,
  Tabs,
  Tab,
  CircularProgress,
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
  Gavel,
  Announcement,
  Description,
  CalendarToday,
  Close,
  FiberManualRecord,
  Visibility,
  InsertDriveFile,
  CloudUpload,
} from "@mui/icons-material";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PageHeader from "./Pageheader";
import instance from "../AxiosInstance/AxiosInstance";
import ReusableTable from "../Common/Reusabletable";
import useFormFieldErrors from "../Common/useFormFieldErrors";
import { uploadFileToCloudinary } from "../Common/Fileupload";

// Fields tracked for inline backend validation errors on this form
const CIRCULAR_FIELD_NAMES = ["circularTitle", "date", "description", "academicYearId"];

const CircularPage = () => {
  const [circulars, setCirculars] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingYears, setFetchingYears] = useState(false);

  // Tab state
  const [selectedTab, setSelectedTab] = useState("all");

  // Dialog states
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCircular, setEditingCircular] = useState(null);
  const [formData, setFormData] = useState({
    circularTitle: "",
    date: "",
    description: "",
    academicYearId: "",
  });

  // File upload state
  const [selectedFile, setSelectedFile] = useState(null);
  const [existingDocumentUrl, setExistingDocumentUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  // Reusable field-error handling (parses backend VALIDATION errors too)
  const {
    formErrors,
    clearFieldErrors,
    clearFieldError,
    setFieldErrors,
    applyBackendFieldErrors,
    fieldProps,
  } = useFormFieldErrors(CIRCULAR_FIELD_NAMES);

  // View dialog states
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [viewCircular, setViewCircular] = useState(null);

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
    } finally {
      setFetchingYears(false);
    }
  };

  // Fetch circulars
  const fetchCirculars = async () => {
    setLoading(true);
    try {
      const response = await instance.get("/circulars");
      console.log("Circulars:", response.data);
      setCirculars(response.data);
    } catch (error) {
      console.error("Error fetching circulars:", error);
      const errorMsg = error.response?.data?.message || "Failed to fetch circulars";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCirculars();
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

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
  };

  const handleRemoveSelectedFile = () => {
    setSelectedFile(null);
  };

  // Handle CRUD
  const handleOpenDialog = (circular = null) => {
    if (circular) {
      setEditingCircular(circular);
      setFormData({
        circularTitle: circular.circularTitle || "",
        date: circular.date ? circular.date.split('T')[0] : "",
        description: circular.description || "",
        academicYearId: circular.academicYearId || "",
      });
      setExistingDocumentUrl(circular.documentUrl || "");
    } else {
      setEditingCircular(null);
      setFormData({
        circularTitle: "",
        date: "",
        description: "",
        academicYearId: "",
      });
      setExistingDocumentUrl("");
    }
    setSelectedFile(null);
    clearFieldErrors(); // Clear any previous field errors
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCircular(null);
    setFormData({
      circularTitle: "",
      date: "",
      description: "",
      academicYearId: "",
    });
    setSelectedFile(null);
    setExistingDocumentUrl("");
    clearFieldErrors(); // Clear errors when closing
  };

  const handleSaveCircular = async () => {
    setLoading(true);
    clearFieldErrors(); // Clear previous errors before API call

    try {
      // Upload file to Cloudinary first (if a new file was selected)
      let documentUrl = existingDocumentUrl || "";
      if (selectedFile) {
        setUploading(true);
        try {
          documentUrl = await uploadFileToCloudinary(selectedFile);
        } catch (uploadError) {
          console.error("Error uploading document:", uploadError);
          toast.error(uploadError.message || "Failed to upload document");
          setUploading(false);
          setLoading(false);
          return;
        }
        setUploading(false);
      }

      const circularData = {
        circularTitle: formData.circularTitle,
        date: formData.date,
        description: formData.description,
        academicYearId: parseInt(formData.academicYearId),
        documentUrl: documentUrl,
      };

      let response;
      if (editingCircular) {
        // Update circular
        response = await instance.put(`/circulars/${editingCircular.id}`, circularData);
        console.log("Updated:", response.data);
        toast.success("Circular updated successfully!");
      } else {
        // Create circular
        response = await instance.post("/circulars", circularData);
        console.log("Created:", response.data);
        toast.success("Circular created successfully!");
      }
      handleCloseDialog();
      await fetchCirculars(); // Refresh list
    } catch (error) {
      console.error("Error saving circular:", error);
      const handledAsFieldErrors = applyBackendFieldErrors(error);
      if (!handledAsFieldErrors) {
        const errorMsg = error.response?.data?.message || "Failed to save circular";
        toast.error(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCircular = async (id) => {
    if (!window.confirm("Are you sure you want to delete this circular?")) return;

    setLoading(true);
    try {
      await instance.delete(`/circulars/${id}`);
      toast.success("Circular deleted successfully!");
      await fetchCirculars();
    } catch (error) {
      console.error("Error deleting circular:", error);
      const errorMsg = error.response?.data?.message || "Failed to delete circular";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleViewCircular = (circular) => {
    setViewCircular(circular);
    setOpenViewDialog(true);
  };

  const getAcademicYearLabel = (id) => {
    // First try to get from the circular's academicYearLabel if available
    const circular = circulars.find(c => c.id === id);
    if (circular && circular.academicYearLabel) {
      return circular.academicYearLabel;
    }
    // Fallback to academicYears list
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

  // Prepare table data for ReusableTable - ALL FIELDS CENTER ALIGNED, NO BULLET
  const tableHeaders = [
    'S.No',
    'Title',
    'Description',
    'Date',
    'Academic Year',
    'Document',
    'Actions'
  ];  
  
  const tableRows = circulars.map((circular, index) => {
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
          onClick={() => handleViewCircular(circular)}
        >
          {circular.circularTitle}
        </Typography>
      </Box>
    );

    // Description - CENTER ALIGNED with tooltip for long text
    const descriptionDisplay = (
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Tooltip title={circular.description || "-"}>
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
            {circular.description || "-"}
          </Typography>
        </Tooltip>
      </Box>
    );

    // Date with icon - CENTER ALIGNED
    const dateDisplay = (
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5 }}>
        <Event sx={{ fontSize: 14, color: "#6B7280" }} />
        <Typography variant="body2">{formatDate(circular.date)}</Typography>
      </Box>
    );

    // Academic year with icon - CENTER ALIGNED
    const academicYearDisplay = (
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5 }}>
        <CalendarToday sx={{ fontSize: 14, color: "#6B7280" }} />
        <Typography variant="body2">{circular.academicYearLabel || getAcademicYearLabel(circular.academicYearId)}</Typography>
      </Box>
    );

    // Document link - CENTER ALIGNED
    const documentDisplay = (
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        {circular.documentUrl ? (
          <Tooltip title="View Document">
            <IconButton
              size="small"
              onClick={() => window.open(circular.documentUrl, '_blank')}
              sx={{ color: "#2563EB" }}
            >
              <InsertDriveFile fontSize="small" />
            </IconButton>
          </Tooltip>
        ) : (
          <Typography variant="caption" sx={{ color: "#9CA3AF" }}>No file</Typography>
        )}
      </Box>
    );

    // Actions - CENTER ALIGNED
    const actions = (
      <Box sx={{ display: "flex", justifyContent: "center", gap: 0.5 }}>
        <Tooltip title="View">
          <IconButton
            size="small"
            onClick={() => handleViewCircular(circular)}
            sx={{ color: "#8B5CF6", p: 0.5 }}
          >
            <Visibility fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Edit">
          <IconButton
            size="small"
            onClick={() => handleOpenDialog(circular)}
            sx={{ color: "#1E293B", p: 0.5 }}
          >
            <Edit fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton
            size="small"
            onClick={() => handleDeleteCircular(circular.id)}
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
      documentDisplay,
      actions
    ];
  });

  return (
    <Box sx={{ bgcolor: "#f5f7fa", minHeight: "100vh", py: 4 }}>
      <PageHeader title="CIRCULARS" subtitle="Manage college circulars" />

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
                Circular
              </Typography>
              <Typography variant="body2" sx={{ color: "#6B7280", mt: 0.5 }}>
                {circulars.length} {circulars.length === 1 ? 'circular' : 'circulars'} found
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
              Create Circular
            </Button>
          </Box>

          {/* Table using ReusableTable */}
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
              <CircularProgress />
            </Box>
          ) : circulars.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 6 }}>
              <Notifications sx={{ fontSize: 56, color: "#D1D5DB" }} />
              <Typography variant="h6" sx={{ color: "#6B7280", mt: 2 }}>
                No circulars found
              </Typography>
              <Typography variant="body2" sx={{ color: "#9CA3AF" }}>
                Create a new circular to get started
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

      {/* Create/Edit Circular Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>
          {editingCircular ? "Edit Circular" : "Create New Circular"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              autoFocus
              margin="dense"
              label="Circular Title"
              name="circularTitle"
              fullWidth
              value={formData.circularTitle}
              onChange={handleFormChange}
              {...fieldProps("circularTitle")}
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
              placeholder="Enter circular details..."
              sx={{ mb: 2 }}
            />

            {/* Document Upload */}
            <Typography
              variant="caption"
              sx={{ color: "#6B7280", fontWeight: 600, display: "block", mb: 0.5, ml: 0.25 }}
            >
              Document (PDF, JPEG, PNG, or Word — max 10MB)
            </Typography>
            <Box
              sx={{
                border: "1px dashed #CBD5E1",
                borderRadius: 2,
                p: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 1,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, overflow: "hidden" }}>
                <InsertDriveFile sx={{ color: "#6B7280" }} />
                <Typography
                  variant="body2"
                  sx={{
                    color: "#374151",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    maxWidth: 220,
                  }}
                >
                  {selectedFile
                    ? selectedFile.name
                    : existingDocumentUrl
                    ? "Existing document attached"
                    : "No file selected"}
                </Typography>
              </Box>

              <Stack direction="row" spacing={1}>
                {existingDocumentUrl && !selectedFile && (
                  <Button
                    size="small"
                    startIcon={<Visibility />}
                    onClick={() => window.open(existingDocumentUrl, "_blank")}
                    sx={{ textTransform: "none" }}
                  >
                    View
                  </Button>
                )}
                {selectedFile && (
                  <Button
                    size="small"
                    color="error"
                    onClick={handleRemoveSelectedFile}
                    sx={{ textTransform: "none" }}
                  >
                    Remove
                  </Button>
                )}
                <Button
                  size="small"
                  component="label"
                  variant="outlined"
                  startIcon={<CloudUpload />}
                  sx={{ textTransform: "none" }}
                >
                  {selectedFile || existingDocumentUrl ? "Replace" : "Upload"}
                  <input
                    type="file"
                    hidden
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={handleFileChange}
                  />
                </Button>
              </Stack>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleSaveCircular} 
            variant="contained" 
            disabled={loading || uploading}
            sx={{ bgcolor: "#1E293B" }}
          >
            {loading || uploading ? (
              <CircularProgress size={24} />
            ) : editingCircular ? (
              "Update"
            ) : (
              "Create"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Circular Dialog */}
      <Dialog
        open={openViewDialog}
        onClose={() => setOpenViewDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        {viewCircular && (
          <>
            <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="h6" fontWeight={700}>
                  Circular Details
                </Typography>
                <IconButton onClick={() => setOpenViewDialog(false)} size="small">
                  <Close />
                </IconButton>
              </Box>
            </DialogTitle>
            <Divider />
            <DialogContent>
              <Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                  {getStatusChip(viewCircular.active)}
                </Box>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                  {viewCircular.circularTitle}
                </Typography>

                <Divider sx={{ mb: 2 }} />

                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Box>
                    <Typography variant="caption" sx={{ color: "#9CA3AF", fontWeight: 600, display: "block", mb: 0.5 }}>
                      DESCRIPTION
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#1A1A1A" }}>
                      {viewCircular.description}
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
                          {formatDate(viewCircular.date)}
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
                          {viewCircular.academicYearLabel || getAcademicYearLabel(viewCircular.academicYearId)}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  {viewCircular.documentUrl && (
                    <Box>
                      <Typography variant="caption" sx={{ color: "#9CA3AF", fontWeight: 600, display: "block", mb: 0.5 }}>
                        DOCUMENT
                      </Typography>
                      <Button
                        variant="outlined"
                        startIcon={<InsertDriveFile />}
                        onClick={() => window.open(viewCircular.documentUrl, '_blank')}
                        sx={{ textTransform: 'none' }}
                      >
                        View Document
                      </Button>
                    </Box>
                  )}

                  <Box>
                    <Typography variant="caption" sx={{ color: "#9CA3AF", fontWeight: 600, display: "block", mb: 0.5 }}>
                      POSTED ON
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#6B7280" }}>
                      {formatDate(viewCircular.createdAt)}
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
                  handleOpenDialog(viewCircular);
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

      {/* Toast Container - Bottom Right */}
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

export default CircularPage;