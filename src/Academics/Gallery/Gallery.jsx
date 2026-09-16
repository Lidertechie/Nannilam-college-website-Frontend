import React, { useState } from "react";
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
} from "@mui/material";
import { ChevronDown, X } from "lucide-react";
import Footer from "../Common/Footer";

// ---------- Data ----------

const galleryByYear = {
  "2024-2025": [
    { src: "https://picsum.photos/seed/rsgc2024-1/500/360", caption: "Annual Day Celebration" },
    { src: "https://picsum.photos/seed/rsgc2024-2/500/360", caption: "Sports Meet" },
    { src: "https://picsum.photos/seed/rsgc2024-3/500/360", caption: "Science Exhibition" },
    { src: "https://picsum.photos/seed/rsgc2024-4/500/360", caption: "Graduation Day" },
    { src: "https://picsum.photos/seed/rsgc2024-5/500/360", caption: "Cultural Fest" },
    { src: "https://picsum.photos/seed/rsgc2024-6/500/360", caption: "NSS Camp" },
  ],
  "2023-2024": [
    { src: "https://picsum.photos/seed/rsgc2023-1/500/360", caption: "Freshers Day" },
    { src: "https://picsum.photos/seed/rsgc2023-2/500/360", caption: "Workshop on AI" },
    { src: "https://picsum.photos/seed/rsgc2023-3/500/360", caption: "Blood Donation Camp" },
    { src: "https://picsum.photos/seed/rsgc2023-4/500/360", caption: "Alumni Meet" },
  ],
  "2022-2023": [
    { src: "https://picsum.photos/seed/rsgc2022-1/500/360", caption: "Independence Day" },
    { src: "https://picsum.photos/seed/rsgc2022-2/500/360", caption: "Seminar Hall" },
    { src: "https://picsum.photos/seed/rsgc2022-3/500/360", caption: "Library Inauguration" },
  ],
  "2021-2022": [
    { src: "https://picsum.photos/seed/rsgc2021-1/500/360", caption: "Convocation" },
    { src: "https://picsum.photos/seed/rsgc2021-2/500/360", caption: "Yoga Day" },
  ],
  "2020-2021": [
    { src: "https://picsum.photos/seed/rsgc2020-1/500/360", caption: "Online Orientation" },
    { src: "https://picsum.photos/seed/rsgc2020-2/500/360", caption: "Webinar Series" },
  ],
};

const years = Object.keys(galleryByYear);

// ---------- Shared style tokens (kept identical to the original design) ----------

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
  const [selectedYear, setSelectedYear] = useState(years[0]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [lightbox, setLightbox] = useState(null);

  const images = galleryByYear[selectedYear] || [];

  const handleDropdownClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDropdownClose = (year) => {
    if (year) {
      setSelectedYear(year);
    }
    setAnchorEl(null);
  };

  const handleLightboxOpen = (img) => {
    setLightbox(img);
  };

  const handleLightboxClose = () => {
    setLightbox(null);
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
              Academic Year: {selectedYear}
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
              {years.map((year) => (
                <MenuItem
                  key={year}
                  onClick={() => handleDropdownClose(year)}
                  sx={{
                    fontFamily: "Arial, Helvetica, sans-serif",
                    fontSize: "14.5px",
                    color: year === selectedYear ? "#8E44AD" : "#2A2A2A",
                    fontWeight: year === selectedYear ? 700 : 400,
                    padding: "10px 20px",
                    "&:hover": {
                      background: "#F5F0FA",
                    },
                  }}
                >
                  {year}
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* Image grid */}
          <Grid container spacing={2.5}>
            {images.map((img, i) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
                <Card
                  onClick={() => handleLightboxOpen(img)}
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
                  <CardMedia
                    component="img"
                    image={img.src}
                    alt={img.caption}
                    sx={{
                      height: 180,
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                  <CardContent sx={{ padding: "10px 14px" }}>
                    <Typography
                      sx={{
                        fontSize: "13.5px",
                        fontFamily: "Arial, Helvetica, sans-serif",
                        color: "#2A2A2A",
                      }}
                    >
                      {img.caption}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {images.length === 0 && (
            <Box
              sx={{
                textAlign: "center",
                padding: "60px 0",
                color: "#A79A7C",
                fontFamily: "Arial, Helvetica, sans-serif",
                fontSize: "16px",
              }}
            >
              No photos available for {selectedYear}.
            </Box>
          )}
        </Box>
      </Box>

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
                alt={lightbox.caption}
                style={{
                  maxWidth: "100%",
                  maxHeight: "75vh",
                  borderRadius: 6,
                  display: "block",
                }}
              />
              <Typography
                sx={{
                  color: "#fff",
                  marginTop: 1.5,
                  fontFamily: "Arial, Helvetica, sans-serif",
                  fontSize: "16px",
                }}
              >
                {lightbox.caption}
              </Typography>
            </>
          )}
        </Box>
      </Modal>

      <Footer />
    </>
  );
}