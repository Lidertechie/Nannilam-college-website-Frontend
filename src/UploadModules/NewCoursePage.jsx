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
  Language,
} from "@mui/icons-material";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PageHeader from "./Pageheader";
import instance from "../AxiosInstance/AxiosInstance";
import ReusableTable from "../Common/Reusabletable";
import useFormFieldErrors from "../Common/useFormFieldErrors";

// Fields tracked for inline backend validation errors on this form
const COURSE_FIELD_NAMES = ["category", "courseName", "mediumOfInstruction", "departmentDivisionId"];

const NewCoursePage = () => {
  const [courses, setCourses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [fetchingDepartments, setFetchingDepartments] = useState(false);

  // Dialog states
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({
    category: "",
    courseName: "",
    mediumOfInstruction: "",
    departmentDivisionId: "",
  });

  // Reusable field-error handling (parses backend VALIDATION errors too)
  const {
    formErrors,
    clearFieldErrors,
    clearFieldError,
    setFieldErrors,
    applyBackendFieldErrors,
    fieldProps,
  } = useFormFieldErrors(COURSE_FIELD_NAMES);

  // View dialog states
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [viewCourse, setViewCourse] = useState(null);

  // Snackbar states
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: "", 
    severity: "success" 
  });

  // Category options
  const categoryOptions = ['UG', 'PG', 'Diploma', 'Certificate'];

  // Medium of instruction options
  const mediumOptions = ['English', 'Tamil', 'Hindi', 'Other'];

  // Fetch departments with their divisions
  const fetchDepartments = async () => {
    setFetchingDepartments(true);
    try {
      const response = await instance.get("/departments");
      console.log("Departments:", response.data);
      setDepartments(response.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
      toast.error("Failed to fetch departments");
    } finally {
      setFetchingDepartments(false);
    }
  };

  // Fetch courses
  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await instance.get("/courses");
      console.log("Courses:", response.data);
      setCourses(response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
      const errorMsg = error.response?.data?.message || "Failed to fetch courses";
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
    fetchCourses();
    fetchDepartments();
  }, []);

  // Get all divisions with department info
  const getAllDivisions = () => {
    const divisions = [];
    departments.forEach(dept => {
      if (dept.divisions && dept.divisions.length > 0) {
        dept.divisions.forEach(div => {
          divisions.push({
            id: div.id,
            category: div.category,
            departmentName: dept.name,
            departmentId: dept.id,
            label: `${dept.name} - ${div.category}`
          });
        });
      }
    });
    return divisions;
  };

  // Handle CRUD operations
  const handleOpenDialog = (course = null) => {
    if (course) {
      setEditingCourse(course);
      setFormData({
        category: course.category || "",
        courseName: course.courseName || "",
        mediumOfInstruction: course.mediumOfInstruction || "",
        departmentDivisionId: course.departmentDivisionId || "",
      });
    } else {
      setEditingCourse(null);
      setFormData({
        category: "",
        courseName: "",
        mediumOfInstruction: "",
        departmentDivisionId: "",
      });
    }
    clearFieldErrors(); // Clear any previous field errors
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCourse(null);
    setFormData({
      category: "",
      courseName: "",
      mediumOfInstruction: "",
      departmentDivisionId: "",
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

  const handleSaveCourse = async () => {
    setSubmitting(true);
    clearFieldErrors(); // Clear previous errors before API call

    try {
      const courseData = {
        category: formData.category,
        courseName: formData.courseName.trim(),
        mediumOfInstruction: formData.mediumOfInstruction,
        departmentDivisionId: parseInt(formData.departmentDivisionId),
      };

      let response;
      if (editingCourse) {
        // Update course
        response = await instance.put(`/courses/${editingCourse.id}`, courseData);
        console.log("Updated:", response.data);
        toast.success("Course updated successfully!");
      } else {
        // Create course
        response = await instance.post("/courses", courseData);
        console.log("Created:", response.data);
        toast.success("Course created successfully!");
      }
      handleCloseDialog();
      await fetchCourses();
    } catch (error) {
      console.error("Error saving course:", error);
      const handledAsFieldErrors = applyBackendFieldErrors(error);
      if (!handledAsFieldErrors) {
        const errorMsg = error.response?.data?.message || "Failed to save course";
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

  const handleDeleteCourse = async (id, courseName) => {
    if (!window.confirm(`Are you sure you want to delete "${courseName}"?`)) return;

    setLoading(true);
    try {
      await instance.delete(`/courses/${id}`);
      toast.success(`"${courseName}" deleted successfully!`);
      await fetchCourses();
    } catch (error) {
      console.error("Error deleting course:", error);
      const errorMsg = error.response?.data?.message || "Failed to delete course";
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

  const handleViewCourse = (course) => {
    setViewCourse(course);
    setOpenViewDialog(true);
  };

  // Get department division label by ID
  const getDivisionLabel = (divisionId) => {
    const divisions = getAllDivisions();
    const division = divisions.find(d => d.id === divisionId);
    return division ? division.label : "N/A";
  };

  // Get category chip color
  const getCategoryColor = (category) => {
    const colors = {
      'UG': '#4CAF50',
      'PG': '#2196F3',
      'Diploma': '#FF9800',
      'Certificate': '#9C27B0'
    };
    return colors[category] || '#6B7280';
  };

  // Prepare table data for ReusableTable
  const tableHeaders = ['S.No', 'Course Name', 'Category', 'Medium', 'Department', 'Actions'];
  
  const tableRows = courses.map((course, index) => {
    // Course name with icon
    const courseNameDisplay = (
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
        <Book sx={{ fontSize: 18, color: "#1565C0" }} />
        <Typography
          sx={{
            fontWeight: 600,
            color: "#1E293B",
            "&:hover": { textDecoration: "underline", cursor: "pointer" },
          }}
          onClick={() => handleViewCourse(course)}
        >
          {course.courseName}
        </Typography>
      </Box>
    );

    // Category chip
    const categoryDisplay = (
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Chip
          label={course.category}
          size="small"
          sx={{
            bgcolor: getCategoryColor(course.category),
            color: "#fff",
            fontWeight: 600,
            fontSize: "0.65rem",
            height: 24,
          }}
        />
      </Box>
    );

    // Medium of instruction
    const mediumDisplay = (
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5 }}>
        <Language sx={{ fontSize: 14, color: "#6B7280" }} />
        <Typography variant="body2">{course.mediumOfInstruction}</Typography>
      </Box>
    );

    // Department with division
    const departmentDisplay = (
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Tooltip title={getDivisionLabel(course.departmentDivisionId)}>
          <Chip
            label={getDivisionLabel(course.departmentDivisionId)}
            size="small"
            sx={{
              bgcolor: "#E3F2FD",
              color: "#1565C0",
              fontWeight: 600,
              fontSize: "0.65rem",
              height: 24,
              maxWidth: 150,
            }}
          />
        </Tooltip>
      </Box>
    );

    // Actions
    const actions = (
      <Box sx={{ display: "flex", justifyContent: "center", gap: 0.5 }}>
        <Tooltip title="View">
          <IconButton
            size="small"
            onClick={() => handleViewCourse(course)}
            sx={{ color: "#8B5CF6", p: 0.5 }}
          >
            <Visibility fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Edit">
          <IconButton
            size="small"
            onClick={() => handleOpenDialog(course)}
            sx={{ color: "#1E293B", p: 0.5 }}
          >
            <Edit fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton
            size="small"
            onClick={() => handleDeleteCourse(course.id, course.courseName)}
            sx={{ color: "#EF4444", p: 0.5 }}
          >
            <Delete fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    );

    return [
      <Box key={`${course.id}-index`} sx={{ display: "flex", justifyContent: "center" }}>
        {index + 1}
      </Box>,
      <Box key={`${course.id}-name`}>
        {courseNameDisplay}
      </Box>,
      <Box key={`${course.id}-category`}>
        {categoryDisplay}
      </Box>,
      <Box key={`${course.id}-medium`}>
        {mediumDisplay}
      </Box>,
      <Box key={`${course.id}-department`}>
        {departmentDisplay}
      </Box>,
      <Box key={`${course.id}-actions`}>
        {actions}
      </Box>
    ];
  });

  return (
    <Box sx={{ bgcolor: "#f5f7fa", minHeight: "100vh", py: 4 }}>
      <PageHeader title="COURSES" subtitle="Manage college courses" />

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
                Courses
              </Typography>
              <Typography variant="body2" sx={{ color: "#6B7280", mt: 0.5 }}>
                {courses.length} {courses.length === 1 ? 'course' : 'courses'} found
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={fetchCourses}
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
                Create Course
              </Button>
            </Box>
          </Box>

          {/* Table using ReusableTable */}
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
              <CircularProgress />
            </Box>
          ) : courses.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 6 }}>
              <Book sx={{ fontSize: 56, color: "#D1D5DB" }} />
              <Typography variant="h6" sx={{ color: "#6B7280", mt: 2 }}>
                No courses found
              </Typography>
              <Typography variant="body2" sx={{ color: "#9CA3AF" }}>
                Create a new course to get started
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => handleOpenDialog()}
                sx={{ mt: 2 }}
              >
                Create First Course
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

      {/* Create/Edit Course Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>
          {editingCourse ? "Edit Course" : "Create New Course"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              autoFocus
              margin="dense"
              label="Course Name"
              name="courseName"
              fullWidth
              value={formData.courseName}
              onChange={handleChange}
              {...fieldProps("courseName")}
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Book sx={{ fontSize: 20, color: "#6B7280" }} />
                  </InputAdornment>
                ),
              }}
            />

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Category</InputLabel>
              <Select
                name="category"
                value={formData.category}
                onChange={handleChange}
                label="Category"
                error={!!formErrors.category}
              >
                <MenuItem value="">Select Category</MenuItem>
                {categoryOptions.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
              {formErrors.category && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                  {formErrors.category}
                </Typography>
              )}
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Medium of Instruction</InputLabel>
              <Select
                name="mediumOfInstruction"
                value={formData.mediumOfInstruction}
                onChange={handleChange}
                label="Medium of Instruction"
                error={!!formErrors.mediumOfInstruction}
              >
                <MenuItem value="">Select Medium</MenuItem>
                {mediumOptions.map((medium) => (
                  <MenuItem key={medium} value={medium}>
                    {medium}
                  </MenuItem>
                ))}
              </Select>
              {formErrors.mediumOfInstruction && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                  {formErrors.mediumOfInstruction}
                </Typography>
              )}
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Department & Division</InputLabel>
              <Select
                name="departmentDivisionId"
                value={formData.departmentDivisionId}
                onChange={handleChange}
                label="Department & Division"
                error={!!formErrors.departmentDivisionId}
              >
                <MenuItem value="">Select Department & Division</MenuItem>
                {getAllDivisions().map((division) => (
                  <MenuItem key={division.id} value={division.id}>
                    {division.label}
                  </MenuItem>
                ))}
              </Select>
              {formErrors.departmentDivisionId && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                  {formErrors.departmentDivisionId}
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
            onClick={handleSaveCourse}
            variant="contained"
            disabled={submitting}
            sx={{ bgcolor: "#1E293B" }}
          >
            {submitting ? (
              <CircularProgress size={24} sx={{ color: "#fff" }} />
            ) : (
              editingCourse ? "Update" : "Create"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Course Dialog */}
      <Dialog
        open={openViewDialog}
        onClose={() => setOpenViewDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        {viewCourse && (
          <>
            <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="h6" fontWeight={700}>
                  Course Details
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
                  <Book sx={{ color: "#1565C0" }} />
                  <Typography variant="h6" fontWeight={700}>
                    {viewCourse.courseName}
                  </Typography>
                </Box>

                <Divider sx={{ mb: 2 }} />

                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Box>
                    <Typography variant="caption" sx={{ color: "#9CA3AF", fontWeight: 600, display: "block", mb: 0.5 }}>
                      CATEGORY
                    </Typography>
                    <Chip
                      label={viewCourse.category}
                      sx={{
                        bgcolor: getCategoryColor(viewCourse.category),
                        color: "#fff",
                        fontWeight: 600,
                      }}
                    />
                  </Box>

                  <Box>
                    <Typography variant="caption" sx={{ color: "#9CA3AF", fontWeight: 600, display: "block", mb: 0.5 }}>
                      MEDIUM OF INSTRUCTION
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Language sx={{ fontSize: 18, color: "#6B7280" }} />
                      <Typography variant="body2" sx={{ color: "#1A1A1A", fontWeight: 500 }}>
                        {viewCourse.mediumOfInstruction}
                      </Typography>
                    </Box>
                  </Box>

                  <Box>
                    <Typography variant="caption" sx={{ color: "#9CA3AF", fontWeight: 600, display: "block", mb: 0.5 }}>
                      DEPARTMENT & DIVISION
                    </Typography>
                    <Chip
                      label={getDivisionLabel(viewCourse.departmentDivisionId)}
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
                    <Chip
                      label={viewCourse.active !== false ? "Active" : "Inactive"}
                      sx={{
                        bgcolor: viewCourse.active !== false ? "#E8F5E9" : "#FFEBEE",
                        color: viewCourse.active !== false ? "#2E7D32" : "#C62828",
                        fontWeight: 600,
                      }}
                    />
                  </Box>

                  <Box>
                    <Typography variant="caption" sx={{ color: "#9CA3AF", fontWeight: 600, display: "block", mb: 0.5 }}>
                      CREATED ON
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#6B7280" }}>
                      {viewCourse.createdAt ? new Date(viewCourse.createdAt).toLocaleDateString('en-IN', {
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
                  handleOpenDialog(viewCourse);
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

export default NewCoursePage;