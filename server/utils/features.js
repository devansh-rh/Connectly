import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";
import { v2 as cloudinary } from "cloudinary";
import { getBase64, getSockets } from "../lib/helper.js";

const cookieOptions = {
  maxAge: 15 * 24 * 60 * 60 * 1000,
  sameSite: "none",
  httpOnly: true,
  secure: true,
};

const connectDB = (uri) => {
  mongoose
    .connect(uri, { dbName: "Connectly" })
    .then((data) => console.log(`Connected to DB: ${data.connection.host}`))
    .catch((err) => {
      throw err;
    });
};

const sendToken = (res, user, code, message) => {
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

  return res.status(code).cookie("connectly-token", token, cookieOptions).json({
    success: true,
    user,
    message,
  });
};

const emitEvent = (req, event, users, data) => {
  const io = req.app.get("io");
  const usersSocket = getSockets(users);
  io.to(usersSocket).emit(event, data);
};

const isCloudinaryConfigured = () => {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
    process.env;

  const values = [
    CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET,
  ];

  return (
    values.every((value) => Boolean(value)) &&
    values.every((value) => !/dummy|your/i.test(value))
  );
};

const filesToLocalDataUrls = (files = []) => {
  return files.map((file) => ({
    public_id: `local-${uuid()}`,
    url: `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
  }));
};

const uploadFilesToCloudinary = async (files = []) => {
  if (!isCloudinaryConfigured()) {
    return filesToLocalDataUrls(files);
  }

  const uploadPromises = files.map((file) => {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        getBase64(file),
        {
          resource_type: "auto",
          public_id: uuid(),
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
    });
  });

  try {
    const results = await Promise.all(uploadPromises);

    const formattedResults = results.map((result) => ({
      public_id: result.public_id,
      url: result.secure_url,
    }));
    return formattedResults;
  } catch (err) {
    if ((process.env.NODE_ENV || "").trim() === "DEVELOPMENT") {
      return filesToLocalDataUrls(files);
    }

    throw new Error("Error uploading files to cloudinary");
  }
};

const deletFilesFromCloudinary = async (public_ids = []) => {
  if (!isCloudinaryConfigured()) {
    return;
  }

  const deletePromises = public_ids.map((public_id) => {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(public_id, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  });

  try {
    await Promise.all(deletePromises);
  } catch (err) {
    if ((process.env.NODE_ENV || "").trim() === "DEVELOPMENT") {
      return;
    }
    throw new Error("Error deleting files from cloudinary");
  }
};

export {
  connectDB,
  sendToken,
  cookieOptions,
  emitEvent,
  deletFilesFromCloudinary,
  uploadFilesToCloudinary,
};