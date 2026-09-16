import React, { useState, useEffect } from 'react';
import {
    Container, Paper, Typography, TextField, Button, Box, Alert, Snackbar, CircularProgress, Card, CardContent, IconButton, Chip, useTheme, useMediaQuery, alpha, Fade, Grow,
    LinearProgress, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Tooltip
} from '@mui/material';
import {
    CloudUpload as CloudUploadIcon, Clear as ClearIcon, PictureAsPdf as PdfIcon, Description as DescriptionIcon, Send as SendIcon, Cancel as CancelIcon, CloudDone as CloudDoneIcon, CloudOff as CloudOffIcon,
    UploadFile as UploadFileIcon, Edit as EditIcon, Delete as DeleteIcon, Refresh as RefreshIcon, Close as CloseIcon, Visibility as VisibilityIcon, OpenInNew as OpenInNewIcon, Download as DownloadIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import instance from '../AxiosInstance/AxiosInstance';
import { uploadFileToCloudinary } from "../Common/Fileupload";
import Reusabletable from "../Common/Reusabletable";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Styled Components
const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(4),
    position: 'relative',
    overflow: 'hidden',
    borderRadius: theme.spacing(3),
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.06)',
    border: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
    background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.primary.main, 0.01)} 100%)`,
    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(3),
        borderRadius: theme.spacing(2),
    },
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '6px',
        background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    }
}));

const ListPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    borderRadius: theme.spacing(3),
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.06)',
    border: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
    marginTop: theme.spacing(4),
    position: 'relative',
    overflow: 'hidden',
    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(2),
        borderRadius: theme.spacing(2),
        marginTop: theme.spacing(3),
    },
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '6px',
        background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    }
}));

const UploadArea = styled(Paper)(({ theme, hasFile, isDragging, isUploading }) => ({
    padding: theme.spacing(4),
    textAlign: 'center',
    border: `2px dashed ${hasFile ? theme.palette.success.main : isDragging ? theme.palette.primary.main : alpha(theme.palette.divider, 0.8)}`,
    borderRadius: theme.spacing(2.5),
    cursor: isUploading ? 'default' : 'pointer',
    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
    backgroundColor: hasFile ? alpha(theme.palette.success.main, 0.02) :
        isDragging ? alpha(theme.palette.primary.main, 0.04) :
            alpha(theme.palette.background.default, 0.5),
    transform: isDragging ? 'scale(1.01)' : 'scale(1)',
    opacity: isUploading ? 0.8 : 1,
    boxShadow: isDragging ? `0 12px 24px ${alpha(theme.palette.primary.main, 0.08)}` : 'none',
    '&:hover': {
        borderColor: hasFile ? theme.palette.success.main : theme.palette.primary.main,
        backgroundColor: hasFile ? alpha(theme.palette.success.main, 0.04) : alpha(theme.palette.primary.main, 0.03),
    },
    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(3, 2),
    }
}));

const FileCard = styled(Card)(({ theme, isUploading }) => ({
    borderRadius: theme.spacing(2.5),
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
    boxShadow: '0 4px 12px 0 rgba(0, 0, 0, 0.03)',
    transition: 'all 0.3s ease',
    opacity: isUploading ? 0.7 : 1,
    '&:hover': {
        boxShadow: isUploading ? 'none' : '0 8px 24px 0 rgba(0, 0, 0, 0.08)',
        borderColor: alpha(theme.palette.primary.main, 0.3)
    }
}));

const StyledButton = styled(Button)(({ theme }) => ({
    borderRadius: theme.spacing(2),
    padding: theme.spacing(1.75, 4),
    textTransform: 'none',
    fontWeight: 600,
    letterSpacing: '0.3px',
    transition: 'all 0.2s ease',
    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(1.5, 3),
        fontSize: '0.95rem'
    }
}));

const UploadProgressWrapper = styled(Box)(({ theme }) => ({
    marginTop: theme.spacing(2.5),
    padding: theme.spacing(2.5),
    borderRadius: theme.spacing(2),
    backgroundColor: alpha(theme.palette.primary.main, 0.02),
    border: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
}));

// File chip shown inside the table - clicking it (or the icon button) opens the preview dialog
const FileChip = styled(Box)(({ theme }) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: theme.spacing(0.75),
    padding: theme.spacing(0.5, 1.25),
    borderRadius: theme.spacing(1.5),
    backgroundColor: alpha(theme.palette.error.main, 0.06),
    border: `1px solid ${alpha(theme.palette.error.main, 0.15)}`,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    maxWidth: '100%',
    '&:hover': {
        backgroundColor: alpha(theme.palette.error.main, 0.12),
        transform: 'translateY(-1px)',
    }
}));

const SimpleCommitteeForm = ({ onSuccess, onCancel, editingCommittee, onEditComplete }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isSmallMobile = useMediaQuery(theme.breakpoints.down('xs'));

    // State for form
    const [formData, setFormData] = useState({
        title: '',
        file: null,
        cloudinaryUrl: null,
        existingFileUrl: null
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [committees, setCommittees] = useState([]);
    const [loadingCommittees, setLoadingCommittees] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [committeeToDelete, setCommitteeToDelete] = useState(null);

    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editData, setEditData] = useState({ id: null, title: '', fileUrl: '', fileName: '', });
    const [editFile, setEditFile] = useState(null);
    const [editUploading, setEditUploading] = useState(false);
    const [editUploadProgress, setEditUploadProgress] = useState(0);
    const [editLoading, setEditLoading] = useState(false);
    const [editError, setEditError] = useState('');
    const [editCloudinaryUrl, setEditCloudinaryUrl] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // ---- NEW: View/preview dialog state ----
    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [viewingFile, setViewingFile] = useState({ url: '', name: '', title: '' });
    const [pdfLoading, setPdfLoading] = useState(true);

    useEffect(() => {
        fetchCommittees();
    }, []);

    useEffect(() => {
        if (editingCommittee) {
            setIsEditing(true);
            setFormData({
                title: editingCommittee.title || '',
                file: null,
                cloudinaryUrl: editingCommittee.fileUrl || null,
                existingFileUrl: editingCommittee.fileUrl || null
            });
            setSelectedFile(null);
        } else {
            setIsEditing(false);
            resetForm();
        }
    }, [editingCommittee]);

    const fetchCommittees = async () => {
        setLoadingCommittees(true);
        try {
            const response = await instance.get('/committees');
            setCommittees(response.data);
        } catch (err) {
            console.error('Error fetching committees:', err);
            toast.error('Failed to fetch committees');
        } finally {
            setLoadingCommittees(false);
        }
    };


    const resetForm = () => {
        setFormData({ title: '', file: null, cloudinaryUrl: null, existingFileUrl: null });
        setSelectedFile(null);
        setError('');
        setUploadProgress(0);
    };

    // Handle input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle file drag events
    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!uploading) {
            setIsDragging(true);
        }
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        if (uploading) return;

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileValidation(files[0]);
        }
    };

    // Handle file change
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && !uploading) {
            handleFileValidation(file);
        }
    };

    // Validate file
    const handleFileValidation = async (file) => {
        if (!file.name.toLowerCase().endsWith('.pdf')) {
            toast.error('Only PDF files are allowed');
            setError('Only PDF files are allowed');
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            toast.error('File size must be less than 10MB');
            setError('File size must be less than 10MB');
            return;
        }

        setSelectedFile(file);
        setFormData(prev => ({
            ...prev,
            file: file,
            cloudinaryUrl: null
        }));
        setError('');
        await uploadToCloudinary(file);
    };

    // Upload file to Cloudinary
    const uploadToCloudinary = async (file) => {
        setUploading(true);
        setUploadProgress(0);

        const progressInterval = setInterval(() => {
            setUploadProgress(prev => {
                if (prev >= 90) {
                    clearInterval(progressInterval);
                    return 90;
                }
                return prev + 10;
            });
        }, 200);

        try {
            const cloudinaryUrl = await uploadFileToCloudinary(file);

            clearInterval(progressInterval);
            setUploadProgress(100);

            setFormData(prev => ({
                ...prev,
                cloudinaryUrl: cloudinaryUrl
            }));

            toast.success('File uploaded to Cloudinary successfully!');

        } catch (err) {
            clearInterval(progressInterval);
            console.error('Cloudinary upload error:', err);
            toast.error(err.message || 'Failed to upload file to Cloudinary');
            setError(err.message || 'Failed to upload file to Cloudinary');
            setSelectedFile(null);
            setFormData(prev => ({
                ...prev,
                file: null,
                cloudinaryUrl: null
            }));
        } finally {
            setUploading(false);
            setUploadProgress(0);
        }
    };

    // Remove file
    const handleRemoveFile = () => {
        if (uploading) return;
        setSelectedFile(null);
        setFormData(prev => ({
            ...prev,
            file: null,
            cloudinaryUrl: prev.existingFileUrl || null
        }));
        setUploadProgress(0);
    };

    // Handle submit (Create)
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title.trim()) {
            toast.error('Please enter a committee title');
            setError('Please enter a committee title');
            return;
        }

        if (!formData.file) {
            toast.error('Please select a file to upload');
            setError('Please select a file to upload');
            return;
        }

        if (!formData.cloudinaryUrl) {
            toast.error('File upload to Cloudinary is in progress or failed. Please wait.');
            setError('File upload to Cloudinary is in progress or failed. Please wait.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const payload = {
                title: formData.title,
                fileUrl: formData.cloudinaryUrl,
                fileName: formData.file.name,
            };

            const response = await instance.post('/committees', payload, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            console.log('Create Response:', response.data);

            toast.success('Committee added successfully!');

            if (onSuccess) {
                onSuccess(response.data);
            }

            await fetchCommittees();
            resetForm();
            setSuccess(true);

        } catch (err) {
            console.error('Error:', err);
            const errorMsg = err.response?.data?.message || 'Failed to add committee. Please try again.';
            toast.error(errorMsg);
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (committee) => {
        setEditData({
            id: committee.id,
            title: committee.title || '',
            fileUrl: committee.fileUrl || '',
            fileName: committee.fileName || '',
        });
        setEditFile(null);
        setEditCloudinaryUrl(null);
        setEditError('');
        setEditDialogOpen(true);
    };

    // Close edit dialog
    const handleCloseEditDialog = () => {
        setEditDialogOpen(false);
        setEditFile(null);
        setEditCloudinaryUrl(null);
        setEditError('');
        setEditUploadProgress(0);
    };

    // Handle edit file change
    const handleEditFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            validateAndUploadEditFile(file);
        }
    };

    // Validate and upload edit file
    const validateAndUploadEditFile = async (file) => {
        if (!file.name.toLowerCase().endsWith('.pdf')) {
            toast.error('Only PDF files are allowed');
            setEditError('Only PDF files are allowed');
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            toast.error('File size must be less than 10MB');
            setEditError('File size must be less than 10MB');
            return;
        }

        // A brand-new file was picked -> it fully replaces whatever was there before
        // (the old cloudinary file reference is dropped from state immediately).
        setEditFile(file);
        setEditError('');
        setEditCloudinaryUrl(null);
        await uploadEditFile(file);
    };

    // Upload edit file to Cloudinary
    const uploadEditFile = async (file) => {
        setEditUploading(true);
        setEditUploadProgress(0);

        const interval = setInterval(() => {
            setEditUploadProgress(prev => {
                if (prev >= 90) {
                    clearInterval(interval);
                    return 90;
                }
                return prev + 10;
            });
        }, 200);

        try {
            const url = await uploadFileToCloudinary(file);
            clearInterval(interval);
            setEditUploadProgress(100);
            setEditCloudinaryUrl(url);

            toast.success('New file uploaded successfully! It will replace the existing document on update.');

        } catch (err) {
            clearInterval(interval);
            toast.error('Failed to upload file');
            setEditError('Failed to upload file');
            setEditFile(null);
            setEditCloudinaryUrl(null);
        } finally {
            setEditUploading(false);
        }
    };

    // Remove the newly-picked replacement file (keeps the old existing file intact)
    const handleRemoveEditFile = () => {
        setEditFile(null);
        setEditCloudinaryUrl(null);
        setEditUploadProgress(0);
        setEditError('');
    };

    // NEW: Explicitly discard the OLD/existing file attached to this committee.
    // After this, the old file reference is cleared and the user must upload a new one.
    const handleRemoveExistingFile = () => {
        setEditData(prev => ({ ...prev, fileUrl: '', fileName: '' }));
        setEditFile(null);
        setEditCloudinaryUrl(null);
        setEditUploadProgress(0);
        setEditError('');
        toast.info('Existing file removed. Please upload a new document.');
    };

    // Handle edit submit
    const handleEditSubmit = async () => {
        if (!editData.title.trim()) {
            toast.error('Please enter a committee title');
            setEditError('Please enter a committee title');
            return;
        }

        if (!editData.fileUrl && !editCloudinaryUrl) {
            toast.error('Please upload a document - the previous file was removed');
            setEditError('Please upload a document - the previous file was removed');
            return;
        }

        if (editUploading) {
            toast.error('Please wait for the file upload to finish');
            setEditError('Please wait for the file upload to finish');
            return;
        }

        setEditLoading(true);
        setEditError('');

        try {
            // The new upload (if any) always wins - this is what actually
            // replaces the old cloudinary file on the backend record.
            const payload = {
                title: editData.title,
                fileUrl: editCloudinaryUrl || editData.fileUrl,
                fileName: editFile ? editFile.name : editData.fileName,
            };

            await instance.put(`/committees/${editData.id}`, payload);

            toast.success('Committee updated successfully!');

            await fetchCommittees();
            handleCloseEditDialog();

            if (onEditComplete) {
                onEditComplete(editData);
            }

        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Failed to update committee';
            toast.error(errorMsg);
            setEditError(errorMsg);
        } finally {
            setEditLoading(false);
        }
    };

    // Handle Delete
    const handleDelete = async (committeeId) => {
        try {
            await instance.delete(`/committees/${committeeId}`);

            toast.success('Committee deleted successfully!');

            await fetchCommittees();

            if (editingCommittee && editingCommittee.id === committeeId) {
                resetForm();
                setIsEditing(false);
                if (onEditComplete) {
                    onEditComplete(null);
                }
            }

        } catch (err) {
            console.error('Error deleting committee:', err);
            toast.error('Failed to delete committee');
        } finally {
            setDeleteDialogOpen(false);
            setCommitteeToDelete(null);
        }
    };

    // Get file icon
    const getFileIcon = (file) => {
        if (!file) return <DescriptionIcon />;
        return file.name.toLowerCase().endsWith('.pdf')
            ? <PdfIcon sx={{ fontSize: { xs: 32, sm: 40 } }} color="error" />
            : <DescriptionIcon sx={{ fontSize: { xs: 32, sm: 40 } }} color="primary" />;
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // ---- NEW: open the preview dialog for a committee's file ----
    const handleViewFile = (committee) => {
        if (!committee.fileUrl) {
            toast.error('No file attached to this committee');
            return;
        }
        setPdfLoading(true);
        setViewingFile({
            url: committee.fileUrl,
            name: committee.fileName || 'Document.pdf',
            title: committee.title || 'Committee Document'
        });
        setViewDialogOpen(true);
    };

    const handleCloseViewDialog = () => {
        setViewDialogOpen(false);
        setViewingFile({ url: '', name: '', title: '' });
    };

    // Prepare table data for HistoryTable
    const tableHeaders = ['S.No', 'Title', 'File', 'Actions'];
    const tableRows = committees
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        .map((committee) => [
            committee.id,
            committee.title,
            <FileChip
                key={`file-${committee.id}`}
                onClick={() => handleViewFile(committee)}
                title="Click to preview"
            >
                <PdfIcon fontSize="small" color="error" sx={{ fontSize: { xs: 16, sm: 18 } }} />
                <Typography
                    variant="body2"
                    fontWeight="600"
                    color="text.primary"
                    sx={{
                        fontSize: { xs: '0.7rem', sm: '0.8125rem' },
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        maxWidth: { xs: 90, sm: 160 }
                    }}
                >
                    {committee.fileName || 'Document'}
                </Typography>
            </FileChip>,
            <Box key={`actions-${committee.id}`} display="flex" alignItems="center">
                <Tooltip title="View / Preview">
                    <IconButton
                        size="small"
                        color="info"
                        onClick={() => handleViewFile(committee)}
                        sx={{ mr: 0.5 }}
                    >
                        <VisibilityIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Edit">
                    <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleEditClick(committee)}
                        sx={{ mr: 0.5}}
                    >
                        <EditIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                    <IconButton
                        size="small"
                        color="error"
                        onClick={() => {
                            setCommitteeToDelete(committee);
                            setDeleteDialogOpen(true);
                        }}
                    >
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            </Box>
        ]);

    return (
        <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 4 }, px: { xs: 1.5, sm: 3 } }}>
            {/* Form Section */}
            <Fade in={true} timeout={400}>
                <StyledPaper elevation={0}>
                    <Box mb={3}>
                        <Typography variant="h5" gutterBottom fontWeight="800" sx={{ fontSize: { xs: '1.3rem', sm: '1.6rem' }, letterSpacing: '-0.5px' }}>
                            {isEditing ? 'Edit Committee' : 'Add New Committee'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" fontWeight="500">
                            {isEditing ? 'Update committee information' : 'Upload committee documents safely to Cloudinary storage.'}
                        </Typography>
                    </Box>

                    <form onSubmit={handleSubmit}>
                        {/* Title Field */}
                        <Box mb={3}>
                            <TextField
                                fullWidth
                                label="Committee Title"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                required
                                placeholder="e.g., Internal Quality Assurance Cell"
                                variant="outlined"
                                size={isMobile ? "small" : "medium"}
                                disabled={loading || uploading}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2.5,
                                        backgroundColor: alpha(theme.palette.background.default, 0.4),
                                        '&:hover': {
                                            backgroundColor: alpha(theme.palette.background.default, 0.8),
                                        }
                                    }
                                }}
                            />
                        </Box>

                        {/* File Upload Section */}
                        <Box mb={3}>
                            <Typography variant="subtitle2" gutterBottom fontWeight="600" color="text.primary" sx={{ mb: 1.5, ml: 0.5 }}>
                                Document (PDF only) {isEditing && formData.existingFileUrl && '(Optional - upload new file to replace existing)'}
                            </Typography>

                            {!selectedFile && !formData.existingFileUrl ? (
                                <UploadArea
                                    elevation={0}
                                    hasFile={false}
                                    isDragging={isDragging}
                                    isUploading={uploading}
                                    onDragEnter={handleDragEnter}
                                    onDragLeave={handleDragLeave}
                                    onDragOver={handleDragOver}
                                    onDrop={handleDrop}
                                    onClick={() => {
                                        if (!uploading) {
                                            document.getElementById('file-upload').click();
                                        }
                                    }}
                                >
                                    <input
                                        id="file-upload"
                                        type="file"
                                        accept=".pdf"
                                        onChange={handleFileChange}
                                        style={{ display: 'none' }}
                                        disabled={uploading}
                                    />
                                    {uploading ? (
                                        <Box py={1}>
                                            <CircularProgress size={40} thickness={4.5} sx={{ mb: 2 }} />
                                            <Typography variant="body2" fontWeight="600" gutterBottom>
                                                Uploading to Cloudinary...
                                            </Typography>
                                            <Box sx={{ width: '100%', maxWidth: 260, mx: 'auto', mt: 2 }}>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={uploadProgress}
                                                    sx={{ borderRadius: 4, height: 6, bgcolor: alpha(theme.palette.primary.main, 0.08) }}
                                                />
                                                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block', fontWeight: 500 }}>
                                                    {uploadProgress}% completed
                                                </Typography>
                                            </Box>
                                        </Box>
                                    ) : (
                                        <>
                                            <CloudUploadIcon
                                                sx={{
                                                    fontSize: { xs: 40, sm: 48 },
                                                    color: isDragging ? 'primary.main' : alpha(theme.palette.text.secondary, 0.4),
                                                    mb: 1.5,
                                                    transition: 'all 0.2s ease'
                                                }}
                                            />
                                            <Typography variant="body2" fontWeight="600" color="text.primary" gutterBottom>
                                                Drop your PDF here, or <Box component="span" color="primary.main" sx={{ textDecoration: 'underline' }}>browse</Box>
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary" fontWeight="500">
                                                Supports PDF up to 10MB
                                            </Typography>
                                        </>
                                    )}
                                </UploadArea>
                            ) : (
                                <Grow in={true} timeout={300}>
                                    <FileCard elevation={0} isUploading={uploading}>
                                        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                                            <Box display="flex" alignItems="center" justifyContent="space-between" gap={1.5}>
                                                <Box display="flex" alignItems="center" gap={1.5} sx={{ minWidth: 0, flex: 1 }}>
                                                    <Box
                                                        sx={{
                                                            width: { xs: 40, sm: 48 },
                                                            height: { xs: 40, sm: 48 },
                                                            borderRadius: 2,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            bgcolor: alpha(theme.palette.error.main, 0.06),
                                                            color: theme.palette.error.main,
                                                            flexShrink: 0
                                                        }}
                                                    >
                                                        {selectedFile ? getFileIcon(selectedFile) : <PdfIcon sx={{ fontSize: { xs: 28, sm: 36 } }} color="error" />}
                                                    </Box>
                                                    <Box sx={{ minWidth: 0, flex: 1 }}>
                                                        <Typography
                                                            variant="body2"
                                                            fontWeight="600"
                                                            sx={{
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                                whiteSpace: 'nowrap',
                                                                color: 'text.primary',
                                                                fontSize: { xs: '0.875rem', sm: '1rem' }
                                                            }}
                                                        >
                                                            {selectedFile ? selectedFile.name : (editingCommittee?.fileName || 'Existing file')}
                                                        </Typography>
                                                        <Box display="flex" alignItems="center" gap={1} mt={0.5} flexWrap="wrap">
                                                            <Chip
                                                                label="PDF"
                                                                size="small"
                                                                color="error"
                                                                variant="filled"
                                                                sx={{ height: 18, fontSize: '0.6rem', fontWeight: 700, borderRadius: 1 }}
                                                            />
                                                            {formData.existingFileUrl && !selectedFile && (
                                                                <Chip
                                                                    label="Existing"
                                                                    size="small"
                                                                    color="info"
                                                                    variant="outlined"
                                                                    sx={{ height: 18, fontSize: '0.6rem', fontWeight: 600, borderRadius: 1 }}
                                                                />
                                                            )}
                                                        </Box>
                                                    </Box>
                                                </Box>
                                                <IconButton
                                                    color="error"
                                                    onClick={handleRemoveFile}
                                                    size="small"
                                                    disabled={uploading || (!selectedFile && !formData.existingFileUrl)}
                                                    sx={{
                                                        flexShrink: 0,
                                                        border: `1px solid ${alpha(theme.palette.error.main, 0.1)}`,
                                                        bgcolor: alpha(theme.palette.error.main, 0.02),
                                                        '&:hover': {
                                                            backgroundColor: alpha(theme.palette.error.main, 0.08)
                                                        }
                                                    }}
                                                >
                                                    <ClearIcon fontSize="small" />
                                                </IconButton>
                                            </Box>

                                            {uploading && (
                                                <UploadProgressWrapper>
                                                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                                                        <UploadFileIcon color="info" sx={{ fontSize: 16 }} />
                                                        <Typography variant="caption" fontWeight="600">
                                                            Uploading document sync...
                                                        </Typography>
                                                    </Box>
                                                    <LinearProgress
                                                        variant="determinate"
                                                        value={uploadProgress}
                                                        sx={{ borderRadius: 2, height: 6 }}
                                                    />
                                                </UploadProgressWrapper>
                                            )}

                                            {!uploading && (formData.cloudinaryUrl || formData.existingFileUrl) && (
                                                <Box mt={1.5} px={0.5} display="flex" alignItems="center" gap={1}>
                                                    <CloudDoneIcon color="success" sx={{ fontSize: 16 }} />
                                                    <Typography variant="caption" color="success.main" fontWeight="600">
                                                        {isEditing && !formData.cloudinaryUrl ? 'Using existing file ✓' : 'Ready to submit ✓'}
                                                    </Typography>
                                                </Box>
                                            )}

                                            {!uploading && selectedFile && !formData.cloudinaryUrl && (
                                                <Box mt={1.5} px={0.5} display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={1}>
                                                    <Box display="flex" alignItems="center" gap={1}>
                                                        <CloudOffIcon color="error" sx={{ fontSize: 16 }} />
                                                        <Typography variant="caption" color="error.main" fontWeight="600">
                                                            Upload failed.
                                                        </Typography>
                                                    </Box>
                                                    <Button
                                                        size="small"
                                                        variant="text"
                                                        color="primary"
                                                        onClick={() => handleFileValidation(selectedFile)}
                                                        sx={{ fontWeight: 700, p: 0, minWidth: 'auto', fontSize: '0.75rem' }}
                                                    >
                                                        Retry Upload
                                                    </Button>
                                                </Box>
                                            )}
                                        </CardContent>
                                    </FileCard>
                                </Grow>
                            )}
                        </Box>

                        {/* Error Display */}
                        {error && (
                            <Fade in={!!error}>
                                <Alert
                                    severity="error"
                                    sx={{ mb: 2.5, borderRadius: 2, fontWeight: 500 }}
                                    action={
                                        <IconButton
                                            size="small"
                                            onClick={() => setError('')}
                                            sx={{ color: 'inherit' }}
                                        >
                                            <ClearIcon fontSize="small" />
                                        </IconButton>
                                    }
                                >
                                    {error}
                                </Alert>
                            </Fade>
                        )}

                        {/* Buttons */}
                        <Box display="flex" flexDirection={isMobile ? "column" : "row"} gap={1.5} justifyContent="flex-end" mt={2}>
                            {onCancel && (
                                <StyledButton
                                    variant="text"
                                    onClick={() => {
                                        if (onCancel) onCancel();
                                        resetForm();
                                        setIsEditing(false);
                                    }}
                                    disabled={loading || uploading}
                                    fullWidth={isMobile}
                                    startIcon={<CancelIcon />}
                                    sx={{
                                        color: 'text.secondary',
                                        order: isMobile ? 2 : 1,
                                    }}
                                >
                                    Cancel
                                </StyledButton>
                            )}
                            <StyledButton
                                type="submit"
                                variant="contained"
                                disableElevation
                                fullWidth={isMobile}
                                disabled={
                                    loading ||
                                    uploading ||
                                    (!isEditing && !selectedFile) ||
                                    (!isEditing && !formData.cloudinaryUrl)
                                }
                                endIcon={
                                    loading ? (
                                        <CircularProgress size={18} color="inherit" />
                                    ) : (
                                        <SendIcon />
                                    )
                                }
                                sx={{
                                    mt: 2,
                                    order: isMobile ? 1 : 2,
                                    fontWeight: 700,
                                    px: 4,
                                    borderRadius: 2.5,
                                    background: theme.palette.primary.main,
                                    '&:hover': {
                                        background: theme.palette.primary.dark,
                                    }
                                }}
                            >
                                {loading
                                    ? 'Submitting...'
                                    : uploading
                                        ? 'Uploading...'
                                        : isEditing ? 'Update Committee' : 'Submit Committee'}
                            </StyledButton>
                        </Box>
                    </form>
                </StyledPaper>
            </Fade>

            {/* Committees List Section - Full Width */}
            <ListPaper elevation={0}>
                {loadingCommittees ? (
                    <Box display="flex" justifyContent="center" py={6}>
                        <CircularProgress />
                    </Box>
                ) : committees.length === 0 ? (
                    <Box sx={{ p: 4, textAlign: 'center' }}>
                        <Typography variant="body1" color="text.secondary">
                            No committees found.
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            Add your first committee from the form above!
                        </Typography>
                    </Box>
                ) : (
                    <Reusabletable
                        headers={tableHeaders}
                        rows={tableRows}
                    />
                )}
            </ListPaper>

            {/* ============= VIEW / PREVIEW DIALOG ============= */}
            <Dialog
                open={viewDialogOpen}
                onClose={handleCloseViewDialog}
                maxWidth="md"
                fullWidth
                fullScreen={isMobile}
                PaperProps={{
                    sx: {
                        borderRadius: isMobile ? 0 : 3,
                        overflow: 'hidden',
                        height: isMobile ? '100%' : '85vh'
                    }
                }}
            >
                <Box sx={{
                    position: 'relative',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '6px',
                        background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    }
                }}>
                    <DialogTitle sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        pt: 3,
                        pb: 2,
                        gap: 1
                    }}>
                        <Box display="flex" alignItems="center" gap={1.5} sx={{ minWidth: 0 }}>
                            <PdfIcon color="error" />
                            <Box sx={{ minWidth: 0 }}>
                                <Typography variant="h6" fontWeight="700" noWrap>
                                    {viewingFile.title}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block' }}>
                                    {viewingFile.name}
                                </Typography>
                            </Box>
                        </Box>
                        <Box display="flex" alignItems="center" gap={0.5} flexShrink={0}>
                            <Tooltip title="Open in new tab">
                                <IconButton
                                    size="small"
                                    component="a"
                                    href={viewingFile.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <OpenInNewIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Download">
                                <IconButton
                                    size="small"
                                    component="a"
                                    href={viewingFile.url}
                                    download={viewingFile.name}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <DownloadIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                            <IconButton onClick={handleCloseViewDialog} size="small">
                                <CloseIcon />
                            </IconButton>
                        </Box>
                    </DialogTitle>

                    <DialogContent sx={{ p: 0, height: '100%', position: 'relative', bgcolor: alpha(theme.palette.text.primary, 0.03) }}>
                        {pdfLoading && (
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: 0, left: 0, right: 0, bottom: 0,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 1.5,
                                    zIndex: 1,
                                    bgcolor: theme.palette.background.paper
                                }}
                            >
                                <CircularProgress size={32} />
                                <Typography variant="body2" color="text.secondary" fontWeight="500">
                                    Loading document...
                                </Typography>
                            </Box>
                        )}
                        {viewingFile.url && (
                            <iframe
                                src={viewingFile.url}
                                title={viewingFile.name}
                                onLoad={() => setPdfLoading(false)}
                                style={{
                                    width: '100%',
                                    height: isMobile ? 'calc(100vh - 90px)' : '70vh',
                                    border: 'none',
                                    display: 'block'
                                }}
                            />
                        )}
                    </DialogContent>
                </Box>
            </Dialog>

            {/* ============= EDIT DIALOG ============= */}
            <Dialog
                open={editDialogOpen}
                onClose={handleCloseEditDialog}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        padding: 0,
                        overflow: 'hidden'
                    }
                }}
            >
                <Box sx={{
                    position: 'relative',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '6px',
                        background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    }
                }}>
                    <DialogTitle sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        pt: 3,
                        pb: 2
                    }}>
                        <Typography variant="h6" fontWeight="700">
                            Edit Committee
                        </Typography>
                        <IconButton onClick={handleCloseEditDialog} size="small">
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>

                    <DialogContent sx={{ pt: 1, pb: 2 }}>
                        <Box sx={{ mt: 1 }}>
                            {/* Edit Title */}
                            <Box mb={3}>
                                <TextField
                                    fullWidth
                                    label="Committee Title"
                                    value={editData.title}
                                    onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                                    variant="outlined"
                                    disabled={editLoading || editUploading}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2.5,
                                            backgroundColor: alpha(theme.palette.background.default, 0.4),
                                        }
                                    }}
                                />
                            </Box>

                            {/* Edit File Section */}
                            <Box>
                                <Typography variant="subtitle2" gutterBottom fontWeight="600" sx={{ mb: 1.5 }}>
                                    Document (PDF only)
                                </Typography>

                                {/* Show existing file with an explicit remove/replace action */}
                                {!editFile && editData.fileUrl && (
                                    <FileCard elevation={0} sx={{ mb: 2 }}>
                                        <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                                            <Box display="flex" alignItems="center" justifyContent="space-between" gap={1}>
                                                <Box
                                                    display="flex"
                                                    alignItems="center"
                                                    gap={1.25}
                                                    sx={{ minWidth: 0, flex: 1, cursor: 'pointer' }}
                                                    onClick={() => window.open(editData.fileUrl, '_blank', 'noopener,noreferrer')}
                                                >
                                                    <PdfIcon color="error" sx={{ fontSize: 30, flexShrink: 0 }} />
                                                    <Box sx={{ minWidth: 0 }}>
                                                        <Typography
                                                            variant="body2"
                                                            fontWeight="600"
                                                            noWrap
                                                        >
                                                            {editData.fileName || 'Document'}
                                                        </Typography>
                                                        <Box display="flex" alignItems="center" gap={0.75} mt={0.25}>
                                                            <Chip
                                                                label="Current file"
                                                                size="small"
                                                                color="info"
                                                                variant="outlined"
                                                                sx={{ height: 18, fontSize: '0.6rem', fontWeight: 600, borderRadius: 1 }}
                                                            />
                                                            <Typography variant="caption" color="primary.main" sx={{ textDecoration: 'underline' }}>
                                                                Click to view
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </Box>
                                                <Tooltip title="Remove this file (you'll need to upload a new one)">
                                                    <IconButton
                                                        size="small"
                                                        color="error"
                                                        onClick={handleRemoveExistingFile}
                                                        sx={{
                                                            flexShrink: 0,
                                                            border: `1px solid ${alpha(theme.palette.error.main, 0.15)}`,
                                                        }}
                                                    >
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        </CardContent>
                                    </FileCard>
                                )}

                                {/* If old file was removed, make that explicit */}
                                {!editFile && !editData.fileUrl && (
                                    <Alert severity="warning" sx={{ borderRadius: 2, mb: 2 }}>
                                        Existing file removed. Please upload a new document below.
                                    </Alert>
                                )}

                                {/* File upload area (for replacing / adding a file) */}
                                {!editFile ? (
                                    <UploadArea
                                        elevation={0}
                                        hasFile={false}
                                        isDragging={false}
                                        isUploading={editUploading}
                                        onClick={() => {
                                            if (!editUploading) {
                                                document.getElementById('edit-file-upload').click();
                                            }
                                        }}
                                        sx={{ py: 3 }}
                                    >
                                        <input
                                            id="edit-file-upload"
                                            type="file"
                                            accept=".pdf"
                                            onChange={handleEditFileChange}
                                            style={{ display: 'none' }}
                                            disabled={editUploading}
                                        />
                                        {editUploading ? (
                                            <Box>
                                                <CircularProgress size={36} sx={{ mb: 1 }} />
                                                <Typography variant="body2" fontWeight="600">
                                                    Uploading...
                                                </Typography>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={editUploadProgress}
                                                    sx={{ mt: 1, borderRadius: 2, height: 6 }}
                                                />
                                            </Box>
                                        ) : (
                                            <>
                                                <CloudUploadIcon sx={{ fontSize: 40, color: alpha(theme.palette.text.secondary, 0.4), mb: 1 }} />
                                                <Typography variant="body2" fontWeight="600">
                                                    <Box component="span" color="primary.main" sx={{ textDecoration: 'underline' }}>
                                                        Browse
                                                    </Box>
                                                    {editData.fileUrl ? ' or drag to replace' : ' or drag a PDF here'}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    PDF up to 10MB
                                                </Typography>
                                            </>
                                        )}
                                    </UploadArea>
                                ) : (
                                    <FileCard elevation={0}>
                                        <CardContent sx={{ p: 2 }}>
                                            <Box display="flex" alignItems="center" justifyContent="space-between">
                                                <Box display="flex" alignItems="center" gap={1.5} sx={{ minWidth: 0 }}>
                                                    <PdfIcon color="error" sx={{ fontSize: 32, flexShrink: 0 }} />
                                                    <Box sx={{ minWidth: 0 }}>
                                                        <Typography variant="body2" fontWeight="600" noWrap>
                                                            {editFile.name}
                                                        </Typography>
                                                        <Chip
                                                            label="New file"
                                                            size="small"
                                                            color="success"
                                                            variant="outlined"
                                                            sx={{ height: 18, fontSize: '0.6rem', fontWeight: 600, borderRadius: 1, mt: 0.25 }}
                                                        />
                                                    </Box>
                                                </Box>
                                                <Tooltip title="Cancel this new file">
                                                    <IconButton onClick={handleRemoveEditFile} size="small" color="error">
                                                        <ClearIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                            {editCloudinaryUrl && (
                                                <Box mt={1} display="flex" alignItems="center" gap={1}>
                                                    <CloudDoneIcon color="success" sx={{ fontSize: 18 }} />
                                                    <Typography variant="caption" color="success.main" fontWeight="600">
                                                        Uploaded ✓ - this will replace the previous file
                                                    </Typography>
                                                </Box>
                                            )}
                                        </CardContent>
                                    </FileCard>
                                )}

                                {editError && (
                                    <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>
                                        {editError}
                                    </Alert>
                                )}
                            </Box>
                        </Box>
                    </DialogContent>

                    <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
                        <Button
                            onClick={handleCloseEditDialog}
                            variant="outlined"
                            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleEditSubmit}
                            variant="contained"
                            disabled={editLoading || editUploading}
                            endIcon={editLoading ? <CircularProgress size={16} color="inherit" /> : null}
                            sx={{
                                borderRadius: 2,
                                textTransform: 'none',
                                fontWeight: 700,
                                px: 4
                            }}
                        >
                            {editLoading ? 'Updating...' : 'Update'}
                        </Button>
                    </DialogActions>
                </Box>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                PaperProps={{
                    sx: { borderRadius: 3 }
                }}
            >
                <DialogTitle sx={{ fontWeight: 700 }}>Delete Committee</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete "{committeeToDelete?.title}"?
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ p: 2.5, gap: 1 }}>
                    <Button
                        onClick={() => setDeleteDialogOpen(false)}
                        variant="outlined"
                        sx={{ borderRadius: 2, textTransform: 'none' }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={() => committeeToDelete && handleDelete(committeeToDelete.id)}
                        color="error"
                        variant="contained"
                        sx={{ borderRadius: 2, textTransform: 'none' }}
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar */}
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
        </Container>
    );
};

export default SimpleCommitteeForm;