import React, { useState } from "react";
import Styles from "./PostCaption.module.css";
import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const PostCaption = ({ post }) => {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  // handling navigation
  const handleNavigate = () => {
    navigate(`/profile/${post?.owner?.username}`);
  };

  const caption = post?.caption || "";
  const limit = 80;

  const isLong = caption.length > limit;
  const displayText = expanded ? caption : caption.slice(0, limit);

  return (
    <div className={Styles.postCaption}>
      {/* Username + Caption */}
      <Typography variant="body2">
        <span onClick={handleNavigate} className={Styles.username}>
          {post?.owner?.username}
        </span>{" "}
        {displayText}
        {isLong && !expanded && "..."}
        {isLong && (
          <span
            className={Styles.moreText}
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? " less" : " more"}
          </span>
        )}
      </Typography>
    </div>
  );
};

export default PostCaption;
