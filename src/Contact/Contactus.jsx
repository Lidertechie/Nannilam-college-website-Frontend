import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Paper,
  Grid,
  Typography,
  Container,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { MapPin, Headphones, Mail } from "lucide-react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import instance from "../AxiosInstance/AxiosInstance";

// Custom styled components with blue/white theme
const StyledTextField = styled(TextField)({
  "& .MuiInputBase-root": {
    borderRadius: 3,
    border: "1px solid #BBDEFB",
    backgroundColor: "#FFFFFF",
    transition: "border-color 0.2s ease",
    "& fieldset": {
      border: "none",
    },
    "&:hover": {
      borderColor: "#64B5F6",
    },
    "&.Mui-focused": {
      borderColor: "#1976D2",
      boxShadow: "0 0 0 3px rgba(25, 118, 210, 0.1)",
    },
  },
  "& .MuiInputBase-input": {
    padding: "14px 16px",
    fontSize: 14,
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    color: "#1A1A1A",
  },
  "& .MuiInputBase-input::placeholder": {
    color: "#9AA0A6",
    opacity: 1,
  },
  width: "100%",
  marginBottom: "16px",
});

const StyledTextArea = styled(TextField)({
  "& .MuiInputBase-root": {
    borderRadius: 3,
    border: "1px solid #BBDEFB",
    backgroundColor: "#FFFFFF",
    transition: "border-color 0.2s ease",
    "& fieldset": {
      border: "none",
    },
    "&:hover": {
      borderColor: "#64B5F6",
    },
    "&.Mui-focused": {
      borderColor: "#1976D2",
      boxShadow: "0 0 0 3px rgba(25, 118, 210, 0.1)",
    },
  },
  "& .MuiInputBase-input": {
    padding: "14px 16px",
    fontSize: 14,
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    color: "#1A1A1A",
    minHeight: "160px",
    resize: "vertical",
  },
  "& .MuiInputBase-input::placeholder": {
    color: "#9AA0A6",
    opacity: 1,
  },
  width: "100%",
  marginBottom: "16px",
});

const SendButton = styled(Button)({
  width: "100%",
  padding: "16px 24px",
  border: "none",
  borderRadius: 3,
  background: "linear-gradient(90deg, #1976D2 0%, #0D47A1 100%)",
  color: "#FFFFFF",
  fontSize: 13,
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  cursor: "pointer",
  marginTop: "8px",
  "&:hover": {
    opacity: 0.92,
    transform: "translateY(-1px)",
    background: "linear-gradient(90deg, #1565C0 0%, #0D47A1 100%)",
  },
  "&:disabled": {
    opacity: 0.6,
    cursor: "not-allowed",
  },
  transition: "opacity 0.2s ease, transform 0.15s ease",
});

export default function ContactUs() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!form.name.trim()) {
      toast.error("Name is required");
      return false;
    }
    if (!form.email.trim()) {
      toast.error("Email is required");
      return false;
    }
    if (!form.email.includes('@') || !form.email.includes('.')) {
      toast.error("Please enter a valid email address");
      return false;
    }
    if (!form.mobile.trim()) {
      toast.error("Mobile number is required");
      return false;
    }
    if (form.mobile.length < 10 || form.mobile.length > 15) {
      toast.error("Please enter a valid mobile number");
      return false;
    }
    if (!form.message.trim()) {
      toast.error("Message is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await instance.post("/contact/submit", {
        name: form.name.trim(),
        email: form.email.trim(),
        mobile: form.mobile.trim(),
        message: form.message.trim(),
      });

      console.log("Contact form submitted:", response.data);
      
      toast.success("Thank you for contacting us! We'll get back to you soon.");
      
      // Reset form after successful submission
      setForm({
        name: "",
        email: "",
        mobile: "",
        message: "",
      });

    } catch (err) {
      console.error("Error submitting contact form:", err);
      const errorMsg = err.response?.data?.message || "Failed to send message. Please try again.";
      toast.error("❌ " + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        background: "#F5F9FF",
        minHeight: "100%",
        padding: { xs: "24px 16px", sm: "32px 20px", md: "48px 24px" },
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
      `}</style>

      {/* Title */}
      <Typography
        variant="h1"
        sx={{
          fontFamily: "'Playfair Display', serif",
          fontSize: { xs: "24px", sm: "28px", md: "clamp(28px, 3.5vw, 40px)" },
          fontWeight: 600,
          textAlign: "center",
          color: "#0D47A1",
          margin: { xs: "0 0 24px", sm: "0 0 32px", md: "0 0 40px" },
        }}
      >
        Contact Us
      </Typography>

      {/* Main grid */}
      <Box
        sx={{
          maxWidth: 1400,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1.6fr 1fr" },
          gap: { xs: "16px", sm: "20px", md: "24px" },
          alignItems: "start",
        }}
      >
        {/* LEFT: Map card */}
        <Paper
          elevation={0}
          sx={{
            background: "#FFFFFF",
            border: "1px solid #E3F2FD",
            borderRadius: "4px",
            padding: { xs: "12px", sm: "14px", md: "16px" },
          }}
        >
          {/* Google Map iframe */}
          <Box
            sx={{
              width: "100%",
              height: { xs: 250, sm: 300, md: 380 },
              borderRadius: "2px",
              overflow: "hidden",
              border: "1px solid #BBDEFB",
            }}
          >
            <iframe
              title="College Location"
              src="https://www.google.com/maps?q=Government+Arts+and+Science+College+Nannilam&z=19&t=k&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </Box>
          
          {/* Info row below map */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
              gap: { xs: "24px", sm: "16px" },
              marginTop: { xs: "20px", sm: "24px", md: "28px" },
              paddingTop: { xs: "4px", sm: "6px", md: "8px" },
              textAlign: "center",
            }}
          >
            {/* Reach Us */}
            <Box>
              <MapPin size={22} color="#1976D2" strokeWidth={1.5} style={{ marginBottom: 8 }} />
              <Typography
                sx={{
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#0D47A1",
                  marginBottom: "10px",
                }}
              >
                Reach Us
              </Typography>
              <Typography sx={{ fontSize: 14, color: "#1A1A1A", lineHeight: 1.5 }}>
                Thiruvarur Main Road, EB Office Opposite, Nannilam - 610105
              </Typography>
            </Box>

            {/* Let's Talk */}
            <Box>
              <Headphones size={22} color="#1976D2" strokeWidth={1.5} style={{ marginBottom: 8 }} />
              <Typography
                sx={{
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#0D47A1",
                  marginBottom: "10px",
                }}
              >
                Let's Talk
              </Typography>
              <Typography sx={{ fontSize: 14, color: "#1A1A1A", lineHeight: 1.5 }}>
                04366 296270
              </Typography>
            </Box>

            {/* E-mail Us */}
            <Box>
              <Mail size={22} color="#1976D2" strokeWidth={1.5} style={{ marginBottom: 8 }} />
              <Typography
                sx={{
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#0D47A1",
                  marginBottom: "10px",
                }}
              >
                E-mail Us
              </Typography>
              <Typography sx={{ fontSize: 14, color: "#1A1A1A", lineHeight: 1.5 }}>
                princibun@bdu.ac.in
                <br />
                gascnannilam2023@gmail.com
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* RIGHT: Form card */}
        <Paper
          elevation={0}
          sx={{
            background: "linear-gradient(180deg, #E3F2FD 0%, #F5F9FF 100%)",
            border: "1px solid #BBDEFB",
            borderRadius: "4px",
            padding: { xs: "16px", sm: "20px", md: "24px" },
          }}
        >
          <form onSubmit={handleSubmit}>
            <StyledTextField
              type="text"
              name="name"
              placeholder="Your name"
              value={form.name}
              onChange={handleChange}
              variant="outlined"
              disabled={loading}
              InputProps={{
                disableUnderline: true,
              }}
            />
            <StyledTextField
              type="email"
              name="email"
              placeholder="Your email address"
              value={form.email}
              onChange={handleChange}
              variant="outlined"
              disabled={loading}
              InputProps={{
                disableUnderline: true,
              }}
            />
            <StyledTextField
              type="tel"
              name="mobile"
              placeholder="Your mobile"
              value={form.mobile}
              onChange={handleChange}
              variant="outlined"
              disabled={loading}
              InputProps={{
                disableUnderline: true,
              }}
            />
            <StyledTextArea
              name="message"
              placeholder="Your message"
              value={form.message}
              onChange={handleChange}
              variant="outlined"
              multiline
              rows={1}
              disabled={loading}
              InputProps={{
                disableUnderline: true,
              }}
            />

            <SendButton 
              type="submit" 
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: "#fff" }} />
              ) : (
                "SEND MESSAGE"
              )}
            </SendButton>
          </form>
        </Paper>
      </Box>

      {/* Toast Container - Bottom Right */}
      <ToastContainer 
        position="bottom-right" 
        autoClose={5000}
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
}