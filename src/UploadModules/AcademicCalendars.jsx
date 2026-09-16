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
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  CalendarToday,
  School,
  Description,
  CheckCircle,
  CloudUpload,
  Close,
  InsertDriveFile,
  Check,
  Error,
  Visibility,
  Download,
  PictureAsPdf,
  Image,
  Description as FileIcon,
  FolderOpen,
  Refresh,
  Save as SaveIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import instance from "../AxiosInstance/AxiosInstance";
import PageHeader from "../UploadModules/Pageheader";
import ReusableTable from "../Common/Reusabletable";
import { uploadFileToCloudinary } from "../Common/Fileupload";
import useFormFieldErrors from "../Common/useFormFieldErrors";

// ---------- Constants (moved out of component so they aren't re-created every render) ----------

const CALENDAR_FIELD_NAMES = ["title", "description", "academicYearId"];

const FILE_ICON_MAP = {
  pdf: { icon: PictureAsPdf, color: "#D32F2F" },
  jpg: { icon: Image, color: "#1976D2" },
  jpeg: { icon: Image, color: "#1976D2" },
  png: { icon: Image, color: "#1976D2" },
  gif: { icon: Image, color: "#1976D2" },
  bmp: { icon: Image, color: "#1976D2" },
  svg: { icon: Image, color: "#1976D2" },
  webp: { icon: Image, color: "#1976D2" },
  doc: { icon: FileIcon, color: "#2E7D32" },
  docx: { icon: FileIcon, color: "#2E7D32" },
};

const FILE_TYPE_LABELS = {
  pdf: "PDF Document",
  jpg: "JPEG Image",
  jpeg: "JPEG Image",
  png: "PNG Image",
  gif: "GIF Image",
  doc: "Word Document",
  docx: "Word Document",
  xls: "Excel Document",
  xlsx: "Excel Document",
  txt: "Text Document",
};

const EMPTY_FORM = { title: "", description: "", academicYearId: "" };

const getExtension = (fileName = "") => fileName.split(".").pop()?.toLowerCase() || "";

const getFileIcon = (fileName) => {
  const { icon: Icon, color } = FILE_ICON_MAP[getExtension(fileName)] || {
    icon: InsertDriveFile,
    color: "#6B7280",
  };
  return <Icon sx={{ color }} />;
};

const getFileTypeLabel = (fileName) => {
  const ext = getExtension(fileName);
  return FILE_TYPE_LABELS[ext] || `${ext.toUpperCase()} File`;
};

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const FileUploadZone = styled(Box)(({ theme }) => ({
  border: `2px dashed ${theme.palette.primary.main}`,
  borderRadius: 12,
  padding: theme.spacing(3),
  textAlign: "center",
  cursor: "pointer",
  transition: "all 0.3s ease",
  backgroundColor: alpha(theme.palette.primary.main, 0.02),
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
    borderColor: theme.palette.primary.dark,
  },
}));

// ---------- Small reusable confirmation dialog (replaces 2 nearly-identical dialogs) ----------

const ConfirmDialog = ({ open, onClose, onConfirm, title, message, note, isMobile }) => (
  <Dialog
    open={open}
    onClose={onClose}
    PaperProps={{ sx: { borderRadius: 3, minWidth: { xs: "90%", sm: 400 } } }}
  >
    <DialogTitle sx={{ pb: 1, fontWeight: 700, display: "flex", alignItems: "center", gap: 2 }}>
      <Box
        sx={{
          bgcolor: "#FFEBEE",
          borderRadius: "50%",
          width: 40,
          height: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Delete sx={{ color: "#C62828" }} />
      </Box>
      {title}
    </DialogTitle>
    <DialogContent>
      <Typography sx={{ color: "#424242" }}>{message}</Typography>
      {note}
      <Typography variant="body2" sx={{ color: "#757575", mt: 2 }}>
        This action cannot be undone.
      </Typography>
    </DialogContent>
    <DialogActions sx={{ px: 3, pb: 3, gap: 1, flexDirection: { xs: "column-reverse", sm: "row" } }}>
      <Button
        onClick={onClose}
        variant="outlined"
        fullWidth={isMobile}
        sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600, borderColor: "#D1D5DB", color: "#6B7280" }}
      >
        Cancel
      </Button>
      <Button
        onClick={onConfirm}
        variant="contained"
        color="error"
        fullWidth={isMobile}
        startIcon={<Delete />}
        sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600, bgcolor: "#D32F2F", "&:hover": { bgcolor: "#C62828" } }}
      >
        Delete
      </Button>
    </DialogActions>
  </Dialog>
);

// ---------- Main component ----------

const AcademicCalendars = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [calendars, setCalendars] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingYears, setFetchingYears] = useState(false);

  // Calendar create/edit dialog
  const [calendarDialog, setCalendarDialog] = useState({ open: false, editing: null, saving: false });
  const [formData, setFormData] = useState(EMPTY_FORM);
  const { formErrors, clearFieldErrors, clearFieldError, applyBackendFieldErrors, fieldProps } =
    useFormFieldErrors(CALENDAR_FIELD_NAMES);

  // Calendar delete confirmation
  const [calendarToDelete, setCalendarToDelete] = useState(null);

  // File upload dialog
  const [uploadDialog, setUploadDialog] = useState({
    open: false,
    calendar: null,
    file: null,
    uploading: false,
    progress: 0,
    status: null, // 'uploading' | 'success' | 'error'
  });

  // File view dialog
  const [viewingCalendar, setViewingCalendar] = useState(null);

  // File rename dialog
  const [fileEdit, setFileEdit] = useState({ open: false, file: null, calendar: null, name: "" });

  // File delete confirmation
  const [fileToDelete, setFileToDelete] = useState(null); // { file, calendar }

  // ---------- Data fetching ----------

  const fetchCalendars = async () => {
    setLoading(true);
    try {
      const { data } = await instance.get("/academic-calendars/admin/all");
      setCalendars(data);
      return data;
    } catch (error) {
      toast.error("❌ " + (error.response?.data?.message || "Failed to fetch calendars"));
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchAcademicYears = async () => {
    setFetchingYears(true);
    try {
      const { data } = await instance.get("/academic-years");
      setAcademicYears(data);
    } catch {
      toast.error("❌ Failed to fetch academic years");
    } finally {
      setFetchingYears(false);
    }
  };

  useEffect(() => {
    fetchCalendars();
    fetchAcademicYears();
  }, []);

  // Refetch calendars and keep the currently-open "view files" dialog in sync.
  // This one helper replaces the repeated "fetch fresh data + update viewingCalendar" block
  // that used to appear after every upload/rename/delete-file action.
  const refreshAndSyncViewingCalendar = async (calendarId) => {
    const freshData = await fetchCalendars();
    const updated = freshData.find((c) => c.id === calendarId);
    setViewingCalendar(updated ? { ...updated, files: updated.files || [] } : null);
    return updated;
  };

  const getAcademicYearLabel = (id) => academicYears.find((y) => y.id === id)?.yearLabel || "N/A";

  // ---------- Calendar form ----------

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    clearFieldError(name);
  };

  const openCalendarDialog = (calendar = null) => {
    setFormData(
      calendar
        ? { title: calendar.title || "", description: calendar.description || "", academicYearId: calendar.academicYearId || "" }
        : EMPTY_FORM
    );
    clearFieldErrors();
    setCalendarDialog({ open: true, editing: calendar, saving: false });
  };

  const closeCalendarDialog = () => {
    setCalendarDialog({ open: false, editing: null, saving: false });
    setFormData(EMPTY_FORM);
    clearFieldErrors();
  };

  const handleSaveCalendar = async () => {
    setCalendarDialog((prev) => ({ ...prev, saving: true }));
    clearFieldErrors();

    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      academicYearId: parseInt(formData.academicYearId),
    };
    const editing = calendarDialog.editing;

    try {
      if (editing) {
        await instance.put(`/academic-calendars/${editing.id}`, payload);
        toast.success("✅ Academic calendar updated successfully!");
      } else {
        await instance.post("/academic-calendars", payload);
        toast.success("✅ Academic calendar created successfully!");
      }
      closeCalendarDialog();
      fetchCalendars();
    } catch (error) {
      if (!applyBackendFieldErrors(error)) {
        toast.error("❌ " + (error.response?.data?.message || `Failed to ${editing ? "update" : "create"} calendar`));
      }
    } finally {
      setCalendarDialog((prev) => ({ ...prev, saving: false }));
    }
  };

  const handleDeleteCalendar = async () => {
    if (!calendarToDelete) return;
    try {
      await instance.delete(`/academic-calendars/${calendarToDelete.id}`);
      toast.success(`✅ "${calendarToDelete.title}" deleted successfully!`);
      setCalendarToDelete(null);
      fetchCalendars();
    } catch (error) {
      toast.error("❌ " + (error.response?.data?.message || "Failed to delete calendar"));
    }
  };

  // ---------- File upload ----------

  const openUploadDialog = (calendar) =>
    setUploadDialog({ open: true, calendar, file: null, uploading: false, progress: 0, status: null });

  const closeUploadDialog = () =>
    setUploadDialog({ open: false, calendar: null, file: null, uploading: false, progress: 0, status: null });

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) setUploadDialog((prev) => ({ ...prev, file, status: null }));
  };

  const handleFileUpload = async () => {
    const { file, calendar } = uploadDialog;
    if (!file) {
      toast.error("Please select a file to upload");
      return;
    }

    setUploadDialog((prev) => ({ ...prev, uploading: true, status: "uploading", progress: 10 }));

    try {
      setUploadDialog((prev) => ({ ...prev, progress: 30 }));
      const cloudinaryUrl = await uploadFileToCloudinary(file);
      setUploadDialog((prev) => ({ ...prev, progress: 70 }));

      await instance.post(`/academic-calendars/${calendar.id}/files`, {
        fileUrl: cloudinaryUrl,
        fileName: file.name,
      });

      setUploadDialog((prev) => ({ ...prev, progress: 100, status: "success" }));
      toast.success("✅ File uploaded successfully!");

      if (viewingCalendar) {
        await refreshAndSyncViewingCalendar(calendar.id);
      } else {
        await fetchCalendars();
      }
      closeUploadDialog();
    } catch (error) {
      setUploadDialog((prev) => ({ ...prev, status: "error", uploading: false }));
      toast.error("❌ " + (error.message || "Failed to upload file"));
    }
  };

  // ---------- File view / rename / delete ----------

  const openFileView = (calendar) => {
    setViewingCalendar(calendars.find((c) => c.id === calendar.id) || calendar);
  };

  const openFileEdit = (file, calendar) =>
    setFileEdit({ open: true, file, calendar, name: file.fileName });

  const closeFileEdit = () => setFileEdit({ open: false, file: null, calendar: null, name: "" });

  const handleFileRename = async () => {
    const { file, calendar, name } = fileEdit;
    if (!name.trim()) {
      toast.error("File name cannot be empty");
      return;
    }
    try {
      await instance.put(`/academic-calendars/${calendar.id}/files/${file.id}`, { fileName: name.trim() });
      toast.success("✅ File name updated successfully!");
      closeFileEdit();
      await refreshAndSyncViewingCalendar(calendar.id);
    } catch {
      toast.error("❌ Failed to update file name");
    }
  };

  const handleFileDelete = async () => {
    const { file, calendar } = fileToDelete || {};
    if (!file || !calendar) return;
    try {
      await instance.delete(`/academic-calendars/${calendar.id}/files/${file.id}`);
      toast.success(`✅ "${file.fileName}" deleted successfully!`);
      setFileToDelete(null);
      const updated = await refreshAndSyncViewingCalendar(calendar.id);
      if (!updated) setViewingCalendar(null);
    } catch {
      toast.error("❌ Failed to delete file");
    }
  };

  const handleRefreshFiles = async () => {
    if (viewingCalendar) await refreshAndSyncViewingCalendar(viewingCalendar.id);
    else await fetchCalendars();
    toast.info("🔄 Files list refreshed");
  };

  const handleFileDownload = (fileUrl) => window.open(fileUrl, "_blank");

  // ---------- Table data ----------

  const tableHeaders = ["S.No", "Title", "Academic Year", "Description", "Files", "Status", "Actions"];

  const tableRows = calendars.map((calendar, index) => [
    index + 1,
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <CalendarToday sx={{ fontSize: 18, color: theme.palette.primary.main }} />
      <Typography fontWeight={500}>{calendar.title}</Typography>
    </Box>,
    <Chip
      icon={<School sx={{ fontSize: 14 }} />}
      label={calendar.academicYearLabel || getAcademicYearLabel(calendar.academicYearId)}
      size="small"
      sx={{ bgcolor: alpha(theme.palette.primary.main, 0.08), color: "primary.main", fontWeight: 600, fontSize: "0.7rem" }}
    />,
    calendar.description || "—",
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
      <Tooltip title="Upload File">
        <IconButton size="small" onClick={() => openUploadDialog(calendar)} sx={{ color: "#0288D1", "&:hover": { bgcolor: alpha("#0288D1", 0.08) } }}>
          <CloudUpload fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="View Files">
        <IconButton size="small" onClick={() => openFileView(calendar)} sx={{ color: "#6B7280", "&:hover": { bgcolor: alpha("#6B7280", 0.08) } }}>
          <FolderOpen fontSize="small" />
        </IconButton>
      </Tooltip>
      <Chip
        icon={<Description sx={{ fontSize: 14 }} />}
        label={`${calendar.fileCount || 0} files`}
        size="small"
        onClick={() => openFileView(calendar)}
        sx={{ bgcolor: alpha(theme.palette.info.main, 0.08), color: "#0288D1", fontWeight: 600, fontSize: "0.7rem", cursor: "pointer" }}
      />
    </Box>,
    calendar.active !== false ? (
      <Chip icon={<CheckCircle sx={{ fontSize: 14 }} />} label="Active" size="small" sx={{ bgcolor: "#E8F5E9", color: "#2E7D32", fontWeight: 600, fontSize: "0.7rem" }} />
    ) : (
      <Chip label="Inactive" size="small" sx={{ bgcolor: "#FFEBEE", color: "#C62828", fontWeight: 600, fontSize: "0.7rem" }} />
    ),
    <Box sx={{ display: "flex", gap: 0.5, justifyContent: "center" }}>
      <Tooltip title="Edit">
        <IconButton size="small" onClick={() => openCalendarDialog(calendar)} sx={{ color: "#1976D2", "&:hover": { bgcolor: alpha("#1976D2", 0.08) } }}>
          <Edit fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Delete">
        <IconButton size="small" onClick={() => setCalendarToDelete(calendar)} sx={{ color: "#D32F2F", "&:hover": { bgcolor: alpha("#D32F2F", 0.08) } }}>
          <Delete fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>,
  ]);

  // ---------- Render ----------

  return (
    <Box sx={{ bgcolor: "#f5f7fa", minHeight: "100vh", py: 4 }}>
      <PageHeader title="ACADEMIC CALENDARS" subtitle="Manage academic calendars" />

      <Box sx={{ px: { xs: 2, md: 4 } }}>
        <Paper elevation={0} sx={{ borderRadius: 3, border: "1px solid #E8ECF1", p: { xs: 2, md: 4 } }}>
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
            <Typography variant="h4" sx={{ fontWeight: 800, color: "#1E293B", fontSize: { xs: "1.5rem", md: "2rem" } }}>
              Calendars
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => openCalendarDialog()}
              sx={{ bgcolor: "#1E293B", borderRadius: 2, "&:hover": { bgcolor: "#0F172A" }, textTransform: "none", fontWeight: 600 }}
            >
              Add Calendar
            </Button>
          </Box>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
              <CircularProgress />
            </Box>
          ) : calendars.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 6 }}>
              <CalendarToday sx={{ fontSize: 56, color: "#D1D5DB" }} />
              <Typography variant="h6" sx={{ color: "#6B7280", mt: 2 }}>
                No academic calendars found
              </Typography>
              <Typography variant="body2" sx={{ color: "#9CA3AF" }}>
                Add a calendar to get started
              </Typography>
            </Box>
          ) : (
            <ReusableTable headers={tableHeaders} rows={tableRows} />
          )}
        </Paper>
      </Box>

      {/* Create/Edit Calendar Dialog */}
      <Dialog open={calendarDialog.open} onClose={closeCalendarDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>
          {calendarDialog.editing ? "Edit Academic Calendar" : "Add New Academic Calendar"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter calendar title"
              {...fieldProps("title")}
              sx={{ mb: 2 }}
            />

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Academic Year</InputLabel>
              <Select
                name="academicYearId"
                value={formData.academicYearId}
                onChange={handleChange}
                label="Academic Year"
                error={!!formErrors.academicYearId}
                disabled={fetchingYears}
              >
                <MenuItem value="">Select Academic Year</MenuItem>
                {academicYears.map((year) => (
                  <MenuItem key={year.id} value={year.id}>
                    {year.yearLabel} {year.active && "(Active)"}
                  </MenuItem>
                ))}
              </Select>
              {formErrors.academicYearId && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                  {formErrors.academicYearId}
                </Typography>
              )}
            </FormControl>

            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter calendar description"
              multiline
              rows={3}
              {...fieldProps("description")}
              sx={{ mb: 2 }}
            />

            {calendarDialog.editing && (
              <Box sx={{ mt: 1, p: 1.5, bgcolor: "#FFF3E0", borderRadius: 2 }}>
                <Typography variant="caption" sx={{ color: "#EF6C00", display: "flex", alignItems: "center", gap: 1 }}>
                  <CalendarToday sx={{ fontSize: 14 }} />
                  Editing: {calendarDialog.editing.title}
                </Typography>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={closeCalendarDialog} disabled={calendarDialog.saving}>
            Cancel
          </Button>
          <Button onClick={handleSaveCalendar} variant="contained" disabled={calendarDialog.saving} sx={{ bgcolor: "#1E293B" }}>
            {calendarDialog.saving ? <CircularProgress size={24} /> : calendarDialog.editing ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* File Upload Dialog */}
      <Dialog open={uploadDialog.open} onClose={closeUploadDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>
          Upload File
          <Typography variant="caption" display="block" sx={{ color: "#6B7280", fontWeight: 400, mt: 0.5 }}>
            Upload file for: {uploadDialog.calendar?.title}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <FileUploadZone onClick={() => document.getElementById("file-upload-input").click()}>
              <CloudUpload sx={{ fontSize: 48, color: theme.palette.primary.main, mb: 1 }} />
              <Typography variant="body1" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                {uploadDialog.file ? uploadDialog.file.name : "Click to select a file"}
              </Typography>
              <Typography variant="body2" sx={{ color: "#6B7280" }}>
                {uploadDialog.file
                  ? `File selected: ${(uploadDialog.file.size / 1024 / 1024).toFixed(2)} MB`
                  : "Supported formats: PDF, JPEG, PNG, DOC, DOCX (Max 10MB)"}
              </Typography>
              <input id="file-upload-input" type="file" hidden onChange={handleFileSelect} />
            </FileUploadZone>

            {uploadDialog.file && (
              <Box sx={{ mt: 2, display: "flex", alignItems: "center", gap: 1 }}>
                <InsertDriveFile sx={{ color: theme.palette.primary.main }} />
                <Typography variant="body2" fontWeight={500}>
                  {uploadDialog.file.name}
                </Typography>
                <Chip label={`${(uploadDialog.file.size / 1024 / 1024).toFixed(2)} MB`} size="small" sx={{ ml: "auto" }} />
              </Box>
            )}

            {uploadDialog.status === "uploading" && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" sx={{ mb: 1, color: "#1565c0", fontWeight: 600 }}>
                  Uploading... {uploadDialog.progress}%
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={uploadDialog.progress}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    "& .MuiLinearProgress-bar": { bgcolor: theme.palette.primary.main },
                  }}
                />
              </Box>
            )}

            {uploadDialog.status === "success" && (
              <Box sx={{ mt: 2, p: 2, bgcolor: "#E8F5E9", borderRadius: 2, display: "flex", alignItems: "center", gap: 1 }}>
                <Check sx={{ color: "#2E7D32" }} />
                <Typography sx={{ color: "#2E7D32", fontWeight: 600 }}>File uploaded successfully!</Typography>
              </Box>
            )}

            {uploadDialog.status === "error" && (
              <Box sx={{ mt: 2, p: 2, bgcolor: "#FFEBEE", borderRadius: 2, display: "flex", alignItems: "center", gap: 1 }}>
                <Error sx={{ color: "#C62828" }} />
                <Typography sx={{ color: "#C62828", fontWeight: 600 }}>Upload failed. Please try again.</Typography>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={closeUploadDialog} disabled={uploadDialog.uploading}>
            Cancel
          </Button>
          <Button
            onClick={handleFileUpload}
            variant="contained"
            disabled={!uploadDialog.file || uploadDialog.uploading || uploadDialog.status === "success"}
            sx={{ bgcolor: "#1E293B" }}
          >
            {uploadDialog.uploading ? <CircularProgress size={24} /> : "Upload"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* File View Dialog */}
      <Dialog open={!!viewingCalendar} onClose={() => setViewingCalendar(null)} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 3, overflow: "hidden" } }}>
        <DialogTitle sx={{ fontWeight: 700, bgcolor: "#f8fafc", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Files - {viewingCalendar?.title}
            </Typography>
            <Typography variant="caption" sx={{ color: "#6B7280" }}>
              {viewingCalendar?.files?.length || 0} files attached
            </Typography>
          </Box>
          <IconButton onClick={() => setViewingCalendar(null)} size="small">
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 0 }}>
          {viewingCalendar?.files?.length > 0 ? (
            <List sx={{ p: 0 }}>
              {viewingCalendar.files.map((file, index) => (
                <React.Fragment key={file.id || index}>
                  <ListItem sx={{ px: 3, py: 2, "&:hover": { bgcolor: alpha(theme.palette.primary.main, 0.04) }, transition: "all 0.2s ease" }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>{getFileIcon(file.fileName)}</ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body1" fontWeight={500} sx={{ color: "#1a1a1a" }}>
                          {file.fileName}
                        </Typography>
                      }
                      secondary={
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 0.5, flexWrap: "wrap" }}>
                          <Chip
                            label={getFileTypeLabel(file.fileName)}
                            size="small"
                            sx={{ height: 20, fontSize: "0.65rem", bgcolor: alpha(theme.palette.primary.main, 0.06), color: "#5D6B7A" }}
                          />
                          <Typography variant="caption" sx={{ color: "#9CA3AF" }}>
                            Uploaded: {formatDate(file.createdAt)}
                          </Typography>
                        </Box>
                      }
                    />
                    <Box sx={{ display: "flex", gap: 0.5, ml: 2, flexWrap: "wrap" }}>
                      <Tooltip title="View / Download">
                        <IconButton size="small" onClick={() => handleFileDownload(file.fileUrl)} sx={{ color: "#0288D1", "&:hover": { bgcolor: alpha("#0288D1", 0.08) } }}>
                          <Visibility fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Download">
                        <IconButton size="small" onClick={() => handleFileDownload(file.fileUrl)} sx={{ color: "#2E7D32", "&:hover": { bgcolor: alpha("#2E7D32", 0.08) } }}>
                          <Download fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Delete File">
                        <IconButton size="small" onClick={() => setFileToDelete({ file, calendar: viewingCalendar })} sx={{ color: "#D32F2F", "&:hover": { bgcolor: alpha("#D32F2F", 0.08) } }}>
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </ListItem>
                  {index < viewingCalendar.files.length - 1 && <Divider sx={{ mx: 3 }} />}
                </React.Fragment>
              ))}
            </List>
          ) : (
            <Box sx={{ textAlign: "center", py: 8, px: 3 }}>
              <FolderOpen sx={{ fontSize: 64, color: "#D1D5DB", mb: 2 }} />
              <Typography variant="h6" sx={{ color: "#6B7280", mb: 1 }}>
                No files uploaded yet
              </Typography>
              <Typography variant="body2" sx={{ color: "#9CA3AF" }}>
                Upload files to this academic calendar
              </Typography>
              <Button
                variant="contained"
                startIcon={<CloudUpload />}
                onClick={() => {
                  const cal = viewingCalendar;
                  setViewingCalendar(null);
                  openUploadDialog(cal);
                }}
                sx={{ mt: 3, bgcolor: "#1E293B" }}
              >
                Upload File
              </Button>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3, borderTop: "1px solid #e2e8f0", bgcolor: "#f8fafc", flexWrap: "wrap", gap: 1 }}>
          <Button variant="outlined" onClick={() => setViewingCalendar(null)} sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600 }}>
            Close
          </Button>
          {viewingCalendar && (
            <>
              <Button variant="outlined" startIcon={<Refresh />} onClick={handleRefreshFiles} sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600 }}>
                Refresh
              </Button>
              <Button
                variant="contained"
                startIcon={<CloudUpload />}
                onClick={() => {
                  const cal = viewingCalendar;
                  setViewingCalendar(null);
                  openUploadDialog(cal);
                }}
                sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600, bgcolor: "#1E293B", "&:hover": { bgcolor: "#0F172A" } }}
              >
                Upload New File
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>

      {/* File Rename Dialog */}
      <Dialog open={fileEdit.open} onClose={closeFileEdit} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3, overflow: "hidden" } }}>
        <DialogTitle sx={{ fontWeight: 700, bgcolor: "#f8fafc", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Edit File Name
            </Typography>
            <Typography variant="caption" sx={{ color: "#6B7280" }}>
              Update the file name
            </Typography>
          </Box>
          <IconButton onClick={closeFileEdit} size="small">
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ mt: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2, p: 2, bgcolor: "#f8fafc", borderRadius: 2 }}>
              {fileEdit.file && getFileIcon(fileEdit.file.fileName)}
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Current File Name
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {fileEdit.file?.fileName}
                </Typography>
              </Box>
            </Box>

            <TextField
              fullWidth
              label="New File Name"
              value={fileEdit.name}
              onChange={(e) => setFileEdit((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Enter new file name"
              helperText="Include file extension (e.g., .pdf, .jpg)"
              sx={{ mb: 1 }}
              autoFocus
            />

            <Typography variant="caption" color="text.secondary">
              File name must include extension. Example: document.pdf, image.jpg
            </Typography>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3, borderTop: "1px solid #e2e8f0", bgcolor: "#f8fafc", gap: 1 }}>
          <Button onClick={closeFileEdit} variant="outlined" sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600 }}>
            Cancel
          </Button>
          <Button
            onClick={handleFileRename}
            variant="contained"
            startIcon={<SaveIcon />}
            sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600, bgcolor: "#1E293B", "&:hover": { bgcolor: "#0F172A" } }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* File Delete Confirmation */}
      <ConfirmDialog
        open={!!fileToDelete}
        onClose={() => setFileToDelete(null)}
        onConfirm={handleFileDelete}
        title="Delete File"
        isMobile={isMobile}
        message={
          <>
            Are you sure you want to delete the file{" "}
            <strong style={{ color: "#C62828" }}>{fileToDelete?.file?.fileName}</strong>?
          </>
        }
        note={
          <Box sx={{ bgcolor: "#FFF8E1", borderRadius: 2, p: 2, border: "1px solid #FFE082", mt: 2 }}>
            <Typography variant="body2" sx={{ color: "#795548", display: "flex", alignItems: "center", gap: 1 }}>
              <FolderOpen sx={{ fontSize: 18 }} />
              <span>
                <strong>Calendar:</strong> {fileToDelete?.calendar?.title}
              </span>
            </Typography>
          </Box>
        }
      />

      {/* Calendar Delete Confirmation */}
      <ConfirmDialog
        open={!!calendarToDelete}
        onClose={() => setCalendarToDelete(null)}
        onConfirm={handleDeleteCalendar}
        title="Delete Academic Calendar"
        isMobile={isMobile}
        message={
          <>
            Are you sure you want to delete the calendar{" "}
            <strong style={{ color: "#C62828" }}>{calendarToDelete?.title}</strong>? All files associated with this
            calendar will also be removed.
          </>
        }
      />

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

export default AcademicCalendars;