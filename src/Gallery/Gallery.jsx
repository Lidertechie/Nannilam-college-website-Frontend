import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Menu,
  MenuItem,
  Grid,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  Modal,
  CircularProgress,
  Alert,
} from "@mui/material";
import { ChevronDown, X } from "lucide-react";
import Footer from "../Common/Footer";
import instance from "../AxiosInstance/AxiosInstance";
// ---------- Shared style tokens ----------
const COLORS = {
  primary: "#1a3e8c",
  text: "#1f2937",
  tableBorder: "#d4cfe0",
  tableHeadBg: "#f0ecf9",
  roleText: "#5b5240",
  placeholder: "#8A7E63",
};

// ---------- Main Component ----------
export default function Gallery() {
  const [selectedYear, setSelectedYear] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [lightbox, setLightbox] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [galleryData, setGalleryData] = useState({});
  const [academicYears, setAcademicYears] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ---------- Fetch academic years ----------
  useEffect(() => {
    const fetchAcademicYears = async () => {
      try {
        const response = await instance.get("/academic-years");
        if (response.data && response.data.length > 0) {
          setAcademicYears(response.data);
          setSelectedYear(response.data[0].id); // Set first year as default
        }
      } catch (err) {
        console.error("Error fetching academic years:", err);
        setError("Failed to load academic years");
      }
    };
    fetchAcademicYears();
  }, []);

  // ---------- Fetch gallery images for selected year ----------
  useEffect(() => {
    if (selectedYear) {
      const fetchGalleryImages = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await instance.get(`/galleries?academicYearId=${selectedYear}`);
          console.log("API Response:", response.data); // For debugging

          if (response.data && response.data.length > 0) {
            // The API returns gallery "events" (e.g. "Annual Sports Day"),
            // each with a nested `images` array like:
            // { id, title, description, images: [{ id, caption, imageUrl, createdAt }, ...] }
            // Keep the event grouping intact (instead of flattening) so each
            // title section only shows the images that belong to it.
            const transformedData = response.data.map((event) => ({
              id: event.id,
              title: event.title,
              description: event.description || "",
              images: Array.isArray(event.images)
                ? event.images.map((img) => ({
                    src: img.imageUrl || img.src || "https://picsum.photos/seed/default/500/360",
                    title: img.caption || event.title || "Gallery Image",
                    id: img.id,
                    createdAt: img.createdAt,
                  }))
                : [],
            }));
            setGalleryData((prev) => ({
              ...prev,
              [selectedYear]: transformedData,
            }));
          } else {
            setGalleryData((prev) => ({
              ...prev,
              [selectedYear]: [],
            }));
          }
        } catch (err) {
          console.error("Error fetching gallery images:", err);
          setError("Failed to load gallery images");
        } finally {
          setLoading(false);
        }
      };
      fetchGalleryImages();
    }
  }, [selectedYear]);

  // ---------- Handle dropdown ----------
  const handleDropdownClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDropdownClose = (yearId) => {
    if (yearId) {
      setSelectedYear(yearId);
    }
    setAnchorEl(null);
  };

  // ---------- Handle album (event) modal ----------
  const handleEventOpen = (event) => {
    setSelectedEvent(event);
  };

  const handleEventClose = () => {
    setSelectedEvent(null);
  };

  // ---------- Handle lightbox ----------
  const handleLightboxOpen = (img) => {
    setLightbox(img);
  };

  const handleLightboxClose = () => {
    setLightbox(null);
  };

  // ---------- Get current events (each with its own title + images) ----------
  const events = selectedYear ? galleryData[selectedYear] || [] : [];

  // ---------- Get selected year label ----------
const getYearLabel = (yearId) => {
  const year = academicYears.find(y => y.id === yearId);
  return year ? year.yearLabel || year.name || `${year.startYear}-${year.endYear}` : "";
};

  // ---------- Loading state ----------
  if (loading && !selectedYear) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  // ---------- Render ----------
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
          background: "#F7F7F7",
          minHeight: "100%",
        }}
      >
        <Typography
          component="h1"
          sx={{
            fontSize: { xs: "24px", md: "30px" },
            fontWeight: 600,
            textAlign: "center",
            color: "#1A1A1A",
            margin: 0,
            padding: "22px 0 30px",
            fontFamily: "Arial, Helvetica, sans-serif",
          }}
        >
          Gallery
        </Typography>

        <Box sx={{ maxWidth: 1180, margin: "0 auto" }}>
          {/* Academic year dropdown */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              marginBottom: 4.5,
            }}
          >
            <Button
              onClick={handleDropdownClick}
              endIcon={
                <ChevronDown
                  size={16}
                  style={{
                    transform: Boolean(anchorEl) ? "rotate(180deg)" : "none",
                    transition: "transform 0.15s ease",
                  }}
                />
              }
              sx={{
                background: "#FFFFFF",
                border: "1px solid #D8D0E8",
                borderRadius: 1,
                padding: "10px 20px",
                fontFamily: "Arial, Helvetica, sans-serif",
                fontSize: "15px",
                fontWeight: 600,
                color: "#1E2A44",
                minWidth: 220,
                justifyContent: "space-between",
                textTransform: "none",
                "&:hover": {
                  background: "#FFFFFF",
                  border: "1px solid #D8D0E8",
                },
              }}
            >
              Academic Year: {selectedYear ? getYearLabel(selectedYear) : "Select Year"}
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => handleDropdownClose()}
              sx={{
                '& .MuiPaper-root': {
                  borderRadius: 1,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                  minWidth: 220,
                  marginTop: 0.75,
                },
              }}
            >
              {academicYears.map((year) => (
                <MenuItem
                  key={year.id}
                  onClick={() => handleDropdownClose(year.id)}
                  sx={{
                    fontFamily: "Arial, Helvetica, sans-serif",
                    fontSize: "14.5px",
                    color: year.id === selectedYear ? "#8E44AD" : "#2A2A2A",
                    fontWeight: year.id === selectedYear ? 700 : 400,
                    padding: "10px 20px",
                    "&:hover": {
                      background: "#F5F0FA",
                    },
                  }}
                >
                 {year.yearLabel || year.name || `${year.startYear}-${year.endYear}`}
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* Error message */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Loading indicator for images */}
          {loading && selectedYear && (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          )}

          {/* One card per event/title (album cover) */}
          {!loading && !error && (
            <Grid container spacing={2.5}>
              {events.map((event) => {
                const cover = (event.images || [])[0];
                const count = (event.images || []).length;
                return (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={event.id}>
                    <Card
                      onClick={() => handleEventOpen(event)}
                      sx={{
                        background: "#FFFFFF",
                        border: "1px solid #E9E1CC",
                        borderRadius: 1,
                        overflow: "hidden",
                        cursor: "pointer",
                        transition: "transform 0.18s ease, box-shadow 0.18s ease",
                        "&:hover": {
                          transform: "translateY(-3px)",
                          boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
                        },
                      }}
                    >
                      <Box sx={{ position: "relative" }}>
                        <CardMedia
                          component="img"
                          image={cover ? cover.src : "https://picsum.photos/seed/default/500/360"}
                          alt={event.title}
                          sx={{
                            height: 180,
                            objectFit: "cover",
                            display: "block",
                          }}
                          onError={(e) => {
                            e.target.src = "https://picsum.photos/seed/default/500/360";
                          }}
                        />
                        {count > 0 && (
                          <Box
                            sx={{
                              position: "absolute",
                              bottom: 8,
                              right: 8,
                              background: "rgba(0,0,0,0.65)",
                              color: "#fff",
                              fontSize: "11px",
                              fontFamily: "Arial, Helvetica, sans-serif",
                              padding: "3px 8px",
                              borderRadius: "10px",
                            }}
                          >
                            {count} {count === 1 ? "photo" : "photos"}
                          </Box>
                        )}
                      </Box>
                      <CardContent sx={{ padding: "10px 14px" }}>
                        <Typography
                          sx={{
                            fontSize: "14px",
                            fontFamily: "Arial, Helvetica, sans-serif",
                            color: "#2A2A2A",
                            fontWeight: 600,
                            mb: event.description ? 0.5 : 0,
                          }}
                        >
                          {event.title}
                        </Typography>
                        {event.description && (
                          <Typography
                            sx={{
                              fontSize: "12px",
                              fontFamily: "Arial, Helvetica, sans-serif",
                              color: "#666",
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            {event.description}
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}

          {/* No albums message */}
          {!loading && !error && events.length === 0 && selectedYear && (
            <Box
              sx={{
                textAlign: "center",
                padding: "60px 0",
                color: "#A79A7C",
                fontFamily: "Arial, Helvetica, sans-serif",
                fontSize: "16px",
              }}
            >
              No photos available for {getYearLabel(selectedYear)}.
            </Box>
          )}
        </Box>
      </Box>

      {/* Album Modal: shows all images inside the selected event */}
      <Modal
        open={Boolean(selectedEvent)}
        onClose={handleEventClose}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 3,
        }}
      >
        <Box
          sx={{
            position: "relative",
            background: "#FFFFFF",
            borderRadius: 2,
            width: "100%",
            maxWidth: 1000,
            maxHeight: "85vh",
            overflowY: "auto",
            padding: "24px",
            outline: "none",
          }}
        >
          <IconButton
            onClick={handleEventClose}
            sx={{
              position: "absolute",
              top: 12,
              right: 12,
              color: "#333",
              zIndex: 1,
            }}
          >
            <X size={24} />
          </IconButton>

          {selectedEvent && (
            <>
              <Typography
                sx={{
                  fontSize: "20px",
                  fontFamily: "Arial, Helvetica, sans-serif",
                  color: "#1A1A1A",
                  fontWeight: 700,
                  marginBottom: selectedEvent.description ? 0.5 : 2,
                  paddingRight: 4,
                }}
              >
                {selectedEvent.title}
              </Typography>
              {selectedEvent.description && (
                <Typography
                  sx={{
                    fontSize: "13.5px",
                    fontFamily: "Arial, Helvetica, sans-serif",
                    color: "#666",
                    marginBottom: 2,
                  }}
                >
                  {selectedEvent.description}
                </Typography>
              )}

              {(selectedEvent.images || []).length === 0 ? (
                <Box
                  sx={{
                    color: "#A79A7C",
                    fontFamily: "Arial, Helvetica, sans-serif",
                    fontSize: "14px",
                    padding: "20px 0",
                    textAlign: "center",
                  }}
                >
                  No photos in this album.
                </Box>
              ) : (
                <Grid container spacing={2}>
                  {(selectedEvent.images || []).map((img, i) => (
                    <Grid item xs={6} sm={4} md={3} key={img.id || i}>
                      <Box
                        onClick={() => handleLightboxOpen(img)}
                        sx={{
                          borderRadius: 1,
                          overflow: "hidden",
                          cursor: "pointer",
                          border: "1px solid #E9E1CC",
                          transition: "transform 0.15s ease",
                          "&:hover": { transform: "scale(1.03)" },
                        }}
                      >
                        <img
                          src={img.src}
                          alt={img.title}
                          style={{
                            width: "100%",
                            height: 140,
                            objectFit: "cover",
                            display: "block",
                          }}
                          onError={(e) => {
                            e.target.src = "https://picsum.photos/seed/default/500/360";
                          }}
                        />
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              )}
            </>
          )}
        </Box>
      </Modal>

      {/* Lightbox Modal */}
      <Modal
        open={Boolean(lightbox)}
        onClose={handleLightboxClose}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 3,
        }}
      >
        <Box
          sx={{
            position: "relative",
            maxWidth: "90vw",
            maxHeight: "85vh",
            textAlign: "center",
            outline: "none",
          }}
        >
          <IconButton
            onClick={handleLightboxClose}
            sx={{
              position: "absolute",
              top: -50,
              right: -50,
              color: "#fff",
              zIndex: 101,
              '&:hover': {
                background: "rgba(255,255,255,0.1)",
              },
            }}
          >
            <X size={28} />
          </IconButton>
          {lightbox && (
            <>
              <img
                src={lightbox.src}
                alt={lightbox.title}
                style={{
                  maxWidth: "100%",
                  maxHeight: "75vh",
                  borderRadius: 6,
                  display: "block",
                }}
                onError={(e) => {
                  e.target.src = "https://picsum.photos/seed/default/500/360";
                }}
              />
              <Typography
                sx={{
                  color: "#fff",
                  marginTop: 1.5,
                  fontFamily: "Arial, Helvetica, sans-serif",
                  fontSize: "18px",
                  fontWeight: 600,
                }}
              >
                {lightbox.title}
              </Typography>
              {lightbox.description && (
                <Typography
                  sx={{
                    color: "#ddd",
                    marginTop: 0.5,
                    fontFamily: "Arial, Helvetica, sans-serif",
                    fontSize: "14px",
                  }}
                >
                  {lightbox.description}
                </Typography>
              )}
            </>
          )}
        </Box>
      </Modal>

      <Footer />
    </>
  );
}