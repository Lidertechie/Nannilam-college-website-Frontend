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
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  Category,
  CheckCircle,
} from "@mui/icons-material";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import instance from "../AxiosInstance/AxiosInstance";
import PageHeader from "../UploadModules/Pageheader";
import ReusableTable from "../Common/Reusabletable";
import useFormFieldErrors from "../Common/useFormFieldErrors";

// Fields tracked for inline backend validation errors on this form
const CATEGORY_FIELD_NAMES = ["name"];

const ScholarshipCategories = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  
  // States
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Dialog states
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
  });

  // Reusable field-error handling (parses backend VALIDATION errors too)
  const {
    formErrors,
    clearFieldErrors,
    clearFieldError,
    setFieldErrors,
    applyBackendFieldErrors,
    fieldProps,
  } = useFormFieldErrors(CATEGORY_FIELD_NAMES);

  // Delete dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  // Fetch categories
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await instance.get("/scholarship-officer-groups/admin/all");
      console.log("Categories:", response.data);
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      const errorMsg = error.response?.data?.message || "Failed to fetch categories";
      toast.error("❌ " + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

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
  const handleOpenDialog = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name || "",
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: "",
      });
    }
    clearFieldErrors(); // Clear any previous field errors
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCategory(null);
    setFormData({
      name: "",
    });
    clearFieldErrors(); // Clear errors when closing
  };

  // Create category
  const handleCreate = async () => {
    setLoading(true);
    clearFieldErrors(); // Clear previous errors before API call

    try {
      const response = await instance.post("/scholarship-officer-groups", {
        name: formData.name.trim(),
      });
      console.log("Created:", response.data);
      toast.success("✅ Category created successfully!");
      handleCloseDialog();
      fetchCategories();
    } catch (error) {
      console.error("Create error:", error);
      const handledAsFieldErrors = applyBackendFieldErrors(error);
      if (!handledAsFieldErrors) {
        const errorMsg = error.response?.data?.message || "Failed to create category";
        toast.error("❌ " + errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  // Update category
  const handleUpdate = async () => {
    setLoading(true);
    clearFieldErrors(); // Clear previous errors before API call

    try {
      const response = await instance.put(`/scholarship-officer-groups/${editingCategory.id}`, {
        name: formData.name.trim(),
      });
      console.log("Updated:", response.data);
      toast.success("✅ Category updated successfully!");
      handleCloseDialog();
      fetchCategories();
    } catch (error) {
      console.error("Update error:", error);
      const handledAsFieldErrors = applyBackendFieldErrors(error);
      if (!handledAsFieldErrors) {
        const errorMsg = error.response?.data?.message || "Failed to update category";
        toast.error("❌ " + errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  // Delete category
  const handleDeleteClick = (category) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return;
    
    try {
      await instance.delete(`/scholarship-officer-groups/${categoryToDelete.id}`);
      toast.success(`✅ "${categoryToDelete.name}" deleted successfully!`);
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
      fetchCategories();
    } catch (error) {
      console.error("Delete error:", error);
      const errorMsg = error.response?.data?.message || "Failed to delete category";
      toast.error("❌ " + errorMsg);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setCategoryToDelete(null);
  };

  // Prepare table data
  const tableHeaders = ["S.No", "Category Name", "Status", "Actions"];
  
  const tableRows = categories.map((category, index) => [
    index + 1,
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Category sx={{ fontSize: 18, color: theme.palette.primary.main }} />
      <Typography fontWeight={500}>{category.name}</Typography>
    </Box>,
    category.active !== false ? (
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
          onClick={() => handleOpenDialog(category)}
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
          onClick={() => handleDeleteClick(category)}
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
        title="SCHOLARSHIP CATEGORIES" 
        subtitle="Manage scholarship categories" 
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
              Categories
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
              Add Category
            </Button>
          </Box>

          {/* Categories List - Table View */}
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
              <CircularProgress />
            </Box>
          ) : categories.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 6 }}>
              <Category sx={{ fontSize: 56, color: "#D1D5DB" }} />
              <Typography variant="h6" sx={{ color: "#6B7280", mt: 2 }}>
                No categories found
              </Typography>
              <Typography variant="body2" sx={{ color: "#9CA3AF" }}>
                Add a category to get started
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
          {editingCategory ? "Edit Category" : "Add New Category"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Category Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter category name"
              {...fieldProps("name")}
              sx={{ mb: 2 }}
              autoFocus
            />

            {editingCategory && (
              <Box sx={{ mt: 1, p: 1.5, bgcolor: "#FFF3E0", borderRadius: 2 }}>
                <Typography variant="caption" sx={{ color: "#EF6C00", display: "flex", alignItems: "center", gap: 1 }}>
                  <Category sx={{ fontSize: 14 }} />
                  Editing category: {editingCategory.name}
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
            onClick={editingCategory ? handleUpdate : handleCreate}
            variant="contained"
            disabled={loading}
            sx={{ bgcolor: "#1E293B" }}
          >
            {loading ? <CircularProgress size={24} /> : (editingCategory ? "Update" : "Create")}
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
          Delete Category
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: "#6B7280" }}>
            Are you sure you want to delete the category{" "}
            <strong>{categoryToDelete ? categoryToDelete.name : ""}</strong>?
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

export default ScholarshipCategories;