import { useFileHandler, useInputValidation } from "6pp";
import { CameraAlt as CameraAltIcon } from "@mui/icons-material";
import {
  Avatar,
  Button,
  Container,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
  Box,
} from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { VisuallyHiddenInput } from "../components/styles/StyledComponents";
import {
  accentGradient,
  darkBg,
  accentPrimary,
  accentSecondary,
} from "../constants/color";
import { server } from "../constants/config";
import { userExists } from "../redux/reducers/auth";
import { usernameValidator } from "../utils/validators";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const toggleLogin = () => setIsLogin((prev) => !prev);

  const name = useInputValidation("");
  const bio = useInputValidation("");
  const username = useInputValidation("", usernameValidator);
  const password = useInputValidation("");

  const avatar = useFileHandler("single");

  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();

    const toastId = toast.loading("Logging In...");

    setIsLoading(true);
    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const { data } = await axios.post(
        `${server}/api/v1/user/login`,
        {
          username: username.value,
          password: password.value,
        },
        config
      );
      dispatch(userExists(data.user));
      toast.success(data.message, {
        id: toastId,
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something Went Wrong", {
        id: toastId,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    const toastId = toast.loading("Signing Up...");
    setIsLoading(true);

    const formData = new FormData();
    formData.append("avatar", avatar.file);
    formData.append("name", name.value);
    formData.append("bio", bio.value);
    formData.append("username", username.value);
    formData.append("password", password.value);

    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    try {
      const { data } = await axios.post(
        `${server}/api/v1/user/new`,
        formData,
        config
      );

      dispatch(userExists(data.user));
      toast.success(data.message, {
        id: toastId,
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something Went Wrong", {
        id: toastId,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        background: `linear-gradient(135deg, ${darkBg} 0%, #1a1a2e 50%, #282c34 100%)`,
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          width: "500px",
          height: "500px",
          background: `radial-gradient(circle, rgba(124, 58, 237, 0.1) 0%, transparent 70%)`,
          borderRadius: "50%",
          top: "-100px",
          left: "-100px",
          pointerEvents: "none",
        },
        "&::after": {
          content: '""',
          position: "absolute",
          width: "500px",
          height: "500px",
          background: `radial-gradient(circle, rgba(6, 182, 212, 0.1) 0%, transparent 70%)`,
          borderRadius: "50%",
          bottom: "-100px",
          right: "-100px",
          pointerEvents: "none",
        },
      }}
    >
      <Container
        component={"main"}
        maxWidth="xs"
        sx={{
          position: "relative",
          zIndex: 1,
        }}
      >
        <Paper
          elevation={10}
          sx={{
            padding: "1.5rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            background: "rgba(26, 26, 46, 0.8)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(124, 58, 237, 0.2)",
            borderRadius: "1.5rem",
            transition: "all 0.3s ease",
            maxHeight: "95vh",
            overflowY: "auto",
            "&:hover": {
              border: "1px solid rgba(124, 58, 237, 0.4)",
              boxShadow: "0 8px 32px rgba(124, 58, 237, 0.15)",
            },
            "&::-webkit-scrollbar": {
              width: "6px",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "transparent",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "rgba(124, 58, 237, 0.3)",
              borderRadius: "3px",
            },
          }}
        >
          <Typography
            variant="h5"
            sx={{
              background: accentGradient,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              fontWeight: 700,
              marginBottom: "0.75rem",
            }}
          >
            Connectly
          </Typography>

          {isLogin ? (
            <>
              <Typography
                variant="body2"
                sx={{ color: "#e2e8f0", fontWeight: 600, marginBottom: "0.25rem" }}
              >
                Welcome Back
              </Typography>
              <form
                style={{
                  width: "100%",
                  marginTop: "0.5rem",
                }}
                onSubmit={handleLogin}
              >
                <TextField
                  required
                  fullWidth
                  label="Username"
                  margin="dense"
                  variant="outlined"
                  size="small"
                  value={username.value}
                  onChange={username.changeHandler}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      color: "#e2e8f0",
                      "& fieldset": {
                        borderColor: "rgba(124, 58, 237, 0.3)",
                      },
                      "&:hover fieldset": {
                        borderColor: "rgba(124, 58, 237, 0.5)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: accentPrimary,
                        boxShadow: `0 0 0 3px rgba(124, 58, 237, 0.1)`,
                      },
                    },
                    "& .MuiInputBase-input::placeholder": {
                      color: "rgba(226, 232, 240, 0.5)",
                      opacity: 1,
                    },
                    "& .MuiInputLabel-root": {
                      color: "rgba(226, 232, 240, 0.7)",
                    },
                  }}
                />

                <TextField
                  required
                  fullWidth
                  label="Password"
                  type="password"
                  margin="dense"
                  variant="outlined"
                  size="small"
                  value={password.value}
                  onChange={password.changeHandler}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      color: "#e2e8f0",
                      "& fieldset": {
                        borderColor: "rgba(124, 58, 237, 0.3)",
                      },
                      "&:hover fieldset": {
                        borderColor: "rgba(124, 58, 237, 0.5)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: accentPrimary,
                        boxShadow: `0 0 0 3px rgba(124, 58, 237, 0.1)`,
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "rgba(226, 232, 240, 0.7)",
                    },
                  }}
                />

                <Button
                  sx={{
                    marginTop: "0.75rem",
                    background: accentGradient,
                    color: "white",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    padding: "0.5rem",
                    transition: "all 0.3s ease",
                    boxShadow: "0 4px 15px rgba(124, 58, 237, 0.3)",
                    "&:hover": {
                      boxShadow: "0 6px 25px rgba(124, 58, 237, 0.5)",
                      transform: "translateY(-2px)",
                    },
                  }}
                  variant="contained"
                  type="submit"
                  fullWidth
                  disabled={isLoading}
                >
                  {isLoading ? "Logging In..." : "Login"}
                </Button>

                <Typography
                  textAlign={"center"}
                  m={"0.5rem 0"}
                  sx={{ color: "rgba(226, 232, 240, 0.5)", fontSize: "0.875rem" }}
                >
                  OR
                </Typography>

                <Button
                  disabled={isLoading}
                  fullWidth
                  variant="outlined"
                  size="small"
                  onClick={toggleLogin}
                  sx={{
                    color: accentSecondary,
                    borderColor: accentSecondary,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      borderColor: accentPrimary,
                      color: accentPrimary,
                      backgroundColor: "rgba(124, 58, 237, 0.1)",
                    },
                  }}
                >
                  Sign Up Instead
                </Button>
              </form>
            </>
          ) : (
            <>
              <Typography
                variant="body1"
                sx={{ color: "#e2e8f0", fontWeight: 600, marginBottom: "0.5rem" }}
              >
                Create Account
              </Typography>
              <form
                style={{
                  width: "100%",
                  marginTop: "0.5rem",
                }}
                onSubmit={handleSignUp}
              >
                <Stack position={"relative"} width={"6.5rem"} margin={"0 auto 0.5rem"}>
                  <Avatar
                    sx={{
                      width: "6.5rem",
                      height: "6.5rem",
                      objectFit: "contain",
                      border: "3px solid rgba(124, 58, 237, 0.3)",
                    }}
                    src={avatar.preview}
                  />

                  <IconButton
                    sx={{
                      position: "absolute",
                      bottom: "0",
                      right: "0",
                      color: "white",
                      background: accentGradient,
                      transition: "all 0.3s ease",
                      ":hover": {
                        boxShadow: "0 4px 15px rgba(124, 58, 237, 0.4)",
                        transform: "scale(1.05)",
                      },
                    }}
                    component="label"
                  >
                    <>
                      <CameraAltIcon />
                      <VisuallyHiddenInput
                        type="file"
                        onChange={avatar.changeHandler}
                      />
                    </>
                  </IconButton>
                </Stack>

                {avatar.error && (
                  <Typography
                    m={"0.25rem auto 0.5rem"}
                    width={"fit-content"}
                    display={"block"}
                    color="error"
                    variant="caption"
                  >
                    {avatar.error}
                  </Typography>
                )}

                <TextField
                  required
                  fullWidth
                  label="Name"
                  margin="dense"
                  size="small"
                  variant="outlined"
                  value={name.value}
                  onChange={name.changeHandler}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      color: "#e2e8f0",
                      "& fieldset": {
                        borderColor: "rgba(124, 58, 237, 0.3)",
                      },
                      "&:hover fieldset": {
                        borderColor: "rgba(124, 58, 237, 0.5)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: accentPrimary,
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "rgba(226, 232, 240, 0.7)",
                    },
                  }}
                />

                <TextField
                  required
                  fullWidth
                  label="Bio"
                  margin="dense"
                  size="small"
                  variant="outlined"
                  value={bio.value}
                  onChange={bio.changeHandler}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      color: "#e2e8f0",
                      "& fieldset": {
                        borderColor: "rgba(124, 58, 237, 0.3)",
                      },
                      "&:hover fieldset": {
                        borderColor: "rgba(124, 58, 237, 0.5)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: accentPrimary,
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "rgba(226, 232, 240, 0.7)",
                    },
                  }}
                />
                <TextField
                  required
                  fullWidth
                  label="Username"
                  margin="dense"
                  variant="outlined"
                  size="small"
                  value={username.value}
                  onChange={username.changeHandler}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      color: "#e2e8f0",
                      "& fieldset": {
                        borderColor: "rgba(124, 58, 237, 0.3)",
                      },
                      "&:hover fieldset": {
                        borderColor: "rgba(124, 58, 237, 0.5)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: accentPrimary,
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "rgba(226, 232, 240, 0.7)",
                    },
                  }}
                />

                {username.error && (
                  <Typography color="error" variant="caption">
                    {username.error}
                  </Typography>
                )}

                <TextField
                  required
                  fullWidth
                  label="Password"
                  type="password"
                  margin="dense"
                  variant="outlined"
                  size="small"
                  value={password.value}
                  onChange={password.changeHandler}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      color: "#e2e8f0",
                      "& fieldset": {
                        borderColor: "rgba(124, 58, 237, 0.3)",
                      },
                      "&:hover fieldset": {
                        borderColor: "rgba(124, 58, 237, 0.5)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: accentPrimary,
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "rgba(226, 232, 240, 0.7)",
                    },
                  }}
                />

                <Button
                  sx={{
                    marginTop: "0.75rem",
                    background: accentGradient,
                    color: "white",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    padding: "0.5rem",
                    transition: "all 0.3s ease",
                    boxShadow: "0 4px 15px rgba(124, 58, 237, 0.3)",
                    "&:hover": {
                      boxShadow: "0 6px 25px rgba(124, 58, 237, 0.5)",
                      transform: "translateY(-2px)",
                    },
                  }}
                  variant="contained"
                  type="submit"
                  fullWidth
                  disabled={isLoading}
                >
                  {isLoading ? "Signing Up..." : "Sign Up"}
                </Button>

                <Typography
                  textAlign={"center"}
                  m={"0.5rem 0"}
                  sx={{ color: "rgba(226, 232, 240, 0.5)", fontSize: "0.875rem" }}
                >
                  OR
                </Typography>

                <Button
                  disabled={isLoading}
                  fullWidth
                  variant="outlined"
                  size="small"
                  onClick={toggleLogin}
                  sx={{
                    color: accentSecondary,
                    borderColor: accentSecondary,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      borderColor: accentPrimary,
                      color: accentPrimary,
                      backgroundColor: "rgba(124, 58, 237, 0.1)",
                    },
                  }}
                >
                  Login Instead
                </Button>
              </form>
            </>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;