import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { TextField, Button, Typography, Container, Box, CircularProgress, Paper, Fade, IconButton, InputAdornment } from "@mui/material";
import LockResetIcon from '@mui/icons-material/LockReset';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import instance from "./AxiosInstance/AxiosInstance";

const ResetPassword = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [token, setToken] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        const urlToken = searchParams.get("token");
        if (urlToken) {
            setToken(urlToken);
        } else {
            setError("Invalid or missing token.");
        }
    }, [searchParams]);

    const handlePasswordReset = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (!token) {
            setError("Invalid or missing token.");
            return;
        }

        setLoading(true);

        try {
            const payload = {
                token,
                newPassword,
                confirmPassword,
            };

            const response = await instance.post(
                "/users/reset-password",
                payload
            );

            setSuccess(true);
            setError(null);

            setTimeout(() => {
                navigate("/login");
            }, 2000);

        } catch (err) {
            if (err.response?.data) {
                setError(
                    err.response.data.details ||
                    err.response.data.message ||
                    "Failed to reset password."
                );
            } else {
                setError("Failed to reset password.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                height: "100vh",
                width: "100vw",
                overflow: "hidden",
                position: "fixed",
                top: 0,
                left: 0,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "linear-gradient(135deg, #6B73FF 0%, #6d6f9b 100%)",
                padding: { xs: 2, sm: 3, md: 4 },
            }}
        >
            <Paper
                elevation={12}
                sx={{
                    padding: { xs: 3, sm: 4, md: 5 },
                    maxWidth: { xs: "95%", sm: 420, md: 440 },
                    width: "100%",
                    borderRadius: { xs: 3, sm: 4 },
                    backgroundColor: "#fff",
                    maxHeight: "90vh",
                    overflow: "auto",
                    transition: "transform 0.3s, box-shadow 0.3s",
                    "&:hover": {
                        transform: { md: "translateY(-5px)" },
                        boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
                    },
                    "&::-webkit-scrollbar": {
                        width: "4px",
                    },
                    "&::-webkit-scrollbar-thumb": {
                        backgroundColor: "#3f51b5",
                        borderRadius: "10px",
                    },
                    "&::-webkit-scrollbar-track": {
                        backgroundColor: "#f1f1f1",
                        borderRadius: "10px",
                    },
                }}
            >
                <Box sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: "100%"
                }}>
                    <Box sx={{
                        display: "flex",
                        justifyContent: "center",
                        mb: { xs: 1.5, sm: 2 },
                        width: "100%"
                    }}>
                        <LockResetIcon sx={{
                            fontSize: { xs: 45, sm: 50, md: 55 },
                            color: "#3f51b5"
                        }} />
                    </Box>

                    <Typography
                        variant="h5"
                        align="center"
                        fontWeight="bold"
                        gutterBottom
                        sx={{
                            fontSize: { xs: "1.25rem", sm: "1.5rem", md: "1.75rem" },
                            wordBreak: "break-word",
                        }}
                    >
                        Reset Your Password
                    </Typography>

                    <Typography
                        variant="body2"
                        align="center"
                        color="textSecondary"
                        mb={{ xs: 2, sm: 3 }}
                        sx={{
                            fontSize: { xs: "0.75rem", sm: "0.875rem" },
                            px: { xs: 1, sm: 0 },
                            wordBreak: "break-word",
                        }}
                    >
                        Enter your new password to reset your account password
                    </Typography>

                    <Fade in={!!error}>
                        <Typography
                            color="error"
                            variant="body2"
                            sx={{
                                mb: 2,
                                textAlign: 'center',
                                minHeight: "24px",
                                transition: "all 0.3s ease-in-out",
                                fontSize: { xs: "0.75rem", sm: "0.875rem" },
                                wordBreak: "break-word",
                                px: 1,
                            }}
                        >
                            {error}
                        </Typography>
                    </Fade>

                    <Fade in={success}>
                        <Typography
                            color="success.main"
                            variant="body2"
                            sx={{
                                mb: 2,
                                textAlign: 'center',
                                minHeight: "24px",
                                transition: "all 0.3s ease-in-out",
                                fontSize: { xs: "0.75rem", sm: "0.875rem" },
                                wordBreak: "break-word",
                                px: 1,
                            }}
                        >
                            Password reset successfully! Redirecting to login...
                        </Typography>
                    </Fade>

                    <Box
                        component="form"
                        onSubmit={handlePasswordReset}
                        sx={{
                            width: "100%",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        <TextField
                            label="New Password"
                            variant="outlined"
                            type={showNewPassword ? "text" : "password"}
                            fullWidth
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            slotProps={{
                                input: {
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle new password visibility"
                                                onClick={() => setShowNewPassword((prev) => !prev)}
                                                edge="end"
                                            >
                                                {showNewPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                },
                            }}
                            sx={{
                                mb: 2,
                                "& .MuiOutlinedInput-root": {
                                    transition: "all 0.3s",
                                    fontSize: { xs: "0.875rem", sm: "1rem" },
                                    "&.Mui-focused fieldset": {
                                        borderColor: "#3f51b5",
                                        boxShadow: "0 0 5px rgba(63,81,181,0.5)",
                                    },
                                },
                                "& .MuiInputLabel-root": {
                                    fontSize: { xs: "0.875rem", sm: "1rem" },
                                },
                            }}
                        />

                        <TextField
                            label="Confirm New Password"
                            variant="outlined"
                            type={showConfirmPassword ? "text" : "password"}
                            fullWidth
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            slotProps={{
                                input: {
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle confirm password visibility"
                                                onClick={() => setShowConfirmPassword((prev) => !prev)}
                                                edge="end"
                                            >
                                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                },
                            }}
                            sx={{
                                mb: { xs: 2.5, sm: 3 },
                                "& .MuiOutlinedInput-root": {
                                    transition: "all 0.3s",
                                    fontSize: { xs: "0.875rem", sm: "1rem" },
                                    "&.Mui-focused fieldset": {
                                        borderColor: "#3f51b5",
                                        boxShadow: "0 0 5px rgba(63,81,181,0.5)",
                                    },
                                },
                                "& .MuiInputLabel-root": {
                                    fontSize: { xs: "0.875rem", sm: "1rem" },
                                },
                            }}
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            disabled={loading || success || !token}
                            sx={{
                                py: { xs: 1.4, sm: 1.6 },
                                fontWeight: 'bold',
                                textTransform: 'none',
                                transition: "all 0.3s ease",
                                fontSize: { xs: "0.875rem", sm: "1rem" },
                                "&:hover": {
                                    backgroundColor: "#303f9f",
                                    transform: { sm: "scale(1.02)", xs: "scale(1.01)" },
                                },
                                "&:active": {
                                    transform: "scale(0.98)",
                                },
                            }}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : "Reset Password"}
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
};

export default ResetPassword;