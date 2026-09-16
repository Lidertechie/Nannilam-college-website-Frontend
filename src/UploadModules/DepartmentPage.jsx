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
  Card,
  CardContent,
  Grid,
  Checkbox,
  ListItemText,
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  Refresh,
  School,
  Description,
  Category,
  Close,
  Visibility,
  CheckCircle,
} from "@mui/icons-material";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PageHeader from "./Pageheader";
import instance from "../AxiosInstance/AxiosInstance";
import ReusableTable from "../Common/Reusabletable";
import useFormFieldErrors from "../Common/useFormFieldErrors";

// Fields tracked for inline backend validation errors on this form
const DEPARTMENT_FIELD_NAMES = ["name", "description", "divisions"];

const DepartmentPage = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Dialog states
  const [openDialog, setOpenDialog] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    divisions: [],
  });

  // Reusable field-error handling (parses backend VALIDATION errors too)
  const {
    formErrors,
    clearFieldErrors,
    clearFieldError,
    setFieldErrors,
    applyBackendFieldErrors,
    fieldProps,
  } = useFormFieldErrors(DEPARTMENT_FIELD_NAMES);

  // View dialog states
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [viewDepartment, setViewDepartment] = useState(null);

  // Snackbar states
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: "", 
    severity: "success" 
  });

  // Division options
  const divisionOptions = ['UG', 'PG', 'Diploma', 'Certificate'];

  // Fetch departments
  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const response = await instance.get("/departments");
      console.log("Departments:", response.data);
      setDepartments(response.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
      const errorMsg = error.response?.data?.message || "Failed to fetch departments";
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
    fetchDepartments();
  }, []);

  // Handle CRUD operations
  const handleOpenDialog = (department = null) => {
    if (department) {
      setEditingDepartment(department);
      // Extract division categories from the divisions array
      const divisionCategories = department.divisions 
        ? department.divisions.map(div => div.category)
        : [];
      setFormData({
        name: department.name || "",
        description: department.description || "",
        divisions: divisionCategories,
      });
    } else {
      setEditingDepartment(null);
      setFormData({
        name: "",
        description: "",
        divisions: [],
      });
    }
    clearFieldErrors(); // Clear any previous field errors
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingDepartment(null);
    setFormData({
      name: "",
      description: "",
      divisions: [],
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

  const handleDivisionChange = (event) => {
    const { value } = event.target;
    setFormData((prev) => ({
      ...prev,
      divisions: typeof value === 'string' ? value.split(',') : value,
    }));
    clearFieldError('divisions'); // Clear error when user changes selection
  };

  const handleSaveDepartment = async () => {
    setSubmitting(true);
    clearFieldErrors(); // Clear previous errors before API call

    try {
      const departmentData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        divisions: formData.divisions,
      };

      let response;
      if (editingDepartment) {
        // Update department
        response = await instance.put(`/departments/${editingDepartment.id}`, departmentData);
        console.log("Updated:", response.data);
        toast.success("Department updated successfully!");
      } else {
        // Create department
        response = await instance.post("/departments", departmentData);
        console.log("Created:", response.data);
        toast.success("Department created successfully!");
      }
      handleCloseDialog();
      await fetchDepartments();
    } catch (error) {
      console.error("Error saving department:", error);
      const handledAsFieldErrors = applyBackendFieldErrors(error);
      if (!handledAsFieldErrors) {
        const errorMsg = error.response?.data?.message || "Failed to save department";
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

  const handleDeleteDepartment = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;

    setLoading(true);
    try {
      await instance.delete(`/departments/${id}`);
      toast.success(`"${name}" deleted successfully!`);
      await fetchDepartments();
    } catch (error) {
      console.error("Error deleting department:", error);
      const errorMsg = error.response?.data?.message || "Failed to delete department";
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

  const handleViewDepartment = (department) => {
    setViewDepartment(department);
    setOpenViewDialog(true);
  };

  // Prepare table data for ReusableTable
  const tableHeaders = ['S.No', 'Name', 'Description', 'Divisions', 'Actions'];
  
  const tableRows = departments.map((department, index) => {
    // Name with icon - Return as JSX element
    const nameDisplay = (
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
        <School sx={{ fontSize: 18, color: "#1565C0" }} />
        <Typography
          sx={{
            fontWeight: 600,
            color: "#1E293B",
            "&:hover": { textDecoration: "underline", cursor: "pointer" },
          }}
          onClick={() => handleViewDepartment(department)}
        >
          {department.name}
        </Typography>
      </Box>
    );

    // Description with tooltip - Return as JSX element
    const descriptionDisplay = (
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Tooltip title={department.description || "-"}>
          <Typography
            variant="body2"
            sx={{
              maxWidth: 200,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              textAlign: "center",
            }}
          >
            {department.description || "-"}
          </Typography>
        </Tooltip>
      </Box>
    );

    // Divisions chips - Extract category from division objects
    const divisionsDisplay = (
      <Box sx={{ display: "flex", justifyContent: "center", gap: 0.5, flexWrap: "wrap" }}>
        {department.divisions && department.divisions.length > 0 ? (
          department.divisions.map((division, idx) => (
            <Chip
              key={division.id || idx}
              label={division.category || division} // Handle both object and string
              size="small"
              sx={{
                bgcolor: "#E3F2FD",
                color: "#1565C0",
                fontWeight: 600,
                fontSize: "0.65rem",
                height: 24,
              }}
            />
          ))
        ) : (
          <Chip
            label="No Divisions"
            size="small"
            sx={{
              bgcolor: "#F3F4F6",
              color: "#9CA3AF",
              fontWeight: 600,
              fontSize: "0.65rem",
              height: 24,
            }}
          />
        )}
      </Box>
    );

    // Actions - Return as JSX element
    const actions = (
      <Box sx={{ display: "flex", justifyContent: "center", gap: 0.5 }}>
        <Tooltip title="View">
          <IconButton
            size="small"
            onClick={() => handleViewDepartment(department)}
            sx={{ color: "#8B5CF6", p: 0.5 }}
          >
            <Visibility fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Edit">
          <IconButton
            size="small"
            onClick={() => handleOpenDialog(department)}
            sx={{ color: "#1E293B", p: 0.5 }}
          >
            <Edit fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton
            size="small"
            onClick={() => handleDeleteDepartment(department.id, department.name)}
            sx={{ color: "#EF4444", p: 0.5 }}
          >
            <Delete fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    );

    // Return array of JSX elements (not objects)
    return [
      <Box key={`${department.id}-index`} sx={{ display: "flex", justifyContent: "center" }}>
        {index + 1}
      </Box>,
      <Box key={`${department.id}-name`}>
        {nameDisplay}
      </Box>,
      <Box key={`${department.id}-description`}>
        {descriptionDisplay}
      </Box>,
      <Box key={`${department.id}-divisions`}>
        {divisionsDisplay}
      </Box>,
      <Box key={`${department.id}-actions`}>
        {actions}
      </Box>
    ];
  });

  return (
    <Box sx={{ bgcolor: "#f5f7fa", minHeight: "100vh", py: 4 }}>
      <PageHeader title="DEPARTMENTS" subtitle="Manage college departments" />

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
                Departments
              </Typography>
              <Typography variant="body2" sx={{ color: "#6B7280", mt: 0.5 }}>
                {departments.length} {departments.length === 1 ? 'department' : 'departments'} found
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={fetchDepartments}
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
                Create Department
              </Button>
            </Box>
          </Box>

          {/* Table using ReusableTable */}
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
              <CircularProgress />
            </Box>
          ) : departments.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 6 }}>
              <School sx={{ fontSize: 56, color: "#D1D5DB" }} />
              <Typography variant="h6" sx={{ color: "#6B7280", mt: 2 }}>
                No departments found
              </Typography>
              <Typography variant="body2" sx={{ color: "#9CA3AF" }}>
                Create a new department to get started
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => handleOpenDialog()}
                sx={{ mt: 2 }}
              >
                Create First Department
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

      {/* Create/Edit Department Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>
          {editingDepartment ? "Edit Department" : "Create New Department"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              autoFocus
              margin="dense"
              label="Department Name"
              name="name"
              fullWidth
              value={formData.name}
              onChange={handleChange}
              {...fieldProps("name")}
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: (
                  <School sx={{ fontSize: 20, color: "#6B7280", mr: 1 }} />
                ),
              }}
            />

            <TextField
              margin="dense"
              label="Description"
              name="description"
              fullWidth
              multiline
              rows={3}
              value={formData.description}
              onChange={handleChange}
              {...fieldProps("description")}
              placeholder="Enter department description..."
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: (
                  <Description sx={{ fontSize: 20, color: "#6B7280", mr: 1 }} />
                ),
              }}
            />

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Divisions</InputLabel>
              <Select
                multiple
                name="divisions"
                value={formData.divisions}
                onChange={handleDivisionChange}
                label="Divisions"
                error={!!formErrors.divisions}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip
                        key={value}
                        label={value}
                        size="small"
                        sx={{
                          bgcolor: "#E3F2FD",
                          color: "#1565C0",
                          fontWeight: 600,
                        }}
                      />
                    ))}
                  </Box>
                )}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      maxHeight: 200,
                    },
                  },
                }}
              >
                {divisionOptions.map((division) => (
                  <MenuItem key={division} value={division}>
                    <Checkbox checked={formData.divisions.includes(division)} />
                    <ListItemText primary={division} />
                  </MenuItem>
                ))}
              </Select>
              {formErrors.divisions && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                  {formErrors.divisions}
                </Typography>
              )}
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={handleCloseDialog} disabled={submitting}>
            Cancel
          </Button>
          <Button
            onClick={handleSaveDepartment}
            variant="contained"
            disabled={submitting}
            sx={{ bgcolor: "#1E293B" }}
          >
            {submitting ? (
              <CircularProgress size={24} sx={{ color: "#fff" }} />
            ) : (
              editingDepartment ? "Update" : "Create"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Department Dialog */}
      <Dialog
        open={openViewDialog}
        onClose={() => setOpenViewDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        {viewDepartment && (
          <>
            <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="h6" fontWeight={700}>
                  Department Details
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
                  <School sx={{ color: "#1565C0" }} />
                  <Typography variant="h6" fontWeight={700}>
                    {viewDepartment.name}
                  </Typography>
                </Box>

                <Divider sx={{ mb: 2 }} />

                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Box>
                    <Typography variant="caption" sx={{ color: "#9CA3AF", fontWeight: 600, display: "block", mb: 0.5 }}>
                      DESCRIPTION
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#1A1A1A" }}>
                      {viewDepartment.description || "-"}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="caption" sx={{ color: "#9CA3AF", fontWeight: 600, display: "block", mb: 0.5 }}>
                      DIVISIONS
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                      {viewDepartment.divisions && viewDepartment.divisions.length > 0 ? (
                        viewDepartment.divisions.map((division, idx) => (
                          <Chip
                            key={division.id || idx}
                            label={division.category || division}
                            sx={{
                              bgcolor: "#E3F2FD",
                              color: "#1565C0",
                              fontWeight: 600,
                            }}
                          />
                        ))
                      ) : (
                        <Typography variant="body2" sx={{ color: "#9CA3AF" }}>
                          No divisions assigned
                        </Typography>
                      )}
                    </Box>
                  </Box>

                  <Box>
                    <Typography variant="caption" sx={{ color: "#9CA3AF", fontWeight: 600, display: "block", mb: 0.5 }}>
                      CREATED ON
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#6B7280" }}>
                      {viewDepartment.createdAt ? new Date(viewDepartment.createdAt).toLocaleDateString('en-IN', {
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
                  handleOpenDialog(viewDepartment);
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

export default DepartmentPage;