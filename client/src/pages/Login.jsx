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
            padding: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            background: "rgba(26, 26, 46, 0.8)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(124, 58, 237, 0.2)",
            borderRadius: "1.5rem",
            transition: "all 0.3s ease",
            "&:hover": {
              border: "1px solid rgba(124, 58, 237, 0.4)",
              boxShadow: "0 8px 32px rgba(124, 58, 237, 0.15)",
            },
          }}
        >
          <Typography
            variant="h4"
            sx={{
              background: accentGradient,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              fontWeight: 700,
              marginBottom: "2rem",
            }}
          >
            Connectly
          </Typography>

          {isLogin ? (
            <>
              <Typography
                variant="h5"
                sx={{ color: "#e2e8f0", fontWeight: 600, marginBottom: "1rem" }}
              >
                Welcome Back
              </Typography>
              <form
                style={{
                  width: "100%",
                  marginTop: "1rem",
                }}
                onSubmit={handleLogin}
              >
                <TextField
                  required
                  fullWidth
                  label="Username"
                  margin="normal"
                  variant="outlined"
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
                  margin="normal"
                  variant="outlined"
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
                    marginTop: "1.5rem",
                    background: accentGradient,
                    color: "white",
                    fontWeight: 600,
                    fontSize: "1rem",
                    padding: "0.75rem",
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
                  m={"1.5rem"}
                  sx={{ color: "rgba(226, 232, 240, 0.5)" }}
                >
                  OR
                </Typography>

                <Button
                  disabled={isLoading}
                  fullWidth
                  variant="outlined"
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
                variant="h5"
                sx={{ color: "#e2e8f0", fontWeight: 600, marginBottom: "1rem" }}
              >
                Create Account
              </Typography>
              <form
                style={{
                  width: "100%",
                  marginTop: "1rem",
                }}
                onSubmit={handleSignUp}
              >
                <Stack position={"relative"} width={"10rem"} margin={"auto"}>
                  <Avatar
                    sx={{
                      width: "10rem",
                      height: "10rem",
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
                    m={"1rem auto"}
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
                  margin="normal"
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
                  margin="normal"
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
                  margin="normal"
                  variant="outlined"
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
                  margin="normal"
                  variant="outlined"
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
                    marginTop: "1.5rem",
                    background: accentGradient,
                    color: "white",
                    fontWeight: 600,
                    fontSize: "1rem",
                    padding: "0.75rem",
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
                  m={"1.5rem"}
                  sx={{ color: "rgba(226, 232, 240, 0.5)" }}
                >
                  OR
                </Typography>

                <Button
                  disabled={isLoading}
                  fullWidth
                  variant="outlined"
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