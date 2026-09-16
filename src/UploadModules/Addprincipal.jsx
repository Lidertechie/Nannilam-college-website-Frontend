// App.js
import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    Paper,
    Grid,
    TextField,
    Button,
    CircularProgress,
    Divider,
    IconButton,
    Tooltip,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogContentText,
    useTheme,
    useMediaQuery
} from '@mui/material';

import {
    Save as SaveIcon,
    Edit as EditIcon,
    Person as PersonIcon,
    Delete as DeleteIcon,
    Cancel as CancelIcon,
    Add as AddIcon,
    Close as CloseIcon,
    Warning as WarningIcon,
    CloudUpload as CloudUploadIcon
} from '@mui/icons-material';

import instance from "../AxiosInstance/AxiosInstance";
import { uploadFileToCloudinary } from "../Common/Fileupload";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Reusabletable from "../Common/Reusabletable";
import PageHeader from "./Pageheader";

function App() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

    const [formData, setFormData] = useState({
        fromDate: '',
        toDate: '',
        name: '',
        qualification: '',
        designation: '',
        imageUrl: '',
        image: null,
        imagePreview: null
    });

    const [principals, setPrincipals] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    // Delete Confirmation Dialog State
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteItemId, setDeleteItemId] = useState(null);
    const [deleteItemName, setDeleteItemName] = useState('');

    // Fetch all principals (GET)
    const fetchPrincipals = async () => {
        setLoading(true);

        try {
            const response = await instance.get(`/principals`);
            setPrincipals(response.data);
        } catch (error) {
            console.error('Error fetching principals:', error);
            toast.error('Failed to fetch principals');
        } finally {
            setLoading(false);
        }
    };

    // Image Upload
    const handleImageUpload = (e) => {
        const file = e.target.files[0];

        if (!file) return;

        // Validate image type
        if (!file.type.startsWith('image/')) {
            toast.error("Please upload a valid image file");
            return;
        }

        // Validate image size - max 2MB
        if (file.size > 2 * 1024 * 1024) {
            toast.error("Image size should be less than 2MB");
            return;
        }

        const reader = new FileReader();

        reader.onloadend = () => {
            setFormData((prev) => ({
                ...prev,
                image: file,
                imagePreview: reader.result
            }));

            toast.success("Image uploaded successfully");
        };

        reader.readAsDataURL(file);
    };

    // Remove Image
    const handleRemoveImage = () => {
        setFormData((prev) => ({
            ...prev,
            image: null,
            imagePreview: null,
            imageUrl: ''
        }));

        toast.info("Image removed");
    };

    // Create principal
    const createPrincipal = async (data) => {
        setSubmitting(true);

        try {
            let imageUrl = data.imageUrl || null;

            // Upload image to Cloudinary if a new image is selected
            if (data.image) {
                try {
                    imageUrl = await uploadFileToCloudinary(data.image);
                } catch (uploadError) {
                    console.error("Image upload error:", uploadError);
                    toast.error(
                        "Failed to upload image: " +
                        (uploadError.message || "Upload failed")
                    );
                    setSubmitting(false);
                    return;
                }
            }

            const principalData = {
                fromDate: data.fromDate,
                toDate: data.toDate,
                name: data.name,
                qualification: data.qualification,
                designation: data.designation,
                imageUrl: imageUrl
            };

            const response = await instance.post(
                `/principals`,
                principalData
            );

            setPrincipals([...principals, response.data]);

            toast.success('Principal added successfully!');

            resetForm();
            setDialogOpen(false);

        } catch (error) {
            console.error('Error creating principal:', error);
            toast.error('Failed to add principal');
        } finally {
            setSubmitting(false);
        }
    };

    // Update principal
    const updatePrincipal = async (id, data) => {
        setSubmitting(true);

        try {
            let imageUrl = data.imageUrl || null;

            // Upload new image only if user selected one
            if (data.image) {
                try {
                    imageUrl = await uploadFileToCloudinary(data.image);
                } catch (uploadError) {
                    console.error("Image upload error:", uploadError);

                    toast.error(
                        "Failed to upload image: " +
                        (uploadError.message || "Upload failed")
                    );

                    setSubmitting(false);
                    return;
                }
            }

            const principalData = {
                fromDate: data.fromDate,
                toDate: data.toDate,
                name: data.name,
                qualification: data.qualification,
                designation: data.designation,
                imageUrl: imageUrl
            };

            const response = await instance.put(
                `/principals/${id}`,
                principalData
            );

            setPrincipals(
                principals.map((p) =>
                    p.id === id ? response.data : p
                )
            );

            toast.success('Principal updated successfully!');

            resetForm();
            setDialogOpen(false);

        } catch (error) {
            console.error('Error updating principal:', error);
            toast.error('Failed to update principal');
        } finally {
            setSubmitting(false);
        }
    };

    // Delete principal
    const handleDeleteClick = (id, name) => {
        setDeleteItemId(id);
        setDeleteItemName(name);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        const toastId = toast.loading('Deleting principal...');

        try {
            await instance.delete(`/principals/${deleteItemId}`);

            setPrincipals(
                principals.filter(
                    p => p.id !== deleteItemId
                )
            );

            toast.success(
                'Principal deleted successfully!',
                { id: toastId }
            );

            setDeleteDialogOpen(false);
            setDeleteItemId(null);
            setDeleteItemName('');

        } catch (error) {
            console.error('Error deleting principal:', error);

            toast.error(
                'Failed to delete principal',
                { id: toastId }
            );
        }
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
        setDeleteItemId(null);
        setDeleteItemName('');
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate form
        if (!formData.name || !formData.designation) {
            toast.error('Please fill in all required fields');
            return;
        }

        if (editingId) {
            updatePrincipal(editingId, formData);
        } else {
            createPrincipal(formData);
        }
    };

    // Handle edit
    const handleEdit = (principal) => {
        setFormData({
            fromDate: principal.fromDate || '',
            toDate: principal.toDate || '',
            name: principal.name || '',
            qualification: principal.qualification || '',
            designation: principal.designation || '',

            // Existing Cloudinary image URL
            imageUrl: principal.imageUrl || '',

            // No new file selected initially
            image: null,

            // Show existing image
            imagePreview: principal.imageUrl || null
        });

        setEditingId(principal.id);
        setDialogOpen(true);
    };

    // Handle Add New button click
    const handleAddNew = () => {
        resetForm();
        setDialogOpen(true);
    };

    // Reset form
    const resetForm = () => {
        setFormData({
            fromDate: '',
            toDate: '',
            name: '',
            qualification: '',
            designation: '',
            imageUrl: '',
            image: null,
            imagePreview: null
        });

        setEditingId(null);
    };

    // Handle input change
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Handle dialog close
    const handleDialogClose = () => {
        if (!submitting) {
            resetForm();
            setDialogOpen(false);
        }
    };

    // Load data on component mount
    useEffect(() => {
        fetchPrincipals();
    }, []);

    // Build headers + rows for ReusableTable
    const tableHeaders = [
        'S.No',
        'Image',
        'Name',
        'Designation',
        'Qualification',
        'From Date',
        'To Date',
        'Actions'
    ];

    const tableRows = principals.map((principal, index) => [
        index + 1,

        <Box
            key={`image-${principal.id || index}`}
            sx={{
                display: 'flex',
                justifyContent: 'center'
            }}
        >
            {principal.imageUrl ? (
                <Box
                    component="img"
                    src={principal.imageUrl}
                    alt={principal.name || 'Principal'}
                    sx={{
                        width: 60,
                        height: 60,
                        objectFit: 'cover',
                        borderRadius: '50%',
                        border: '2px solid #e0e0e0'
                    }}
                    onError={(e) => {
                        e.currentTarget.style.display = 'none';
                    }}
                />
            ) : (
                <PersonIcon
                    sx={{
                        fontSize: 40,
                        color: 'text.secondary'
                    }}
                />
            )}
        </Box>,

        <Typography
            key={`name-${principal.id || index}`}
            variant="body2"
            fontWeight="bold"
        >
            {principal.name}
        </Typography>,

        <Chip
            key={`designation-${principal.id || index}`}
            label={principal.designation}
            size="small"
            color="primary"
            variant="outlined"
        />,

        principal.qualification || '-',

        principal.fromDate || '-',

        principal.toDate || '-',

        <Box
            key={`actions-${principal.id || index}`}
            display="flex"
            justifyContent="center"
            gap={0.5}
        >
            <Tooltip title="Edit">
                <IconButton
                    size={isMobile ? "small" : "medium"}
                    color="primary"
                    onClick={() => handleEdit(principal)}
                >
                    <EditIcon
                        fontSize={
                            isMobile ? "small" : "medium"
                        }
                    />
                </IconButton>
            </Tooltip>

            <Tooltip title="Delete">
                <IconButton
                    size={isMobile ? "small" : "medium"}
                    color="error"
                    onClick={() =>
                        handleDeleteClick(
                            principal.id,
                            principal.name
                        )
                    }
                >
                    <DeleteIcon
                        fontSize={
                            isMobile ? "small" : "medium"
                        }
                    />
                </IconButton>
            </Tooltip>
        </Box>
    ]);

    return (
        <>
            {/* Page Header */}
            <PageHeader
                title="Principal Management"
                subtitle="Manage all principals and their details efficiently"
                backgroundImage="/image1.jpeg"
            />

            <Container
                maxWidth="xl"
                sx={{
                    py: {
                        xs: 2,
                        sm: 3,
                        md: 4
                    }
                }}
            >
                <ToastContainer
                    position={
                        isMobile
                            ? "bottom-center"
                            : "bottom-right"
                    }
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

                <Box
                    display="flex"
                    justifyContent="flex-end"
                    alignItems="center"
                    mb={4}
                >
                    <Box
                        sx={{
                            width: {
                                xs: '100%',
                                sm: 'auto'
                            }
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                mb: {
                                    xs: '20px',
                                    sm: '30px'
                                },
                                mt: {
                                    xs: "-20px",
                                    sm: "-30px"
                                },
                                justifyContent: "flex-end",
                                width: {
                                    xs: '100%',
                                    sm: 'auto'
                                }
                            }}
                        >
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={handleAddNew}
                                fullWidth={isMobile}
                                sx={{
                                    fontSize: {
                                        xs: '0.875rem',
                                        sm: '1rem'
                                    },
                                    padding: {
                                        xs: '8px 16px',
                                        sm: '10px 24px'
                                    }
                                }}
                            >
                                Add Principal
                            </Button>
                        </Box>
                    </Box>
                </Box>

                {/* Data Display Section */}
                <Paper
                    elevation={3}
                    sx={{
                        p: {
                            xs: 1,
                            sm: 1.5,
                            md: 2
                        },
                        overflow: 'hidden'
                    }}
                >
                    {loading ? (
                        <Box
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            minHeight="200px"
                        >
                            <CircularProgress />
                        </Box>
                    ) : principals.length === 0 ? (
                        <Box textAlign="center" py={4}>
                            <Typography
                                variant="body1"
                                color="textSecondary"
                            >
                                No principals found. Click
                                "Add Principal" to create one.
                            </Typography>
                        </Box>
                    ) : (
                        <Box sx={{ overflowX: 'auto' }}>
                            <Reusabletable
                                headers={tableHeaders}
                                rows={tableRows}
                            />
                        </Box>
                    )}
                </Paper>
            </Container>

            {/* Add/Edit Dialog */}
            <Dialog
                open={dialogOpen}
                onClose={handleDialogClose}
                maxWidth="md"
                fullWidth
                disableEscapeKeyDown={submitting}
                PaperProps={{
                    sx: {
                        margin: {
                            xs: 2,
                            sm: 3,
                            md: 4
                        },
                        width: '100%',
                        maxHeight: {
                            xs: '95vh',
                            sm: '90vh'
                        }
                    }
                }}
            >
                <DialogTitle
                    sx={{
                        px: {
                            xs: 2,
                            sm: 2.5,
                            md: 3
                        },
                        py: {
                            xs: 1.5,
                            sm: 2,
                            md: 2.5
                        }
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: {
                                xs: 'flex-start',
                                sm: 'center'
                            },
                            justifyContent: "space-between",
                            gap: 1,
                            flexWrap: "wrap",
                            flexDirection: {
                                xs: 'column',
                                sm: 'row'
                            }
                        }}
                    >
                        <Box
                            sx={{
                                minWidth: 0,
                                width: {
                                    xs: '100%',
                                    sm: 'auto'
                                }
                            }}
                        >
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 700,
                                    fontSize: {
                                        xs: "1rem",
                                        sm: "1.125rem",
                                        md: "1.25rem"
                                    },
                                    lineHeight: 1.2,
                                }}
                            >
                                {editingId
                                    ? "Edit Principal"
                                    : "Add New Principal"}
                            </Typography>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                    fontSize: {
                                        xs: '0.75rem',
                                        sm: '0.875rem'
                                    }
                                }}
                            >
                                {editingId
                                    ? "Update the principal details below."
                                    : "Enter the details to create a new principal."}
                            </Typography>
                        </Box>

                        <IconButton
                            onClick={handleDialogClose}
                            disabled={submitting}
                            aria-label="close"
                            sx={{
                                border: 1,
                                borderColor: "divider",
                                flexShrink: 0,
                                alignSelf: {
                                    xs: 'flex-end',
                                    sm: 'center'
                                }
                            }}
                        >
                            <CloseIcon
                                fontSize={
                                    isMobile
                                        ? "small"
                                        : "medium"
                                }
                            />
                        </IconButton>
                    </Box>
                </DialogTitle>

                <Divider />

                <DialogContent
                    sx={{
                        px: {
                            xs: 2,
                            sm: 2.5,
                            md: 3
                        },
                        py: {
                            xs: 1.5,
                            sm: 2,
                            md: 2.5
                        }
                    }}
                >
                    <form
                        onSubmit={handleSubmit}
                        id="principal-form"
                    >
                        <Grid
                            container
                            spacing={2}
                            sx={{ mt: 0 }}
                        >

                            {/* Name */}
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Name *"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    variant="outlined"
                                    size={
                                        isMobile
                                            ? "small"
                                            : "medium"
                                    }
                                    disabled={submitting}
                                    placeholder="Enter full name"
                                />
                            </Grid>

                            {/* Designation */}
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Designation *"
                                    name="designation"
                                    value={formData.designation}
                                    onChange={handleChange}
                                    required
                                    variant="outlined"
                                    size={
                                        isMobile
                                            ? "small"
                                            : "medium"
                                    }
                                    disabled={submitting}
                                    placeholder="Enter designation"
                                />
                            </Grid>

                            {/* Qualification */}
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Qualification"
                                    name="qualification"
                                    value={formData.qualification}
                                    onChange={handleChange}
                                    variant="outlined"
                                    size={
                                        isMobile
                                            ? "small"
                                            : "medium"
                                    }
                                    disabled={submitting}
                                    placeholder="Enter qualification"
                                />
                            </Grid>

                            {/* Image Upload */}
                            <Grid item xs={12} md={6}>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        mb: 1,
                                        fontWeight: 500,
                                        color: 'text.secondary',
                                        fontSize: {
                                            xs: '0.8rem',
                                            sm: '0.875rem'
                                        }
                                    }}
                                >
                                    Principal Photo
                                </Typography>

                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 2,
                                        flexWrap: 'wrap'
                                    }}
                                >
                                    {/* Image Preview */}
                                    <Box
                                        sx={{
                                            width: 100,
                                            height: 100,
                                            borderRadius: '50%',
                                            overflow: 'hidden',
                                            border: '3px solid #E8ECF1',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            bgcolor: '#F5F7FA',
                                            flexShrink: 0
                                        }}
                                    >
                                        {formData.imagePreview ? (
                                            <Box
                                                component="img"
                                                src={formData.imagePreview}
                                                alt="Principal"
                                                sx={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover'
                                                }}
                                                onError={(e) => {
                                                    e.currentTarget.style.display = 'none';
                                                }}
                                            />
                                        ) : (
                                            <PersonIcon
                                                sx={{
                                                    fontSize: 48,
                                                    color: '#BDBDBD'
                                                }}
                                            />
                                        )}
                                    </Box>

                                    {/* Upload Button */}
                                    <Box>
                                        <Button
                                            variant="outlined"
                                            component="label"
                                            startIcon={
                                                <CloudUploadIcon />
                                            }
                                            disabled={submitting}
                                            sx={{
                                                borderRadius: 2,
                                                textTransform: 'none',
                                                fontWeight: 600,
                                                borderColor: '#D1D5DB',
                                                color: '#6B7280',
                                                '&:hover': {
                                                    borderColor: '#1565C0',
                                                    color: '#1565C0',
                                                    bgcolor:
                                                        'rgba(21, 101, 192, 0.04)'
                                                }
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

                                        {/* Remove Button */}
                                        {formData.imagePreview && (
                                            <Button
                                                variant="text"
                                                color="error"
                                                size="small"
                                                onClick={handleRemoveImage}
                                                disabled={submitting}
                                                sx={{
                                                    mt: 1,
                                                    textTransform: 'none',
                                                    fontWeight: 600,
                                                    display: 'block'
                                                }}
                                            >
                                                Remove Photo
                                            </Button>
                                        )}

                                        <Typography
                                            variant="caption"
                                            sx={{
                                                color: '#9CA3AF',
                                                display: 'block',
                                                mt: 1
                                            }}
                                        >
                                            JPG, PNG, GIF • Max 2MB
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>

                            {/* From Date */}
                            <Grid item xs={12} md={6}>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        mb: 0.5,
                                        fontWeight: 500,
                                        color: 'text.secondary',
                                        fontSize: {
                                            xs: '0.8rem',
                                            sm: '0.875rem'
                                        }
                                    }}
                                >
                                    From Date
                                </Typography>

                                <TextField
                                    fullWidth
                                    name="fromDate"
                                    type="date"
                                    value={formData.fromDate}
                                    onChange={handleChange}
                                    size={
                                        isMobile
                                            ? "small"
                                            : "medium"
                                    }
                                    disabled={submitting}
                                />
                            </Grid>

                            {/* To Date */}
                            <Grid item xs={12} md={6}>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        mb: 0.5,
                                        fontWeight: 500,
                                        color: 'text.secondary',
                                        fontSize: {
                                            xs: '0.8rem',
                                            sm: '0.875rem'
                                        }
                                    }}
                                >
                                    To Date
                                </Typography>

                                <TextField
                                    fullWidth
                                    name="toDate"
                                    type="date"
                                    value={formData.toDate}
                                    onChange={handleChange}
                                    size={
                                        isMobile
                                            ? "small"
                                            : "medium"
                                    }
                                    disabled={submitting}
                                />
                            </Grid>

                        </Grid>
                    </form>
                </DialogContent>

                <DialogActions
                    sx={{
                        p: {
                            xs: 2,
                            sm: 2.5,
                            md: 3
                        },
                        pt: {
                            xs: 1,
                            sm: 1.5,
                            md: 2
                        },
                        flexDirection: {
                            xs: 'column-reverse',
                            sm: 'row'
                        },
                        gap: {
                            xs: 1,
                            sm: 0
                        }
                    }}
                >
                    <Button
                        onClick={handleDialogClose}
                        disabled={submitting}
                        color="secondary"
                        variant="outlined"
                        fullWidth={isMobile}
                        startIcon={<CancelIcon />}
                        sx={{
                            order: {
                                xs: 2,
                                sm: 1
                            },
                            width: {
                                xs: '100%',
                                sm: 'auto'
                            }
                        }}
                    >
                        Cancel
                    </Button>

                    <Button
                        type="submit"
                        form="principal-form"
                        variant="contained"
                        color="primary"
                        startIcon={
                            submitting ? (
                                <CircularProgress size={20} />
                            ) : (
                                <SaveIcon />
                            )
                        }
                        disabled={submitting}
                        fullWidth={isMobile}
                        sx={{
                            order: {
                                xs: 1,
                                sm: 2
                            },
                            width: {
                                xs: '100%',
                                sm: 'auto'
                            }
                        }}
                    >
                        {submitting
                            ? 'Saving...'
                            : editingId
                                ? 'Update'
                                : 'Save'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={handleDeleteCancel}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        p: {
                            xs: 1,
                            sm: 2
                        },
                        boxShadow:
                            '0 20px 60px rgba(0,0,0,0.2)',
                    }
                }}
            >
                <DialogTitle
                    sx={{
                        pb: 1,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                    }}
                >
                    <Box
                        sx={{
                            bgcolor: '#FFF3E0',
                            borderRadius: '50%',
                            width: {
                                xs: 40,
                                sm: 48
                            },
                            height: {
                                xs: 40,
                                sm: 48
                            },
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                        }}
                    >
                        <WarningIcon
                            sx={{
                                color: '#E65100',
                                fontSize: {
                                    xs: 24,
                                    sm: 28
                                }
                            }}
                        />
                    </Box>

                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 600,
                            fontSize: {
                                xs: '1rem',
                                sm: '1.25rem'
                            },
                            color: '#1a1a1a'
                        }}
                    >
                        Delete Principal
                    </Typography>
                </DialogTitle>

                <DialogContent sx={{ pb: 1 }}>
                    <DialogContentText
                        sx={{
                            fontSize: {
                                xs: '0.9rem',
                                sm: '1rem'
                            },
                            color: '#424242',
                            lineHeight: 1.6,
                            mb: 2
                        }}
                    >
                        Are you sure you want to delete{' '}
                        <strong
                            style={{
                                color: '#D32F2F'
                            }}
                        >
                            {deleteItemName}
                        </strong>{' '}
                        from the principals list?
                        This action cannot be undone.
                    </DialogContentText>

                    <Box
                        sx={{
                            bgcolor: '#FFF8E1',
                            borderRadius: 2,
                            p: {
                                xs: 1.5,
                                sm: 2
                            },
                            mt: 1,
                            border:
                                '1px solid #FFE082'
                        }}
                    >
                        <Typography
                            variant="body2"
                            sx={{
                                color: '#795548',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                fontSize: {
                                    xs: '0.8rem',
                                    sm: '0.875rem'
                                }
                            }}
                        >
                            <PersonIcon
                                sx={{
                                    fontSize: {
                                        xs: 18,
                                        sm: 20
                                    }
                                }}
                            />

                            <span>
                                <strong>
                                    Principal:
                                </strong>{' '}
                                {deleteItemName}
                            </span>
                        </Typography>
                    </Box>
                </DialogContent>

                <DialogActions
                    sx={{
                        p: {
                            xs: 2,
                            sm: 2.5
                        },
                        pt: {
                            xs: 1.5,
                            sm: 2
                        },
                        gap: {
                            xs: 1,
                            sm: 1.5
                        },
                        flexDirection: {
                            xs: 'column-reverse',
                            sm: 'row'
                        }
                    }}
                >
                    <Button
                        onClick={handleDeleteCancel}
                        variant="outlined"
                        color="secondary"
                        fullWidth={isMobile}
                        startIcon={<CancelIcon />}
                        sx={{
                            borderRadius: 2,
                            py: {
                                xs: 0.8,
                                sm: 1
                            },
                            fontSize: {
                                xs: '0.85rem',
                                sm: '0.9375rem'
                            },
                            fontWeight: 600,
                            textTransform: 'none',
                            order: {
                                xs: 2,
                                sm: 1
                            }
                        }}
                    >
                        Cancel
                    </Button>

                    <Button
                        onClick={handleDeleteConfirm}
                        variant="contained"
                        color="error"
                        fullWidth={isMobile}
                        startIcon={<DeleteIcon />}
                        sx={{
                            borderRadius: 2,
                            py: {
                                xs: 0.8,
                                sm: 1
                            },
                            fontSize: {
                                xs: '0.85rem',
                                sm: '0.9375rem'
                            },
                            fontWeight: 600,
                            textTransform: 'none',
                            boxShadow:
                                '0 8px 20px rgba(211, 47, 47, 0.3)',
                            '&:hover': {
                                boxShadow:
                                    '0 12px 28px rgba(211, 47, 47, 0.4)',
                            },
                            order: {
                                xs: 1,
                                sm: 2
                            }
                        }}
                    >
                        Delete Principal
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default App;