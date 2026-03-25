import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import AppLayout from "../components/layout/AppLayout";
import { Box, IconButton, Popover, Skeleton, Stack, Tab, Tabs, TextField, Typography } from "@mui/material";
import { darkBg, accentPrimary, accentSecondary } from "../constants/color";
import {
  AttachFile as AttachFileIcon,
  Close as CloseIcon,
  EmojiEmotions as EmojiIcon,
  Send as SendIcon,
} from "@mui/icons-material";
import { InputBox } from "../components/styles/StyledComponents";
import FileMenu from "../components/dialogs/FileMenu";
import MessageComponent from "../components/shared/MessageComponent";
import { getSocket } from "../socket";
import {
  ALERT,
  CHAT_JOINED,
  CHAT_LEAVED,
  NEW_READ_RECEIPT,
  NEW_REACTION,
  NEW_MESSAGE,
  MESSAGE_READ,
  START_TYPING,
  STOP_TYPING,
} from "../constants/events";
import {
  useChatDetailsQuery,
  useGetMessagesQuery,
  useMarkMessagesReadMutation,
  useReactToMessageMutation,
} from "../redux/api/api";
import { useErrors, useSocketEvents } from "../hooks/hook";
import { useInfiniteScrollTop } from "6pp";
import { useDispatch } from "react-redux";
import { setIsFileMenu } from "../redux/reducers/misc";
import { removeNewMessagesAlert } from "../redux/reducers/chat";
import { TypingLoader } from "../components/layout/Loaders";
import { useNavigate } from "react-router-dom";

const Chat = ({ chatId, user }) => {
  const RECENT_EMOJIS_KEY = "connectly_recent_emojis";

  const socket = getSocket();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const containerRef = useRef(null);
  const bottomRef = useRef(null);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [fileMenuAnchor, setFileMenuAnchor] = useState(null);
  const [emojiAnchorEl, setEmojiAnchorEl] = useState(null);
  const [activeEmojiTab, setActiveEmojiTab] = useState(0);
  const [emojiSearch, setEmojiSearch] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [recentEmojis, setRecentEmojis] = useState(() => {
    try {
      const stored = localStorage.getItem(RECENT_EMOJIS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [IamTyping, setIamTyping] = useState(false);
  const [userTyping, setUserTyping] = useState(false);
  const typingTimeout = useRef(null);

  const [reactToMessage] = useReactToMessageMutation();
  const [markMessagesRead] = useMarkMessagesReadMutation();

  const chatDetails = useChatDetailsQuery({ chatId, populate: true, skip: !chatId });

  const oldMessagesChunk = useGetMessagesQuery({ chatId, page });

  const { data: oldMessages, setData: setOldMessages } = useInfiniteScrollTop(
    containerRef,
    oldMessagesChunk.data?.totalPages,
    page,
    setPage,
    oldMessagesChunk.data?.messages
  );

  const errors = [
    { isError: chatDetails.isError, error: chatDetails.error },
    { isError: oldMessagesChunk.isError, error: oldMessagesChunk.error },
  ];

  const members = chatDetails?.data?.chat?.members || [];
  const memberIds = useMemo(
    () => members.map((member) => member?._id || member).filter(Boolean),
    [members]
  );
  const isDirectChat = members.length === 2;
  const otherMember = useMemo(
    () => members.find((member) => (member?._id || member)?.toString() !== user?._id?.toString()),
    [members, user?._id]
  );

  const emojiGroups = [
    {
      label: "Recent",
      emojis: recentEmojis,
    },
    {
      label: "Smileys",
      emojis: ["😀", "😄", "😁", "😆", "😊", "😍", "🥰", "😘", "🤩", "😎", "🥳", "🤗", "🤭", "😇", "🤓", "😌", "😋", "😜", "🤪", "😏", "🙃", "😺", "😸", "😹"],
    },
    {
      label: "Love",
      emojis: ["❤️", "💜", "💙", "🖤", "💛", "💚", "🤍", "🤎", "💖", "💘", "💝", "💕", "💞", "💓", "💗", "💟", "😍", "🥰", "😘", "🤝", "🌹", "💐", "✨", "🫶"],
    },
    {
      label: "Fun",
      emojis: ["🔥", "⚡", "🌈", "🌟", "💯", "🎉", "🎊", "🎈", "🎵", "🎶", "🎮", "🕺", "💃", "🤘", "👌", "🙌", "👏", "💪", "🚀", "🎯", "🧠", "🍕", "🍔", "☕"],
    },
    {
      label: "Reacts",
      emojis: ["👍", "👎", "👏", "🙌", "🙏", "🤝", "👌", "✌️", "🤟", "🫡", "✅", "❌", "❗", "❓", "💥", "😮", "😢", "😭", "😡", "🤯", "🤔", "😂", "😅", "😉"],
    },
  ];

  const messageOnChange = (e) => {
    setMessage(e.target.value);

    if (!IamTyping) {
      socket.emit(START_TYPING, { members: memberIds, chatId });
      setIamTyping(true);
    }

    if (typingTimeout.current) clearTimeout(typingTimeout.current);

    typingTimeout.current = setTimeout(() => {
      socket.emit(STOP_TYPING, { members: memberIds, chatId });
      setIamTyping(false);
    }, [2000]);
  };

  const handleFileOpen = (e) => {
    dispatch(setIsFileMenu(true));
    setFileMenuAnchor(e.currentTarget);
  };

  const submitHandler = (e) => {
    e.preventDefault();

    if (!message.trim()) return;

    const optimisticMessage = {
      _id: `temp-${Date.now()}`,
      content: message,
      sender: {
        _id: user._id,
        name: user.name,
      },
      chat: chatId,
      replyTo: replyTo
        ? {
            _id: replyTo._id,
            content: replyTo.content,
            sender: { name: replyTo.sender?.name },
          }
        : null,
      seenBy: [{ user: user._id, seenAt: new Date().toISOString() }],
      createdAt: new Date().toISOString(),
      isPending: true,
    };

    setMessages((prev) => [...prev, optimisticMessage]);

    // Emitting the message to the server
    socket.emit(NEW_MESSAGE, {
      chatId,
      members: memberIds,
      message,
      replyTo: replyTo
        ? {
            _id: replyTo._id,
            content: replyTo.content,
            sender: { name: replyTo.sender?.name },
          }
        : null,
    });
    setMessage("");
    setReplyTo(null);
  };

  const handleReact = async (messageId, emoji) => {
    try {
      await reactToMessage({ chatId, messageId, emoji });
    } catch {
      // Error toast is already handled globally by API hooks where needed.
    }
  };

  const openEmojiPicker = (event) => setEmojiAnchorEl(event.currentTarget);

  const closeEmojiPicker = () => {
    setEmojiAnchorEl(null);
    setEmojiSearch("");
  };

  const addEmojiToMessage = (emoji) => {
    setMessage((prev) => `${prev}${emoji}`);

    setRecentEmojis((prev) => {
      const next = [emoji, ...prev.filter((item) => item !== emoji)].slice(0, 24);
      localStorage.setItem(RECENT_EMOJIS_KEY, JSON.stringify(next));
      return next;
    });
  };

  useEffect(() => {
    socket.emit(CHAT_JOINED, { userId: user._id, members: memberIds });
    dispatch(removeNewMessagesAlert(chatId));

    return () => {
      setMessages([]);
      setMessage("");
      setOldMessages([]);
      setPage(1);
      socket.emit(CHAT_LEAVED, { userId: user._id, members: memberIds });
    };
  }, [chatId, user?._id, memberIds, dispatch, setOldMessages, socket]);

  useEffect(() => {
    if (bottomRef.current)
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (chatDetails.isError) return navigate("/");
  }, [chatDetails.isError]);

  const newMessagesListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;

      setMessages((prev) => {
        if (data?.message?.sender?._id === user?._id) {
          const withoutPending = [...prev];
          const pendingIndex = withoutPending.findIndex(
            (msg) => msg.isPending && msg.sender?._id === user?._id
          );

          if (pendingIndex >= 0) {
            withoutPending.splice(pendingIndex, 1);
          }

          return [...withoutPending, data.message];
        }

        return [...prev, data.message];
      });
    },
    [chatId, user?._id]
  );

  const startTypingListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;

      setUserTyping(true);
    },
    [chatId]
  );

  const stopTypingListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      setUserTyping(false);
    },
    [chatId]
  );

  const reactionListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;

      const applyReactions = (list = []) =>
        list.map((msg) =>
          msg._id?.toString() === data.messageId?.toString()
            ? { ...msg, reactions: data.reactions }
            : msg
        );

      setMessages((prev) => applyReactions(prev));
      setOldMessages((prev) => applyReactions(prev));
    },
    [chatId, setOldMessages]
  );

  const readReceiptListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;

      const applySeen = (list = []) =>
        list.map((msg) => {
          const isTargetMessage = data.messageIds.some(
            (id) => id?.toString() === msg._id?.toString()
          );

          if (!isTargetMessage) return msg;

          const alreadySeen = (msg.seenBy || []).some(
            (entry) =>
              (entry.user?._id || entry.user)?.toString() ===
              data.userId?.toString()
          );

          if (alreadySeen) return msg;

          return {
            ...msg,
            seenBy: [
              ...(msg.seenBy || []),
              {
                user: { _id: data.userId, name: data.userName || "User" },
                seenAt: data.seenAt,
              },
            ],
          };
        });

      setMessages((prev) => applySeen(prev));
      setOldMessages((prev) => applySeen(prev));
    },
    [chatId, setOldMessages]
  );

  const alertListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      const messageForAlert = {
        content: data.message,
        sender: {
          _id: "djasdhajksdhasdsadasdas",
          name: "Admin",
        },
        chat: chatId,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, messageForAlert]);
    },
    [chatId]
  );

  const eventHandler = {
    [ALERT]: alertListener,
    [NEW_MESSAGE]: newMessagesListener,
    [NEW_REACTION]: reactionListener,
    [NEW_READ_RECEIPT]: readReceiptListener,
    [START_TYPING]: startTypingListener,
    [STOP_TYPING]: stopTypingListener,
  };

  useSocketEvents(socket, eventHandler);

  useErrors(errors);

  const allMessages = [...oldMessages, ...messages];

  useEffect(() => {
    if (!chatId || memberIds.length === 0 || !user?._id || allMessages.length === 0) return;

    const unreadIncomingIds = allMessages
      .filter((msg) => msg?.sender?._id !== user._id)
      .filter(
        (msg) =>
          !(msg.seenBy || []).some(
            (entry) => (entry.user?._id || entry.user)?.toString() === user._id.toString()
          )
      )
      .map((msg) => msg._id)
      .filter(Boolean);

    if (unreadIncomingIds.length === 0) return;

    socket.emit(MESSAGE_READ, {
      chatId,
      members: memberIds,
      messageIds: unreadIncomingIds,
    });

    markMessagesRead({ chatId, messageIds: unreadIncomingIds });
  }, [allMessages, chatId, memberIds, socket, user?._id, markMessagesRead]);

  const isEmojiPickerOpen = Boolean(emojiAnchorEl);
  const activeEmojis = emojiGroups[activeEmojiTab]?.emojis || [];
  const filteredEmojis = useMemo(() => {
    if (!emojiSearch.trim()) return activeEmojis;

    return activeEmojis.filter((emoji) => emoji.includes(emojiSearch.trim()));
  }, [activeEmojis, emojiSearch]);

  return chatDetails.isLoading ? (
    <Skeleton />
  ) : (
    <Fragment>
      <Stack
        ref={containerRef}
        boxSizing={"border-box"}
        padding={"1rem"}
        spacing={"1rem"}
        bgcolor={darkBg}
        height={"90%"}
        sx={{
          overflowX: "hidden",
          overflowY: "auto",
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(124, 58, 237, 0.3)",
            borderRadius: "4px",
          },
        }}
      >
        {allMessages.map((i) => (
          <MessageComponent
            key={i._id}
            message={i}
            user={user}
            isDirectChat={isDirectChat}
            otherMemberName={otherMember?.name}
            onReply={(msg) => setReplyTo(msg)}
            onReact={handleReact}
          />
        ))}

        {userTyping && <TypingLoader />}

        <div ref={bottomRef} />
      </Stack>

      <form
        style={{
          height: "10%",
        }}
        onSubmit={submitHandler}
      >
        {replyTo && (
          <Box
            sx={{
              mx: "auto",
              mb: 0.4,
              width: "min(62vw, 680px)",
              p: "0.45rem 0.65rem",
              borderRadius: "0.65rem",
              border: "1px solid rgba(6, 182, 212, 0.35)",
              backgroundColor: "rgba(6, 182, 212, 0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 1,
            }}
          >
            <Box>
              <Typography variant="caption" sx={{ color: "#67e8f9", display: "block" }}>
                Replying to {replyTo?.sender?.name || "message"}
              </Typography>
              <Typography variant="caption" sx={{ color: "rgba(226, 232, 240, 0.9)" }}>
                {(replyTo?.content || "Attachment").slice(0, 80)}
              </Typography>
            </Box>
            <IconButton size="small" onClick={() => setReplyTo(null)}>
              <CloseIcon sx={{ color: "#e2e8f0" }} />
            </IconButton>
          </Box>
        )}

        <Stack
          direction={"row"}
          height={"100%"}
          padding={"1rem"}
          alignItems={"center"}
          justifyContent={"center"}
          spacing={0.8}
        >
          <IconButton
            sx={{
              rotate: "30deg",
              width: "2.75rem",
              height: "2.75rem",
              borderRadius: "0.9rem",
              color: "#e2e8f0",
              backgroundColor: "rgba(26, 26, 46, 0.9)",
              border: "1px solid rgba(124, 58, 237, 0.35)",
              transition: "all 0.25s ease",
              "&:hover": {
                backgroundColor: "rgba(124, 58, 237, 0.2)",
                transform: "translateY(-1px)",
              },
            }}
            onClick={handleFileOpen}
          >
            <AttachFileIcon />
          </IconButton>

          <Box sx={{ width: "min(62vw, 680px)", height: "3.15rem" }}>
            <InputBox
              placeholder="Type Message Here..."
              value={message}
              onChange={messageOnChange}
              style={{
                height: "100%",
                padding: "0 1rem",
                borderRadius: "1rem",
              }}
            />
          </Box>

          <IconButton
            onClick={openEmojiPicker}
            sx={{
              width: "2.75rem",
              height: "2.75rem",
              borderRadius: "0.9rem",
              color: "#facc15",
              backgroundColor: "rgba(26, 26, 46, 0.9)",
              border: "1px solid rgba(124, 58, 237, 0.35)",
              transition: "all 0.25s ease",
              "&:hover": {
                backgroundColor: "rgba(124, 58, 237, 0.2)",
                transform: "translateY(-1px)",
              },
            }}
          >
            <EmojiIcon />
          </IconButton>

          <IconButton
            type="submit"
            sx={{
              width: "2.75rem",
              height: "2.75rem",
              borderRadius: "0.9rem",
              background: `linear-gradient(135deg, ${accentPrimary} 0%, ${accentSecondary} 100%)`,
              color: "white",
              boxShadow: "0 8px 20px rgba(124, 58, 237, 0.35)",
              transition: "all 0.3s ease",
              "&:hover": {
                boxShadow: `0 10px 24px rgba(124, 58, 237, 0.5)`,
                transform: "translateY(-2px) scale(1.03)",
              },
              "&:disabled": {
                opacity: 0.45,
              },
            }}
            disabled={!message.trim()}
          >
            <SendIcon />
          </IconButton>
        </Stack>
      </form>

      <Popover
        open={isEmojiPickerOpen}
        anchorEl={emojiAnchorEl}
        onClose={closeEmojiPicker}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        transformOrigin={{ vertical: "bottom", horizontal: "right" }}
        PaperProps={{
          sx: {
            width: 320,
            maxWidth: "90vw",
            borderRadius: "1rem",
            overflow: "hidden",
            backgroundColor: "#121327",
            border: "1px solid rgba(124, 58, 237, 0.3)",
          },
        }}
      >
        <Tabs
          value={activeEmojiTab}
          onChange={(e, value) => setActiveEmojiTab(value)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            minHeight: "2.5rem",
            "& .MuiTab-root": {
              color: "rgba(226, 232, 240, 0.8)",
              minHeight: "2.5rem",
              fontSize: "0.75rem",
              textTransform: "none",
            },
          }}
        >
          {emojiGroups.map((group) => (
            <Tab key={group.label} label={group.label} />
          ))}
        </Tabs>

        <Box sx={{ px: 1.2, pb: 1.2 }}>
          <Typography variant="caption" sx={{ color: "rgba(226, 232, 240, 0.75)", display: "block", mb: 0.8 }}>
            Pick an emoji
          </Typography>
          <TextField
            size="small"
            value={emojiSearch}
            onChange={(e) => setEmojiSearch(e.target.value)}
            placeholder="Search emoji"
            fullWidth
            sx={{
              mb: 1,
              "& .MuiOutlinedInput-root": {
                color: "#e2e8f0",
                backgroundColor: "rgba(255,255,255,0.03)",
                "& fieldset": {
                  borderColor: "rgba(124, 58, 237, 0.35)",
                },
                "&:hover fieldset": {
                  borderColor: "rgba(124, 58, 237, 0.5)",
                },
                "&.Mui-focused fieldset": {
                  borderColor: accentPrimary,
                },
              },
            }}
          />
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(8, 1fr)",
              gap: "0.25rem",
              maxHeight: 220,
              overflowY: "auto",
              pr: 0.5,
              "&::-webkit-scrollbar": { width: "6px" },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "rgba(124, 58, 237, 0.35)",
                borderRadius: "4px",
              },
            }}
          >
            {filteredEmojis.map((emoji) => (
              <IconButton
                key={`${emoji}-${activeEmojiTab}`}
                onClick={() => addEmojiToMessage(emoji)}
                sx={{
                  borderRadius: "0.55rem",
                  fontSize: "1.15rem",
                  backgroundColor: "rgba(255,255,255,0.03)",
                  "&:hover": {
                    backgroundColor: "rgba(124, 58, 237, 0.2)",
                    transform: "translateY(-1px)",
                  },
                }}
              >
                {emoji}
              </IconButton>
            ))}
          </Box>
          {activeEmojiTab === 0 && filteredEmojis.length === 0 && (
            <Typography variant="caption" sx={{ color: "rgba(226, 232, 240, 0.65)", mt: 1, display: "block" }}>
              No recent emojis yet. Pick any emoji to start building your recent list.
            </Typography>
          )}
        </Box>
      </Popover>

      <FileMenu anchorE1={fileMenuAnchor} chatId={chatId} />
    </Fragment>
  );
};

export default AppLayout()(Chat);