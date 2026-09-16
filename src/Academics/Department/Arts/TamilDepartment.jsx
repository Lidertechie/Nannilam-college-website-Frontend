import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Tabs,
  Tab,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  Divider,
  useTheme,
  useMediaQuery,
  alpha,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Link,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  School,
  User,
  BookOpen,
  Award,
  Users,
  GraduationCap,
  Star,
  Crown,
  X,
  FileText,
  Briefcase,
  School as SchoolIcon,
  Link as LinkIcon,
  Download,
  Eye,
} from "lucide-react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from "../../../Common/Footer";
import instance from "../../../AxiosInstance/AxiosInstance";

// ---------- Data ----------

const introParagraphs = [
  `இக்கல்லூரியில் தமிழ்த்துறை, கல்லூரி தொடங்கப்பட்ட ஆண்டிலிருந்தே மாணவர்களின் இலக்கிய அறிவையும் ஆராய்ச்சி மனப்பான்மையையும் ஊக்குவிக்கும் வகையில் முழுச் சிறப்புடன் செயல்பட்டு வருகின்றது. 2011-இல் இளங்கலைத் தமிழ்ப் பாடப்பிரிவோடு தொடங்கப்பட்ட இத்தமிழ்த்துறையில், 2015–2016 கல்வியாண்டு முதல் முதுகலைத் தமிழ்ப் பாடப்பிரிவும் தொடங்கப்பட்டுச் சிறப்பாகச் செயல்பட்டு வருகின்றது.`,
  `2020-ஆம் ஆண்டு அரசு கலை மற்றும் அறிவியல் கல்லூரியாக மாறிய இக்கல்லூரியின் தமிழ்த்துறையில் பதின்மர் உதவிப் பேராசிரியர்களாகப் பணிபுரிந்து வருகின்றனர். இளங்கலைத் தமிழ்ப் பாடப்பிரிவில் 150-க்கும் மேற்பட்ட மாணவர்களும், முதுகலைத் தமிழ்ப் பாடப்பிரிவில் 50-க்கும் மேற்பட்ட மாணவர்களும் தற்போது பயின்று வருகின்றனர்.`,
  `தமிழ்த்துறையில் பாரதிதாசன் இலக்கிய மன்றம் செயல்பட்டு வருகிறது. மாணவர்களுக்கு பேச்சு, கவிதை, கட்டுரை, ஓவியம், நாடகம் மற்றும் நடிப்பு போன்ற நுண்கலைகள் இம்மன்றத்தின் சார்பில் பயிற்றுவிக்கப்படுகின்றன. ஆண்டுக்கு இருமுறை இலக்கிய மன்ற விழா நடத்தப்படுகிறது. விழாவினை மாணவர்களே பொறுப்பேற்று நடத்த அனுமதி வழங்கப்பட்டுள்ளது. மாணவர்கள் பல்வேறு இடங்களில் நடத்தப்படும் நுண்கலைப் போட்டிகளில் வெற்றி பெற்று சான்றிதழ்கள் மற்றும் ரொக்கப் பரிசுகளைப் பெற்று வருகின்றனர். இறுதியாண்டு மாணவர்களுக்குப் போட்டித் தேர்வுகளில் வெற்றி பெறும் வகையில் தாய்மொழியான தமிழ் வழியில் சிறப்பு வகுப்புகள் தமிழ்த்துறைப் பேராசிரியர்களால் நடத்தப்பட்டு வருகின்றன.`,
  `"ஒழுக்கம், திறமை, உயர்வு ஆகியவற்றைக் கற்பித்து விழுமியம் மிக்க சமூக உறுப்பினர்களை உருவாக்குதல்" என்ற நோக்கத்தை அடிப்படையாகக் கொண்டு இத்துறை செயல்பட்டு வருகிறது.`,
];

const tabsRow1 = ["ACADEMIC", "FACULTY"];

// Academic Data
const academicHeaders = ["Programmes Offered"];
const academicRows = [["✓ B.A Tamil"], ["✓ M.A Tamil"]];

// Styled Components
const StyledSectionHeading = styled(Typography)(({ theme }) => ({
  borderLeft: `4px solid ${theme.palette.primary.main}`,
  paddingLeft: theme.spacing(2),
  fontFamily: "Arial, Helvetica, sans-serif",
  fontSize: "20px",
  fontWeight: 700,
  color: theme.palette.primary.main,
  margin: theme.spacing(4, 0, 3),
  letterSpacing: "0.02em",
  textAlign: "left",
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
}));

const StyledCard = styled(Card)(({ theme, isHod }) => ({
  border: isHod ? `2px solid ${theme.palette.warning.main}` : "1px solid #e8edf5",
  borderRadius: "16px",
  overflow: "hidden",
  background: isHod ? `linear-gradient(135deg, #FFF8E1, #FFFFFF)` : "#ffffff",
  maxWidth: "260px",
  margin: "0 auto",
  boxShadow: isHod 
    ? "0 4px 20px rgba(255, 193, 7, 0.25)" 
    : "0 4px 20px rgba(26, 62, 140, 0.08)",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  position: "relative",
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: isHod 
      ? "0 12px 40px rgba(255, 193, 7, 0.35)" 
      : "0 12px 40px rgba(26, 62, 140, 0.15)",
    borderColor: isHod ? theme.palette.warning.main : theme.palette.primary.main,
  },
}));

const ProfileImageWrapper = styled(Box)(({ theme }) => ({
  width: "100%",
  height: "120px",
  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
  overflow: "hidden",
}));

const StyledAvatar = styled(Avatar)(({ theme, isHod }) => ({
  width: 90,
  height: 90,
  border: isHod ? `3px solid ${theme.palette.warning.main}` : `3px solid ${theme.palette.primary.main}`,
  boxShadow: isHod 
    ? "0 4px 20px rgba(255, 193, 7, 0.4)" 
    : "0 4px 12px rgba(26, 62, 140, 0.2)",
  backgroundColor: isHod ? alpha(theme.palette.warning.main, 0.1) : alpha(theme.palette.primary.main, 0.1),
  color: isHod ? theme.palette.warning.main : theme.palette.primary.main,
}));

const StyledProfileButton = styled(Button)(({ theme, isHod }) => ({
  border: isHod ? `2px solid ${theme.palette.warning.main}` : `2px solid ${theme.palette.primary.main}`,
  color: isHod ? theme.palette.warning.main : theme.palette.primary.main,
  background: "transparent",
  fontSize: "10px",
  fontWeight: 700,
  letterSpacing: "0.05em",
  padding: "3px 12px",
  borderRadius: "20px",
  minHeight: "28px",
  transition: "all 0.3s ease",
  "&:hover": {
    background: isHod ? theme.palette.warning.main : theme.palette.primary.main,
    color: "#ffffff",
    transform: "scale(1.05)",
    boxShadow: isHod 
      ? `0 4px 12px rgba(255, 193, 7, 0.4)` 
      : `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
  },
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  fontFamily: "Arial, Helvetica, sans-serif",
  fontSize: "14px",
  fontWeight: 600,
  letterSpacing: "0.02em",
  padding: "12px 24px",
  minWidth: "auto",
  color: "#64748b",
  textTransform: "uppercase",
  "&.Mui-selected": {
    color: theme.palette.primary.main,
  },
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: "12px",
  border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
  overflow: "hidden",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
}));

const HodBadge = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: 8,
  right: 8,
  background: theme.palette.warning.main,
  color: "#fff",
  padding: "2px 10px",
  borderRadius: "20px",
  fontSize: "9px",
  fontWeight: 700,
  display: "flex",
  alignItems: "center",
  gap: "3px",
  boxShadow: "0 2px 8px rgba(255, 193, 7, 0.3)",
  zIndex: 1,
}));

// Components
function SectionHeading({ children, icon }) {
  return (
    <StyledSectionHeading variant="h6">
      {icon && <span style={{ display: "flex" }}>{icon}</span>}
      {children}
    </StyledSectionHeading>
  );
}

function DataTable({ headers, rows }) {
  return (
    <StyledTableContainer>
      <Table sx={{ minWidth: 300 }}>
        <TableHead>
          <TableRow sx={{ background: (theme) => alpha(theme.palette.primary.main, 0.06) }}>
            {headers.map((h, i) => (
              <TableCell
                key={i}
                sx={{
                  fontWeight: 700,
                  padding: "14px 16px",
                  borderBottom: `2px solid ${(theme) => theme.palette.primary.main}`,
                  color: "text.primary",
                  fontSize: "14px",
                }}
              >
                {h}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, i) => (
            <TableRow
              key={i}
              sx={{
                "&:hover": {
                  background: (theme) => alpha(theme.palette.primary.main, 0.02),
                },
              }}
            >
              {row.map((cell, j) => (
                <TableCell
                  key={j}
                  sx={{
                    padding: "14px 16px",
                    borderBottom: "1px solid #e8edf5",
                    color: "text.primary",
                    verticalAlign: "top",
                    fontSize: "14px",
                  }}
                >
                  {cell}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </StyledTableContainer>
  );
}

function FacultyCard({ 
  name, 
  role, 
  qualification, 
  imageUrl, 
  isHod, 
  active,
  documentUrl,
  onViewProfile 
}) {
  const [isHovered, setIsHovered] = useState(false);

  // Check if it's HoD
  const isHodRole = role && (role.includes("HoD") || role.includes("Head"));

  return (
    <StyledCard
      isHod={isHodRole}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHodRole && (
        <HodBadge>
          <Crown size={10} />
        </HodBadge>
      )}
      
      <ProfileImageWrapper>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center top",
            }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.style.display = "none";
              e.target.parentElement.querySelector('.avatar-fallback').style.display = 'flex';
            }}
          />
        ) : null}
        <StyledAvatar
          isHod={isHodRole}
          className="avatar-fallback"
          sx={{
            display: imageUrl ? 'none' : 'flex',
            transform: isHovered ? "scale(1.05)" : "scale(1)",
            transition: "transform 0.3s ease",
          }}
        >
          <User size={36} />
        </StyledAvatar>

        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(180deg, transparent 60%, ${alpha(
              "#000",
              0.1
            )} 100%)`,
          }}
        />
      </ProfileImageWrapper>

      <CardContent
        sx={{
          p: 1.5,
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          gap: 0.25,
        }}
      >
        <Typography
          sx={{
            minHeight: 32,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            fontWeight: 700,
            fontSize: 14,
            color: isHodRole ? "warning.main" : "primary.main",
            mb: 0.25,
            lineHeight: 1.2,
          }}
        >
          {name}
        </Typography>

        <Chip
          label={role}
          size="small"
          sx={{
            alignSelf: "center",
            minHeight: 20,
            maxWidth: "100%",
            mb: 0.5,
            backgroundColor: isHodRole 
              ? (theme) => alpha(theme.palette.warning.main, 0.15)
              : (theme) => alpha(theme.palette.primary.main, 0.08),
            color: isHodRole ? "warning.main" : "primary.main",
            fontWeight: 600,
            fontSize: 9,
            borderRadius: 3,
            border: isHodRole ? "1px solid #FFD54F" : "none",
            '& .MuiChip-label': {
              px: 0.75,
              py: 0.25,
              fontSize: 9,
            }
          }}
        />

        <Box
          sx={{
            minHeight: 24,
            display: "flex",
            justifyContent: "center",
            gap: 1,
            fontSize: 10,
            color: "text.secondary",
            flexWrap: "wrap",
            mb: 0.75,
          }}
        >
          {qualification && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <GraduationCap size={11} />
              <span style={{ fontSize: 10 }}>{qualification}</span>
            </Box>
          )}
        </Box>

        <StyledProfileButton
          isHod={isHodRole}
          sx={{ mt: "auto" }}
          size="small"
          fullWidth
          onClick={onViewProfile}
        >
          View Profile
        </StyledProfileButton>
      </CardContent>
    </StyledCard>
  );
}

// Profile Dialog Component
function ProfileDialog({ open, onClose, faculty }) {
  const [isViewingDocument, setIsViewingDocument] = useState(false);

  if (!faculty) return null;

  const getFileExtension = (url) => {
    if (!url) return null;
    const parts = url.split('.');
    return parts[parts.length - 1].toLowerCase();
  };

  const getFileTypeLabel = (url) => {
    const ext = getFileExtension(url);
    const types = {
      'pdf': 'PDF Document',
      'doc': 'Word Document',
      'docx': 'Word Document',
      'jpg': 'Image',
      'jpeg': 'Image',
      'png': 'Image',
      'gif': 'Image',
    };
    return types[ext] || 'Document';
  };

  const isViewableInBrowser = (url) => {
    const ext = getFileExtension(url);
    const viewableTypes = ['pdf', 'jpg', 'jpeg', 'png', 'gif'];
    return viewableTypes.includes(ext);
  };

  const handleViewDocument = () => {
    if (faculty.documentUrl) {
      const ext = getFileExtension(faculty.documentUrl);
      
      // If it's a PDF or image, open in new tab with proper viewer
      if (isViewableInBrowser(faculty.documentUrl)) {
        window.open(faculty.documentUrl, '_blank');
      } else {
        // For DOC, DOCX, and other files, try to use Google Docs Viewer
        const googleDocsUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(faculty.documentUrl)}&embedded=true`;
        window.open(googleDocsUrl, '_blank');
        toast.info("Opening document in Google Docs Viewer");
      }
    }
  };

  const handleDownloadDocument = () => {
    if (faculty.documentUrl) {
      const link = document.createElement('a');
      link.href = faculty.documentUrl;
      link.download = `${faculty.name}_document.${getFileExtension(faculty.documentUrl) || 'pdf'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleEmbeddedView = () => {
    if (faculty.documentUrl) {
      setIsViewingDocument(true);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: "hidden",
          maxHeight: "90vh",
        },
      }}
    >
      <DialogTitle sx={{ 
        fontWeight: 700, 
        bgcolor: "#FAFBFC", 
        borderBottom: "1px solid #E8ECF1",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        py: 2,
      }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <User size={24} color="#1565C0" />
          <Typography variant="h6" fontWeight={700}>
            Staff Profile
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <X size={20} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0, overflow: "hidden" }}>
        {isViewingDocument && faculty.documentUrl ? (
          // Document Viewer
          <Box sx={{ height: "70vh", width: "100%" }}>
            <Box sx={{ 
              p: 2, 
              bgcolor: "#FAFBFC", 
              borderBottom: "1px solid #E8ECF1",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <Typography variant="subtitle2" fontWeight={600}>
                Document Viewer
              </Typography>
              <Button 
                size="small" 
                onClick={() => setIsViewingDocument(false)}
                variant="outlined"
                sx={{ borderRadius: 2 }}
              >
                Back to Profile
              </Button>
            </Box>
            <iframe
              src={faculty.documentUrl}
              style={{
                width: "100%",
                height: "calc(100% - 56px)",
                border: "none",
              }}
              title="Document Viewer"
            />
          </Box>
        ) : (
          // Profile Content
          <Box sx={{ p: 3 }}>
            {/* Profile Header */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 3 }}>
              <Avatar
                src={faculty.imageUrl || undefined}
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: "#E3F2FD",
                  color: "#1565C0",
                  border: "3px solid #E8ECF1",
                }}
              >
                {!faculty.imageUrl && <User size={36} />}
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight={700} sx={{ color: "#1A1A1A" }}>
                  {faculty.name}
                </Typography>
                <Chip
                  label={faculty.role}
                  size="small"
                  sx={{
                    bgcolor: alpha("#1565C0", 0.08),
                    color: "#1565C0",
                    fontWeight: 600,
                    mt: 0.5,
                  }}
                />
              </Box>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Staff Details */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box>
                <Typography variant="caption" sx={{ color: "#9CA3AF", fontWeight: 600, display: "block", mb: 0.5 }}>
                  QUALIFICATION
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <SchoolIcon size={18} color="#6B7280" />
                  <Typography variant="body2" sx={{ color: "#1A1A1A", fontWeight: 500 }}>
                    {faculty.qualification || "N/A"}
                  </Typography>
                </Box>
              </Box>

              <Box>
                <Typography variant="caption" sx={{ color: "#9CA3AF", fontWeight: 600, display: "block", mb: 0.5 }}>
                  DESIGNATION
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Briefcase size={18} color="#6B7280" />
                  <Typography variant="body2" sx={{ color: "#1A1A1A", fontWeight: 500 }}>
                    {faculty.role || "N/A"}
                  </Typography>
                </Box>
              </Box>

              <Box>
                <Typography variant="caption" sx={{ color: "#9CA3AF", fontWeight: 600, display: "block", mb: 0.5 }}>
                  STAFF TYPE
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Users size={18} color="#6B7280" />
                  <Typography variant="body2" sx={{ color: "#1A1A1A", fontWeight: 500 }}>
                    {faculty.staffType || "Teaching Staff"}
                  </Typography>
                </Box>
              </Box>

              <Box>
                <Typography variant="caption" sx={{ color: "#9CA3AF", fontWeight: 600, display: "block", mb: 0.5 }}>
                  STATUS
                </Typography>
                <Chip
                  label={faculty.active !== false ? "Active" : "Inactive"}
                  size="small"
                  sx={{
                    bgcolor: faculty.active !== false ? "#E8F5E9" : "#FFEBEE",
                    color: faculty.active !== false ? "#2E7D32" : "#C62828",
                    fontWeight: 600,
                  }}
                />
              </Box>

              {/* Document Section */}
              <Box sx={{ mt: 2 }}>
                <Typography variant="caption" sx={{ color: "#9CA3AF", fontWeight: 600, display: "block", mb: 1.5 }}>
                  DOCUMENT
                </Typography>
                {faculty.documentUrl ? (
                  <Box
                    sx={{
                      p: 2,
                      border: "1px solid #E8ECF1",
                      borderRadius: 2,
                      bgcolor: "#FAFBFC",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          bgcolor: "#E3F2FD",
                          borderRadius: 2,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <FileText size={24} color="#1565C0" />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" fontWeight={600} sx={{ color: "#1A1A1A" }}>
                          {getFileTypeLabel(faculty.documentUrl)}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "#9CA3AF" }}>
                          {isViewableInBrowser(faculty.documentUrl) 
                            ? "View in browser or download" 
                            : "Download to view"}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                        {isViewableInBrowser(faculty.documentUrl) && (
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={handleViewDocument}
                            startIcon={<Eye size={16} />}
                            sx={{
                              borderRadius: 2,
                              textTransform: "none",
                              fontWeight: 600,
                              borderColor: "#1565C0",
                              color: "#1565C0",
                              "&:hover": {
                                borderColor: "#0D47A1",
                                bgcolor: alpha("#1565C0", 0.04),
                              },
                            }}
                          >
                            View
                          </Button>
                        )}
                        <Button
                          variant="contained"
                          size="small"
                          onClick={handleDownloadDocument}
                          startIcon={<Download size={16} />}
                          sx={{
                            borderRadius: 2,
                            textTransform: "none",
                            fontWeight: 600,
                            bgcolor: "#1565C0",
                            "&:hover": {
                              bgcolor: "#0D47A1",
                            },
                          }}
                        >
                          Download
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                ) : (
                  <Box
                    sx={{
                      p: 2,
                      border: "1px dashed #E8ECF1",
                      borderRadius: 2,
                      bgcolor: "#F9FAFB",
                      textAlign: "center",
                    }}
                  >
                    <Typography variant="body2" sx={{ color: "#9CA3AF" }}>
                      No document uploaded
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button
          onClick={onClose}
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
          Close
        </Button>
        {faculty.documentUrl && !isViewingDocument && (
          <Button
            onClick={handleViewDocument}
            variant="contained"
            startIcon={<Eye size={18} />}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              bgcolor: "#1565C0",
              "&:hover": {
                bgcolor: "#0D47A1",
              },
            }}
          >
            View Document
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

export default function TamilDepartment() {
  const [activeTab, setActiveTab] = useState(0);
  const [facultyData, setFacultyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  // Fetch faculty data from API
  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        setLoading(true);
        const response = await instance.get("/subject-allocations");
        console.log("All Staff Data:", response.data);
        
        // Filter for Tamil subject only
        const tamilData = response.data.filter(
          item => item.subjectName && item.subjectName.trim().toLowerCase() === "tamil"
        );
        
        console.log("Tamil Staff Data:", tamilData);
        
        // Map to faculty format
        const facultyList = tamilData.map(item => ({
          name: item.staffName || "Unknown",
          role: item.staffDesignation || "Guest Lecturer",
          qualification: item.staffQualification || "—",
          imageUrl: item.staffImageUrl || null,
          active: item.active !== false,
          staffId: item.staffId,
          subjectId: item.subjectId,
          documentUrl: item.documentUrl || null,
          staffType: item.staffType || "Teaching Staff",
        }));
        
        setFacultyData(facultyList);
        setError(null);
        
        if (facultyList.length === 0) {
          toast.info("No Tamil faculty members found");
        }
      } catch (err) {
        console.error("Error fetching faculty:", err);
        const errorMsg = err.response?.data?.message || "Failed to fetch faculty data";
        setError(errorMsg);
        toast.error("❌ " + errorMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchFaculty();
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleViewProfile = (faculty) => {
    setSelectedFaculty(faculty);
    setProfileDialogOpen(true);
  };

  const handleCloseProfileDialog = () => {
    setProfileDialogOpen(false);
    setSelectedFaculty(null);
  };

  return (
    <>
      <Box
        sx={{
          maxWidth: "1500px",
          margin: "0 auto",
          padding: { xs: "24px 16px", sm: "40px 24px", md: "48px 32px" },
          backgroundColor: "#fafbfd",
        }}
      >
        <style>{`
          * { box-sizing: border-box; }
        `}</style>

        {/* Header Section */}
        <Box
          sx={{
            textAlign: "center",
            mb: 4,
            position: "relative",
          }}
        >
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontSize: { xs: "28px", sm: "36px", md: "44px" },
              fontWeight: 800,
              color: "#1f2937",
              position: "relative",
              display: "inline-block",
              "&::after": {
                content: '""',
                position: "absolute",
                bottom: -8,
                left: "50%",
                transform: "translateX(-50%)",
                width: "80px",
                height: "4px",
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${alpha(theme.palette.primary.main, 0.3)})`,
                borderRadius: "2px",
              },
            }}
          >
            தமிழ்
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              mt: 3,
              color: "text.secondary",
              fontSize: "15px",
              maxWidth: "600px",
              margin: "24px auto 0",
            }}
          >
            Department of Tamil • Government Arts & Science College
          </Typography>
        </Box>

        <Box sx={{ maxWidth: 1180, margin: "0 auto" }}>
          {/* Introduction Paragraphs */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, sm: 3, md: 4 },
              mb: 4,
              borderRadius: "16px",
              backgroundColor: "#ffffff",
              border: "1px solid #e8edf5",
            }}
          >
            {introParagraphs.map((p, i) => (
              <Typography
                key={i}
                sx={{
                  fontSize: { xs: "15px", sm: "16px" },
                  textAlign: "justify",
                  marginBottom: i < introParagraphs.length - 1 ? "16px" : 0,
                  fontFamily: "Arial, Helvetica, sans-serif",
                  color: "text.primary",
                  lineHeight: 1.8,
                  letterSpacing: "0.01em",
                }}
              >
                {p}
              </Typography>
            ))}
          </Paper>
          
          {/* Tabs */}
          <Paper
            elevation={0}
            sx={{
              borderRadius: "12px",
              backgroundColor: "#ffffff",
              border: "1px solid #e8edf5",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                borderBottom: "1px solid #e8edf5",
                padding: "4px 0",
              }}
            >
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                aria-label="department tabs"
                sx={{
                  "& .MuiTabs-indicator": {
                    backgroundColor: "primary.main",
                    height: "3px",
                    borderRadius: "2px",
                  },
                }}
                variant={isMobile ? "fullWidth" : "standard"}
              >
                {tabsRow1.map((tab) => (
                  <StyledTab key={tab} label={tab} />
                ))}
              </Tabs>
            </Box>

            {/* Tab Content */}
            <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
              {activeTab === 0 && (
                <>
                  <SectionHeading icon={<School size={20} />}>
                    Academics
                  </SectionHeading>
                  <DataTable headers={academicHeaders} rows={academicRows} />
                </>
              )}

              {activeTab === 1 && (
                <>
                  <SectionHeading icon={<Users size={20} />}>
                    Faculty Members
                  </SectionHeading>
                  
                  {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                      <CircularProgress />
                    </Box>
                  ) : error ? (
                    <Box sx={{ textAlign: "center", py: 8 }}>
                      <Typography color="error" variant="h6">
                        Failed to load faculty data
                      </Typography>
                      <Typography variant="body2" sx={{ color: "text.secondary", mt: 1 }}>
                        {error}
                      </Typography>
                    </Box>
                  ) : facultyData.length === 0 ? (
                    <Box sx={{ textAlign: "center", py: 8 }}>
                      <Typography variant="h6" sx={{ color: "text.secondary" }}>
                        No Tamil faculty members found
                      </Typography>
                    </Box>
                  ) : (
                    <Grid
                      container
                      spacing={2}
                      sx={{
                        justifyContent: "center",
                      }}
                    >
                      {facultyData.map((faculty, index) => (
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={4}
                          lg={3}
                          key={index}
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <FacultyCard
                            name={faculty.name}
                            role={faculty.role}
                            qualification={faculty.qualification}
                            imageUrl={faculty.imageUrl}
                            isHod={faculty.role && faculty.role.includes("HoD")}
                            active={faculty.active}
                            documentUrl={faculty.documentUrl}
                            onViewProfile={() => handleViewProfile(faculty)}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </>
              )}
            </Box>
          </Paper>
        </Box>
      </Box>

      {/* Profile Dialog */}
      <ProfileDialog
        open={profileDialogOpen}
        onClose={handleCloseProfileDialog}
        faculty={selectedFaculty}
      />
      
      <Footer />
      
      {/* Toast Container */}
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
    </>
  );
}