import {
  Avatar,
  AppBar,
  Backdrop,
  Badge,
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Menu,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { Suspense, lazy, useState } from "react";
import { accentGradient, accentPrimary } from "../../constants/color";
import {
  Add as AddIcon,
  Menu as MenuIcon,
  Search as SearchIcon,
  Group as GroupIcon,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../../constants/config";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { userNotExists, userExists } from "../../redux/reducers/auth";
import {
  setIsMobile,
  setIsNewGroup,
  setIsNotification,
  setIsSearch,
} from "../../redux/reducers/misc";
import { resetNotificationCount } from "../../redux/reducers/chat";
import Profile from "../specific/Profile";
import { transformImage } from "../../lib/features";

const SearchDialog = lazy(() => import("../specific/Search"));
const NotifcationDialog = lazy(() => import("../specific/Notifications"));
const NewGroupDialog = lazy(() => import("../specific/NewGroup"));

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const { isSearch, isNotification, isNewGroup } = useSelector(
    (state) => state.misc
  );
  const { notificationCount } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.auth);

  // Update local user when Redux user changes
  React.useEffect(() => {
    setCurrentUser(user);
  }, [user]);

  const isProfileMenuOpen = Boolean(profileAnchorEl);

  const handleMobile = () => dispatch(setIsMobile(true));

  const openSearch = () => dispatch(setIsSearch(true));

  const openNewGroup = () => {
    dispatch(setIsNewGroup(true));
  };

  const openNotification = () => {
    dispatch(setIsNotification(true));
    dispatch(resetNotificationCount());
  };

  const navigateToGroup = () => navigate("/groups");

  const openProfile = (event) => setProfileAnchorEl(event.currentTarget);

  const closeProfile = () => setProfileAnchorEl(null);

  const openAboutDialog = () => setIsAboutOpen(true);

  const closeAboutDialog = () => setIsAboutOpen(false);

  const handleProfileUpdate = (updatedUser) => {
    setCurrentUser(updatedUser);
    dispatch(userExists(updatedUser));
  };

  const logoutHandler = async () => {
    try {
      const { data } = await axios.get(`${server}/api/v1/user/logout`, {
        withCredentials: true,
      });
      dispatch(userNotExists());
      toast.success(data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }} height={"4rem"}>
        <AppBar
          position="static"
          sx={{
            background: accentGradient,
            boxShadow: "0 4px 20px rgba(124, 58, 237, 0.3)",
          }}
        >
          <Toolbar>
            <Box
              sx={{
                display: { xs: "none", sm: "flex" },
                alignItems: "center",
                gap: "0.5rem",
                cursor: "pointer",
                borderRadius: "0.65rem",
                padding: "0.25rem 0.45rem",
                transition: "all 0.25s ease",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.12)",
                },
              }}
              onClick={openAboutDialog}
            >
              <Box
                component="img"
                src="/connectly-logo.svg"
                alt="Connectly Logo"
                sx={{ width: 30, height: 30 }}
              />
              <Typography variant="h6">Connectly</Typography>
            </Box>

            <Box
              sx={{
                display: { xs: "block", sm: "none" },
              }}
            >
              <IconButton color="inherit" onClick={handleMobile}>
                <MenuIcon />
              </IconButton>
            </Box>
            <Box
              sx={{
                flexGrow: 1,
              }}
            />
            <Box>
              <IconBtn
                title={"Search"}
                icon={<SearchIcon />}
                onClick={openSearch}
              />

              <IconBtn
                title={"New Group"}
                icon={<AddIcon />}
                onClick={openNewGroup}
              />

              <IconBtn
                title={"Manage Groups"}
                icon={<GroupIcon />}
                onClick={navigateToGroup}
              />

              <IconBtn
                title={"Notifications"}
                icon={<NotificationsIcon />}
                onClick={openNotification}
                value={notificationCount}
              />

              <Tooltip title={"Profile"}>
                <IconButton color="inherit" size="large" onClick={openProfile}>
                  <Avatar
                    src={transformImage((currentUser || user)?.avatar?.url)}
                    alt={(currentUser || user)?.name || "Profile"}
                    sx={{
                      width: 32,
                      height: 32,
                      border: "2px solid rgba(255,255,255,0.8)",
                    }}
                  />
                </IconButton>
              </Tooltip>

              <IconBtn
                title={"Logout"}
                icon={<LogoutIcon />}
                onClick={logoutHandler}
              />
            </Box>
          </Toolbar>
        </AppBar>
      </Box>

      {isSearch && (
        <Suspense fallback={<Backdrop open />}>
          <SearchDialog />
        </Suspense>
      )}

      {isNotification && (
        <Suspense fallback={<Backdrop open />}>
          <NotifcationDialog />
        </Suspense>
      )}

      {isNewGroup && (
        <Suspense fallback={<Backdrop open />}>
          <NewGroupDialog />
        </Suspense>
      )}

      <Menu
        anchorEl={profileAnchorEl}
        open={isProfileMenuOpen}
        onClose={closeProfile}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 320,
            maxWidth: 360,
            maxHeight: "75vh",
            p: 2,
            backgroundColor: "#1a1a2e",
            border: "1px solid rgba(124, 58, 237, 0.25)",
            borderRadius: "1rem",
            overflowY: "auto",
            "&::-webkit-scrollbar": {
              width: "6px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "rgba(124, 58, 237, 0.35)",
              borderRadius: "4px",
            },
          },
        }}
      >
        <Profile user={currentUser || user} isPopup onProfileUpdate={handleProfileUpdate} />
      </Menu>

      <Dialog
        open={isAboutOpen}
        onClose={closeAboutDialog}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "1rem",
            backgroundColor: "#15162b",
            border: "1px solid rgba(124, 58, 237, 0.3)",
            color: "#e2e8f0",
          },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" fontWeight={700}>
            About The Developer
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: "0.25rem !important" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: "0.75rem", mb: 1.2 }}>
            <Avatar sx={{ bgcolor: "rgba(124, 58, 237, 0.25)", color: "#fff" }}>D</Avatar>
            <Box>
              <Typography variant="body1" fontWeight={700}>
                Devansh Rohilla
              </Typography>
              <Typography variant="caption" sx={{ color: "rgba(226, 232, 240, 0.7)" }}>
                Full Stack Developer
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ borderColor: "rgba(124, 58, 237, 0.25)", mb: 1.2 }} />

          <Typography variant="body2" sx={{ mb: 0.8 }}>
            Project: Connectly
          </Typography>
          <Typography variant="body2" sx={{ mb: 0.8 }}>
            Built with: React, Node.js, Express, MongoDB, Socket.IO
          </Typography>
          <Typography variant="body2" sx={{ mb: 0.8 }}>
            Focus: Real-time chat, clean UI, and smooth user experience
          </Typography>
          <Typography variant="body2">
            GitHub: github.com/devansh-rh
          </Typography>
        </DialogContent>
      </Dialog>
    </>
  );
};

const IconBtn = ({ title, icon, onClick, value }) => {
  return (
    <Tooltip title={title}>
      <IconButton color="inherit" size="large" onClick={onClick}>
        {value ? (
          <Badge badgeContent={value} color="error">
            {icon}
          </Badge>
        ) : (
          icon
        )}
      </IconButton>
    </Tooltip>
  );
};

export default Header;