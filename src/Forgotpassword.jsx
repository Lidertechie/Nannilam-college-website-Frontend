import React, { useState } from "react";
import {
    Box,
    Button,
    Container,
    Paper,
    TextField,
    Typography,
    Alert,
    CircularProgress,
    IconButton,
    InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import instance from "./AxiosInstance/AxiosInstance";

export default function ForgotPassword() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get("token"); // Gets token from either route

    // ---- Step 1: email ----
    const [email, setEmail] = useState("");

    // ---- Step 2: new password ----
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    // Step 1 submit: request reset link
    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);
        setLoading(true);

        try {
            const res = await instance.post("/users/forgot-password", { email });

            setMessage({
                type: "success",
                text:
                    res.data?.message ||
                    "A password reset link has been sent to your email.",
            });

            setEmail("");
        } catch (err) {
            setMessage({
                type: "error",
                text:
                    err.response?.data?.message ||
                    err.message ||
                    "Something went wrong. Please try again.",
            });
        } finally {
            setLoading(false);
        }
    };

    // Step 2 submit: set new password
    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);

        if (password.length < 6) {
            setMessage({
                type: "error",
                text: "Password must be at least 6 characters long.",
            });
            return;
        }

        if (password !== confirmPassword) {
            setMessage({
                type: "error",
                text: "Passwords do not match.",
            });
            return;
        }

        if (!token) {
            setMessage({
                type: "error",
                text: "Invalid or missing reset token. Please request a new password reset link.",
            });
            return;
        }

        setLoading(true);
        try {
            const payload = {
                token: token,
                newPassword: password,
                confirmPassword: confirmPassword
            };

            const res = await instance.post("/users/reset-password", payload);

            setMessage({
                type: "success",
                text: res.data?.message || "Your password has been reset successfully.",
            });

            setPassword("");
            setConfirmPassword("");

            // Redirect to login after successful password reset
            setTimeout(() => navigate("/login"), 2000);
        } catch (err) {
            setMessage({
                type: "error",
                text:
                    err.response?.data?.message ||
                    err.message ||
                    "Something went wrong. Please try again.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="xs">
            <Paper
                elevation={4}
                sx={{
                    mt: 8,
                    p: 4,
                    borderRadius: 3,
                    textAlign: "center",
                }}
            >
                <Box
                    component="img"
                    src="/forgot.jpg"
                    alt={token ? "Reset Password" : "Forgot Password"}
                    sx={{
                        width: 140,
                        height: "auto",
                        mb: 2,
                    }}
                />

                <Typography variant="h5" fontWeight={600} gutterBottom>
                    {token ? "Reset Password" : "Forgot Password?"}
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    {token
                        ? "Please enter your new password below."
                        : "Please enter your registered email address and we will send you a password reset link."}
                </Typography>

                {message && (
                    <Alert severity={message.type} sx={{ mb: 3, textAlign: "left" }}>
                        {message.text}
                    </Alert>
                )}

                {token ? (
                    // ---- Step 2 form: New Password / Confirm Password ----
                    <Box component="form" onSubmit={handlePasswordSubmit}>
                        <TextField
                            fullWidth
                            label="New Password"
                            type={showPassword ? "text" : "password"}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                            sx={{ mb: 3 }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPassword((v) => !v)}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <TextField
                            fullWidth
                            label="Confirm Password"
                            type={showConfirmPassword ? "text" : "password"}
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            disabled={loading}
                            sx={{ mb: 3 }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowConfirmPassword((v) => !v)}
                                            edge="end"
                                        >
                                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            size="large"
                            disabled={loading}
                        >
                            {loading ? (
                                <CircularProgress size={24} color="inherit" />
                            ) : (
                                "Reset Password"
                            )}
                        </Button>
                    </Box>
                ) : (
                    // ---- Step 1 form: Email ----
                    <Box component="form" onSubmit={handleEmailSubmit}>
                        <TextField
                            fullWidth
                            label="Email Address"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                            sx={{ mb: 3 }}
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            size="large"
                            disabled={loading}
                        >
                            {loading ? (
                                <CircularProgress size={24} color="inherit" />
                            ) : (
                                "Send Reset Link"
                            )}
                        </Button>
                    </Box>
                )}

                <Typography variant="body2" sx={{ mt: 2 }}>
                    Remembered your password?{" "}
                    <Link
                        to="/login"
                        style={{ color: "#1976d2", textDecoration: "none", fontWeight: 600 }}
                    >
                        Sign In
                    </Link>
                </Typography>
            </Paper>
        </Container>
    );
}