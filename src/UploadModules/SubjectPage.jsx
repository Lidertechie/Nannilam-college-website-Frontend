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
  Checkbox,
  ListItemText,
  InputAdornment,
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
  Book,
  Subject,
} from "@mui/icons-material";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PageHeader from "./Pageheader";
import instance from "../AxiosInstance/AxiosInstance";
import ReusableTable from "../Common/Reusabletable";
import useFormFieldErrors from "../Common/useFormFieldErrors";

// Fields tracked for inline backend validation errors on this form
const SUBJECT_FIELD_NAMES = ["subjectName", "courseId"];

const SubjectPage = () => {
  const [subjects, setSubjects] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [fetchingCourses, setFetchingCourses] = useState(false);

  // Dialog states
  const [openDialog, setOpenDialog] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [formData, setFormData] = useState({
    subjectName: "",
    courseId: "",
  });

  // Reusable field-error handling (parses backend VALIDATION errors too)
  const {
    formErrors,
    clearFieldErrors,
    clearFieldError,
    setFieldErrors,
    applyBackendFieldErrors,
    fieldProps,
  } = useFormFieldErrors(SUBJECT_FIELD_NAMES);

  // View dialog states
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [viewSubject, setViewSubject] = useState(null);

  // Snackbar states
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: "", 
    severity: "success" 
  });

  // Fetch courses
  const fetchCourses = async () => {
    setFetchingCourses(true);
    try {
      const response = await instance.get("/courses");
      console.log("Courses:", response.data);
      setCourses(response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast.error("Failed to fetch courses");
    } finally {
      setFetchingCourses(false);
    }
  };

  // Fetch subjects
  const fetchSubjects = async () => {
    setLoading(true);
    try {
      const response = await instance.get("/subjects/all");
      console.log("Subjects:", response.data);
      setSubjects(response.data);
    } catch (error) {
      console.error("Error fetching subjects:", error);
      const errorMsg = error.response?.data?.message || "Failed to fetch subjects";
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
    fetchSubjects();
    fetchCourses();
  }, []);

  // Handle CRUD operations
  const handleOpenDialog = (subject = null) => {
    if (subject) {
      setEditingSubject(subject);
      setFormData({
        subjectName: subject.subjectName || "",
        courseId: subject.courseId || "",
      });
    } else {
      setEditingSubject(null);
      setFormData({
        subjectName: "",
        courseId: "",
      });
    }
    clearFieldErrors(); // Clear any previous field errors
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingSubject(null);
    setFormData({
      subjectName: "",
      courseId: "",
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

  const handleSaveSubject = async () => {
    setSubmitting(true);
    clearFieldErrors(); // Clear previous errors before API call

    try {
      const subjectData = {
        subjectName: formData.subjectName.trim(),
        courseId: parseInt(formData.courseId),
      };

      let response;
      if (editingSubject) {
        // Update subject
        response = await instance.put(`/subjects/${editingSubject.id}`, subjectData);
        console.log("Updated:", response.data);
        toast.success("Subject updated successfully!");
      } else {
        // Create subject
        response = await instance.post("/subjects", subjectData);
        console.log("Created:", response.data);
        toast.success("Subject created successfully!");
      }
      handleCloseDialog();
      await fetchSubjects();
    } catch (error) {
      console.error("Error saving subject:", error);
      const handledAsFieldErrors = applyBackendFieldErrors(error);
      if (!handledAsFieldErrors) {
        const errorMsg = error.response?.data?.message || "Failed to save subject";
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

  const handleDeleteSubject = async (id, subjectName) => {
    if (!window.confirm(`Are you sure you want to delete "${subjectName}"?`)) return;

    setLoading(true);
    try {
      await instance.delete(`/subjects/${id}`);
      toast.success(`"${subjectName}" deleted successfully!`);
      await fetchSubjects();
    } catch (error) {
      console.error("Error deleting subject:", error);
      const errorMsg = error.response?.data?.message || "Failed to delete subject";
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

  const handleViewSubject = (subject) => {
    setViewSubject(subject);
    setOpenViewDialog(true);
  };

  // Get course name by ID
  const getCourseName = (courseId) => {
    const course = courses.find(c => c.id === courseId);
    return course ? course.courseName : "N/A";
  };

  // Get course category by ID
  const getCourseCategory = (courseId) => {
    const course = courses.find(c => c.id === courseId);
    return course ? course.category : "N/A";
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
  const tableHeaders = ['S.No', 'Subject Name', 'Course', 'Category', 'Status', 'Actions'];
  
  const tableRows = subjects.map((subject, index) => {
    // Subject name with icon
    const subjectNameDisplay = (
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
        <Subject sx={{ fontSize: 18, color: "#1565C0" }} />
        <Typography
          sx={{
            fontWeight: 600,
            color: "#1E293B",
            "&:hover": { textDecoration: "underline", cursor: "pointer" },
          }}
          onClick={() => handleViewSubject(subject)}
        >
          {subject.subjectName}
        </Typography>
      </Box>
    );

    // Course name
    const courseDisplay = (
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5 }}>
        <Book sx={{ fontSize: 14, color: "#6B7280" }} />
        <Typography variant="body2">
          {subject.courseName || getCourseName(subject.courseId)}
        </Typography>
      </Box>
    );

    // Category
    const categoryDisplay = (
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Chip
          label={subject.category || getCourseCategory(subject.courseId)}
          size="small"
          sx={{
            bgcolor: "#E3F2FD",
            color: "#1565C0",
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
        {getStatusChip(subject.active)}
      </Box>
    );

    // Actions
    const actions = (
      <Box sx={{ display: "flex", justifyContent: "center", gap: 0.5 }}>
        <Tooltip title="View">
          <IconButton
            size="small"
            onClick={() => handleViewSubject(subject)}
            sx={{ color: "#8B5CF6", p: 0.5 }}
          >
            <Visibility fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Edit">
          <IconButton
            size="small"
            onClick={() => handleOpenDialog(subject)}
            sx={{ color: "#1E293B", p: 0.5 }}
          >
            <Edit fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton
            size="small"
            onClick={() => handleDeleteSubject(subject.id, subject.subjectName)}
            sx={{ color: "#EF4444", p: 0.5 }}
          >
            <Delete fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    );

    return [
      <Box key={`${subject.id}-index`} sx={{ display: "flex", justifyContent: "center" }}>
        {index + 1}
      </Box>,
      <Box key={`${subject.id}-name`}>
        {subjectNameDisplay}
      </Box>,
      <Box key={`${subject.id}-course`}>
        {courseDisplay}
      </Box>,
      <Box key={`${subject.id}-category`}>
        {categoryDisplay}
      </Box>,
      <Box key={`${subject.id}-status`}>
        {statusDisplay}
      </Box>,
      <Box key={`${subject.id}-actions`}>
        {actions}
      </Box>
    ];
  });

  return (
    <Box sx={{ bgcolor: "#f5f7fa", minHeight: "100vh", py: 4 }}>
      <PageHeader title="SUBJECTS" subtitle="Manage college subjects" />

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
                Subjects
              </Typography>
              <Typography variant="body2" sx={{ color: "#6B7280", mt: 0.5 }}>
                {subjects.length} {subjects.length === 1 ? 'subject' : 'subjects'} found
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={fetchSubjects}
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
                Create Subject
              </Button>
            </Box>
          </Box>

          {/* Table using ReusableTable */}
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
              <CircularProgress />
            </Box>
          ) : subjects.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 6 }}>
              <Subject sx={{ fontSize: 56, color: "#D1D5DB" }} />
              <Typography variant="h6" sx={{ color: "#6B7280", mt: 2 }}>
                No subjects found
              </Typography>
              <Typography variant="body2" sx={{ color: "#9CA3AF" }}>
                Create a new subject to get started
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => handleOpenDialog()}
                sx={{ mt: 2 }}
              >
                Create First Subject
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

      {/* Create/Edit Subject Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>
          {editingSubject ? "Edit Subject" : "Create New Subject"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              autoFocus
              margin="dense"
              label="Subject Name"
              name="subjectName"
              fullWidth
              value={formData.subjectName}
              onChange={handleChange}
              {...fieldProps("subjectName")}
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Subject sx={{ fontSize: 20, color: "#6B7280" }} />
                  </InputAdornment>
                ),
              }}
            />

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Course</InputLabel>
              <Select
                name="courseId"
                value={formData.courseId}
                onChange={handleChange}
                label="Course"
                error={!!formErrors.courseId}
              >
                <MenuItem value="">Select Course</MenuItem>
                {courses.map((course) => (
                  <MenuItem key={course.id} value={course.id}>
                    {course.courseName} ({course.category})
                  </MenuItem>
                ))}
              </Select>
              {formErrors.courseId && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                  {formErrors.courseId}
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
            onClick={handleSaveSubject}
            variant="contained"
            disabled={submitting}
            sx={{ bgcolor: "#1E293B" }}
          >
            {submitting ? (
              <CircularProgress size={24} sx={{ color: "#fff" }} />
            ) : (
              editingSubject ? "Update" : "Create"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Subject Dialog */}
      <Dialog
        open={openViewDialog}
        onClose={() => setOpenViewDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        {viewSubject && (
          <>
            <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="h6" fontWeight={700}>
                  Subject Details
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
                  <Subject sx={{ color: "#1565C0" }} />
                  <Typography variant="h6" fontWeight={700}>
                    {viewSubject.subjectName}
                  </Typography>
                </Box>

                <Divider sx={{ mb: 2 }} />

                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Box>
                    <Typography variant="caption" sx={{ color: "#9CA3AF", fontWeight: 600, display: "block", mb: 0.5 }}>
                      COURSE
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Book sx={{ fontSize: 18, color: "#6B7280" }} />
                      <Typography variant="body2" sx={{ color: "#1A1A1A", fontWeight: 500 }}>
                        {viewSubject.courseName || getCourseName(viewSubject.courseId)}
                      </Typography>
                    </Box>
                  </Box>

                  <Box>
                    <Typography variant="caption" sx={{ color: "#9CA3AF", fontWeight: 600, display: "block", mb: 0.5 }}>
                      CATEGORY
                    </Typography>
                    <Chip
                      label={viewSubject.category || getCourseCategory(viewSubject.courseId)}
                      sx={{
                        bgcolor: "#E3F2FD",
                        color: "#1565C0",
                        fontWeight: 600,
                      }}
                    />
                  </Box>

                  <Box>
                    <Typography variant="caption" sx={{ color: "#9CA3AF", fontWeight: 600, display: "block", mb: 0.5 }}>
                      STATUS
                    </Typography>
                    {getStatusChip(viewSubject.active)}
                  </Box>

                  <Box>
                    <Typography variant="caption" sx={{ color: "#9CA3AF", fontWeight: 600, display: "block", mb: 0.5 }}>
                      CREATED ON
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#6B7280" }}>
                      {viewSubject.createdAt ? new Date(viewSubject.createdAt).toLocaleDateString('en-IN', {
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
                  handleOpenDialog(viewSubject);
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

export default SubjectPage;