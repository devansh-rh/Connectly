import React, { memo } from "react";
import { Link } from "../styles/StyledComponents";
import { Box, Stack, Typography } from "@mui/material";
import AvatarCard from "./AvatarCard";
import { motion } from "framer-motion";
import moment from "moment";

const ChatItem = ({
  avatar = [],
  name,
  username,
  _id,
  groupChat = false,
  sameSender,
  isOnline,
  newMessageAlert,
  index = 0,
  handleDeleteChat,
  directMeta = null,
}) => {
  const statusLabel = isOnline
    ? "Online"
    : directMeta?.status?.text ||
      (directMeta?.lastSeen
        ? `Last seen ${moment(directMeta.lastSeen).fromNow()}`
        : "Offline");

  return (
    <Link
      sx={{
        padding: "0",
      }}
      to={`/chat/${_id}`}
      onContextMenu={(e) => handleDeleteChat(e, _id, groupChat)}
    >
      <motion.div
        initial={{ opacity: 0, y: "-100%" }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 * index }}
        style={{
          display: "flex",
          gap: "1rem",
          alignItems: "center",
          backgroundColor: sameSender ? "black" : "unset",
          color: sameSender ? "white" : "unset",
          position: "relative",
          padding: "1rem",
        }}
      >
        <AvatarCard avatar={avatar} />

        <Stack>
          <Typography>{name}</Typography>
          {!groupChat && username && (
            <Typography variant="caption" sx={{ opacity: 0.85, color: "#67e8f9" }}>
              {username.startsWith("@") ? username : `@${username}`}
            </Typography>
          )}
          {!groupChat && (
            <Typography variant="caption" sx={{ opacity: 0.75 }}>
              {statusLabel}
            </Typography>
          )}
          {newMessageAlert && (
            <Typography>{newMessageAlert.count} New Message</Typography>
          )}
        </Stack>

        {isOnline && (
          <Box
            sx={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: "green",
              position: "absolute",
              top: "50%",
              right: "1rem",
              transform: "translateY(-50%)",
            }}
          />
        )}
      </motion.div>
    </Link>
  );
};

export default memo(ChatItem);