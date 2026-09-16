import { useState, useEffect } from "react";
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
    IconButton,
    Chip,
    CircularProgress,
    Grid,
    Card,
    CardContent,
    useMediaQuery,
    useTheme,
    Divider,
    Switch,
    Tooltip,
    FormHelperText,
} from "@mui/material";
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Refresh as RefreshIcon,
    CalendarToday as CalendarIcon,
} from "@mui/icons-material";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import instance from "../AxiosInstance/AxiosInstance";
import ReusableTable from "../Common/Reusabletable"
import useFormFieldErrors from "../Common/useFormFieldErrors";

// Fields tracked for inline backend validation errors on this form
const YEAR_FIELD_NAMES = ["yearLabel", "startDate", "endDate"];

const AcademicYears = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    
    // States
    const [academicYears, setAcademicYears] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formLoading, setFormLoading] = useState(false);

    // Tracks which row's active-toggle PATCH call is in-flight
    const [togglingId, setTogglingId] = useState(null);
    
    // Form state
    const [formData, setFormData] = useState({
        yearLabel: "",
        startDate: "",
        endDate: "",
    });

    // Reusable field-error handling (parses backend VALIDATION errors too)
    const {
        formErrors,
        clearFieldErrors,
        clearFieldError,
        setFieldErrors,
        applyBackendFieldErrors,
        fieldProps,
    } = useFormFieldErrors(YEAR_FIELD_NAMES);

    // Fetch all academic years
    const fetchAcademicYears = async () => {
        setLoading(true);
        try {
            const response = await instance.get("/academic-years");
            console.log("Academic Years:", response.data);
            setAcademicYears(response.data);
        } catch (err) {
            console.error("Error fetching academic years:", err);
            const errorMsg = err.response?.data?.message || err?.message || "Failed to fetch academic years";
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAcademicYears();
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

    // Validate form (only frontend date range validation)
    const validateForm = () => {
        // Only validate date range - backend handles field validation
        if (formData.startDate && formData.endDate) {
            const start = new Date(formData.startDate);
            const end = new Date(formData.endDate);
            if (start >= end) {
                toast.error("End date must be after start date");
                return false;
            }
        }
        return true;
    };

    // Create academic year
    const handleCreate = async () => {
        if (!validateForm()) return;

        setFormLoading(true);
        clearFieldErrors(); // Clear any previous errors

        try {
            const response = await instance.post("/academic-years/create", formData);
            console.log("Created:", response.data);

            toast.success("Academic year created successfully!");

            // Reset form and close dialog
            handleCloseDialog();
            fetchAcademicYears(); // Refresh list

        } catch (err) {
            console.error("Create error:", err);
            const handledAsFieldErrors = applyBackendFieldErrors(err);
            if (!handledAsFieldErrors) {
                const errorMsg = err.response?.data?.message || err?.message || "Failed to create academic year";
                toast.error(errorMsg);
            }
        } finally {
            setFormLoading(false);
        }
    };

    // Update academic year
    const handleUpdate = async () => {
        if (!validateForm()) return;

        setFormLoading(true);
        clearFieldErrors(); // Clear any previous errors

        try {
            const response = await instance.put(`/academic-years/${editingId}`, formData);
            console.log("Updated:", response.data);

            toast.success("Academic year updated successfully!");

            handleCloseDialog();
            fetchAcademicYears();

        } catch (err) {
            console.error("Update error:", err);
            const handledAsFieldErrors = applyBackendFieldErrors(err);
            if (!handledAsFieldErrors) {
                const errorMsg = err.response?.data?.message || err?.message || "Failed to update academic year";
                toast.error(errorMsg);
            }
        } finally {
            setFormLoading(false);
        }
    };

    // Delete academic year
    const handleDelete = async (id, yearLabel) => {
        if (!window.confirm(`Are you sure you want to delete "${yearLabel}"?`)) {
            return;
        }
        
        setLoading(true);
        try {
            await instance.delete(`/academic-years/${id}`);
            toast.success(`"${yearLabel}" deleted successfully!`);
            fetchAcademicYears();
        } catch (err) {
            console.error("Delete error:", err);
            const errorMsg = err.response?.data?.message || err?.message || "Failed to delete academic year";
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    // Toggle "Active" academic year
    const handleToggleActive = async (year) => {
        setTogglingId(year.id);
        try {
            await instance.patch(`/academic-years/${year.id}/active`);
            toast.success(
                year.active
                    ? `"${year.yearLabel}" marked as inactive`
                    : `"${year.yearLabel}" set as the active academic year`
            );
            fetchAcademicYears();
        } catch (err) {
            console.error("Toggle active error:", err);
            const errorMsg = err.response?.data?.message || err?.message || "Failed to update active status";
            toast.error(errorMsg);
        } finally {
            setTogglingId(null);
        }
    };

    // Open dialog for create/edit
    const handleOpenDialog = (year = null) => {
        if (year) {
            // Edit mode
            setEditingId(year.id);
            setFormData({
                yearLabel: year.yearLabel || "",
                startDate: year.startDate ? year.startDate.split('T')[0] : "",
                endDate: year.endDate ? year.endDate.split('T')[0] : "",
            });
        } else {
            // Create mode
            setEditingId(null);
            setFormData({
                yearLabel: "",
                startDate: "",
                endDate: "",
            });
        }
        clearFieldErrors();
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingId(null);
        setFormData({
            yearLabel: "",
            startDate: "",
            endDate: "",
        });
        clearFieldErrors();
    };

    // Prepare table data for ReusableTable
    const tableHeaders = ['S.No', 'Year Label', 'Start Date', 'End Date', 'Duration', 'Active', 'Actions'];
    
    const tableRows = academicYears.map((year, index) => {
        // Calculate duration in months
        const durationMonths = Math.ceil(
            (new Date(year.endDate) - new Date(year.startDate)) /
            (1000 * 60 * 60 * 24 * 30)
        );
        
        // Format dates
        const startDate = new Date(year.startDate).toLocaleDateString();
        const endDate = new Date(year.endDate).toLocaleDateString();
        
        // Create actions with icons
        const actions = (
            <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                <IconButton
                    size="small"
                    color="primary"
                    onClick={() => handleOpenDialog(year)}
                >
                    <EditIcon />
                </IconButton>
                <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDelete(year.id, year.yearLabel)}
                >
                    <DeleteIcon />
                </IconButton>
            </Box>
        );

        // Active/Inactive toggle switch
        const activeToggle = (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 0.5 }}>
                <Tooltip title={year.active ? "Click to mark inactive" : "Click to set as active"}>
                    <span>
                        <Switch
                            checked={!!year.active}
                            onChange={() => handleToggleActive(year)}
                            disabled={togglingId === year.id}
                            color="success"
                            size="small"
                        />
                    </span>
                </Tooltip>
                {togglingId === year.id ? (
                    <CircularProgress size={14} />
                ) : (
                    <Chip
                        label={year.active ? "Active" : "Inactive"}
                        color={year.active ? "success" : "default"}
                        size="small"
                        sx={{ fontWeight: 600 }}
                    />
                )}
            </Box>
        );
        
        return [
            <Box sx={{ display: "flex", justifyContent: "center" }}>
                {index + 1}
            </Box>,
            <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Typography sx={{ fontWeight: 600 }}>{year.yearLabel}</Typography>
            </Box>,
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5 }}>
                <CalendarIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                {startDate}
            </Box>,
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5 }}>
                <CalendarIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                {endDate}
            </Box>,
            <Box sx={{ display: "flex", justifyContent: "center" }}>
                {`${durationMonths} months`}
            </Box>,
            activeToggle,
            actions
        ];
    });

    return (
        <Box sx={{ p: { xs: 2, sm: 3 } }}>
            {/* Header */}
            <Paper
                elevation={0}
                sx={{
                    p: { xs: 2, sm: 3 },
                    mb: 3,
                    borderRadius: 3,
                    background: "linear-gradient(135deg, #0D47A1 0%, #1565C0 50%, #1976D2 100%)",
                    color: "#fff",
                }}
            >
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
                    <Box>
                        <Typography variant="h5" sx={{ fontWeight: 700 }}>
                            Academic Years
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.8, mt: 0.5 }}>
                            Manage academic years and their timelines
                        </Typography>
                    </Box>
                    <Box sx={{ display: "flex", gap: 1, mt: { xs: 2, sm: 0 } }}>
                        <Button
                            variant="contained"
                            startIcon={<RefreshIcon />}
                            onClick={fetchAcademicYears}
                            sx={{
                                bgcolor: "rgba(255,255,255,0.2)",
                                "&:hover": {
                                    bgcolor: "rgba(255,255,255,0.3)",
                                },
                            }}
                        >
                            Refresh
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => handleOpenDialog()}
                            sx={{
                                bgcolor: "#fff",
                                color: "#0D47A1",
                                "&:hover": {
                                    bgcolor: "#f5f5f5",
                                },
                            }}
                        >
                            Add New
                        </Button>
                    </Box>
                </Box>
            </Paper>

            {/* Table using ReusableTable */}
            <Paper
                elevation={0}
                sx={{
                    borderRadius: 3,
                    border: "1px solid rgba(0,0,0,0.08)",
                    overflow: "hidden",
                    p: 2,
                }}
            >
                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
                        <CircularProgress />
                    </Box>
                ) : academicYears.length === 0 ? (
                    <Box sx={{ textAlign: "center", p: 5 }}>
                        <Typography variant="h6" color="textSecondary">
                            No academic years found
                        </Typography>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => handleOpenDialog()}
                            sx={{ mt: 2 }}
                        >
                            Create First Academic Year
                        </Button>
                    </Box>
                ) : (
                    <ReusableTable 
                        headers={tableHeaders}
                        rows={tableRows}
                    />
                )}
            </Paper>

            {/* Create/Edit Dialog with Proper Alignment */}
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 4,
                        p: { xs: 1.5, sm: 2.5 },
                    },
                }}
            >
                <DialogTitle sx={{ 
                    fontWeight: 700, 
                    color: "#0D47A1",
                    fontSize: { xs: "1.2rem", sm: "1.5rem" },
                    pb: 1,
                }}>
                    {editingId ? "Edit Academic Year" : "Create New Academic Year"}
                </DialogTitle>
                <Divider sx={{ mb: 2 }} />
                
                <DialogContent sx={{ pt: 2 }}>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                        {/* Year Label */}
                        <Box>
                            <Typography
                                component="label"
                                sx={{
                                    fontWeight: 600,
                                    fontSize: "0.9rem",
                                    color: "#1A1A1A",
                                    display: "block",
                                    mb: 0.75,
                                }}
                            >
                                Year Label <span style={{ color: "#D32F2F" }}>*</span>
                            </Typography>
                            <TextField
                                fullWidth
                                name="yearLabel"
                                value={formData.yearLabel}
                                onChange={handleChange}
                                placeholder="e.g., 2026-2027"
                                {...fieldProps("yearLabel")}
                                variant="outlined"
                                size="medium"
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: 2,
                                        bgcolor: "#FAFBFC",
                                        "&:hover": {
                                            bgcolor: "#F5F7FA",
                                        },
                                    },
                                }}
                            />
                        </Box>

                        {/* Start Date & End Date */}
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <Typography
                                    component="label"
                                    sx={{
                                        fontWeight: 600,
                                        fontSize: "0.9rem",
                                        color: "#1A1A1A",
                                        display: "block",
                                        mb: 0.75,
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
                                            "&:hover": {
                                                bgcolor: "#F5F7FA",
                                            },
                                        },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography
                                    component="label"
                                    sx={{
                                        fontWeight: 600,
                                        fontSize: "0.9rem",
                                        color: "#1A1A1A",
                                        display: "block",
                                        mb: 0.75,
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
                                            "&:hover": {
                                                bgcolor: "#F5F7FA",
                                            },
                                        },
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>
                
                <DialogActions sx={{ 
                    p: 3, 
                    pt: 1, 
                    gap: 1.5,
                    borderTop: "1px solid #E8ECF1",
                }}>
                    <Button 
                        onClick={handleCloseDialog} 
                        variant="outlined"
                        sx={{
                            borderRadius: 2,
                            textTransform: "none",
                            fontWeight: 600,
                            borderColor: "#D1D5DB",
                            color: "#6B7280",
                            px: 3,
                            "&:hover": {
                                borderColor: "#9CA3AF",
                                bgcolor: "#F9FAFB",
                            },
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={editingId ? handleUpdate : handleCreate}
                        variant="contained"
                        disabled={formLoading}
                        sx={{
                            bgcolor: "#0D47A1",
                            borderRadius: 2,
                            textTransform: "none",
                            fontWeight: 600,
                            px: 3,
                            "&:hover": {
                                bgcolor: "#1565C0",
                            },
                        }}
                    >
                        {formLoading ? (
                            <CircularProgress size={24} sx={{ color: "#fff" }} />
                        ) : (
                            editingId ? "Update" : "Create"
                        )}
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
                style={{ zIndex: 9999 }}
            />
        </Box>
    );
};

export default AcademicYears;