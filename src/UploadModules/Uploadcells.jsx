import React, { useState, useEffect } from "react";
import {
  MenuItem,
  Box,
  Paper,
  Typography,
  Avatar,
  TextField,
  Button,
  Container,
  Grid,
  Chip,
  Fade,
  Slide,
  useTheme,
  useMediaQuery,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  School,
  Person,
  Category,
  Save,
  Add,
  EmojiEvents,
  Edit,
  Delete,
  Close,
} from "@mui/icons-material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import instance from "../AxiosInstance/AxiosInstance";
import PageHeader from "./Pageheader";
import Reusabletable from "../Common/Reusabletable";
import useFormFieldErrors from "../Common/useFormFieldErrors";

// Fields tracked for inline backend validation errors on this form
const CELL_FIELD_NAMES = ["category", "courseId", "staffId"];

const CellPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [formData, setFormData] = useState({
    category: "",
    staffType: "TEACHING", // NEW: Teaching / Non-Teaching toggle
    courseId: "",
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
  } = useFormFieldErrors(CELL_FIELD_NAMES);

  const [cellsData, setCellsData] = useState([]);
  const [courses, setCourses] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const isNonTeaching = formData.staffType === "NON_TEACHING";

  // Page load aagum bothu courses fetch pannurom
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await instance.get("/courses");
        setCourses(response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
        toast.error("Failed to load courses");
      }
    };

    fetchCourses();
  }, []);

  // Ella cells um API la irundhu fetch pannurom
  const fetchCells = async () => {
    setLoading(true);
    try {
      const response = await instance.get("/cells");
      setCellsData(response.data);
    } catch (error) {
      console.error("Error fetching cells:", error);
      toast.error("Failed to load cells");
    } finally {
      setLoading(false);
    }
  };

  // Page load aagum bothu ella cells um fetch pannurom
  useEffect(() => {
    fetchCells();
  }, []);

  // Course select pannumbodhu, andha course ku matching staff fetch pannurom
  // Teaching staffType ku mattum indha flow (course based staff fetch)
  useEffect(() => {
    if (isNonTeaching) {
      // Non-teaching ku course thevai illa, andha effect skip pannurom
      return;
    }

    if (!formData.courseId) {
      setStaffList([]);
      return;
    }

    const fetchStaffByCourse = async () => {
      try {
        const response = await instance.get(
          `/staff/by-course?courseId=${formData.courseId}`
        );
        setStaffList(response.data);
      } catch (error) {
        console.error("Error fetching staff:", error);
        toast.error("Failed to load staff for this course");
      }
    };

    fetchStaffByCourse();
  }, [formData.courseId, isNonTeaching]);

  // NEW: Non-Teaching staffType select pannumbodhu, staffType api vachu staff fetch pannurom
  useEffect(() => {
    if (!isNonTeaching) {
      return;
    }

    const fetchStaffByType = async () => {
      try {
        const response = await instance.get(
          `/staff/by-type?staffType=NON_TEACHING`
        );
        setStaffList(response.data);
      } catch (error) {
        console.error("Error fetching non-teaching staff:", error);
        toast.error("Failed to load non-teaching staff");
      }
    };

    fetchStaffByType();
  }, [isNonTeaching]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "courseId" ? { staffId: "" } : {}),
      // staffType maarina, courseId & staffId reset pannurom
      ...(name === "staffType" ? { courseId: "", staffId: "" } : {}),
    }));

    clearFieldError(name); // Clear error for this field when user types
  };

  const saveCell = async () => {
    setLoading(true);
    clearFieldErrors(); // Clear previous errors before API call

    try {
      const payload = {
        category: formData.category,
        staffType: formData.staffType,
        // Non-teaching ku courseId thevai illa
        courseId: isNonTeaching ? null : Number(formData.courseId),
        staffId: Number(formData.staffId),
      };

      if (editingId) {
        await instance.put(`/cells/${editingId}`, payload);
        toast.success("Cell updated successfully");
      } else {
        await instance.post("/cells", payload);
        toast.success("Cell added successfully");
      }

      setFormData({
        category: "",
        staffType: "TEACHING",
        courseId: "",
        staffId: "",
      });
      setStaffList([]);
      setEditingId(null);
      await fetchCells();
    } catch (error) {
      console.error("Error:", error);
      const handledAsFieldErrors = applyBackendFieldErrors(error);
      if (!handledAsFieldErrors) {
        toast.error(editingId ? "Failed to update cell" : "Failed to add cell");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (cell) => {
    const id = cell.id || cell.cellId;
    // Backend la staffType irundha adha use pannurom, illana courseId irundha TEACHING nu assume pannurom
    const resolvedStaffType =
      cell.staffType || (cell.courseId ? "TEACHING" : "NON_TEACHING");

    setEditingId(id);
    setFormData({
      category: cell.category || "",
      staffType: resolvedStaffType,
      courseId: resolvedStaffType === "NON_TEACHING" ? "" : String(cell.courseId ?? ""),
      staffId: String(cell.staffId ?? ""),
    });
    clearFieldErrors(); // Clear any previous field errors when editing
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({
      category: "",
      staffType: "TEACHING",
      courseId: "",
      staffId: "",
    });
    setStaffList([]);
    clearFieldErrors(); // Clear errors when cancelling
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this cell?")) return;

    setLoading(true);
    try {
      await instance.delete(`/cells/${id}`);
      if (editingId === id) {
        cancelEdit();
      }
      toast.success("Cell deleted successfully");
      await fetchCells();
    } catch (error) {
      console.error("Error deleting cell:", error);
      toast.error("Failed to delete cell");
    } finally {
      setLoading(false);
    }
  };

  const categoryOptions = ["NSS", "YRC", "RRC", "CCC", "PTA","OSA"];

  const staffTypeOptions = [
    { value: "TEACHING", label: "Teaching" },
    { value: "NON_TEACHING", label: "Non-Teaching" },
  ];

  const getCourseName = (courseId) => {
    const course = courses.find((c) => c.id === courseId || c.courseId === courseId);
    return course ? course.courseName || course.name : "";
  };

  const getStaffName = (staffId) => {
    const staff = staffList.find((s) => s.id === staffId || s.staffId === staffId);
    return staff ? staff.staffName || staff.name : staffId;
  };

const categoryColors = {
  NSS: "#4CAF50",
  YRC: "#FF9800",
  RRC: "#2196F3",
  CCC: "#9C27B0",
  PTA: "#F44336",
  OSA: "#00BCD4",
};

  const getCategoryColor = (category) => {
    return categoryColors[category] || "#1976d2";
  };

  // Prepare table data
  const tableHeaders = ["S.No", "Category", "Course", "Staff", "Actions"];

  const tableRows = cellsData.map((cell, index) => {
    const id = cell.id ?? cell.cellId;
    return [
      (index + 1).toString(),
      cell.category || "",
      cell.courseName || getCourseName(cell.courseId) || "",
      cell.staffName || getStaffName(cell.staffId) || "",
      <Box key={id} sx={{ display: "flex", gap: 0.5 }}>
        <Tooltip title="Edit">
          <IconButton
            size="small"
            onClick={() => handleEdit(cell)}
            sx={{ color: "#1976d2" }}
          >
            <Edit fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton
            size="small"
            onClick={() => handleDelete(id)}
            sx={{ color: "#d32f2f" }}
          >
            <Delete fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>,
    ];
  });

  return (
    <Box sx={{ bgcolor: "#f5f7fa", minHeight: "100vh", pb: 4 }}>
      <ToastContainer position="bottom-right" autoClose={3000} />
      <PageHeader title="CELL" subtitle="College cells and committees" />

      <Container maxWidth={false} sx={{ px: { xs: 2, sm: 3, md: 5 } }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            flexWrap: "nowrap",
            alignItems: "flex-start",
            gap: 3,
            width: "100%",
          }}
        >
          {/* Form Section - fixed width, never causes wrap */}
          <Box sx={{ width: { xs: "100%", md: 320 }, flex: "0 0 auto" }}>
            <Slide direction="right" in={true} mountOnEnter unmountOnExit>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 4,
                  border: "1px solid #e8ecf1",
                  bgcolor: "#ffffff",
                  position: "sticky",
                  top: 24,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  {editingId ? (
                    <Edit sx={{ color: "#1976d2", mr: 1.5 }} />
                  ) : (
                    <Add sx={{ color: "#1976d2", mr: 1.5 }} />
                  )}
                  <Typography variant="h6" fontWeight={700}>
                    {editingId ? "Edit Cell" : "Add New Cell"}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2.5,
                  }}
                >
                  <TextField
                    select
                    label="Category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    size="medium"
                    fullWidth
                    {...fieldProps("category")}
                    InputProps={{
                      startAdornment: (
                        <Category sx={{ mr: 1, color: "#757575", fontSize: 20 }} />
                      ),
                    }}
                  >
                    <MenuItem value="">
                      <em>Select Category</em>
                    </MenuItem>
                    {categoryOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Chip
                            label={option}
                            size="small"
                            sx={{
                              bgcolor: getCategoryColor(option),
                              color: "#fff",
                              fontWeight: 600,
                              fontSize: "0.7rem",
                              height: 24,
                            }}
                          />
                        </Box>
                      </MenuItem>
                    ))}
                  </TextField>

                  {/* NEW: Staff Type - decides whether Course field is shown */}
                  <TextField
                    select
                    label="Staff Type"
                    name="staffType"
                    value={formData.staffType}
                    onChange={handleChange}
                    size="medium"
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <Person sx={{ mr: 1, color: "#757575", fontSize: 20 }} />
                      ),
                    }}
                  >
                    {staffTypeOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>

                  {/* Course field - only for Teaching staffType */}
                  {!isNonTeaching && (
                    <TextField
                      select
                      label="Course"
                      name="courseId"
                      value={formData.courseId}
                      onChange={handleChange}
                      size="medium"
                      fullWidth
                      {...fieldProps("courseId")}
                      InputProps={{
                        startAdornment: (
                          <School sx={{ mr: 1, color: "#757575", fontSize: 20 }} />
                        ),
                      }}
                    >
                      <MenuItem value="">
                        <em>Select Course</em>
                      </MenuItem>
                      {courses.map((course) => (
                        <MenuItem
                          key={course.id || course.courseId}
                          value={course.id || course.courseId}
                        >
                          {course.courseName || course.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}

                  <TextField
                    select
                    label="Staff"
                    name="staffId"
                    value={formData.staffId}
                    onChange={handleChange}
                    size="medium"
                    fullWidth
                    disabled={!isNonTeaching && !formData.courseId}
                    {...fieldProps("staffId")}
                    helperText={
                      !isNonTeaching && !formData.courseId
                        ? "Please select a course first"
                        : ""
                    }
                    InputProps={{
                      startAdornment: (
                        <Person sx={{ mr: 1, color: "#757575", fontSize: 20 }} />
                      ),
                    }}
                  >
                    <MenuItem value="">
                      <em>Select Staff</em>
                    </MenuItem>
                    {staffList.map((staff) => (
                      <MenuItem
                        key={staff.id || staff.staffId}
                        value={staff.id || staff.staffId}
                      >
                        {staff.staffName || staff.name}
                      </MenuItem>
                    ))}
                  </TextField>

                  <Box sx={{ display: "flex", gap: 1.5, mt: 1, flexWrap: "wrap" }}>
                    <Button
                      variant="contained"
                      onClick={saveCell}

                      startIcon={<Save />}
                      sx={{
                        py: 1.2,
                        borderRadius: 3,
                        bgcolor: "#1976d2",
                        "&:hover": {
                          bgcolor: "#1565c0",
                          transform: "translateY(-2px)",
                          boxShadow: "0 6px 20px rgba(25, 118, 210, 0.3)",
                        },
                        transition: "all 0.3s ease",
                        flex: editingId ? "1 1 auto" : "1 1 100%",
                      }}
                    >
                      {loading
                        ? editingId
                          ? "Updating..."
                          : "Saving..."
                        : editingId
                          ? "Update Cell"
                          : "Save Cell"}
                    </Button>
                    {editingId && (
                      <Button
                        variant="outlined"
                        onClick={cancelEdit}
                        startIcon={<Close />}
                        sx={{
                          py: 1.2,
                          borderRadius: 3,
                          whiteSpace: "nowrap",
                          flex: "1 1 auto",
                        }}
                      >
                        Cancel
                      </Button>
                    )}
                  </Box>
                </Box>
              </Paper>
            </Slide>
          </Box>

          {/* Table Section - takes remaining width, never wraps below the form */}
          <Box sx={{ flex: "1 1 0%", minWidth: 0, width: "100%" }}>
            {cellsData.length === 0 ? (
              <Fade in={true}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 6,
                    borderRadius: 4,
                    border: "2px dashed #dce0e6",
                    bgcolor: "#fafbfc",
                    textAlign: "center",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <EmojiEvents sx={{ fontSize: 60, color: "#bdbdbd", mb: 2 }} />
                  <Typography variant="h6" fontWeight={600} color="text.secondary">
                    No Cells Found
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Add a new cell using the form, or check back later
                  </Typography>
                </Paper>
              </Fade>
            ) : (
              <Fade in={true}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 4,
                    border: "1px solid #e8ecf1",
                    bgcolor: "#ffffff",
                  }}
                >
              
                    <Reusabletable
                      headers={tableHeaders}
                      rows={tableRows}
                    />
               
                </Paper>
              </Fade>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default CellPage;