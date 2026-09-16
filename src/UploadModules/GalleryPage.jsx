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
  MenuItem,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Chip,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Stack,
  Divider,
  LinearProgress,
  CircularProgress,
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  PhotoLibrary,
  CloudUpload,
  Close,
  Visibility,
  CalendarToday,
  Image,
  CheckCircle,
  Error,
} from "@mui/icons-material";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PageHeader from "./Pageheader";
import instance from "../AxiosInstance/AxiosInstance";
import { uploadFileToCloudinary } from "../Common/Fileupload";
import useFormFieldErrors from "../Common/useFormFieldErrors";

// Fixed width for every gallery card (change here to resize all cards)
const CARD_WIDTH = 300;

// Fields tracked for inline backend validation errors on this form
const GALLERY_FIELD_NAMES = ["title", "academicYearId"];

const GalleryPage = () => {
  // States
  const [galleries, setGalleries] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingYears, setFetchingYears] = useState(false);

  // Filter state - selected academic year to filter galleries by
  const [filterAcademicYearId, setFilterAcademicYearId] = useState("");

  // Dialog states
  const [openDialog, setOpenDialog] = useState(false);
  const [editingGallery, setEditingGallery] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    academicYearId: ""
  });

  // Reusable field-error handling (parses backend VALIDATION errors too)
  const {
    formErrors,
    clearFieldErrors,
    clearFieldError,
    setFieldErrors,
    applyBackendFieldErrors,
    fieldProps,
  } = useFormFieldErrors(GALLERY_FIELD_NAMES);

  // Image upload dialog states
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [selectedGallery, setSelectedGallery] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imageCaption, setImageCaption] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);

  // View gallery dialog
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [viewGallery, setViewGallery] = useState(null);

  // Fetch academic years
  const fetchAcademicYears = async () => {
    setFetchingYears(true);
    try {
      const response = await instance.get("/academic-years");
      console.log("Academic Years:", response.data);
      setAcademicYears(response.data);
    } catch (error) {
      console.error("Error fetching academic years:", error);
      toast.error("Failed to fetch academic years");
    } finally {
      setFetchingYears(false);
    }
  };

  // Fetch galleries - optionally filtered by academicYearId
  // Calls: GET /galleries?academicYearId=<id>  (when a year is selected)
  //        GET /galleries                       (when "All" is selected)
  const fetchGalleries = async (academicYearId = filterAcademicYearId) => {
    setLoading(true);
    try {
      const response = await instance.get("/galleries", {
        params: academicYearId ? { academicYearId } : {},
      });
      console.log("Galleries:", response.data);
      setGalleries(response.data);
    } catch (error) {
      console.error("Error fetching galleries:", error);
      const errorMsg = error.response?.data?.message || "Failed to fetch galleries";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGalleries();
    fetchAcademicYears();
  }, []);

  // When the filter dropdown changes, re-fetch galleries with the new academicYearId
  const handleFilterChange = (e) => {
    const value = e.target.value;
    setFilterAcademicYearId(value);
    fetchGalleries(value);
  };

  // Handle Gallery CRUD
  const handleOpenDialog = (gallery = null) => {
    if (gallery) {
      setEditingGallery(gallery);
      setFormData({
        title: gallery.title || "",
        description: gallery.description || "",
        academicYearId: gallery.academicYearId || "",
      });
    } else {
      setEditingGallery(null);
      setFormData({
        title: "",
        description: "",
        academicYearId: "",
      });
    }
    clearFieldErrors(); // Clear any previous field errors
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingGallery(null);
    setFormData({ title: "", description: "", academicYearId: "" });
    clearFieldErrors(); // Clear errors when closing
  };

  // Handle form input changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    clearFieldError(name); // Clear error for this field when user types
  };

  const handleSaveGallery = async () => {
    setLoading(true);
    clearFieldErrors(); // Clear previous errors before API call

    try {
      if (editingGallery) {
        // Update gallery
        const response = await instance.put(`/galleries/${editingGallery.id}`, {
          title: formData.title,
          description: formData.description,
          academicYearId: formData.academicYearId,
        });
        console.log("Updated:", response.data);
        toast.success("Gallery updated successfully!");
      } else {
        // Create gallery
        const response = await instance.post("/galleries/create", {
          title: formData.title,
          description: formData.description,
          academicYearId: formData.academicYearId,
        });
        console.log("Created:", response.data);
        toast.success("Gallery created successfully!");
      }
      handleCloseDialog();
      fetchGalleries(); // Refresh list (keeps current filter)
    } catch (error) {
      console.error("Error saving gallery:", error);
      const handledAsFieldErrors = applyBackendFieldErrors(error);
      if (!handledAsFieldErrors) {
        const errorMsg = error.response?.data?.message || "Failed to save gallery";
        toast.error(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGallery = async (id) => {
    if (!window.confirm("Are you sure you want to delete this gallery?")) return;

    setLoading(true);
    try {
      await instance.delete(`/galleries/${id}`);
      toast.success("Gallery deleted successfully!");
      fetchGalleries();
    } catch (error) {
      console.error("Error deleting gallery:", error);
      const errorMsg = error.response?.data?.message || "Failed to delete gallery";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Handle Image Upload with Cloudinary
  const handleOpenImageDialog = (gallery) => {
    setSelectedGallery(gallery);
    setImageFile(null);
    setImageCaption("");
    setImagePreview(null);
    setUploadProgress(0);
    setIsUploading(false);
    setUploadStatus(null);
    setOpenImageDialog(true);
  };

  const handleCloseImageDialog = () => {
    setOpenImageDialog(false);
    setSelectedGallery(null);
    setImageFile(null);
    setImageCaption("");
    setImagePreview(null);
    setUploadProgress(0);
    setIsUploading(false);
    setUploadStatus(null);
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error("Please upload a valid image");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
      setUploadStatus(null);
    }
  };

  // Image upload with Cloudinary
  const handleSaveImage = async () => {
    if (!imageFile || !imageCaption) {
      toast.error("Please select an image and enter caption");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Step 1: Upload to Cloudinary
      setUploadProgress(20);
      const cloudinaryUrl = await uploadFileToCloudinary(imageFile);
      console.log("Cloudinary URL:", cloudinaryUrl);
      setUploadProgress(60);

      // Step 2: Save to your backend with Cloudinary URL
      const response = await instance.post(
        `/galleries/${selectedGallery.id}/images`,
        {
          imageUrl: cloudinaryUrl,
          caption: imageCaption,
        }
      );

      setUploadProgress(100);
      console.log("Image saved:", response.data);
      setUploadStatus('success');

      toast.success("Image uploaded successfully!");

      // Refresh gallery list
      fetchGalleries();

      handleCloseImageDialog();

    } catch (error) {
      console.error("Error uploading image:", error);
      setUploadStatus('error');
      const errorMsg = error.message || "Failed to upload image";
      toast.error(errorMsg);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteImage = async (galleryId, imageId) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;

    try {
      await instance.delete(`/galleries/${galleryId}/images/${imageId}`);
      toast.success("Image deleted successfully!");
      fetchGalleries();
    } catch (error) {
      console.error("Error deleting image:", error);
      const errorMsg = error.response?.data?.message || "Failed to delete image";
      toast.error(errorMsg);
    }
  };

  const handleViewGallery = (gallery) => {
    setViewGallery(gallery);
    setOpenViewDialog(true);
  };

  // Get academic year label by ID
  const getAcademicYearLabel = (id) => {
    const year = academicYears.find(y => y.id === id);
    return year ? year.yearLabel : "N/A";
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

  return (
    <Box sx={{ bgcolor: "#f5f7fa", minHeight: "100vh", py: 4 }}>
      <PageHeader title="GALLERY" subtitle="Manage college photo galleries" />

      <Box sx={{ px: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, flexWrap: "wrap", gap: 2 }}>
          {/* Academic Year Filter */}
          <TextField
            select
            label="Filter by Academic Year"
            value={filterAcademicYearId}
            onChange={handleFilterChange}
            size="small"
            sx={{ minWidth: 220, bgcolor: "#fff", borderRadius: 2 }}
          >
            <MenuItem value="">All Academic Years</MenuItem>
            {academicYears.map((year) => (
              <MenuItem key={year.id} value={year.id}>
                {year.yearLabel}
              </MenuItem>
            ))}
          </TextField>

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
            Create Gallery
          </Button>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
          </Box>
        ) : galleries.length === 0 ? (
          <Paper sx={{ p: 8, textAlign: "center", borderRadius: 3 }}>
            <PhotoLibrary sx={{ fontSize: 64, color: "#D1D5DB" }} />
            <Typography variant="h6" sx={{ mt: 2, color: "#6B7280" }}>
              No galleries found
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => handleOpenDialog()}
              sx={{ mt: 2 }}
            >
              Create Your First Gallery
            </Button>
          </Paper>
        ) : (
          // Flex layout (not percentage Grid breakpoints) so cards sit
          // tightly next to each other at CARD_WIDTH and wrap naturally -
          // no leftover empty space on the right as more cards get added.
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 3,
            }}
          >
            {galleries.map((gallery) => (
              <Paper
                key={gallery.id}
                elevation={0}
                sx={{
                  borderRadius: 3,
                  border: "1px solid #E8ECF1",
                  overflow: "hidden",
                  transition: "all 0.3s ease",
                  width: CARD_WIDTH,
                  display: "flex",
                  flexDirection: "column",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
                  },
                }}
              >
                {/* Gallery Header Image */}
                <Box sx={{ position: "relative", height: 200, bgcolor: "#EEF2FF", flexShrink: 0 }}>
                  {gallery.images && gallery.images.length > 0 ? (
                    <img
                      src={gallery.images[0].imageUrl}
                      alt={gallery.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='400' height='300' fill='%23e2e8f0'/%3E%3Ctext x='200' y='150' font-family='Arial' font-size='20' fill='%2394a3b8' text-anchor='middle'%3ENo Image%3C/text%3E%3C/svg%3E";
                      }}
                    />
                  ) : (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100%",
                        flexDirection: "column",
                        color: "#9CA3AF",
                      }}
                    >
                      <PhotoLibrary sx={{ fontSize: 48 }} />
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        No images
                      </Typography>
                    </Box>
                  )}

                  <Chip
                    label={`${gallery.images?.length || 0} photos`}
                    size="small"
                    sx={{
                      position: "absolute",
                      bottom: 12,
                      right: 12,
                      bgcolor: "rgba(0,0,0,0.7)",
                      color: "#fff",
                      fontWeight: 600,
                    }}
                  />
                </Box>

                <CardContent sx={{ p: 2.5, flex: 1, display: "flex", flexDirection: "column" }}>
                  <Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
                      <Typography variant="h6" fontWeight={700} sx={{ fontSize: "1rem" }}>
                        {gallery.title}
                      </Typography>
                      <Stack direction="row" spacing={0.5} sx={{ flexShrink: 0 }}>
                        <IconButton
                          size="small"
                          onClick={() => handleOpenImageDialog(gallery)}
                          sx={{ color: "#3B82F6", p: 0.5 }}
                          title="Upload Image"
                        >
                          <CloudUpload fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleViewGallery(gallery)}
                          sx={{ color: "#8B5CF6", p: 0.5 }}
                          title="View Gallery"
                        >
                          <Visibility fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDialog(gallery)}
                          sx={{ color: "#1E293B", p: 0.5 }}
                          title="Edit Gallery"
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteGallery(gallery.id)}
                          sx={{ color: "#EF4444", p: 0.5 }}
                          title="Delete Gallery"
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Stack>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                      <CalendarToday sx={{ fontSize: 13, color: "#9CA3AF" }} />
                      <Typography variant="body2" sx={{ color: "#6B7280", fontSize: "0.8rem" }}>
                        {getAcademicYearLabel(gallery.academicYearId)}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#9CA3AF", fontSize: "0.8rem" }}>
                        •
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#9CA3AF", fontSize: "0.8rem" }}>
                        {formatDate(gallery.createdAt)}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Thumbnail preview */}
                  {gallery.images && gallery.images.length > 0 && (
                    <Box sx={{ display: "flex", gap: 0.5, mt: 1, flexWrap: "wrap" }}>
                      {gallery.images.slice(0, 4).map((img, index) => (
                        <Box
                          key={img.id || index}
                          sx={{
                            width: 45,
                            height: 45,
                            borderRadius: 1,
                            overflow: "hidden",
                            border: "1px solid #E8ECF1",
                            flexShrink: 0,
                          }}
                        >
                          <img
                            src={img.imageUrl}
                            alt={img.caption || `Image ${index + 1}`}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='45' height='45'%3E%3Crect width='45' height='45' fill='%23e2e8f0'/%3E%3C/svg%3E";
                            }}
                          />
                        </Box>
                      ))}
                      {gallery.images.length > 4 && (
                        <Box
                          sx={{
                            width: 45,
                            height: 45,
                            borderRadius: 1,
                            bgcolor: "#EEF2FF",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: "1px solid #E8ECF1",
                            flexShrink: 0,
                          }}
                        >
                          <Typography variant="caption" fontWeight={600} color="#3B82F6">
                            +{gallery.images.length - 4}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  )}
                </CardContent>
              </Paper>
            ))}
          </Box>
        )}
      </Box>

      {/* Create/Edit Gallery Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>
          {editingGallery ? "Edit Gallery" : "Create New Gallery"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            name="title"
            fullWidth
            value={formData.title}
            onChange={handleFormChange}
            {...fieldProps("title")}
            sx={{ mb: 2, mt: 1 }}
          />
          {/* <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            sx={{ mb: 2 }}
          /> */}
          <TextField
            margin="dense"
            label="Academic Year"
            name="academicYearId"
            select
            fullWidth
            value={formData.academicYearId}
            onChange={handleFormChange}
            {...fieldProps("academicYearId")}
          >
            <MenuItem value="">Select Academic Year</MenuItem>
            {academicYears.map((year) => (
              <MenuItem key={year.id} value={year.id}>
                {year.yearLabel}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSaveGallery}
            variant="contained"
            disabled={loading}
            sx={{ bgcolor: "#1E293B" }}
          >
            {loading ? <CircularProgress size={24} /> : (editingGallery ? "Update" : "Create")}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Image Dialog with Cloudinary Upload */}
      <Dialog
        open={openImageDialog}
        onClose={isUploading ? undefined : handleCloseImageDialog}
        maxWidth="sm"
        fullWidth
        disableEscapeKeyDown={isUploading}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span>Upload Image to {selectedGallery?.title}</span>
            {!isUploading && (
              <IconButton onClick={handleCloseImageDialog} size="small">
                <Close />
              </IconButton>
            )}
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            {/* Image Preview */}
            {imagePreview && (
              <Box
                sx={{
                  width: "100%",
                  height: 200,
                  borderRadius: 2,
                  overflow: "hidden",
                  mb: 2,
                  border: "2px dashed #E8ECF1",
                  position: "relative",
                }}
              >
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
                {isUploading && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      bgcolor: "rgba(0,0,0,0.5)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: "column",
                      gap: 2,
                    }}
                  >
                    <Typography variant="body2" sx={{ color: "#fff", fontWeight: 600 }}>
                      Uploading... {uploadProgress}%
                    </Typography>
                    <Box sx={{ width: "80%" }}>
                      <LinearProgress
                        variant="determinate"
                        value={uploadProgress}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          bgcolor: "rgba(255,255,255,0.3)",
                          "& .MuiLinearProgress-bar": {
                            bgcolor: "#fff",
                          }
                        }}
                      />
                    </Box>
                  </Box>
                )}
                {uploadStatus === 'success' && !isUploading && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      bgcolor: "rgba(46, 125, 50, 0.8)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: "column",
                      gap: 1,
                    }}
                  >
                    <CheckCircle sx={{ fontSize: 48, color: "#fff" }} />
                    <Typography variant="h6" sx={{ color: "#fff", fontWeight: 600 }}>
                      Upload Complete!
                    </Typography>
                  </Box>
                )}
                {uploadStatus === 'error' && !isUploading && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      bgcolor: "rgba(211, 47, 47, 0.8)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: "column",
                      gap: 1,
                    }}
                  >
                    <Error sx={{ fontSize: 48, color: "#fff" }} />
                    <Typography variant="h6" sx={{ color: "#fff", fontWeight: 600 }}>
                      Upload Failed
                    </Typography>
                  </Box>
                )}
              </Box>
            )}

            <Button
              variant="outlined"
              component="label"
              fullWidth
              startIcon={<CloudUpload />}
              disabled={isUploading}
              sx={{
                mb: 2,
                py: 2,
                borderColor: "#D1D5DB",
                color: "#6B7280",
                "&:hover": {
                  borderColor: "#3B82F6",
                  color: "#3B82F6",
                },
              }}
            >
              {imagePreview ? "Change Image" : "Choose Image"}
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageFileChange}
                disabled={isUploading}
              />
            </Button>

            <TextField
              fullWidth
              label="Image Caption"
              value={imageCaption}
              onChange={(e) => setImageCaption(e.target.value)}
              placeholder="Enter image caption"
              disabled={isUploading}
              sx={{ mb: 2 }}
            />

            <Typography variant="caption" sx={{ color: "#9CA3AF" }}>
              Supported formats: JPG, PNG, GIF, WebP • Max size: 5MB
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={handleCloseImageDialog} disabled={isUploading}>
            Cancel
          </Button>
          <Button
            onClick={handleSaveImage}
            variant="contained"
            disabled={isUploading || !imagePreview || !imageCaption}
            sx={{
              bgcolor: isUploading ? "#9CA3AF" : "#3B82F6",
              "&:hover": {
                bgcolor: isUploading ? "#9CA3AF" : "#2563EB",
              }
            }}
          >
            {isUploading ? "Uploading..." : "Upload Image"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Gallery Dialog */}
      <Dialog
        open={openViewDialog}
        onClose={() => setOpenViewDialog(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            maxHeight: "90vh",
          },
        }}
      >
        {viewGallery && (
          <>
            <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box>
                <Typography variant="h6" fontWeight={700}>
                  {viewGallery.title}
                </Typography>
                <Typography variant="body2" sx={{ color: "#6B7280" }}>
                  {viewGallery.images?.length || 0} photos • {getAcademicYearLabel(viewGallery.academicYearId)}
                </Typography>
              </Box>
              <IconButton onClick={() => setOpenViewDialog(false)}>
                <Close />
              </IconButton>
            </DialogTitle>
            <Divider />
            <DialogContent>
              {!viewGallery.images || viewGallery.images.length === 0 ? (
                <Box sx={{ textAlign: "center", py: 8 }}>
                  <PhotoLibrary sx={{ fontSize: 64, color: "#D1D5DB" }} />
                  <Typography variant="body1" sx={{ color: "#9CA3AF", mt: 2 }}>
                    No images in this gallery
                  </Typography>
                </Box>
              ) : (
                <ImageList cols={3} gap={16}>
                  {viewGallery.images.map((img) => (
                    <ImageListItem key={img.id}>
                      <img
                        src={img.imageUrl}
                        alt={img.caption || "Gallery image"}
                        loading="lazy"
                        style={{
                          height: 200,
                          objectFit: "cover",
                          borderRadius: 8,
                        }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200'%3E%3Crect width='400' height='200' fill='%23e2e8f0'/%3E%3Ctext x='200' y='100' font-family='Arial' font-size='18' fill='%2394a3b8' text-anchor='middle'%3ENo Image%3C/text%3E%3C/svg%3E";
                        }}
                      />
                      <ImageListItemBar
                        title={img.caption || "Image"}
                        position="below"
                        sx={{
                          "& .MuiImageListItemBar-title": {
                            fontSize: "0.9rem",
                            fontWeight: 600,
                          },
                        }}
                        actionIcon={
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteImage(viewGallery.id, img.id)}
                            sx={{ color: "#EF4444" }}
                            title="Delete Image"
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        }
                      />
                    </ImageListItem>
                  ))}
                </ImageList>
              )}
            </DialogContent>
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

export default GalleryPage;