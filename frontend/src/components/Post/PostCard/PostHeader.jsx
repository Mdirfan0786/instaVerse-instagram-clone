import React from "react";
import styles from "./PostHeader.module.css";
import { Avatar, Typography, IconButton } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { useNavigate } from "react-router-dom";

const PostHeader = ({ user }) => {
  const navigate = useNavigate();

  // handling navigation
  const handleNavigate = () => {
    navigate(`/profile/${user.username}`);
  };

  return (
    <div className={styles.postHeader}>
      <div className={styles.postHeaderLeft}>
        <Avatar
          onClick={handleNavigate}
          sx={{ cursor: "pointer" }}
          src={user.profilePic}
        />
        <Typography
          variant="subtitle2"
          className={styles.username}
          onClick={handleNavigate}
        >
          {user.username}
        </Typography>
      </div>

      <IconButton>
        <MoreHorizIcon />
      </IconButton>
    </div>
  );
};

export default PostHeader;
