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
  Group,
  School,
  Work,
  CheckCircle,
} from "@mui/icons-material";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import instance from "../AxiosInstance/AxiosInstance";
import PageHeader from "../UploadModules/Pageheader";
import ReusableTable from "../Common/Reusabletable";
import useFormFieldErrors from "../Common/useFormFieldErrors";

// Fields tracked for inline backend validation errors on this form
const OFFICER_FIELD_NAMES = ["groupId", "staffId", "role"];

const ScholarshipOfficers = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  
  // States
  const [officers, setOfficers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingGroups, setFetchingGroups] = useState(false);
  const [fetchingStaff, setFetchingStaff] = useState(false);
  
  // Dialog states
  const [openDialog, setOpenDialog] = useState(false);
  const [editingOfficer, setEditingOfficer] = useState(null);
  const [formData, setFormData] = useState({
    groupId: "",
    staffId: "",
    role: "",
  });

  // Reusable field-error handling (parses backend VALIDATION errors too)
  const {
    formErrors,
    clearFieldErrors,
    clearFieldError,
    setFieldErrors,
    applyBackendFieldErrors,
    fieldProps,
  } = useFormFieldErrors(OFFICER_FIELD_NAMES);

  // Delete dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [officerToDelete, setOfficerToDelete] = useState(null);

  // Fetch officers
  const fetchOfficers = async () => {
    setLoading(true);
    try {
      const response = await instance.get("/scholarship-officers/admin/all");
      console.log("Officers:", response.data);
      setOfficers(response.data);
    } catch (error) {
      console.error("Error fetching officers:", error);
      const errorMsg = error.response?.data?.message || "Failed to fetch officers";
      toast.error("❌ " + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Fetch groups
  const fetchGroups = async () => {
    setFetchingGroups(true);
    try {
      const response = await instance.get("/scholarship-officer-groups/admin/all");
      console.log("Groups:", response.data);
      setGroups(response.data);
    } catch (error) {
      console.error("Error fetching groups:", error);
      toast.error("❌ Failed to fetch groups");
    } finally {
      setFetchingGroups(false);
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
    fetchOfficers();
    fetchGroups();
    fetchStaff();
  }, []);

  // Get group name by ID
  const getGroupName = (groupId) => {
    const group = groups.find(g => g.id === groupId);
    return group ? group.name : "Unknown";
  };

  // Get staff name by ID
  const getStaffName = (staffId) => {
    const staff = staffList.find(s => s.id === staffId);
    return staff ? staff.name : "Unknown";
  };

  // Get staff designation by ID
  const getStaffDesignation = (staffId) => {
    const staff = staffList.find(s => s.id === staffId);
    return staff ? staff.designation : "—";
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
  const handleOpenDialog = (officer = null) => {
    if (officer) {
      setEditingOfficer(officer);
      setFormData({
        groupId: officer.groupId || "",
        staffId: officer.staffId || "",
        role: officer.role || "",
      });
    } else {
      setEditingOfficer(null);
      setFormData({
        groupId: "",
        staffId: "",
        role: "",
      });
    }
    clearFieldErrors(); // Clear any previous field errors
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingOfficer(null);
    setFormData({
      groupId: "",
      staffId: "",
      role: "",
    });
    clearFieldErrors(); // Clear errors when closing
  };

  // Create officer
  const handleCreate = async () => {
    setLoading(true);
    clearFieldErrors(); // Clear previous errors before API call

    try {
      const response = await instance.post("/scholarship-officers", {
        groupId: parseInt(formData.groupId),
        staffId: parseInt(formData.staffId),
        role: formData.role.trim(),
      });
      console.log("Created:", response.data);
      toast.success("✅ Officer assigned successfully!");
      handleCloseDialog();
      fetchOfficers();
    } catch (error) {
      console.error("Create error:", error);
      const handledAsFieldErrors = applyBackendFieldErrors(error);
      if (!handledAsFieldErrors) {
        const errorMsg = error.response?.data?.message || "Failed to assign officer";
        toast.error("❌ " + errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  // Update officer
  const handleUpdate = async () => {
    setLoading(true);
    clearFieldErrors(); // Clear previous errors before API call

    try {
      const response = await instance.put(`/scholarship-officers/${editingOfficer.id}`, {
        groupId: parseInt(formData.groupId),
        staffId: parseInt(formData.staffId),
        role: formData.role.trim(),
      });
      console.log("Updated:", response.data);
      toast.success("✅ Officer updated successfully!");
      handleCloseDialog();
      fetchOfficers();
    } catch (error) {
      console.error("Update error:", error);
      const handledAsFieldErrors = applyBackendFieldErrors(error);
      if (!handledAsFieldErrors) {
        const errorMsg = error.response?.data?.message || "Failed to update officer";
        toast.error("❌ " + errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  // Delete officer
  const handleDeleteClick = (officer) => {
    setOfficerToDelete(officer);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!officerToDelete) return;
    
    try {
      await instance.delete(`/scholarship-officers/${officerToDelete.id}`);
      toast.success(`✅ "${officerToDelete.staffName}" removed successfully!`);
      setDeleteDialogOpen(false);
      setOfficerToDelete(null);
      fetchOfficers();
    } catch (error) {
      console.error("Delete error:", error);
      const errorMsg = error.response?.data?.message || "Failed to delete officer";
      toast.error("❌ " + errorMsg);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setOfficerToDelete(null);
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

  // Prepare table data
  const tableHeaders = ["S.No", "Staff Name", "Designation", "Group", "Role", "Status", "Actions"];
  
  const tableRows = officers.map((officer, index) => [
    index + 1,
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Person sx={{ fontSize: 18, color: theme.palette.primary.main }} />
      <Typography fontWeight={500}>{officer.staffName}</Typography>
    </Box>,
    officer.staffDesignation || "—",
    <Chip
      icon={<Group sx={{ fontSize: 14 }} />}
      label={officer.groupName || getGroupName(officer.groupId)}
      size="small"
      sx={{
        bgcolor: alpha(theme.palette.primary.main, 0.08),
        color: "primary.main",
        fontWeight: 600,
        fontSize: "0.7rem",
      }}
    />,
    <Chip
      label={officer.role}
      size="small"
      sx={{
        bgcolor: alpha(theme.palette.warning.main, 0.15),
        color: "#E65100",
        fontWeight: 600,
        fontSize: "0.7rem",
      }}
    />,
    officer.active !== false ? (
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
    <Box sx={{ display: "flex", gap: 0.5, justifyContent: "center" }}>
      <Tooltip title="Edit">
        <IconButton
          size="small"
          onClick={() => handleOpenDialog(officer)}
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
          onClick={() => handleDeleteClick(officer)}
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
        title="SCHOLARSHIP OFFICERS" 
        subtitle="Manage scholarship officers" 
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
              Officers
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
              Assign Officer
            </Button>
          </Box>

          {/* Officers List - Table View */}
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
              <CircularProgress />
            </Box>
          ) : officers.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 6 }}>
              <Person sx={{ fontSize: 56, color: "#D1D5DB" }} />
              <Typography variant="h6" sx={{ color: "#6B7280", mt: 2 }}>
                No officers assigned
              </Typography>
              <Typography variant="body2" sx={{ color: "#9CA3AF" }}>
                Assign an officer to a group to get started
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
          {editingOfficer ? "Edit Officer Assignment" : "Assign New Officer"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Select Group</InputLabel>
              <Select
                name="groupId"
                value={formData.groupId}
                onChange={handleChange}
                label="Select Group"
                error={!!formErrors.groupId}
                disabled={fetchingGroups}
              >
                <MenuItem value="">Select Group</MenuItem>
                {groups.map((group) => (
                  <MenuItem key={group.id} value={group.id}>
                    {group.name}
                  </MenuItem>
                ))}
              </Select>
              {formErrors.groupId && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                  {formErrors.groupId}
                </Typography>
              )}
            </FormControl>

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
              label="Role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              placeholder="e.g., Nodal Officer, Coordinator, SPOC"
              {...fieldProps("role")}
              sx={{ mb: 2 }}
            />

            {editingOfficer && (
              <Box sx={{ mt: 1, p: 1.5, bgcolor: "#FFF3E0", borderRadius: 2 }}>
                <Typography variant="caption" sx={{ color: "#EF6C00", display: "flex", alignItems: "center", gap: 1 }}>
                  <Person sx={{ fontSize: 14 }} />
                  Editing: {editingOfficer.staffName} - {editingOfficer.role}
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
            onClick={editingOfficer ? handleUpdate : handleCreate}
            variant="contained"
            disabled={loading}
            sx={{ bgcolor: "#1E293B" }}
          >
            {loading ? <CircularProgress size={24} /> : (editingOfficer ? "Update" : "Assign")}
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
          Remove Officer Assignment
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: "#6B7280" }}>
            Are you sure you want to remove{" "}
            <strong>{officerToDelete ? officerToDelete.staffName : ""}</strong> from{" "}
            <strong>{officerToDelete ? officerToDelete.groupName : ""}</strong>?
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
            Remove
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

export default ScholarshipOfficers;