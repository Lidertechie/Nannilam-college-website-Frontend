import React, { useState, useEffect } from "react";
import instance from "../AxiosInstance/AxiosInstance";
import ReusableTable from "../Common/Reusabletable";
import {
  Container,
  Typography,
  useMediaQuery,
  useTheme,
  CircularProgress,
  Alert,
  Avatar,
} from "@mui/material";

const principalsHeaders = [
  "S.No",
  "Photo",
  "From",
  "To",
  "Name of the Principal",
  "Qualification",
  "Designation",
];

export default function PrincipalSuccessionList() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [principalsData, setPrincipalsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPrincipalsData();
  }, []);

  const fetchPrincipalsData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await instance.get("/principals");

      const transformedData = response.data.map((item, index) => [
        (index + 1).toString(),

        // Principal Photo
        item.imageUrl ? (
          <Avatar
            src={item.imageUrl}
            alt={item.name || "Principal"}
            sx={{
              width: 60,
              height: 60,
              margin: "auto",
              border: "2px solid #294a1a",
            }}
          />
        ) : (
          <Avatar
            sx={{
              width: 60,
              height: 60,
              margin: "auto",
              bgcolor: "#294a1a",
            }}
          >
            {item.name?.charAt(0) || "P"}
          </Avatar>
        ),

        item.fromDate || "",
        item.toDate || "_",
        item.name || "",
        item.qualification || "",
        item.designation || "",
      ]);

      setPrincipalsData(transformedData);
    } catch (err) {
      console.error("Error fetching principals data:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to fetch principals data"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container
        maxWidth="lg"
        sx={{
          mt: 4,
          mb: 3,
          px: 3,
          textAlign: "center",
        }}
      >
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>
          Loading principals data...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 3, px: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>

        <Typography variant="body2" color="textSecondary">
          Please try again later.
        </Typography>
      </Container>
    );
  }

  return (
    <Container
      maxWidth="lg"
      sx={{
        mt: isMobile ? 2 : 4,
        mb: isMobile ? 2 : 3,
        px: isMobile ? 1 : 3,
      }}
    >
      <Typography
        variant={isMobile ? "h5" : "h4"}
        component="h2"
        sx={{
          fontWeight: 700,
          color: "#1a3e8c",
          textAlign: "center",
          mb: isMobile ? 2 : 3,
          fontSize: isMobile ? "18px" : "22px",
        }}
      >
        Succession List of Principals of this College
      </Typography>

      {principalsData.length > 0 ? (
        <ReusableTable
          headers={principalsHeaders}
          rows={principalsData}
        />
      ) : (
        <Typography
          variant="body1"
          color="textSecondary"
          textAlign="center"
        >
          No principals data available
        </Typography>
      )}
    </Container>
  );
}