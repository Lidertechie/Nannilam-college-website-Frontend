import { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Divider,
  Chip,
  Avatar,
  Stack,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Menu,
  MenuItem,
  InputAdornment,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  Tooltip,
  InputBase,
} from "@mui/material";
import {
  Person,
  School,
  Work,
  CheckCircle,
  MoreVert,
  Edit,
  Delete,
  Close,
  CloudUpload,
  Description,
  Link as LinkIcon,
  Search,
} from "@mui/icons-material";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PageHeader from "./Pageheader";
import instance from "../AxiosInstance/AxiosInstance";
import { uploadFileToCloudinary } from "../Common/Fileupload";
import ReusableTable from "../Common/Reusabletable";
import useFormFieldErrors from "../Common/useFormFieldErrors";

// Fields tracked for inline backend validation errors on this form
const STAFF_FIELD_NAMES = ["name", "qualification", "designation", "staffType"];

const AddStaffPage = () => {
  const [form, setForm] = useState({
    name: "",
    qualification: "",
    designation: "",
    staffType: "NON_TEACHING",
    image: null,
    imagePreview: null,
    document: null,
    documentPreview: null,
    documentUrl: null,
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [staffRecords, setStaffRecords] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Reusable field-error handling (parses backend VALIDATION errors too)
  const {
    formErrors,
    clearFieldErrors,
    clearFieldError,
    applyBackendFieldErrors,
    fieldProps,
  } = useFormFieldErrors(STAFF_FIELD_NAMES);

  // Staff Types
  const staffTypes = ["TEACHING", "NON_TEACHING"];

  // Fetch staff records
  const fetchStaff = async () => {
    setFetching(true);
    setTableLoading(true);
    try {
      const response = await instance.get("/staff");
      console.log("Staff Records:", response.data);
      setStaffRecords(response.data);
    } catch (error) {
      console.error("Error fetching staff:", error);
      const errorMsg = error.response?.data?.message || "Failed to fetch staff records";
      toast.error(errorMsg);
    } finally {
      setFetching(false);
      setTableLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  // Filter staff records based on search query
  const filteredStaffRecords = staffRecords.filter((staff) =>
    staff.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    staff.designation?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    staff.qualification?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    clearFieldError(name); // Clear error for this field when user types
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error("Please upload a valid image file");
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size should be less than 2MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({
          ...prev,
          image: file,
          imagePreview: reader.result,
        }));
        toast.success("Image uploaded successfully");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setForm((prev) => ({
      ...prev,
      image: null,
      imagePreview: null,
    }));
    toast.info("Image removed");
  };

  const handleDocumentUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 5MB for documents)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Document size should be less than 5MB");
        return;
      }

      // Check file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Please upload PDF, DOC, DOCX, JPG, or PNG files only");
        return;
      }

      setForm((prev) => ({
        ...prev,
        document: file,
        documentPreview: URL.createObjectURL(file),
        documentUrl: null, // Clear existing URL when new document is uploaded
      }));
      toast.success("Document uploaded successfully");
    }
  };

  const handleRemoveDocument = () => {
    if (form.documentPreview) {
      URL.revokeObjectURL(form.documentPreview);
    }
    setForm((prev) => ({
      ...prev,
      document: null,
      documentPreview: null,
      documentUrl: null,
    }));
    toast.info("Document removed");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    clearFieldErrors(); // Clear previous errors before API call

    try {
      let imageUrl = null;
      let documentUrl = null;

      // Upload image to Cloudinary if selected
      if (form.image) {
        try {
          imageUrl = await uploadFileToCloudinary(form.image);
        } catch (uploadError) {
          console.error("Image upload error:", uploadError);
          toast.error("Failed to upload image: " + uploadError.message);
          setLoading(false);
          return;
        }
      }

      // Upload document to Cloudinary if selected
      if (form.document) {
        try {
          documentUrl = await uploadFileToCloudinary(form.document);
        } catch (uploadError) {
          console.error("Document upload error:", uploadError);
          toast.error("Failed to upload document: " + uploadError.message);
          setLoading(false);
          return;
        }
      } else if (form.documentUrl) {
        // Keep existing document URL if no new document is uploaded
        documentUrl = form.documentUrl;
      }

      const staffData = {
        name: form.name,
        qualification: form.qualification,
        designation: form.designation,
        staffType: form.staffType,
        imageUrl: imageUrl || form.imagePreview || null,
        documentUrl: documentUrl || null,
      };

      let response;
      if (editingId) {
        // Update staff
        response = await instance.put(`/staff/${editingId}`, staffData);
        console.log("Updated:", response.data);
        toast.success("Staff member updated successfully!");
        setEditingId(null);
      } else {
        // Create staff
        response = await instance.post("/staff/register", staffData);
        console.log("Created:", response.data);
        toast.success("Staff member added successfully!");
      }

      // Reset form
      setForm({
        name: "",
        qualification: "",
        designation: "",
        staffType: "NON_TEACHING",
        image: null,
        imagePreview: null,
        document: null,
        documentPreview: null,
        documentUrl: null,
      });
      clearFieldErrors(); // Clear errors after successful submission

      // Refresh staff list
      await fetchStaff();
      setSearchQuery(""); // Clear search after successful submission

    } catch (error) {
      console.error("Error saving staff:", error);
      const handledAsFieldErrors = applyBackendFieldErrors(error);
      if (!handledAsFieldErrors) {
        const errorMsg = error.response?.data?.message || "Failed to save staff member";
        toast.error(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (staff) => {
    setForm({
      name: staff.name || "",
      qualification: staff.qualification || "",
      designation: staff.designation || "",
      staffType: staff.staffType || "NON_TEACHING",
      image: null,
      imagePreview: staff.imageUrl || null,
      document: null,
      documentPreview: null,
      documentUrl: staff.documentUrl || null,
    });
    setEditingId(staff.id);
    clearFieldErrors(); // Clear errors when editing
    handleMenuClose();
    // Scroll to form
    document.querySelector('.MuiPaper-root')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDeleteClick = (staff) => {
    setStaffToDelete(staff);
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = async () => {
    if (staffToDelete) {
      try {
        await instance.delete(`/staff/${staffToDelete.id}`);
        setDeleteDialogOpen(false);
        toast.success(`"${staffToDelete.name}" deleted successfully`);
        setStaffToDelete(null);
        await fetchStaff();
      } catch (error) {
        console.error("Error deleting staff:", error);
        const errorMsg = error.response?.data?.message || "Failed to delete staff member";
        toast.error(errorMsg);
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setStaffToDelete(null);
  };

  const handleMenuOpen = (event, staff) => {
    setAnchorEl(event.currentTarget);
    setSelectedStaff(staff);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedStaff(null);
  };

  const handleCancelEdit = () => {
    if (form.documentPreview) {
      URL.revokeObjectURL(form.documentPreview);
    }
    setForm({
      name: "",
      qualification: "",
      designation: "",
      staffType: "NON_TEACHING",
      image: null,
      imagePreview: null,
      document: null,
      documentPreview: null,
      documentUrl: null,
    });
    setEditingId(null);
    clearFieldErrors(); // Clear errors when cancelling
    toast.info("Edit cancelled");
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

  // Prepare table data for ReusableTable
  const tableHeaders = ['S.No', 'Staff', 'Qualification', 'Designation', 'Type', 'Added Date', 'Actions'];

  const tableRows = filteredStaffRecords.map((staff, index) => {
    // Get initials for avatar
    const initials = staff.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'ST';

    // Create avatar component
    const staffInfo = (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <Avatar
          src={staff.imageUrl || undefined}
          sx={{
            bgcolor: staff.imageUrl ? "transparent" : "#E3F2FD",
            color: "#1565C0",
            width: 40,
            height: 40,
            fontWeight: 600,
            fontSize: "0.85rem",
            border: staff.imageUrl ? "2px solid #E8ECF1" : "none",
          }}
        >
          {!staff.imageUrl && initials}
        </Avatar>
        <Typography variant="body2" fontWeight={600}>
          {staff.name}
        </Typography>
        {staff.documentUrl && (
          <Tooltip title="View Document">
            <IconButton
              size="small"
              onClick={() => window.open(staff.documentUrl, '_blank')}
              sx={{ color: "#1565C0", p: 0.5 }}
            >
              <Description sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    );

    // Type chip
    const typeChip = (
      <Chip
        label={staff.staffType || "Staff"}
        size="small"
        sx={{
          bgcolor: "#E3F2FD",
          color: "#1565C0",
          fontSize: "0.65rem",
          fontWeight: 600,
          height: 20,
        }}
      />
    );

    // Actions menu
    const actions = (
      <IconButton
        size="small"
        onClick={(e) => handleMenuOpen(e, staff)}
        sx={{ color: "#9CA3AF" }}
      >
        <MoreVert fontSize="small" />
      </IconButton>
    );

    return [
      index + 1,
      staffInfo,
      staff.qualification || '_',
      staff.designation || '_',
      typeChip,
      formatDate(staff.createdAt),
      actions
    ];
  });

  return (
    <Box sx={{ bgcolor: "#f5f7fa", minHeight: "100vh", py: 4 }}>
      <PageHeader title="STAFF MANAGEMENT" subtitle="Add staff members" />

      {/* ---------------------------------------------------------------
          LAYOUT FIX:
          - Added maxWidth + mx:"auto" so the row never gets wider than
            the viewport and forces horizontal page-level scrolling.
          - Added flexWrap:"wrap" so on narrower desktop widths the form
            and table stack cleanly instead of overflowing sideways.
          - Removed fixed maxWidth from the two panels below and replaced
            with flex-basis + minWidth:0 so they shrink/grow properly.
      --------------------------------------------------------------- */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          px: 2,
          gap: 3,
          flexWrap: "wrap",
          maxWidth: 1400,
          mx: "auto",
        }}
      >
        {/* Form Card */}
        <Paper
          elevation={0}
          component="form"
          onSubmit={handleSubmit}
          sx={{
            width: "100%",
            flex: "1 1 380px",
            maxWidth: 500,
            minWidth: 0,
            borderRadius: 3,
            overflow: "hidden",
            border: "1px solid #E8ECF1",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          }}
        >
          <Box
            sx={{
              px: 4,
              py: 3,
              borderBottom: "1px solid #E8ECF1",
              bgcolor: "#FAFBFC",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Box>
                <Typography variant="h6" fontWeight={600} sx={{ color: "#1A1A1A" }}>
                  {editingId ? "EDIT STAFF" : "ADD STAFF"}
                </Typography>
                <Typography variant="body2" sx={{ color: "#6B7280" }}>
                  {editingId ? "Update staff member details" : "Enter the staff member details below"}
                </Typography>
              </Box>
              {editingId && (
                <IconButton size="small" onClick={handleCancelEdit}>
                  <Close fontSize="small" />
                </IconButton>
              )}
            </Box>
          </Box>

          <Box sx={{ p: { xs: 2.5, md: 4 } }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: "#0D47A1",
                mb: 3,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Person color="primary" />
              Staff Information
            </Typography>

            <Grid container spacing={3}>
              {/* Image Upload Field */}
              <Grid item xs={12}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 3,
                    flexWrap: "wrap",
                  }}
                >
                  <Box
                    sx={{
                      position: "relative",
                      width: 100,
                      height: 100,
                      borderRadius: "50%",
                      overflow: "hidden",
                      border: "3px solid #E8ECF1",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: "#F5F7FA",
                      flexShrink: 0,
                    }}
                  >
                    {form.imagePreview ? (
                      <img
                        src={form.imagePreview}
                        alt="Staff"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <Person sx={{ fontSize: 48, color: "#BDBDBD" }} />
                    )}
                  </Box>

                  <Box sx={{ flex: 1 }}>
                    <Button
                      variant="outlined"
                      component="label"
                      startIcon={<CloudUpload />}
                      sx={{
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 600,
                        borderColor: "#D1D5DB",
                        color: "#6B7280",
                        "&:hover": {
                          borderColor: "#1565C0",
                          color: "#1565C0",
                          bgcolor: "rgba(21, 101, 192, 0.04)",
                        },
                      }}
                    >
                      Upload Photo
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </Button>

                    {form.imagePreview && (
                      <Button
                        variant="text"
                        color="error"
                        size="small"
                        onClick={handleRemoveImage}
                        sx={{
                          mt: 1,
                          textTransform: "none",
                          fontWeight: 600,
                          display: "block",
                        }}
                      >
                        Remove Photo
                      </Button>
                    )}

                    <Typography variant="caption" sx={{ color: "#9CA3AF", display: "block", mt: 1 }}>
                      JPG, PNG, GIF • Max 2MB
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Divider />
              </Grid>

              {/* Document Upload Field */}
              <Grid item xs={12}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 3,
                    flexWrap: "wrap",
                  }}
                >
                  <Box
                    sx={{
                      width: 100,
                      height: 100,
                      borderRadius: 2,
                      border: "2px dashed #E8ECF1",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: "#F5F7FA",
                      flexShrink: 0,
                      flexDirection: "column",
                    }}
                  >
                    {form.documentPreview ? (
                      <Description sx={{ fontSize: 48, color: "#1565C0" }} />
                    ) : form.documentUrl ? (
                      <LinkIcon sx={{ fontSize: 48, color: "#1565C0" }} />
                    ) : (
                      <Description sx={{ fontSize: 48, color: "#BDBDBD" }} />
                    )}
                    {(form.documentPreview || form.documentUrl) && (
                      <Typography variant="caption" sx={{ color: "#1565C0", fontWeight: 600, mt: 0.5 }}>
                        Document Uploaded
                      </Typography>
                    )}
                  </Box>

                  <Box sx={{ flex: 1 }}>
                    <Button
                      variant="outlined"
                      component="label"
                      startIcon={<CloudUpload />}
                      sx={{
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 600,
                        borderColor: "#D1D5DB",
                        color: "#6B7280",
                        "&:hover": {
                          borderColor: "#1565C0",
                          color: "#1565C0",
                          bgcolor: "rgba(21, 101, 192, 0.04)",
                        },
                      }}
                    >
                      {form.documentUrl ? "Change Document" : "Upload Document"}
                      <input
                        type="file"
                        hidden
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        onChange={handleDocumentUpload}
                      />
                    </Button>

                    {(form.documentPreview || form.documentUrl) && (
                      <Button
                        variant="text"
                        color="error"
                        size="small"
                        onClick={handleRemoveDocument}
                        sx={{
                          mt: 1,
                          textTransform: "none",
                          fontWeight: 600,
                          display: "block",
                        }}
                      >
                        Remove Document
                      </Button>
                    )}

                    {form.documentUrl && !form.documentPreview && (
                      <Button
                        variant="text"
                        size="small"
                        onClick={() => window.open(form.documentUrl, '_blank')}
                        sx={{
                          mt: 0.5,
                          textTransform: "none",
                          fontWeight: 600,
                          color: "#1565C0",
                          display: "block",
                        }}
                        startIcon={<LinkIcon />}
                      >
                        View Current Document
                      </Button>
                    )}

                    <Typography variant="caption" sx={{ color: "#9CA3AF", display: "block", mt: 1 }}>
                      PDF, DOC, DOCX, JPG, PNG • Max 5MB
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Divider />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Staff Name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter Staff Name"
                  {...fieldProps("name")}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            bgcolor: "#E3F2FD",
                            color: "#1565C0",
                          }}
                        >
                          <Person fontSize="small" />
                        </Avatar>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 3,
                      bgcolor: "#FCFCFD",
                      transition: ".3s",
                      "&:hover": {
                        bgcolor: "#F8FAFC",
                      },
                      "&.Mui-focused": {
                        boxShadow: "0 0 0 4px rgba(25,118,210,.08)",
                      },
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Qualification"
                  name="qualification"
                  value={form.qualification}
                  onChange={handleChange}
                  placeholder="Enter Qualification"
                  {...fieldProps("qualification")}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            bgcolor: "#E8F5E9",
                            color: "#2E7D32",
                          }}
                        >
                          <School fontSize="small" />
                        </Avatar>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 3,
                      bgcolor: "#FCFCFD",
                      transition: ".3s",
                      "&:hover": {
                        bgcolor: "#F8FAFC",
                      },
                      "&.Mui-focused": {
                        boxShadow: "0 0 0 4px rgba(25,118,210,.08)",
                      },
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Designation"
                  name="designation"
                  value={form.designation}
                  onChange={handleChange}
                  placeholder="Enter Designation"
                  {...fieldProps("designation")}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            bgcolor: "#FFF3E0",
                            color: "#EF6C00",
                          }}
                        >
                          <Work fontSize="small" />
                        </Avatar>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 3,
                      bgcolor: "#FCFCFD",
                      transition: ".3s",
                      "&:hover": {
                        bgcolor: "#F8FAFC",
                      },
                      "&.Mui-focused": {
                        boxShadow: "0 0 0 4px rgba(25,118,210,.08)",
                      },
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth error={!!formErrors.staffType}>
                  <InputLabel>Staff Type</InputLabel>
                  <Select
                    name="staffType"
                    value={form.staffType}
                    onChange={handleChange}
                    label="Staff Type"
                    sx={{
                      borderRadius: 3,
                      bgcolor: "#FCFCFD",
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 3,
                      },
                    }}
                  >
                    <MenuItem value="">
                      <em>Select Staff Type</em>
                    </MenuItem>
                    {staffTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                  {formErrors.staffType && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                      {formErrors.staffType}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
              </Grid>

              <Grid item xs={12}>
                <Stack direction="row" spacing={2}>
                  <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    sx={{
                      py: 1.6,
                      borderRadius: 3,
                      fontWeight: 700,
                      fontSize: "1rem",
                      textTransform: "none",
                      background: editingId
                        ? "linear-gradient(90deg,#F57C00,#E65100)"
                        : "linear-gradient(90deg,#1976D2,#0D47A1)",
                      boxShadow: "0 8px 20px rgba(25,118,210,.25)",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 12px 25px rgba(25,118,210,.35)",
                      },
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={24} sx={{ color: "#fff" }} />
                    ) : editingId ? (
                      "Update Staff"
                    ) : (
                      "Add Staff"
                    )}
                  </Button>

                  {editingId && (
                    <Button
                      variant="outlined"
                      onClick={handleCancelEdit}
                      sx={{
                        px: 4,
                        borderRadius: 3,
                        textTransform: "none",
                        fontWeight: 700,
                      }}
                    >
                      Cancel
                    </Button>
                  )}
                </Stack>
              </Grid>
            </Grid>
          </Box>
        </Paper>

        {/* Staff Records List - Using ReusableTable */}
        <Box
          sx={{
            flex: "2 1 600px",
            maxWidth: 800,
            minWidth: 0,
            width: "100%",
          }}
        >
          <Paper
            elevation={0}
            sx={{
              borderRadius: 3,
              border: "1px solid #E8ECF1",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                px: 4,
                py: 3,
                borderBottom: "1px solid #E8ECF1",
                bgcolor: "#FAFBFC",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 1,
              }}
            >
              <Box>
                <Typography variant="h6" fontWeight={600} sx={{ color: "#1A1A1A" }}>
                  Staff Members
                </Typography>
                <Typography variant="body2" sx={{ color: "#6B7280" }}>
                  {filteredStaffRecords.length} {filteredStaffRecords.length === 1 ? 'record' : 'records'} found
                  {searchQuery && ` (filtered from ${staffRecords.length} total)`}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", gap: 1, alignItems: "center", flexWrap: "wrap" }}>
                {/* Search Field */}
                <Paper
                  component="div"
                  sx={{
                    p: '2px 4px',
                    display: 'flex',
                    alignItems: 'center',
                    width: 250,
                    borderRadius: 2,
                    border: '1px solid #E8ECF1',
                    bgcolor: '#FAFBFC',
                  }}
                >
                  <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="Search staff..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    inputProps={{ 'aria-label': 'search staff' }}
                  />
                  <IconButton type="button" sx={{ p: '8px' }} aria-label="search">
                    <Search />
                  </IconButton>
                  {searchQuery && (
                    <IconButton
                      type="button"
                      sx={{ p: '4px' }}
                      onClick={() => setSearchQuery('')}
                      aria-label="clear search"
                    >
                      <Close fontSize="small" />
                    </IconButton>
                  )}
                </Paper>

                <Chip
                  label={`${staffRecords.filter(s => s.active !== false).length} Active`}
                  size="small"
                  sx={{
                    bgcolor: "#E8F5E9",
                    color: "#2E7D32",
                    fontWeight: 600,
                  }}
                />
                <Button
                  size="small"
                  variant="outlined"
                  onClick={fetchStaff}
                  sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 600,
                  }}
                >
                  Refresh
                </Button>
              </Box>
            </Box>

            {/* Table body: overflowX:"auto" keeps the horizontal scroll
                (if any) contained to the table only, instead of the
                whole page scrolling sideways. */}
            {/* <Box sx={{ p: 2, overflowX: "auto" }}> */}
              {fetching || tableLoading ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                  <CircularProgress />
                </Box>
              ) : filteredStaffRecords.length === 0 ? (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <Typography variant="body2" sx={{ color: "#9CA3AF" }}>
                    {searchQuery ? `No staff members found matching "${searchQuery}"` : "No staff members found"}
                  </Typography>
                  {searchQuery && (
                    <Button
                      size="small"
                      onClick={() => setSearchQuery('')}
                      sx={{ mt: 1, textTransform: 'none' }}
                    >
                      Clear search
                    </Button>
                  )}
                </Box>
              ) : (
                <ReusableTable
                  headers={tableHeaders}
                  rows={tableRows}
                />
              )}
            {/* </Box> */}
          </Paper>
        </Box>
      </Box>

      {/* Menu for Edit/Delete */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            minWidth: 150,
          },
        }}
      >
        <MenuItem onClick={() => selectedStaff && handleEdit(selectedStaff)}>
          <ListItemIcon>
            <Edit fontSize="small" sx={{ color: "#1565C0" }} />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontSize: "0.9rem" }}>
            Edit
          </ListItemText>
        </MenuItem>
        <MenuItem onClick={() => selectedStaff && handleDeleteClick(selectedStaff)}>
          <ListItemIcon>
            <Delete fontSize="small" sx={{ color: "#D32F2F" }} />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontSize: "0.9rem", color: "#D32F2F" }}>
            Delete
          </ListItemText>
        </MenuItem>
      </Menu>

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
          Delete Staff Member
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: "#6B7280" }}>
            Are you sure you want to delete <strong>{staffToDelete?.name}</strong>?
            This action cannot be undone.
          </DialogContentText>
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
      />
    </Box>
  );
};

export default AddStaffPage;