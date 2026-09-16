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
  MenuItem,
  Chip,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery,
  alpha,
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  Person,
  School,
  Work,
  Verified,
} from "@mui/icons-material";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import instance from "../AxiosInstance/AxiosInstance";
import PageHeader from "../UploadModules/Pageheader";
import ReusableTable from "../Common/Reusabletable";
import useFormFieldErrors from "../Common/useFormFieldErrors";

// Fields tracked for inline backend validation errors on this form
const SCHEME_FIELD_NAMES = ["staffId", "position"];

const NaanMudhalvan = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  
  // States
  const [schemes, setSchemes] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingStaff, setFetchingStaff] = useState(false);
  
  // Dialog states
  const [openDialog, setOpenDialog] = useState(false);
  const [editingScheme, setEditingScheme] = useState(null);
  const [formData, setFormData] = useState({
    staffId: "",
    position: "",
  });

  // Reusable field-error handling (parses backend VALIDATION errors too)
  const {
    formErrors,
    clearFieldErrors,
    clearFieldError,
    setFieldErrors,
    applyBackendFieldErrors,
    fieldProps,
  } = useFormFieldErrors(SCHEME_FIELD_NAMES);

  // Delete dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [schemeToDelete, setSchemeToDelete] = useState(null);

  // Fetch schemes
  const fetchSchemes = async () => {
    setLoading(true);
    try {
      const response = await instance.get("/naan-mudhalvan-scheme");
      console.log("Schemes:", response.data);
      setSchemes(response.data);
    } catch (error) {
      console.error("Error fetching schemes:", error);
      const errorMsg = error.response?.data?.message || "Failed to fetch schemes";
      toast.error("❌ " + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Fetch staff list
  const fetchStaff = async () => {
    setFetchingStaff(true);
    try {
      const response = await instance.get("/staff");
      console.log("Staff List:", response.data);
      setStaffList(response.data);
    } catch (error) {
      console.error("Error fetching staff:", error);
      toast.error("❌ Failed to fetch staff list");
    } finally {
      setFetchingStaff(false);
    }
  };

  useEffect(() => {
    fetchSchemes();
    fetchStaff();
  }, []);

  // Get staff name by ID
  const getStaffName = (staffId) => {
    const staff = staffList.find(s => s.id === staffId);
    return staff ? staff.name : "Unknown";
  };

  // Get staff qualification by ID
  const getStaffQualification = (staffId) => {
    const staff = staffList.find(s => s.id === staffId);
    return staff ? staff.qualification : "—";
  };

  // Get staff image by ID
  const getStaffImage = (staffId) => {
    const staff = staffList.find(s => s.id === staffId);
    return staff ? staff.imageUrl : null;
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    clearFieldError(name); // Clear error for this field when user types
  };

  // Open dialog for create/edit
  const handleOpenDialog = (scheme = null) => {
    if (scheme) {
      setEditingScheme(scheme);
      setFormData({
        staffId: scheme.staffId || "",
        position: scheme.position || "",
      });
    } else {
      setEditingScheme(null);
      setFormData({
        staffId: "",
        position: "",
      });
    }
    clearFieldErrors(); // Clear any previous field errors
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingScheme(null);
    setFormData({
      staffId: "",
      position: "",
    });
    clearFieldErrors(); // Clear errors when closing
  };

  // Create scheme
  const handleCreate = async () => {
    setLoading(true);
    clearFieldErrors(); // Clear previous errors before API call

    try {
      const response = await instance.post("/naan-mudhalvan-scheme", {
        staffId: parseInt(formData.staffId),
        position: formData.position.trim(),
      });
      console.log("Created:", response.data);
      toast.success("✅ Scheme created successfully!");
      handleCloseDialog();
      fetchSchemes();
    } catch (error) {
      console.error("Create error:", error);
      const handledAsFieldErrors = applyBackendFieldErrors(error);
      if (!handledAsFieldErrors) {
        const errorMsg = error.response?.data?.message || "Failed to create scheme";
        toast.error("❌ " + errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  // Update scheme
  const handleUpdate = async () => {
    setLoading(true);
    clearFieldErrors(); // Clear previous errors before API call

    try {
      const response = await instance.put(`/naan-mudhalvan-scheme/${editingScheme.id}`, {
        staffId: parseInt(formData.staffId),
        position: formData.position.trim(),
      });
      console.log("Updated:", response.data);
      toast.success("✅ Scheme updated successfully!");
      handleCloseDialog();
      fetchSchemes();
    } catch (error) {
      console.error("Update error:", error);
      const handledAsFieldErrors = applyBackendFieldErrors(error);
      if (!handledAsFieldErrors) {
        const errorMsg = error.response?.data?.message || "Failed to update scheme";
        toast.error("❌ " + errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  // Delete scheme
  const handleDeleteClick = (scheme) => {
    setSchemeToDelete(scheme);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!schemeToDelete) return;
    
    try {
      await instance.delete(`/naan-mudhalvan-scheme/${schemeToDelete.id}`);
      toast.success(`✅ Scheme deleted successfully!`);
      setDeleteDialogOpen(false);
      setSchemeToDelete(null);
      fetchSchemes();
    } catch (error) {
      console.error("Delete error:", error);
      const errorMsg = error.response?.data?.message || "Failed to delete scheme";
      toast.error("❌ " + errorMsg);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSchemeToDelete(null);
  };

  // Prepare table data
  const tableHeaders = ["S.No", "Staff Name", "Position", "Qualification", "Academic Year", "Verified", "Actions"];
  
  const tableRows = schemes.map((scheme, index) => [
    index + 1,
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      {getStaffImage(scheme.staffId) ? (
        <img 
          src={getStaffImage(scheme.staffId)} 
          alt={getStaffName(scheme.staffId)}
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            objectFit: "cover",
          }}
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
      ) : (
        <Person sx={{ fontSize: 20, color: "#9CA3AF" }} />
      )}
      {getStaffName(scheme.staffId)}
    </Box>,
    scheme.position || "N/A",
    getStaffQualification(scheme.staffId),
    scheme.academicYear || "N/A",
    scheme.verified ? (
      <Chip
        icon={<Verified sx={{ fontSize: 14 }} />}
        label="Verified"
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
        label="Not Verified"
        size="small"
        sx={{
          bgcolor: "#FFEBEE",
          color: "#C62828",
          fontWeight: 600,
          fontSize: "0.7rem",
        }}
      />
    ),
    <Box sx={{ display: "flex", gap: 0.5, justifyContent: "center" }}>
      <Tooltip title="Edit">
        <IconButton
          size="small"
          onClick={() => handleOpenDialog(scheme)}
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
          onClick={() => handleDeleteClick(scheme)}
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
        title="NAAN MUDHALVAN SCHEME" 
        subtitle="Manage Naan Mudhalvan Scheme coordinators" 
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
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Typography
              variant="h4"
              sx={{ fontWeight: 800, color: "#1E293B", fontSize: { xs: "1.5rem", md: "2rem" } }}
            >
              Scheme Coordinators
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => handleOpenDialog()}
              sx={{
                bgcolor: "#1E293B",
                "&:hover": { bgcolor: "#0F172A" },
                textTransform: "none",
                fontWeight: 600,
                flexShrink: 0,
              }}
            >
              Add Coordinator
            </Button>
          </Box>

          {/* Scheme List - Table View */}
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
              <CircularProgress />
            </Box>
          ) : schemes.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 6 }}>
              <School sx={{ fontSize: 56, color: "#D1D5DB" }} />
              <Typography variant="h6" sx={{ color: "#6B7280", mt: 2 }}>
                No scheme coordinators found
              </Typography>
              <Typography variant="body2" sx={{ color: "#9CA3AF" }}>
                Add a coordinator to get started
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
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>
          {editingScheme ? "Edit Scheme Coordinator" : "Add New Scheme Coordinator"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Select Staff</InputLabel>
              <Select
                name="staffId"
                value={formData.staffId}
                onChange={handleChange}
                label="Select Staff"
                error={!!formErrors.staffId}
                disabled={fetchingStaff}
              >
                <MenuItem value="">Select Staff Member</MenuItem>
                {staffList.map((staff) => (
                  <MenuItem key={staff.id} value={staff.id}>
                    {staff.name} - {staff.designation}
                  </MenuItem>
                ))}
              </Select>
              {formErrors.staffId && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                  {formErrors.staffId}
                </Typography>
              )}
            </FormControl>

            <TextField
              fullWidth
              label="Position"
              name="position"
              value={formData.position}
              onChange={handleChange}
              placeholder="e.g., SPOC, SENIOR CONSULTANT, COORDINATOR"
              {...fieldProps("position")}
              sx={{ mb: 2 }}
            />

            {editingScheme && (
              <Box sx={{ mt: 1, p: 1.5, bgcolor: "#FFF3E0", borderRadius: 2 }}>
                <Typography variant="caption" sx={{ color: "#EF6C00", display: "flex", alignItems: "center", gap: 1 }}>
                  <School sx={{ fontSize: 14 }} />
                  Editing coordinator for: {getStaffName(editingScheme.staffId)}
                </Typography>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={handleCloseDialog} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={editingScheme ? handleUpdate : handleCreate}
            variant="contained"
            disabled={loading}
            sx={{ bgcolor: "#1E293B" }}
          >
            {loading ? <CircularProgress size={24} /> : (editingScheme ? "Update" : "Create")}
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
          Delete Scheme Coordinator
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: "#6B7280" }}>
            Are you sure you want to delete the coordinator for{" "}
            <strong>{schemeToDelete ? getStaffName(schemeToDelete.staffId) : ""}</strong>?
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

export default NaanMudhalvan;