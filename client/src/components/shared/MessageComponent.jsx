import { Box, Typography, Tooltip, Stack, Chip, IconButton } from "@mui/material";
import React, { memo } from "react";
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
import ReplyIcon from "@mui/icons-material/Reply";

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

const MessageComponent = ({ message, user, onReply, onReact }) => {
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
  } = message;

  const sameSender = sender?._id === user?._id;

  const timeAgo = moment(createdAt).fromNow();

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
          borderRadius: sameSender ? "1.25rem 1.25rem 0.5rem 1.25rem" : "1.25rem 1.25rem 1.25rem 0.5rem",
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
                p: "0.6rem 0.75rem",
                border: "1px solid rgba(6, 182, 212, 0.35)",
                borderRadius: "0.7rem",
                backgroundColor: "rgba(6, 182, 212, 0.1)",
              }}
            >
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
            {timeAgo}
          </Typography>
          {sameSender && (
            <Tooltip
              title={
                seenByOthers.length > 0
                  ? `Read by ${seenByOthers.length}`
                  : "Delivered"
              }
            >
              <DoneAllIcon
                sx={{
                  fontSize: "0.9rem",
                  opacity: 0.7,
                  color: seenByOthers.length > 0 ? "#22d3ee" : "inherit",
                }}
              />
            </Tooltip>
          )}
        </Box>
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
        <Chip
          size="small"
          label="👍"
          onClick={() => onReact?.(_id, "👍")}
          sx={{ height: 22, color: "white", backgroundColor: "rgba(255,255,255,0.06)" }}
        />
        <Chip
          size="small"
          label="🔥"
          onClick={() => onReact?.(_id, "🔥")}
          sx={{ height: 22, color: "white", backgroundColor: "rgba(255,255,255,0.06)" }}
        />
        <Chip
          size="small"
          label="😂"
          onClick={() => onReact?.(_id, "😂")}
          sx={{ height: 22, color: "white", backgroundColor: "rgba(255,255,255,0.06)" }}
        />
      </Stack>
    </motion.div>
  );
};

export default memo(MessageComponent);