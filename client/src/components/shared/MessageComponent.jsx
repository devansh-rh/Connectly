import {
  Box,
  Typography,
  Tooltip,
  Stack,
  Chip,
  IconButton,
  Popover,
} from "@mui/material";
import React, { memo, useMemo, useState } from "react";
import {
  accentPrimary,
  accentSecondary,
  messageOther,
  messageSelfText,
  messageOtherText,
} from "../../constants/color";
import moment from "moment";
import { fileFormat } from "../../lib/features";
import RenderAttachment from "./RenderAttachment";
import { motion } from "framer-motion";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import DoneIcon from "@mui/icons-material/Done";
import ReplyIcon from "@mui/icons-material/Reply";
import AddReactionIcon from "@mui/icons-material/AddReaction";

const emojiSplitRegex = /([\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}])/gu;
const emojiTestRegex = /^[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]$/u;

const renderContentWithLargerEmojis = (text) => {
  const parts = text.split(emojiSplitRegex).filter(Boolean);

  return parts.map((part, index) => {
    if (emojiTestRegex.test(part)) {
      return (
        <span
          key={`emoji-${index}`}
          style={{
            fontSize: "2.4em",
            lineHeight: 1,
            verticalAlign: "-0.12em",
          }}
        >
          {part}
        </span>
      );
    }

    return <React.Fragment key={`text-${index}`}>{part}</React.Fragment>;
  });
};

const MessageComponent = ({
  message,
  user,
  onReply,
  onReact,
  isDirectChat = false,
  otherMemberName = "",
}) => {
  const [reactionAnchorEl, setReactionAnchorEl] = useState(null);

  const {
    _id,
    sender,
    content,
    attachments = [],
    createdAt,
    replyTo,
    reactions = [],
    seenBy = [],
    linkPreview,
    isPending = false,
  } = message;

  const sameSender = sender?._id === user?._id;
  const sentTime = moment(createdAt).format("DD MMM YYYY, hh:mm:ss A");

  const reactionMap = reactions.reduce((acc, reaction) => {
    const key = reaction.emoji;
    if (!acc[key]) {
      acc[key] = { count: 0, isMine: false };
    }

    acc[key].count += 1;
    if (reaction.user?.toString?.() === user?._id || reaction.user?._id === user?._id) {
      acc[key].isMine = true;
    }

    return acc;
  }, {});

  const reactionEntries = Object.entries(reactionMap);
  const seenByOthers = seenBy.filter(
    (entry) => (entry.user?._id || entry.user)?.toString() !== user?._id?.toString()
  );

  const latestSeenEntry = useMemo(() => {
    return [...seenByOthers]
      .filter((entry) => entry?.seenAt)
      .sort((a, b) => new Date(b.seenAt).getTime() - new Date(a.seenAt).getTime())[0];
  }, [seenByOthers]);

  const seenByName =
    latestSeenEntry?.user?.name ||
    (isDirectChat && otherMemberName ? otherMemberName : `${seenByOthers.length} users`);

  const tickMeta = (() => {
    if (!sameSender) return null;

    if (isPending) {
      return {
        icon: <DoneIcon sx={{ fontSize: "0.9rem", opacity: 0.7 }} />,
        title: "Sent",
      };
    }

    if (seenByOthers.length > 0) {
      return {
        icon: <DoneAllIcon sx={{ fontSize: "0.9rem", opacity: 0.9, color: "#00a8ff" }} />,
        title: "Read",
      };
    }

    return {
      icon: <DoneAllIcon sx={{ fontSize: "0.9rem", opacity: 0.7 }} />,
      title: "Delivered",
    };
  })();

  const reactionPickerOpen = Boolean(reactionAnchorEl);
  const reactionPickerEmojis = ["👍", "❤️", "🔥", "😂", "😮", "👏", "🎉", "😢"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        alignSelf: sameSender ? "flex-end" : "flex-start",
        marginBottom: "0.5rem",
        maxWidth: "70%",
      }}
    >
      {!sameSender && (
        <Typography
          color={accentSecondary}
          fontWeight="700"
          variant="caption"
          sx={{
            display: "block",
            marginBottom: "0.25rem",
            marginLeft: "0.5rem",
          }}
        >
          {sender?.name}
        </Typography>
      )}

      <Box
        sx={{
          background: sameSender
            ? `linear-gradient(135deg, ${accentPrimary} 0%, rgb(139, 92, 246) 100%)`
            : messageOther,
          color: sameSender ? messageSelfText : messageOtherText,
          borderRadius: sameSender
            ? "1.25rem 1.25rem 0.5rem 1.25rem"
            : "1.25rem 1.25rem 1.25rem 0.5rem",
          padding: "0.75rem 1rem",
          wordWrap: "break-word",
          boxShadow: sameSender
            ? "0 4px 12px rgba(124, 58, 237, 0.3)"
            : "0 2px 8px rgba(0, 0, 0, 0.2)",
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: sameSender
              ? "0 6px 16px rgba(124, 58, 237, 0.5)"
              : "0 4px 12px rgba(0, 0, 0, 0.3)",
          },
        }}
      >
        {replyTo && (
          <Box
            sx={{
              mb: content ? 0.75 : 0,
              p: "0.45rem 0.6rem",
              borderLeft: "3px solid rgba(6, 182, 212, 0.9)",
              borderRadius: "0.45rem",
              backgroundColor: "rgba(6, 182, 212, 0.12)",
            }}
          >
            <Typography variant="caption" sx={{ fontWeight: 700, opacity: 0.9 }}>
              Replying to {replyTo?.sender?.name || "message"}
            </Typography>
            <Typography variant="caption" sx={{ display: "block", opacity: 0.85 }}>
              {(replyTo?.content || "Attachment").slice(0, 80)}
            </Typography>
          </Box>
        )}

        {content && (
          <Typography
            variant="body2"
            sx={{
              margin: 0,
              lineHeight: "1.5",
              wordBreak: "break-word",
            }}
          >
            {renderContentWithLargerEmojis(content)}
          </Typography>
        )}

        {linkPreview?.url && (
          <a
            href={linkPreview.url}
            target="_blank"
            rel="noreferrer"
            style={{ color: "inherit", textDecoration: "none" }}
          >
            <Box
              sx={{
                mt: content ? "0.6rem" : 0,
                p: 0,
                border: "1px solid rgba(6, 182, 212, 0.35)",
                borderRadius: "0.7rem",
                backgroundColor: "rgba(6, 182, 212, 0.1)",
                overflow: "hidden",
              }}
            >
              {linkPreview.image && (
                <Box
                  component="img"
                  src={linkPreview.image}
                  alt={linkPreview.title || "Link preview"}
                  sx={{
                    width: "100%",
                    height: 140,
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              )}

              <Box sx={{ p: "0.6rem 0.75rem" }}>
                <Typography variant="caption" sx={{ opacity: 0.7 }}>
                  {linkPreview.siteName || "Link"}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  {linkPreview.title || linkPreview.url}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.85 }}>
                  {linkPreview.description || linkPreview.url}
                </Typography>
              </Box>
            </Box>
          </a>
        )}

        {attachments.length > 0 &&
          attachments.map((attachment, index) => {
            const url = attachment.url;
            const file = fileFormat(url);

            return (
              <Box
                key={index}
                sx={{
                  marginTop: content ? "0.5rem" : 0,
                }}
              >
                <a
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  download
                  style={{
                    color: "inherit",
                    textDecoration: "none",
                  }}
                >
                  {RenderAttachment(file, url)}
                </a>
              </Box>
            );
          })}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: "0.25rem",
            marginTop: content || attachments.length > 0 ? "0.5rem" : 0,
          }}
        >
          <IconButton
            size="small"
            onClick={() => onReply?.(message)}
            sx={{ color: "inherit", opacity: 0.75 }}
          >
            <ReplyIcon sx={{ fontSize: "0.95rem" }} />
          </IconButton>
          <Typography
            variant="caption"
            sx={{
              opacity: 0.7,
              fontSize: "0.75rem",
            }}
          >
            {sameSender ? `Sent: ${sentTime}` : `Received: ${sentTime}`}
          </Typography>
          {sameSender && tickMeta && <Tooltip title={tickMeta.title}>{tickMeta.icon}</Tooltip>}
        </Box>

        {sameSender && latestSeenEntry && (
          <Typography
            variant="caption"
            sx={{
              display: "block",
              textAlign: "right",
              opacity: 0.78,
              color: "#7dd3fc",
              fontSize: "0.72rem",
              mt: 0.1,
            }}
          >
            Read{isDirectChat && seenByName ? ` by ${seenByName}` : ""}: {moment(
              latestSeenEntry.seenAt
            ).format("DD MMM YYYY, hh:mm:ss A")}
          </Typography>
        )}
      </Box>

      <Stack direction="row" spacing={0.5} sx={{ mt: 0.4, ml: sameSender ? 0 : 0.5 }}>
        {reactionEntries.map(([emoji, meta]) => (
          <Chip
            key={emoji}
            size="small"
            label={`${emoji} ${meta.count}`}
            onClick={() => onReact?.(_id, emoji)}
            sx={{
              height: 22,
              backgroundColor: meta.isMine
                ? "rgba(124, 58, 237, 0.35)"
                : "rgba(255, 255, 255, 0.08)",
              color: "white",
              border: "1px solid rgba(124, 58, 237, 0.35)",
            }}
          />
        ))}

        <IconButton
          size="small"
          onClick={(e) => setReactionAnchorEl(e.currentTarget)}
          sx={{
            width: 24,
            height: 24,
            color: "rgba(226,232,240,0.9)",
            backgroundColor: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(124,58,237,0.35)",
          }}
        >
          <AddReactionIcon sx={{ fontSize: "0.95rem" }} />
        </IconButton>
      </Stack>

      <Popover
        open={reactionPickerOpen}
        anchorEl={reactionAnchorEl}
        onClose={() => setReactionAnchorEl(null)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        transformOrigin={{ vertical: "bottom", horizontal: "center" }}
        PaperProps={{
          sx: {
            p: 0.6,
            borderRadius: "0.8rem",
            backgroundColor: "#121327",
            border: "1px solid rgba(124, 58, 237, 0.35)",
          },
        }}
      >
        <Stack direction="row" spacing={0.35}>
          {reactionPickerEmojis.map((emoji) => (
            <IconButton
              key={`${_id}-${emoji}`}
              size="small"
              onClick={() => {
                onReact?.(_id, emoji);
                setReactionAnchorEl(null);
              }}
              sx={{
                borderRadius: "0.55rem",
                fontSize: "1.05rem",
                color: "white",
                "&:hover": {
                  backgroundColor: "rgba(124, 58, 237, 0.2)",
                },
              }}
            >
              {emoji}
            </IconButton>
          ))}
        </Stack>
      </Popover>
    </motion.div>
  );
};

export default memo(MessageComponent);
