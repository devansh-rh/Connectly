import { Box, Typography, Tooltip } from "@mui/material";
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

const emojiSplitRegex = /([\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}])/gu;
const emojiTestRegex = /^[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]$/u;

const renderContentWithLargerEmojis = (text) => {
  const parts = text.split(emojiSplitRegex).filter(Boolean);

  return parts.map((part, index) => {
    if (emojiTestRegex.test(part)) {
      return (
        <Box
          key={`emoji-${index}`}
          component="span"
          sx={{
            fontSize: "1.2em",
            lineHeight: 1,
            verticalAlign: "-0.06em",
          }}
        >
          {part}
        </Box>
      );
    }

    return <React.Fragment key={`text-${index}`}>{part}</React.Fragment>;
  });
};

const MessageComponent = ({ message, user }) => {
  const { sender, content, attachments = [], createdAt } = message;

  const sameSender = sender?._id === user?._id;

  const timeAgo = moment(createdAt).fromNow();

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
            <Tooltip title="Delivered">
              <DoneAllIcon sx={{ fontSize: "0.9rem", opacity: 0.7 }} />
            </Tooltip>
          )}
        </Box>
      </Box>
    </motion.div>
  );
};

export default memo(MessageComponent);