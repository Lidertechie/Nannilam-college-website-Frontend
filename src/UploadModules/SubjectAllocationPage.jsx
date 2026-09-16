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
  Chip,
  Stack,
  Divider,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  Alert,
  Snackbar,
  Grid,
  InputAdornment,
  Avatar,
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  Refresh,
  School,
  Person,
  Book,
  Close,
  Visibility,
  CheckCircle,
  Assignment,
  PersonAdd,
  Subject,
} from "@mui/icons-material";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PageHeader from "./Pageheader";
import instance from "../AxiosInstance/AxiosInstance";
import ReusableTable from "../Common/Reusabletable";
import useFormFieldErrors from "../Common/useFormFieldErrors";

// Fields tracked for inline backend validation errors on this form
const ALLOCATION_FIELD_NAMES = ["subjectId", "staffId"];

const SubjectAllocationPage = () => {
  const [allocations, setAllocations] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);

  // Dialog states
  const [openDialog, setOpenDialog] = useState(false);
  const [editingAllocation, setEditingAllocation] = useState(null);
  const [formData, setFormData] = useState({
    subjectId: "",
    staffId: "",
  });

  // Reusable field-error handling (parses backend VALIDATION errors too)
  const {
    formErrors,
    clearFieldErrors,
    clearFieldError,
    setFieldErrors,
    applyBackendFieldErrors,
    fieldProps,
  } = useFormFieldErrors(ALLOCATION_FIELD_NAMES);

  // View dialog states
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [viewAllocation, setViewAllocation] = useState(null);

  // Snackbar states
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  // Fetch subjects
  const fetchSubjects = async () => {
    try {
      const response = await instance.get("/subjects/all");
      console.log("Subjects:", response.data);
      setSubjects(response.data);
    } catch (error) {
      console.error("Error fetching subjects:", error);
      toast.error("Failed to fetch subjects");
    }
  };

  // Fetch staff
  const fetchStaff = async () => {
    try {
      const response = await instance.get("/staff");
      console.log("Staff:", response.data);
      setStaff(response.data);
    } catch (error) {
      console.error("Error fetching staff:", error);
      toast.error("Failed to fetch staff");
    }
  };

  // Fetch allocations
  const fetchAllocations = async () => {
    setLoading(true);
    try {
      const response = await instance.get("/subject-allocations");
      console.log("Allocations:", response.data);
      setAllocations(response.data);
    } catch (error) {
      console.error("Error fetching allocations:", error);
      const errorMsg = error.response?.data?.message || "Failed to fetch allocations";
      toast.error(errorMsg);
      setSnackbar({
        open: true,
        message: errorMsg,
        severity: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllocations();
    fetchSubjects();
    fetchStaff();
  }, []);

  // Handle CRUD operations
  const handleOpenDialog = (allocation = null) => {
    if (allocation) {
      setEditingAllocation(allocation);
      setFormData({
        subjectId: allocation.subjectId || "",
        staffId: allocation.staffId || "",
      });
    } else {
      setEditingAllocation(null);
      setFormData({
        subjectId: "",
        staffId: "",
      });
    }
    clearFieldErrors(); // Clear any previous field errors
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingAllocation(null);
    setFormData({
      subjectId: "",
      staffId: "",
    });
    clearFieldErrors(); // Clear errors when closing
  };

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    clearFieldError(name); // Clear error for this field when user types
  };

  const handleSaveAllocation = async () => {
    setSubmitting(true);
    clearFieldErrors(); // Clear previous errors before API call

    try {
      const allocationData = {
        subjectId: parseInt(formData.subjectId),
        staffId: parseInt(formData.staffId),
      };

      let response;
      if (editingAllocation) {
        // Update allocation
        response = await instance.put(`/subject-allocations/${editingAllocation.id}`, allocationData);
        console.log("Updated:", response.data);
        toast.success("Allocation updated successfully!");
      } else {
        // Create allocation
        response = await instance.post("/subject-allocations", allocationData);
        console.log("Created:", response.data);
        toast.success("Allocation created successfully!");
      }
      handleCloseDialog();
      await fetchAllocations();
    } catch (error) {
      console.error("Error saving allocation:", error);
      const handledAsFieldErrors = applyBackendFieldErrors(error);
      if (!handledAsFieldErrors) {
        const errorMsg = error.response?.data?.message || "Failed to save allocation";
        toast.error(errorMsg);
        setSnackbar({
          open: true,
          message: errorMsg,
          severity: "error"
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAllocation = async (id) => {
    if (!window.confirm("Are you sure you want to delete this allocation?")) return;

    setLoading(true);
    try {
      await instance.delete(`/subject-allocations/${id}`);
      toast.success("Allocation deleted successfully!");
      await fetchAllocations();
    } catch (error) {
      console.error("Error deleting allocation:", error);
      const errorMsg = error.response?.data?.message || "Failed to delete allocation";
      toast.error(errorMsg);
      setSnackbar({
        open: true,
        message: errorMsg,
        severity: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewAllocation = (allocation) => {
    setViewAllocation(allocation);
    setOpenViewDialog(true);
  };

  // Get subject name by ID
  const getSubjectName = (subjectId) => {
    const subject = subjects.find(s => s.id === subjectId);
    return subject ? subject.subjectName : "N/A";
  };

  // Get staff name by ID
  const getStaffName = (staffId) => {
    const staffMember = staff.find(s => s.id === staffId);
    return staffMember ? staffMember.name : "N/A";
  };

  // Get staff designation by ID
  const getStaffDesignation = (staffId) => {
    const staffMember = staff.find(s => s.id === staffId);
    return staffMember ? staffMember.designation : "N/A";
  };

  // Get staff image by ID
  const getStaffImage = (staffId) => {
    const staffMember = staff.find(s => s.id === staffId);
    return staffMember ? staffMember.imageUrl : null;
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

  // Prepare table data for ReusableTable
  const tableHeaders = ['S.No', 'Subject', 'Staff', 'Designation', 'Status', 'Actions'];

  const tableRows = allocations.map((allocation, index) => {
    // Subject name with icon
    const subjectDisplay = (
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
        <Subject sx={{ fontSize: 18, color: "#1565C0" }} />
        <Typography
          sx={{
            fontWeight: 600,
            color: "#1E293B",
          }}
        >
          {allocation.subjectName || getSubjectName(allocation.subjectId)}
        </Typography>
      </Box>
    );

    // Staff with avatar
    const staffDisplay = (
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
        <Avatar
          src={allocation.staffImage || getStaffImage(allocation.staffId)}
          sx={{
            width: 32,
            height: 32,
            bgcolor: "#E3F2FD",
            color: "#1565C0",
            fontSize: "0.75rem",
          }}
        >
          {allocation.staffName ? allocation.staffName.charAt(0).toUpperCase() : "S"}
        </Avatar>
        <Typography variant="body2" fontWeight={500}>
          {allocation.staffName || getStaffName(allocation.staffId)}
        </Typography>
      </Box>
    );

    // Designation
    const designationDisplay = (
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Chip
          label={allocation.staffDesignation || getStaffDesignation(allocation.staffId)}
          size="small"
          sx={{
            bgcolor: "#FFF3E0",
            color: "#EF6C00",
            fontWeight: 600,
            fontSize: "0.65rem",
            height: 24,
          }}
        />
      </Box>
    );

    // Status
    const statusDisplay = (
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        {getStatusChip(allocation.active)}
      </Box>
    );

    // Actions
    const actions = (
      <Box sx={{ display: "flex", justifyContent: "center", gap: 0.5 }}>
        <Tooltip title="View">
          <IconButton
            size="small"
            onClick={() => handleViewAllocation(allocation)}
            sx={{ color: "#8B5CF6", p: 0.5 }}
          >
            <Visibility fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Edit">
          <IconButton
            size="small"
            onClick={() => handleOpenDialog(allocation)}
            sx={{ color: "#1E293B", p: 0.5 }}
          >
            <Edit fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton
            size="small"
            onClick={() => handleDeleteAllocation(allocation.id)}
            sx={{ color: "#EF4444", p: 0.5 }}
          >
            <Delete fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    );

    return [
      <Box key={`${allocation.id}-index`} sx={{ display: "flex", justifyContent: "center" }}>
        {index + 1}
      </Box>,
      <Box key={`${allocation.id}-subject`}>
        {subjectDisplay}
      </Box>,
      <Box key={`${allocation.id}-staff`}>
        {staffDisplay}
      </Box>,
      <Box key={`${allocation.id}-designation`}>
        {designationDisplay}
      </Box>,
      <Box key={`${allocation.id}-status`}>
        {statusDisplay}
      </Box>,
      <Box key={`${allocation.id}-actions`}>
        {actions}
      </Box>
    ];
  });

  return (
    <Box sx={{ bgcolor: "#f5f7fa", minHeight: "100vh", py: 4 }}>
      <PageHeader title="SUBJECT ALLOCATIONS" subtitle="Assign subjects to staff members" />

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
              borderBottom: "3px solid #1E293B",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Box>
              <Typography
                variant="h4"
                sx={{ fontWeight: 800, color: "#1E293B", fontSize: { xs: "1.5rem", md: "2rem" } }}
              >
                Subject Allocations
              </Typography>
              <Typography variant="body2" sx={{ color: "#6B7280", mt: 0.5 }}>
                {allocations.length} {allocations.length === 1 ? 'allocation' : 'allocations'} found
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={fetchAllocations}
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
                Refresh
              </Button>
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
                }}
              >
                Create Allocation
              </Button>
            </Box>
          </Box>

          {/* Table using ReusableTable */}
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
              <CircularProgress />
            </Box>
          ) : allocations.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 6 }}>
              <Assignment sx={{ fontSize: 56, color: "#D1D5DB" }} />
              <Typography variant="h6" sx={{ color: "#6B7280", mt: 2 }}>
                No subject allocations found
              </Typography>
              <Typography variant="body2" sx={{ color: "#9CA3AF" }}>
                Allocate a subject to a staff member to get started
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => handleOpenDialog()}
                sx={{ mt: 2 }}
              >
                Create First Allocation
              </Button>
            </Box>
          ) : (
            <ReusableTable
              headers={tableHeaders}
              rows={tableRows}
            />
          )}
        </Paper>
      </Box>

      {/* Create/Edit Allocation Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>
          {editingAllocation ? "Edit Allocation" : "Create New Allocation"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Subject</InputLabel>
              <Select
                name="subjectId"
                value={formData.subjectId}
                onChange={handleChange}
                label="Subject"
                error={!!formErrors.subjectId}
              >
                <MenuItem value="">Select Subject</MenuItem>

                {subjects.map((subject) => (
                  <MenuItem key={subject.id} value={subject.id}>
                    {subject.courseName} - {subject.subjectName}
                  </MenuItem>
                ))}
              </Select>
              {formErrors.subjectId && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                  {formErrors.subjectId}
                </Typography>
              )}
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Staff Member</InputLabel>
              <Select
                name="staffId"
                value={formData.staffId}
                onChange={handleChange}
                label="Staff Member"
                error={!!formErrors.staffId}
              >
                <MenuItem value="">Select Staff Member</MenuItem>
                {staff.map((member) => (
                  <MenuItem key={member.id} value={member.id}>
                    {member.name} ({member.designation})
                  </MenuItem>
                ))}
              </Select>
              {formErrors.staffId && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                  {formErrors.staffId}
                </Typography>
              )}
            </FormControl>

            {/* Preview of selected items */}
            {formData.subjectId && formData.staffId && (
              <Box
                sx={{
                  mt: 2,
                  p: 2,
                  bgcolor: "#F8FAFC",
                  borderRadius: 2,
                  border: "1px solid #E8ECF1",
                }}
              >
                <Typography variant="caption" sx={{ color: "#6B7280", fontWeight: 600, display: "block", mb: 1 }}>
                  Allocation Preview
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
                  <Chip
                    icon={<Subject />}
                    label={getSubjectName(parseInt(formData.subjectId))}
                    sx={{ bgcolor: "#E3F2FD", color: "#1565C0" }}
                  />
                  <Typography variant="body2" sx={{ color: "#6B7280" }}>
                    →
                  </Typography>
                  <Chip
                    icon={<Person />}
                    label={getStaffName(parseInt(formData.staffId))}
                    sx={{ bgcolor: "#E8F5E9", color: "#2E7D32" }}
                  />
                </Box>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={handleCloseDialog} disabled={submitting}>
            Cancel
          </Button>
          <Button
            onClick={handleSaveAllocation}
            variant="contained"
            disabled={submitting}
            sx={{ bgcolor: "#1E293B" }}
          >
            {submitting ? (
              <CircularProgress size={24} sx={{ color: "#fff" }} />
            ) : (
              editingAllocation ? "Update" : "Create"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Allocation Dialog */}
      <Dialog
        open={openViewDialog}
        onClose={() => setOpenViewDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        {viewAllocation && (
          <>
            <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="h6" fontWeight={700}>
                  Allocation Details
                </Typography>
                <IconButton onClick={() => setOpenViewDialog(false)} size="small">
                  <Close />
                </IconButton>
              </Box>
            </DialogTitle>
            <Divider />
            <DialogContent>
              <Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
                  <Assignment sx={{ color: "#1565C0" }} />
                  <Typography variant="h6" fontWeight={700}>
                    Subject Allocation
                  </Typography>
                </Box>

                <Divider sx={{ mb: 2 }} />

                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Box>
                    <Typography variant="caption" sx={{ color: "#9CA3AF", fontWeight: 600, display: "block", mb: 0.5 }}>
                      SUBJECT
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Subject sx={{ fontSize: 18, color: "#6B7280" }} />
                      <Typography variant="body2" sx={{ color: "#1A1A1A", fontWeight: 500 }}>
                        {viewAllocation.subjectName || getSubjectName(viewAllocation.subjectId)}
                      </Typography>
                    </Box>
                  </Box>

                  <Box>
                    <Typography variant="caption" sx={{ color: "#9CA3AF", fontWeight: 600, display: "block", mb: 0.5 }}>
                      STAFF MEMBER
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Avatar
                        src={viewAllocation.staffImage || getStaffImage(viewAllocation.staffId)}
                        sx={{
                          width: 40,
                          height: 40,
                          bgcolor: "#E3F2FD",
                          color: "#1565C0",
                        }}
                      >
                        {viewAllocation.staffName ? viewAllocation.staffName.charAt(0).toUpperCase() : "S"}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" sx={{ color: "#1A1A1A", fontWeight: 500 }}>
                          {viewAllocation.staffName || getStaffName(viewAllocation.staffId)}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "#6B7280" }}>
                          {viewAllocation.staffDesignation || getStaffDesignation(viewAllocation.staffId)}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Box>
                    <Typography variant="caption" sx={{ color: "#9CA3AF", fontWeight: 600, display: "block", mb: 0.5 }}>
                      STATUS
                    </Typography>
                    {getStatusChip(viewAllocation.active)}
                  </Box>

                  <Box>
                    <Typography variant="caption" sx={{ color: "#9CA3AF", fontWeight: 600, display: "block", mb: 0.5 }}>
                      CREATED ON
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#6B7280" }}>
                      {viewAllocation.createdAt ? new Date(viewAllocation.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      }) : "N/A"}
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
                  handleOpenDialog(viewAllocation);
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

export default SubjectAllocationPage;