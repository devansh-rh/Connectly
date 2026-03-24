import React from "react";
import { Avatar, Stack, Typography } from "@mui/material";
import {
  Face as FaceIcon,
  AlternateEmail as UserNameIcon,
  CalendarMonth as CalendarIcon,
} from "@mui/icons-material";
import moment from "moment";
import { transformImage } from "../../lib/features";

const Profile = ({ user, isPopup = false }) => {
  const avatarSize = isPopup ? 96 : 200;

  return (
    <Stack spacing={isPopup ? "1rem" : "2rem"} direction={"column"} alignItems={"center"}>
      <Avatar
        src={transformImage(user?.avatar?.url)}
        sx={{
          width: avatarSize,
          height: avatarSize,
          objectFit: "contain",
          marginBottom: isPopup ? "0.5rem" : "1rem",
          border: "5px solid white",
        }}
      />
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
  >
    {Icon && Icon}

    <Stack>
      <Typography variant={isPopup ? "body2" : "body1"}>{text}</Typography>
      <Typography color={"gray"} variant="caption">
        {heading}
      </Typography>
    </Stack>
  </Stack>
);

export default Profile;