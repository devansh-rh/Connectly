import express from "express";
import { connectDB } from "./utils/features.js";
import dotenv from "dotenv";
import { errorMiddleware } from "./middlewares/error.js";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import { createServer } from "http";
import { v4 as uuid } from "uuid";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";
import {
  CHAT_JOINED,
  CHAT_LEAVED,
  MESSAGE_READ,
  NEW_MESSAGE,
  NEW_MESSAGE_ALERT,
  NEW_READ_RECEIPT,
  ONLINE_USERS,
  START_TYPING,
  STOP_TYPING,
  USER_SET_STATUS,
  USER_STATUS_UPDATED,
} from "./constants/events.js";
import { getSockets } from "./lib/helper.js";
import { Message } from "./models/message.js";
import { User } from "./models/user.js";
import { corsOptions, isOriginAllowed } from "./constants/config.js";
import { socketAuthenticator } from "./middlewares/auth.js";

import userRoute from "./routes/user.js";
import chatRoute from "./routes/chat.js";
import adminRoute from "./routes/admin.js";

dotenv.config({
  path: "./.env",
});

const mongoURI = process.env.MONGO_URI;
const port = process.env.PORT || 3000;
const envMode = (process.env.NODE_ENV || "PRODUCTION").trim();
const adminSecretKey = process.env.ADMIN_SECRET_KEY || "adsasdsdfsdfsdfd";
const userSocketIDs = new Map();
const onlineUsers = new Set();

const extractFirstUrl = (text = "") => {
  const match = text.match(/https?:\/\/[^\s]+/i);
  return match ? match[0] : null;
};

const buildFallbackLinkPreview = (url) => {
  try {
    const parsed = new URL(url);
    return {
      url,
      title: parsed.hostname,
      description: `Open ${parsed.hostname}`,
      image: "",
      siteName: parsed.hostname,
    };
  } catch {
    return null;
  }
};

connectDB(mongoURI);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: corsOptions,
});

app.set("io", io);

// Using Middlewares Here
app.use(express.json());
app.use(cookieParser());

// Hardened CORS middleware for production
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (isOriginAllowed(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
  }

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(cors(corsOptions));

app.use("/api/v1/user", userRoute);
app.use("/api/v1/chat", chatRoute);
app.use("/api/v1/admin", adminRoute);

app.get("/", (req, res) => {
  res.send("Hello World");
});

io.use((socket, next) => {
  cookieParser()(
    socket.request,
    socket.request.res,
    async (err) => await socketAuthenticator(err, socket, next)
  );
});

io.on("connection", (socket) => {
  const user = socket.user;
  userSocketIDs.set(user._id.toString(), socket.id);
  onlineUsers.add(user._id.toString());

  User.findByIdAndUpdate(user._id, {
    $set: {
      "status.state": user.status?.state === "invisible" ? "invisible" : "online",
      lastSeen: new Date(),
    },
  }).catch(() => {});

  socket.broadcast.emit(USER_STATUS_UPDATED, {
    userId: user._id,
    status: user.status?.state === "invisible" ? "invisible" : "online",
    statusText: user.status?.text || "",
    lastSeen: new Date().toISOString(),
  });

  io.emit(ONLINE_USERS, Array.from(onlineUsers));

  socket.on(NEW_MESSAGE, async ({ chatId, members, message, replyTo = null }) => {
    const firstUrl = extractFirstUrl(message || "");
    const linkPreview = firstUrl ? buildFallbackLinkPreview(firstUrl) : null;

    const messageForRealTime = {
      content: message,
      _id: uuid(),
      sender: {
        _id: user._id,
        name: user.name,
      },
      chat: chatId,
      replyTo,
      linkPreview,
      seenBy: [{ user: user._id, seenAt: new Date().toISOString() }],
      createdAt: new Date().toISOString(),
    };

    const messageForDB = {
      content: message,
      sender: user._id,
      chat: chatId,
      replyTo: replyTo?._id || null,
      linkPreview,
      seenBy: [{ user: user._id, seenAt: new Date() }],
    };

    const membersSocket = getSockets(members);
    io.to(membersSocket).emit(NEW_MESSAGE, {
      chatId,
      message: messageForRealTime,
    });
    io.to(membersSocket).emit(NEW_MESSAGE_ALERT, { chatId });

    try {
      await Message.create(messageForDB);
    } catch (error) {
      throw new Error(error);
    }
  });

  socket.on(START_TYPING, ({ members, chatId }) => {
    const membersSockets = getSockets(members);
    socket.to(membersSockets).emit(START_TYPING, { chatId });
  });

  socket.on(STOP_TYPING, ({ members, chatId }) => {
    const membersSockets = getSockets(members);
    socket.to(membersSockets).emit(STOP_TYPING, { chatId });
  });

  socket.on(MESSAGE_READ, async ({ chatId, members, messageIds = [] }) => {
    const messages = await Message.find({
      _id: { $in: messageIds },
      chat: chatId,
    });

    const updatedMessageIds = [];

    for (const message of messages) {
      const alreadySeen = message.seenBy.some(
        (entry) => entry.user.toString() === user._id.toString()
      );

      if (!alreadySeen) {
        message.seenBy.push({ user: user._id, seenAt: new Date() });
        await message.save();
        updatedMessageIds.push(message._id.toString());
      }
    }

    if (updatedMessageIds.length > 0) {
      const membersSockets = getSockets(members);
      io.to(membersSockets).emit(NEW_READ_RECEIPT, {
        chatId,
        messageIds: updatedMessageIds,
        userId: user._id,
        seenAt: new Date().toISOString(),
      });
    }
  });

  socket.on(USER_SET_STATUS, async ({ status, statusText = "" }) => {
    const allowed = ["online", "away", "dnd", "invisible"];
    const safeStatus = allowed.includes(status) ? status : "online";

    await User.findByIdAndUpdate(user._id, {
      $set: {
        "status.state": safeStatus,
        "status.text": String(statusText).slice(0, 80),
        lastSeen: new Date(),
      },
    });

    io.emit(USER_STATUS_UPDATED, {
      userId: user._id,
      status: safeStatus,
      statusText: String(statusText).slice(0, 80),
      lastSeen: new Date().toISOString(),
    });
  });

  socket.on(CHAT_JOINED, ({ userId, members }) => {
    onlineUsers.add(userId.toString());

    const membersSocket = getSockets(members);
    io.to(membersSocket).emit(ONLINE_USERS, Array.from(onlineUsers));
  });

  socket.on(CHAT_LEAVED, ({ userId, members }) => {
    onlineUsers.delete(userId.toString());

    const membersSocket = getSockets(members);
    io.to(membersSocket).emit(ONLINE_USERS, Array.from(onlineUsers));
  });

  socket.on("disconnect", () => {
    userSocketIDs.delete(user._id.toString());
    onlineUsers.delete(user._id.toString());

    User.findByIdAndUpdate(user._id, {
      $set: {
        lastSeen: new Date(),
      },
    }).catch(() => {});

    socket.broadcast.emit(USER_STATUS_UPDATED, {
      userId: user._id,
      status: "away",
      statusText: user.status?.text || "",
      lastSeen: new Date().toISOString(),
    });

    socket.broadcast.emit(ONLINE_USERS, Array.from(onlineUsers));
  });
});

app.use(errorMiddleware);

server.listen(port, () => {
  console.log(`Server is running on port ${port} in ${envMode} Mode`);
});

export { envMode, adminSecretKey, userSocketIDs };