import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Box,
  Chip,
  IconButton,
  Alert,
  Paper,
  Divider,
  Pagination,
  TextField,
  InputAdornment,
  Skeleton,
  Stack
} from '@mui/material';
import {
  Description as DescriptionIcon,
  Download as DownloadIcon,
  Search as SearchIcon,
  PictureAsPdf as PdfIcon,
  FolderOpen as FolderIcon,
  Clear as ClearIcon,
  InsertDriveFile as FileIcon
} from '@mui/icons-material';
import instance from '../AxiosInstance/AxiosInstance';

const CommitteesList = () => {
  const [committees, setCommittees] = useState([]);
  const [filteredCommittees, setFilteredCommittees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  // Fetch committees data
  useEffect(() => {
    const fetchCommittees = async () => {
      try {
        setLoading(true);
        const response = await instance.get('/committees');
        setCommittees(response.data);
        setFilteredCommittees(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch committees. Please try again later.');
        console.error('Error fetching committees:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCommittees();
  }, []);

  // Search functionality
  useEffect(() => {
    const filtered = committees.filter((committee) =>
      committee.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCommittees(filtered);
    setPage(1);
  }, [searchTerm, committees]);

  // Handle download
  const handleDownload = (fileUrl, title) => {
    const downloadUrl = fileUrl.startsWith('http')
      ? fileUrl
      : `${process.env.REACT_APP_API_URL || ''}${fileUrl}`;
    window.open(downloadUrl, '_blank');
  };

  // Get file extension
  const getFileExtension = (fileUrl) => {
    if (!fileUrl) return 'file';
    return fileUrl.split('.').pop().toLowerCase();
  };

  // Get file icon based on extension
  const getFileIcon = (fileUrl) => {
    const ext = getFileExtension(fileUrl);
    switch (ext) {
      case 'pdf':
        return <PdfIcon color="error" />;
      case 'doc':
      case 'docx':
        return <DescriptionIcon color="info" />;
      default:
        return <FileIcon color="action" />;
    }
  };

  // Get file type color for Chip
  const getFileTypeColor = (fileUrl) => {
    const ext = getFileExtension(fileUrl);
    switch (ext) {
      case 'pdf': return 'error';
      case 'doc':
      case 'docx': return 'info';
      default: return 'default';
    }
  };

  // Handle page change
  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Get current page items
  const getCurrentPageItems = () => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredCommittees.slice(startIndex, endIndex);
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchTerm('');
  };

  // Loading State with Skeletons (Better UX than a single spinner)
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
        <Skeleton variant="rounded" height={120} sx={{ mb: 4, borderRadius: 3 }} />
        <Skeleton variant="rounded" height={70} sx={{ mb: 4, borderRadius: 3 }} />
        <Grid container spacing={3}>
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item}>
              <Skeleton variant="rounded" height={280} sx={{ borderRadius: 3 }} />
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  // Error State
  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 5 }}>
        <Alert 
          severity="error" 
          variant="filled" 
          sx={{ mb: 3, borderRadius: 2 }}
          action={
            <Button color="inherit" size="small" onClick={() => window.location.reload()}>
              RETRY
            </Button>
          }
        >
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
      
      {/* Hero Banner Section */}
 <Paper
  elevation={0}
  sx={{
    p: { xs: 3, md: 5 },
    mb: 4,
    background: "linear-gradient(135deg, #1976d2 0%, #115293 100%)",
    color: "#fff",
    borderRadius: 3,
    boxShadow: "0 8px 32px rgba(25,118,210,0.15)",
    textAlign: "center",
  }}
>
  <Typography
    variant="h3"
    component="h1"
    sx={{ fontWeight: 700, mb: 2, fontSize: { xs: "2rem", md: "2rem" } }}
  >
    Committees &amp; Documents
  </Typography>

  <Typography
    variant="h6"
    sx={{
      opacity: 0.95,
      maxWidth: 900,
      mx: "auto",
      lineHeight: 1.6,
      fontWeight: 400,
    }}
  >
    Browse, search, and download official committee reports,
    guidelines, and related documentation.
  </Typography>
</Paper>
      {/* Search and Filter Bar */}
      <Paper 
        elevation={0}
        sx={{ 
          p: 2, 
          mb: 4, 
          borderRadius: 3, 
          border: '1px solid', 
          borderColor: 'divider',
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between', 
          alignItems: { xs: 'stretch', sm: 'center' }, 
          gap: 2 
        }}
      >
        <TextField
          placeholder="Search committees by title..."
          variant="outlined"
          size="medium"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ flexGrow: 1, maxWidth: { sm: 500 } }}
          InputProps={{
            sx: { borderRadius: 2, backgroundColor: 'background.paper' },
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={handleClearSearch}>
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
      </Paper>

      {/* Content Grid */}
      {filteredCommittees.length === 0 ? (
        <Alert severity="info" sx={{ borderRadius: 2, py: 2 }} icon={<FolderIcon />}>
          No committees found matching "{searchTerm}". Try a different search term.
        </Alert>
      ) : (
        <>
          <Grid container spacing={3}>
            {getCurrentPageItems().map((committee) => (
              <Grid item xs={12} sm={6} md={4} key={committee.id}>
                <Card 
                  elevation={0}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 3,
                    transition: 'all 0.25s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-6px)',
                      boxShadow: '0 12px 24px -10px rgba(0,0,0,0.15)',
                      borderColor: 'primary.main'
                    }
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                      <Chip 
                        icon={getFileIcon(committee.fileUrl)}
                        label={getFileExtension(committee.fileUrl).toUpperCase()}
                        size="small"
                        color={getFileTypeColor(committee.fileUrl)}
                        variant="outlined"
                        sx={{ fontWeight: 600, borderRadius: 1.5, px: 0.5 }}
                      />
                    </Box>
                    
                    <Typography 
                      variant="h6" 
                      component="h2" 
                      sx={{ 
                        fontSize: '1.15rem',
                        fontWeight: 700,
                        lineHeight: 1.4,
                        mb: 2,
                        // Line clamping for uniform card heights
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {committee.title}
                    </Typography>

                    <Divider sx={{ my: 1.5 }} />

                    <Stack direction="row" spacing={1} alignItems="center">
                      <FolderIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        sx={{ 
                          overflow: 'hidden', 
                          textOverflow: 'ellipsis', 
                          whiteSpace: 'nowrap' 
                        }}
                      >
                        {committee.fileUrl?.split('/').pop() || 'No file attached'}
                      </Typography>
                    </Stack>
                  </CardContent>

                  <Box sx={{ p: 3, pt: 0 }}>
                    <Button
                      variant="contained"
                      fullWidth
                      disableElevation
                      startIcon={<DownloadIcon />}
                      onClick={() => handleDownload(committee.fileUrl, committee.title)}
                      disabled={!committee.fileUrl}
                      sx={{
                        py: 1,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600,
                        transition: 'background-color 0.2s',
                        '&:hover': {
                          backgroundColor: 'primary.dark',
                        }
                      }}
                    >
                      View Document
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          {filteredCommittees.length > itemsPerPage && (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 6, mb: 2 }}>
              <Pagination
                count={Math.ceil(filteredCommittees.length / itemsPerPage)}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size="large"
                shape="rounded"
                showFirstButton
                showLastButton
                sx={{
                  '& .MuiPaginationItem-root': {
                    borderRadius: 2,
                  }
                }}
              />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Showing {((page - 1) * itemsPerPage) + 1} - {Math.min(page * itemsPerPage, filteredCommittees.length)} of {filteredCommittees.length} documents
              </Typography>
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default CommitteesList;