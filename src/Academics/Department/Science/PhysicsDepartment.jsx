import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Link,
  Card,
  Button,
  Grid,
  Avatar,
  Chip,
  CardContent,
  CircularProgress,
  useTheme,
  useMediaQuery,
  alpha,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Divider,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import DownloadIcon from "@mui/icons-material/Download";
import { 
  User, 
  GraduationCap, 
  Crown,
  X,
  FileText,
  Briefcase,
  School as SchoolIcon,
  Eye,
  Download, 
  Users
} from "lucide-react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from "../../../Common/Footer";
import instance from "../../../AxiosInstance/AxiosInstance";

// ---------- Data ----------

const introParagraphs = [
  `Our Physics Department, operating in the rich educational environment of Tamil Nadu, excels in teaching students by integrating theoretical concepts, experimental methods, and practical applications. The Department offers specialized training in various branches including Classical Mechanics, Quantum Mechanics, Electromagnetism, Thermodynamics, Statistical Physics, Optics, Solid State Physics, Nuclear Physics, Particle Physics, Astrophysics, Cosmology, Condensed Matter Physics, Materials Science, Nanotechnology, Biophysics, and Computational Physics.`,
  
  `Our department is staffed by experienced faculty members and research scholars. Our focus is on enhancing students' scientific understanding and research capabilities. Furthermore, the department engages in expanding students' knowledge through national and international conferences, workshops, and special lectures on various physics themes.`,
  
  `The department houses a research center that has been actively functioning. So far, 30 research scholars have earned their doctoral degrees. Our faculty members have published research articles in various national and international journals. The curriculum is designed to help students understand the connection between physics theories and real-world applications.`,
];

const tabsRow1 = [
  "ACADEMIC",
  "FACULTY",
  "RESEARCH",
  "SEMINARS & WORKSHOPS",
  "PUBLICATION",
  "LEARNING RESOURCES",
  "PLACEMENT",
];
const tabsRow2 = ["HIGHLIGHTS", "RANK HOLDERS"];

const courses = ["B.Sc Physics", "M.Sc Physics", "Ph.D Physics [Full Time]", "Ph.D Physics [Part Time]"];

const academicParas = [
  `The B.Sc and M.Sc Physics programs are structured following the guidelines of the University Grants Commission and the Tamil Nadu State Council for Higher Education. The curriculum incorporates both theoretical foundations and practical applications to prepare students for diverse career paths.`,
  
  `The syllabus covers Classical Mechanics, Quantum Mechanics, Electromagnetism, Thermodynamics, Statistical Physics, Optics, Solid State Physics, Nuclear Physics, Particle Physics, Astrophysics, Cosmology, Condensed Matter Physics, Materials Science, Nanotechnology, Biophysics, and Computational Physics. Students also receive training in experimental physics, laboratory techniques, and computational methods to enhance their analytical skills.`,
  
  `Students are introduced to various physics theories, experimental techniques, and contemporary scientific issues. The comprehensive curricular framework plays a vital role in shaping the minds and the personality of the students to shine in their chosen fields of life. Since the majority of our students aspire to take up careers in teaching, research, and scientific industries, papers in Advanced Physics, Quantum Mechanics, and Experimental Physics are introduced at both the UG and the PG levels in a graded manner.`,
];

// Default faculty list (fallback if no API data)
const defaultFacultyList = [
  { name: "Dr. C. V. Raman", role: "HOD/Professor" },
  { name: "Dr. S. Chandrasekhar", role: "Associate Professor" },
  { name: "Dr. H. J. Bhabha", role: "Associate Professor" },
  { name: "Dr. M. G. K. Menon", role: "Assistant Professor" },
  { name: "Dr. A. P. J. Abdul Kalam", role: "Assistant Professor" },
];

const facultyTableData = [
  {
    sn: 1,
    guide: "Dr. C. V. Raman (Principal Investigator)",
    fund: "DST - Rs. 7,00,000",
    title: "Quantum Materials and Their Applications",
    year: "2020-21",
  },
  {
    sn: 2,
    guide: "Dr. S. Chandrasekhar (Co-Investigator)",
    fund: "UGC - Rs. 5,00,000",
    title: "Astrophysical Phenomena and Gravitational Waves",
    year: "2019-20",
  },
];

const rows = [
  {
    year: "2020-21",
    level: "National Level",
    fund: "DST, New Delhi 15.01.2021 - 17.01.2021",
    coordinator: "Dr. C. V. Raman",
    title: "Advances in Condensed Matter Physics",
  },
  {
    year: "2019-20",
    level: "International Level",
    fund: "UGC, New Delhi 10.12.2019 - 12.12.2019",
    coordinator: "Dr. S. Chandrasekhar",
    title: "Cosmology and Dark Matter",
  },
  {
    year: "2018-19",
    level: "National Level",
    fund: "DST, New Delhi 18.02.2019 - 20.02.2019",
    coordinator: "Dr. H. J. Bhabha",
    title: "Nuclear Physics and Energy",
  },
  {
    year: "2017-18",
    level: "State Level",
    fund: "Tamil Nadu Government 05.10.2017",
    coordinator: "Dr. M. G. K. Menon",
    title: "Particle Physics and Accelerators",
  },
  {
    year: "2021-22",
    level: "International Level",
    fund: "ISRO 22.03.2022 - 24.03.2022",
    coordinator: "Dr. A. P. J. Abdul Kalam",
    title: "Space Physics and Satellite Technology",
  },
];

const studentGuideRows = [
  {
    student: "R. Sivakumar",
    guide: "Dr. C. V. Raman",
    fund: "TANSCHE - Rs. 20,000",
    title: "Superconductivity in Advanced Materials",
    year: "2020-21",
  },
  {
    student: "S. Meenakshi",
    guide: "Dr. S. Chandrasekhar",
    fund: "DST - Rs. 25,000",
    title: "Stellar Evolution and Black Holes",
    year: "2021-22",
  },
  {
    student: "K. Balaji",
    guide: "Dr. H. J. Bhabha",
    fund: "UGC - Rs. 15,000",
    title: "Quantum Computing and Information",
    year: "2019-20",
  },
];

// ---------- Shared style tokens ----------

const COLORS = {
  primary: "#1a3e8c",
  text: "#1f2937",
  tableBorder: "#d4cfe0",
  tableHeadBg: "#f0ecf9",
  roleText: "#5b5240",
  placeholder: "#8A7E63",
};

// ---------- Styled Components for Faculty Cards ----------

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

// ---------- Small building blocks ----------

function SectionHeading({ children }) {
  return (
    <Typography
      component="div"
      sx={{
        borderLeft: `4px solid ${COLORS.primary}`,
        pl: 1.5,
        fontFamily: "Arial, Helvetica, sans-serif",
        fontSize: "18px",
        fontWeight: 700,
        color: COLORS.primary,
        margin: "28px 0 16px",
        letterSpacing: "0.02em",
        textAlign: "left",
      }}
    >
      {children}
    </Typography>
  );
}

function DataTable({ headers, rows }) {
  return (
    <Box sx={{ overflowX: "auto", mb: 3 }}>
      <Table sx={{ width: "100%", borderCollapse: "collapse", fontSize: "13.5px" }}>
        <TableHead>
          <TableRow>
            {headers.map((h, i) => (
              <TableCell
                key={i}
                sx={{
                  background: COLORS.tableHeadBg,
                  color: COLORS.text,
                  fontWeight: 700,
                  textAlign: "left",
                  padding: "10px 12px",
                  border: `1px solid ${COLORS.tableBorder}`,
                  fontSize: "13.5px",
                }}
              >
                {h}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, i) => (
            <TableRow key={i}>
              {row.map((cell, j) => (
                <TableCell
                  key={j}
                  sx={{
                    padding: "10px 12px",
                    border: `1px solid ${COLORS.tableBorder}`,
                    color: COLORS.text,
                    verticalAlign: "top",
                    fontSize: "13.5px",
                    whiteSpace: "pre-line",
                  }}
                >
                  {cell}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}

function DownloadLink({ label }) {
  return (
    <Link
      href="#"
      underline="none"
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.75,
        color: COLORS.primary,
        fontSize: "14.5px",
        fontWeight: 500,
      }}
    >
      {label} <DownloadIcon sx={{ fontSize: 14 }} />
    </Link>
  );
}

// ---------- Profile Dialog Component ----------
function ProfileDialog({ open, onClose, faculty }) {
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
      if (isViewableInBrowser(faculty.documentUrl)) {
        window.open(faculty.documentUrl, '_blank');
      } else {
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

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: "hidden",
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
          <User size={24} color="#1a3e8c" />
          <Typography variant="h6" fontWeight={700}>
            Staff Profile
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <X size={20} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {/* Profile Header */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 3 }}>
          <Avatar
            src={faculty.imageUrl || undefined}
            sx={{
              width: 80,
              height: 80,
              bgcolor: "#E3F2FD",
              color: "#1a3e8c",
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
                bgcolor: alpha("#1a3e8c", 0.08),
                color: "#1a3e8c",
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
                    <FileText size={24} color="#1a3e8c" />
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
                          borderColor: "#1a3e8c",
                          color: "#1a3e8c",
                          "&:hover": {
                            borderColor: "#0D47A1",
                            bgcolor: alpha("#1a3e8c", 0.04),
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
                        bgcolor: "#1a3e8c",
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
        {faculty.documentUrl && (
          <Button
            onClick={handleViewDocument}
            variant="contained"
            startIcon={<Eye size={18} />}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              bgcolor: "#1a3e8c",
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

// ---------- Faculty Card Component ----------
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
  const isHodRole = role && (role.includes("HoD") || role.includes("HOD") || role.includes("Head"));

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

// ---------- Tab content ----------

function AcademicTab() {
  return (
    <>
      <SectionHeading>Courses Offered</SectionHeading>
      <Box component="ul" sx={{ margin: "0 0 22px", pl: 2.5 }}>
        {courses.map((c) => (
          <Typography
            component="li"
            key={c}
            sx={{
              fontFamily: "Arial, Helvetica, sans-serif",
              fontSize: "15px",
              color: COLORS.text,
              mb: 1,
              textAlign: "left",
            }}
          >
            {c}
          </Typography>
        ))}
      </Box>
      {academicParas.map((p, i) => (
        <Typography key={i} sx={{ fontSize: "17px", textAlign: "justify", mb: 2 }}>
          {p}
        </Typography>
      ))}
    </>
  );
}

function FacultyTab({ facultyList, loading, onViewProfile }) {
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (facultyList.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography variant="body1" sx={{ color: COLORS.placeholder }}>
          No Physics faculty members found in the system.
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <SectionHeading>Faculty</SectionHeading>
      <Grid container spacing={2} sx={{ justifyContent: "center" }}>
        {facultyList.map((faculty, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <FacultyCard
              name={faculty.name}
              role={faculty.role}
              qualification={faculty.qualification || "Ph.D., M.Sc."}
              imageUrl={faculty.imageUrl}
              isHod={faculty.role && (faculty.role.includes("HoD") || faculty.role.includes("HOD"))}
              active={faculty.active}
              documentUrl={faculty.documentUrl}
              onViewProfile={() => onViewProfile(faculty)}
            />
          </Grid>
        ))}
      </Grid>
    </>
  );
}

function ResearchTab() {
  return (
    <>
      <SectionHeading>Research Center</SectionHeading>
      <Typography sx={{ fontSize: "17px", textAlign: "justify", mb: 2 }}>
        The Physics Department serves as a recognized research center affiliated with the university. The center facilitates doctoral research in various areas of physics including condensed matter physics, quantum mechanics, astrophysics, cosmology, nuclear physics, particle physics, materials science, nanotechnology, biophysics, and computational physics.
      </Typography>

      <SectionHeading>Faculty Research Projects</SectionHeading>
      <DataTable
        headers={["S.No", "Principal Investigator", "Funding Agency", "Project Title", "Year"]}
        rows={facultyTableData.map((r) => [r.sn, r.guide, r.fund, r.title, r.year])}
      />

      <SectionHeading>Student Research Projects</SectionHeading>
      <DataTable
        headers={["S.No", "Student Name / Guide", "Funding Agency", "Project Title", "Year"]}
        rows={studentGuideRows.map((r, i) => [i + 1, `${r.student}\n${r.guide}`, r.fund, r.title, r.year])}
      />

      <SectionHeading>Doctoral Awardees</SectionHeading>
      <DownloadLink label="List of Ph.D Awardees" />
    </>
  );
}

function SeminarsTab() {
  return (
    <>
      <Typography sx={{ fontSize: "17px", textAlign: "justify", mb: 2 }}>
        Our department regularly organizes national and international seminars, workshops, and conferences to keep students and faculty updated on the latest developments in physics research. These events provide a platform for researchers and practitioners to share their insights and experiences.
      </Typography>
      <DataTable
        headers={["Year", "Level", "Funding Agency", "Coordinator", "Theme"]}
        rows={rows.map((r) => [r.year, r.level, r.fund, r.coordinator, r.title])}
      />
    </>
  );
}

function PublicationTab() {
  return (
    <>
      <Typography sx={{ fontSize: "17px", textAlign: "justify", mb: 2 }}>
        Our faculty members and research scholars have published extensively in leading national and international journals. Their research covers diverse areas including condensed matter physics, quantum mechanics, astrophysics, cosmology, nuclear physics, particle physics, materials science, nanotechnology, and computational physics.
      </Typography>
      <DataTable
        headers={["Year", "Funding Agency", "Author", "Title"]}
        rows={rows.map((r) => [r.year, r.fund, r.coordinator, r.title])}
      />
      <Box sx={{ mt: 2 }}>
        <DownloadLink label="Full Publication List" />
      </Box>
    </>
  );
}

function PlacementTab() {
  return (
    <>
      <SectionHeading>Placement Opportunities</SectionHeading>
      <Typography sx={{ fontSize: "17px", textAlign: "justify", mb: 2 }}>
        Our students have been successfully placed in various leading organizations including academic institutions, research laboratories, ISRO, DRDO, BARC, space research organizations, nuclear research centers, technology companies, and government agencies. The department also provides career guidance and placement support through dedicated placement cell.
      </Typography>
      <SectionHeading>Internship Programs</SectionHeading>
      <DownloadLink label="Internship Details" />
      <Box sx={{ mt: 1.5 }}>
        <DownloadLink label="Placement Brochure" />
      </Box>
    </>
  );
}

function PlaceholderTab({ label }) {
  return (
    <Typography
      sx={{
        fontFamily: "Arial, Helvetica, sans-serif",
        fontSize: "15px",
        color: COLORS.placeholder,
        padding: "20px 0",
        textAlign: "center",
      }}
    >
      {label} content coming soon.
    </Typography>
  );
}

// ---------- Main component ----------
export default function PhysicsDepartment() {
  const [activeTab, setActiveTab] = useState("ACADEMIC");
  const [facultyList, setFacultyList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);

  // Fetch faculty data from API
  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        setLoading(true);
        const response = await instance.get("/subject-allocations");
        console.log("All Staff Data:", response.data);
        
        // Filter for Physics subject only
        const physicsData = response.data.filter(
          item => item.subjectName && 
          (item.subjectName.trim().toLowerCase() === "physics" || 
           item.subjectName.trim().toLowerCase() === "allied physics")
        );
        
        console.log("Physics Staff Data:", physicsData);
        
        if (physicsData.length > 0) {
          // Map to faculty format
          const facultyList = physicsData.map(item => ({
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
          setFacultyList(facultyList);
        } else {
          // Use default faculty list if no Physics data from API
          setFacultyList(defaultFacultyList.map(f => ({
            ...f,
            qualification: "Ph.D., M.Sc.",
            imageUrl: null,
            documentUrl: null,
            staffType: "Teaching Staff",
            active: true,
          })));
          toast.info("Using default Physics faculty data");
        }
      } catch (err) {
        console.error("Error fetching faculty:", err);
        // Use default faculty list on error
        setFacultyList(defaultFacultyList.map(f => ({
          ...f,
          qualification: "Ph.D., M.Sc.",
          imageUrl: null,
          documentUrl: null,
          staffType: "Teaching Staff",
          active: true,
        })));
        toast.error("❌ Failed to fetch faculty data. Using default data.");
      } finally {
        setLoading(false);
      }
    };

    fetchFaculty();
  }, []);

  const tabButtonSx = (tab) => ({
    background: "transparent",
    border: "none",
    cursor: "pointer",
    fontFamily: "Arial, Helvetica, sans-serif",
    fontSize: "13px",
    fontWeight: 600,
    letterSpacing: "0.02em",
    padding: "6px 4px",
    minWidth: 0,
    textTransform: "none",
    borderRadius: 0,
    color: activeTab === tab ? COLORS.primary : COLORS.text,
    borderBottom: activeTab === tab ? `3px solid ${COLORS.primary}` : "2px solid transparent",
    textAlign: "center",
    transition: "all 0.2s ease",
    "&:hover": {
      background: "transparent",
      borderBottom: activeTab === tab ? `3px solid ${COLORS.primary}` : "2px solid transparent",
    },
  });

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
          padding: "40px 20px",
          fontFamily: "Arial, Helvetica, sans-serif",
          color: COLORS.text,
          lineHeight: 1.7,
          "*": { boxSizing: "border-box" },
        }}
      >
        <Typography
          component="h1"
          sx={{
            fontSize: "32px",
            fontWeight: 800,
            color: COLORS.primary,
            borderBottom: `3px solid ${COLORS.primary}`,
            paddingBottom: "10px",
            marginBottom: "24px",
            textAlign: "center",
          }}
        >
          PHYSICS
        </Typography>

        <Box sx={{ maxWidth: 1180, margin: "0 auto" }}>
          {introParagraphs.map((p, i) => (
            <Typography key={i} sx={{ fontSize: "17px", textAlign: "justify", mb: 2 }}>
              {p}
            </Typography>
          ))}

          {/* Tabs - Centered */}
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 3.5,
              borderTop: "1px solid #e8edf5",
              borderBottom: "1px solid #e8edf5",
              padding: "16px 0",
              marginBottom: "4px",
            }}
          >
            {tabsRow1.map((tab) => (
              <Button key={tab} disableRipple sx={tabButtonSx(tab)} onClick={() => setActiveTab(tab)}>
                {tab}
              </Button>
            ))}
          </Box>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 3.5,
              paddingBottom: "16px",
              marginBottom: "20px",
            }}
          >
            {tabsRow2.map((tab) => (
              <Button key={tab} disableRipple sx={tabButtonSx(tab)} onClick={() => setActiveTab(tab)}>
                {tab}
              </Button>
            ))}
          </Box>

          {/* Tab content */}
          {activeTab === "ACADEMIC" && <AcademicTab />}
          {activeTab === "FACULTY" && (
            <FacultyTab 
              facultyList={facultyList} 
              loading={loading} 
              onViewProfile={handleViewProfile}
            />
          )}
          {activeTab === "RESEARCH" && <ResearchTab />}
          {activeTab === "SEMINARS & WORKSHOPS" && <SeminarsTab />}
          {activeTab === "PUBLICATION" && <PublicationTab />}
          {activeTab === "LEARNING RESOURCES" && <PlaceholderTab label="Learning Resources" />}
          {activeTab === "PLACEMENT" && <PlacementTab />}
          {activeTab === "HIGHLIGHTS" && <PlaceholderTab label="Highlights" />}
          {activeTab === "RANK HOLDERS" && <PlaceholderTab label="Rank Holders" />}
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