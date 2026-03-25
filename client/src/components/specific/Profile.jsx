import React, { useEffect, useRef, useState } from "react";
import {
  Avatar,
  Stack,
  Typography,
  IconButton,
  Box,
  CircularProgress,
  TextField,
  MenuItem,
  Button,
} from "@mui/material";
import {
  Face as FaceIcon,
  AlternateEmail as UserNameIcon,
  CalendarMonth as CalendarIcon,
  PhotoCamera as PhotoCameraIcon,
} from "@mui/icons-material";
import moment from "moment";
import axios from "axios";
import toast from "react-hot-toast";
import { transformImage } from "../../lib/features";
import { server } from "../../constants/config";
import { getSocket } from "../../socket";
import { USER_SET_STATUS } from "../../constants/events";
import { usernameValidator } from "../../utils/validators";

const Profile = ({ user, isPopup = false, onProfileUpdate }) => {
  const socket = getSocket();
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isSavingStatus, setIsSavingStatus] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [statusState, setStatusState] = useState(user?.status?.state || "online");
  const [statusText, setStatusText] = useState(user?.status?.text || "");
  const [username, setUsername] = useState(user?.username || "");
  const [bio, setBio] = useState(user?.bio || "");
  const fileInputRef = useRef(null);
  const avatarSize = isPopup ? 96 : 200;

  useEffect(() => {
    setStatusState(user?.status?.state || "online");
    setStatusText(user?.status?.text || "");
    setUsername(user?.username || "");
    setBio(user?.bio || "");
  }, [user?.status?.state, user?.status?.text, user?.username, user?.bio]);

  const usernameValidation = usernameValidator(username);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    try {
      setIsUploadingAvatar(true);
      const formData = new FormData();
      formData.append("avatar", file);

      const config = {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      const { data } = await axios.put(
        `${server}/api/v1/user/profile/avatar`,
        formData,
        config
      );

      toast.success("Profile image updated successfully!");

      // Update avatar display
      if (onProfileUpdate) {
        onProfileUpdate(data.user);
      }

      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update profile image");
      console.error("Avatar upload error:", error);
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleSaveStatus = async () => {
    try {
      setIsSavingStatus(true);

      const { data } = await axios.put(
        `${server}/api/v1/user/status`,
        { state: statusState, text: statusText },
        { withCredentials: true }
      );

      socket.emit(USER_SET_STATUS, {
        status: statusState,
        statusText,
      });

      if (onProfileUpdate) onProfileUpdate(data.user);

      toast.success("Status updated");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update status");
    } finally {
      setIsSavingStatus(false);
    }
  };

  const handleSaveProfile = async () => {
    if (usernameValidation?.isValid === false) {
      toast.error(usernameValidation.errorMessage);
      return;
    }

    try {
      setIsSavingProfile(true);

      const { data } = await axios.put(
        `${server}/api/v1/user/profile`,
        {
          username: username.trim().toLowerCase(),
          bio: bio.trim(),
        },
        { withCredentials: true }
      );

      if (onProfileUpdate) onProfileUpdate(data.user);

      toast.success("Profile updated");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update profile");
    } finally {
      setIsSavingProfile(false);
    }
  };

  return (
    <Stack
      spacing={isPopup ? "1rem" : "2rem"}
      direction={"column"}
      alignItems={"center"}
      sx={{
        p: isPopup ? "1.5rem 1rem" : "2rem",
        borderRadius: "1rem",
      }}
    >
      <Box sx={{ position: "relative", display: "inline-block" }}>
        <Avatar
          src={transformImage(user?.avatar?.url)}
          sx={{
            width: avatarSize,
            height: avatarSize,
            objectFit: "contain",
            border: "5px solid rgba(124, 58, 237, 0.3)",
            boxShadow: "0 8px 32px rgba(124, 58, 237, 0.2)",
            transition: "all 0.3s ease",
            cursor: isPopup ? "pointer" : "default",
            "&:hover": isPopup
              ? {
                  boxShadow: "0 12px 40px rgba(124, 58, 237, 0.4)",
                  transform: "scale(1.05)",
                }
              : {},
          }}
          onClick={isPopup ? handleAvatarClick : undefined}
        />

        {isPopup && (
          <IconButton
            onClick={handleAvatarClick}
            disabled={isUploadingAvatar}
            sx={{
              position: "absolute",
              bottom: 0,
              right: 0,
              backgroundColor: "rgba(124, 58, 237, 0.8)",
              color: "white",
              border: "3px solid" + (isPopup ? "rgba(255, 255, 255, 0.2)" : "transparent"),
              width: avatarSize * 0.35,
              height: avatarSize * 0.35,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              "&:hover": {
                backgroundColor: "rgba(124, 58, 237, 1)",
              },
            }}
          >
            {isUploadingAvatar ? (
              <CircularProgress size={avatarSize * 0.2} sx={{ color: "white" }} />
            ) : (
              <PhotoCameraIcon sx={{ fontSize: avatarSize * 0.2 }} />
            )}
          </IconButton>
        )}

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleAvatarChange}
          style={{ display: "none" }}
        />
      </Box>

      <ProfileCard heading={"Bio"} text={user?.bio} isPopup={isPopup} />
      <ProfileCard
        heading={"Username"}
        text={user?.username}
        Icon={<UserNameIcon />}
        isPopup={isPopup}
      />
      <ProfileCard heading={"Name"} text={user?.name} Icon={<FaceIcon />} isPopup={isPopup} />
      <ProfileCard
        heading={"Joined"}
        text={moment(user?.createdAt).fromNow()}
        Icon={<CalendarIcon />}
        isPopup={isPopup}
      />

      {isPopup && (
        <Stack spacing={1} width={"100%"} sx={{ mt: 1 }}>
          <TextField
            label="Username"
            value={username}
            size="small"
            onChange={(e) => setUsername(e.target.value)}
            error={usernameValidation?.isValid === false}
            helperText={usernameValidation?.isValid === false ? usernameValidation.errorMessage : " "}
            sx={{
              "& .MuiOutlinedInput-root": {
                color: "white",
                "& fieldset": { borderColor: "rgba(124, 58, 237, 0.35)" },
              },
              "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.75)" },
            }}
          />

          <TextField
            value={bio}
            onChange={(e) => setBio(e.target.value.slice(0, 160))}
            label="Bio"
            size="small"
            multiline
            minRows={2}
            sx={{
              "& .MuiOutlinedInput-root": {
                color: "white",
                "& fieldset": { borderColor: "rgba(124, 58, 237, 0.35)" },
              },
              "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.75)" },
            }}
          />

          <Button
            variant="contained"
            onClick={handleSaveProfile}
            disabled={isSavingProfile || usernameValidation?.isValid === false}
            sx={{
              background: "linear-gradient(135deg, #06b6d4 0%, #7c3aed 100%)",
              textTransform: "none",
              fontWeight: 700,
            }}
          >
            {isSavingProfile ? "Saving profile..." : "Update profile"}
          </Button>

          <TextField
            select
            label="Presence"
            value={statusState}
            size="small"
            onChange={(e) => setStatusState(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                color: "white",
                "& fieldset": { borderColor: "rgba(124, 58, 237, 0.35)" },
              },
              "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.75)" },
            }}
          >
            <MenuItem value="online">Online</MenuItem>
            <MenuItem value="away">Away</MenuItem>
            <MenuItem value="dnd">Do Not Disturb</MenuItem>
            <MenuItem value="invisible">Invisible</MenuItem>
          </TextField>

          <TextField
            value={statusText}
            onChange={(e) => setStatusText(e.target.value.slice(0, 80))}
            label="Status message"
            size="small"
            placeholder="Available for collaboration"
            sx={{
              "& .MuiOutlinedInput-root": {
                color: "white",
                "& fieldset": { borderColor: "rgba(124, 58, 237, 0.35)" },
              },
              "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.75)" },
            }}
          />

          <Button
            variant="contained"
            onClick={handleSaveStatus}
            disabled={isSavingStatus}
            sx={{
              background: "linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%)",
              textTransform: "none",
              fontWeight: 700,
            }}
          >
            {isSavingStatus ? "Saving..." : "Update status"}
          </Button>
        </Stack>
      )}
    </Stack>
  );
};

const ProfileCard = ({ text, Icon, heading, isPopup = false }) => (
  <Stack
    direction={"row"}
    alignItems={"center"}
    spacing={isPopup ? "0.75rem" : "1rem"}
    color={"white"}
    textAlign={"center"}
    sx={{
      p: isPopup ? "0.5rem 0" : "0.75rem 0",
      transition: "all 0.3s ease",
      "&:hover": {
        transform: isPopup ? "translateX(4px)" : "none",
      },
    }}
  >
    {Icon && <Box sx={{ color: "rgba(124, 58, 237, 0.8)" }}>{Icon}</Box>}

    <Stack>
      <Typography
        variant={isPopup ? "body2" : "body1"}
        sx={{
          fontWeight: isPopup ? 500 : 600,
          letterSpacing: "0.3px",
        }}
      >
        {text}</Typography>
      <Typography color={"rgba(255, 255, 255, 0.6)"} variant="caption">
        {heading}
      </Typography>
    </Stack>
  </Stack>
);

export default Profile;