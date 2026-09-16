import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    InputAdornment,
    IconButton,
    CircularProgress,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import {
    Visibility,
    VisibilityOff,
    LockOutlined,
    Person,
} from "@mui/icons-material";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import instance from "./AxiosInstance/AxiosInstance"

const Login = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const [loginData, setLoginData] = useState({
        username: "",
        password: "",
        remember: false,
    });

    const [errors, setErrors] = useState({
        username: false,
        password: false,
    });

    const handleChange = (e) => {
        const { name, value, checked, type } = e.target;

        setLoginData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));

        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: false,
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {
            username: !loginData.username.trim(),
            password: !loginData.password.trim(),
        };

        setErrors(newErrors);
        return !Object.values(newErrors).some(error => error);
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error("Please fill in all required fields");
            return;
        }

        setLoading(true);

        try {
            const response = await instance.post("/auth/login", {
                usernameOrEmail: loginData.username,
                password: loginData.password,
            });

            console.log("Login Response:", response.data);

            if (response.data.accessToken) {
                if (loginData.remember) {
                    localStorage.setItem('accessToken', response.data.accessToken);
                    localStorage.setItem('userData', JSON.stringify(response.data.user));
                } else {
                    sessionStorage.setItem('accessToken', response.data.accessToken);
                    sessionStorage.setItem('userData', JSON.stringify(response.data.user));
                }

                console.log("✅ Login successful!");
                toast.success("Login successful! Welcome back!");

                setTimeout(() => {
                    navigate("/dashboard");
                }, 1000);
            } else {
                throw new Error("No access token received");
            }

        } catch (err) {
            console.error("Login Error:", err);

            let errorMessage = "Login failed. Please try again.";

            if (err.response) {
                if (err.response.status === 401) {
                    errorMessage = "Invalid username or password. Please try again.";
                } else if (err.response.status === 404) {
                    errorMessage = "User not found. Please check your username.";
                } else if (err.response.data?.message) {
                    errorMessage = err.response.data.message;
                }
            } else if (err.message) {
                errorMessage = err.message;
            }

            toast.error(errorMessage);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        // FIX: kept `position: fixed` (no page scroll, as requested) but
        // removed the old `mt:12` bug — that margin combined with
        // `height:100dvh` made the box measure 96px taller than the real
        // viewport, so "centered" content was off by a device-dependent
        // amount. Now it's `inset:0` (top/right/bottom/left all 0) with
        // NO margin, so the box is exactly the visible viewport on every
        // device. Centering is done with flexbox instead of
        // absolute+top:50%+transform, which also makes it safe even if
        // this page is ever wrapped by something that applies a CSS
        // `transform` (route transitions, Fade/Slide, etc.) — a case
        // where absolute/fixed positioning tricks can silently break.
        <Box
            sx={{
                position: "fixed",
                // Start below the navbar instead of at the very top of
                // the screen, and shrink the height by the same amount —
                // so this box only occupies the space actually visible
                // beneath the fixed navbar, and the card centers in THAT
                // space rather than the full (partly hidden) viewport.
                // --navbar-height is published by the Navbar component
                // via useNavbarHeightVar(); the 88px fallback matches
                // your current navbar so it still looks right even
                // before that variable is wired up.
                top: "var(--navbar-height, 88px)",
                left: 0,
                right: 0,
                bottom: 0,
                width: "100vw",
                height: "calc(100dvh - var(--navbar-height, 88px))",
                boxSizing: "border-box",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #0a192f, #112240, #1a365d)",
                overflow: "hidden",
                p: { xs: 1.5, sm: 2 },
            }}
        >
            <Paper
                elevation={0}
                sx={{
                    width: "100%",
                    maxWidth: {
                        xs: "100%",
                        sm: 420,
                        md: 450
                    },
                    // Card is capped to whatever space is left inside the
                    // padded viewport, so it can never push past the
                    // screen edge — it shrinks/scrolls internally instead.
                    maxHeight: "100%",
                    overflowY: "auto",
                    overflowX: "hidden",
                    borderRadius: {
                        xs: 2,
                        sm: 4,
                        md: 6
                    },
                    bgcolor: "#fff",
                    border: "1px solid rgba(0,0,0,0.08)",
                    boxShadow: {
                        xs: "0 10px 40px rgba(0,0,0,0.15)",
                        sm: "0 20px 60px rgba(0,0,0,0.15)"
                    },
                    "&::-webkit-scrollbar": {
                        width: "4px",
                    },
                    "&::-webkit-scrollbar-thumb": {
                        backgroundColor: "#1565C0",
                        borderRadius: "10px",
                    },
                }}
            >
                {/* Header */}
                <Box
                    sx={{
                        background: "linear-gradient(135deg, #0D47A1 0%, #1565C0 50%, #1976D2 100%)",
                        color: "#fff",
                        textAlign: "center",
                        px: { xs: 1.5, sm: 3, md: 4 },
                        py: { xs: 1.5, sm: 2.5, md: 3 },
                        position: "relative",
                        overflow: "hidden",
                    }}
                >
                    {/* Decorative Circles */}
                    <Box
                        sx={{
                            position: "absolute",
                            top: { xs: -20, sm: -40, md: -50 },
                            right: { xs: -20, sm: -40, md: -50 },
                            width: { xs: 80, sm: 120, md: 140 },
                            height: { xs: 80, sm: 120, md: 140 },
                            borderRadius: "50%",
                            bgcolor: "rgba(255,255,255,0.08)",
                        }}
                    />
                    <Box
                        sx={{
                            position: "absolute",
                            bottom: { xs: -15, sm: -30, md: -40 },
                            left: { xs: -15, sm: -30, md: -40 },
                            width: { xs: 60, sm: 80, md: 100 },
                            height: { xs: 60, sm: 80, md: 100 },
                            borderRadius: "50%",
                            bgcolor: "rgba(255,255,255,0.08)",
                        }}
                    />

                    <Box
                        component="img"
                        src="/collegelogo.jpeg"
                        alt="College Logo"
                        sx={{
                            width: { xs: 44, sm: 58, md: 70 },
                            height: { xs: 44, sm: 58, md: 70 },
                            borderRadius: "50%",
                            bgcolor: "#fff",
                            p: 1,
                            objectFit: "cover",
                            border: "3px solid rgba(255,255,255,0.4)",
                            boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
                            mb: { xs: 0.5, sm: 1, md: 1 },
                            position: "relative",
                            zIndex: 1,
                        }}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%231565C0'/%3E%3Ctext x='50' y='50' font-family='Arial' font-size='30' fill='white' text-anchor='middle' dominant-baseline='central'%3EGASC%3C/text%3E%3C/svg%3E";
                        }}
                    />

                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 700,
                            position: "relative",
                            zIndex: 1,
                            fontSize: {
                                xs: "0.75rem",
                                sm: "1rem",
                                md: "1.15rem"
                            },
                            lineHeight: 1.3,
                            px: { xs: 0.5, sm: 1 }
                        }}
                    >
                        Government Arts and Science College
                    </Typography>

                    <Typography
                        sx={{
                            color: "#FFE082",
                            mt: 0.5,
                            letterSpacing: 1,
                            fontWeight: 500,
                            position: "relative",
                            zIndex: 1,
                            fontSize: {
                                xs: "0.65rem",
                                sm: "0.75rem",
                                md: "0.875rem"
                            },
                        }}
                    >
                        Nannilam – 610105
                    </Typography>
                </Box>

                {/* Form */}
                <Box
                    component="form"
                    onSubmit={handleLogin}
                    sx={{
                        p: { xs: 2, sm: 2.5, md: 3 },
                    }}
                >
                    <TextField
                        fullWidth
                        label="Username"
                        name="username"
                        value={loginData.username}
                        onChange={handleChange}
                        margin="dense"
                        required
                        error={errors.username}
                        helperText={errors.username ? "Username is required" : ""}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Person color="primary" sx={{ fontSize: { xs: 20, sm: 24 } }} />
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                borderRadius: { xs: 2, sm: 3 },
                                bgcolor: "#F8FAFC",
                                fontSize: { xs: "0.875rem", sm: "1rem" },
                                "& input": {
                                    padding: { xs: "12px 14px", sm: "14px 14px" }
                                }
                            },
                            "& .MuiInputLabel-root": {
                                fontSize: { xs: "0.875rem", sm: "1rem" },
                            },
                            "& .MuiFormHelperText-root": {
                                fontSize: { xs: "0.75rem", sm: "0.875rem" },
                                marginLeft: 0
                            },
                            "& .MuiFormLabel-root": {
                                fontSize: { xs: "0.875rem", sm: "1rem" }
                            },
                            "& .MuiInputBase-root": {
                                minHeight: { xs: 44, sm: 50 }
                            },
                            marginTop: { xs: 1, sm: 1 }
                        }}
                    />

                    <Box sx={{ position: 'relative', width: '100%', mt: { xs: 1, sm: 1 } }}>
                        <TextField
                            fullWidth
                            margin="dense"
                            required
                            label="Password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            value={loginData.password}
                            onChange={handleChange}
                            error={errors.password}
                            helperText={errors.password ? "Password is required" : ""}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: { xs: 2, sm: 3 },
                                    bgcolor: "#F8FAFC",
                                    fontSize: { xs: "0.875rem", sm: "1rem" },
                                    paddingRight: '50px !important',
                                    "& input": {
                                        padding: { xs: "12px 14px", sm: "14px 14px" }
                                    }
                                },
                                "& .MuiInputLabel-root": {
                                    fontSize: { xs: "0.875rem", sm: "1rem" },
                                },
                                "& .MuiFormHelperText-root": {
                                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                                    marginLeft: 0
                                },
                                "& .MuiFormLabel-root": {
                                    fontSize: { xs: "0.875rem", sm: "1rem" }
                                },
                                "& .MuiInputBase-root": {
                                    minHeight: { xs: 44, sm: 50 }
                                },
                                marginTop: 0
                            }}
                        />
                        <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => setShowPassword((prev) => !prev)}
                            sx={{
                                position: 'absolute',
                                right: { xs: '8px', sm: '12px' },
                                top: '50%',
                                transform: 'translateY(-50%)',
                                zIndex: 1,
                                color: '#1565C0',
                                padding: { xs: '6px', sm: '8px' },
                            }}
                            size={isMobile ? "small" : "medium"}
                        >
                            {showPassword ? <VisibilityOff sx={{ fontSize: { xs: 20, sm: 24 } }} /> : <Visibility sx={{ fontSize: { xs: 20, sm: 24 } }} />}
                        </IconButton>
                    </Box>

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            width: "100%",
                            mt: { xs: 0.5, sm: 1 },
                            mb: { xs: 0.5, sm: 0.5 },
                        }}
                    >
                        <Typography
                            variant="body2"
                            onClick={() => navigate("/Forgotpassword")}
                            sx={{
                                color: "#1565C0",
                                cursor: "pointer",
                                fontWeight: 600,
                                textAlign: "right",
                                fontSize: { xs: "0.75rem", sm: "0.875rem" },
                                "&:hover": {
                                    textDecoration: "underline",
                                },
                                padding: { xs: '4px 0', sm: '4px 0' }
                            }}
                        >
                            Forgot Password?
                        </Typography>
                    </Box>

                    <Button
                        fullWidth
                        variant="contained"
                        size={isMobile ? "medium" : "large"}
                        type="submit"
                        disabled={loading}
                        sx={{
                            mt: { xs: 1, sm: 1.5, md: 2 },
                            py: { xs: 1.1, sm: 1.2, md: 1.4 },
                            borderRadius: { xs: 2, sm: 3 },
                            fontWeight: 700,
                            fontSize: {
                                xs: "0.875rem",
                                sm: "0.9375rem",
                                md: "1rem"
                            },
                            textTransform: "none",
                            background: "linear-gradient(90deg,#1565C0,#0D47A1)",
                            boxShadow: "0 10px 25px rgba(21,101,192,0.35)",
                            "&:hover": {
                                background: "linear-gradient(90deg,#0D47A1,#1565C0)",
                                boxShadow: "0 15px 30px rgba(21,101,192,0.45)",
                            },
                            "&:disabled": {
                                background: "#90CAF9",
                            },
                            minHeight: { xs: 42, sm: 48 },
                            letterSpacing: { xs: 0.5, sm: 0.7 }
                        }}
                    >
                        {loading ? (
                            <CircularProgress
                                size={isMobile ? 20 : 24}
                                sx={{ color: "#fff" }}
                            />
                        ) : (
                            "Sign In"
                        )}
                    </Button>
                </Box>
            </Paper>

            {/* Toast Container */}
            <ToastContainer
                position={isMobile ? "top-center" : "bottom-right"}
                autoClose={4000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                style={{
                    zIndex: 9999,
                    width: isMobile ? '100%' : 'auto',
                    padding: isMobile ? '0 16px' : 0,
                }}
                toastStyle={{
                    borderRadius: isMobile ? '12px' : '8px',
                }}
            />
        </Box>
    );
};

export default Login;