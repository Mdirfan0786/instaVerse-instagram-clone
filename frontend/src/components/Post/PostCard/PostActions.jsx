import React, { useEffect, useState } from "react";
import Styles from "./PostAction.module.css";
import { IconButton, Typography } from "@mui/material";

import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import SendIcon from "@mui/icons-material/Send";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { clientServer } from "../../../api/axios";
import formatNumber from "../../../utils/formatNumber";

const PostActions = ({ post, currentUser }) => {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post?.likes?.length || 0);

  const [saved, setSaved] = useState(false); //todo

  // initial likes check
  useEffect(() => {
    if (post?.likes?.includes(currentUser?._id)) {
      setLiked(true);
    }
  }, [post, currentUser]);

  // toggle like
  const handleLike = async () => {
    try {
      setLiked((prev) => !prev);
      setLikesCount((prev) => (liked ? prev - 1 : prev + 1));

      const res = await clientServer.post(`/posts/${post._id}/like`);

      setLikesCount(res.data.likesCount);
    } catch (err) {
      console.log("Error While toggling Like: ", err.message);

      setLiked((prev) => !prev);
      setLikesCount((prev) => (liked ? prev + 1 : prev - 1));
    }
  };

  return (
    <div className={Styles.postActions}>
      {/* LEFT ACTIONS */}
      <div className={Styles.leftActions}>
        {/* LIKE */}
        <div className={Styles.actionItem}>
          <IconButton onClick={handleLike}>
            {liked ? (
              <FavoriteIcon className={Styles.liked} />
            ) : (
              <FavoriteBorderIcon />
            )}
          </IconButton>
          <Typography variant="caption">{formatNumber(likesCount)}</Typography>
        </div>

        {/* COMMENT */}
        <div className={Styles.actionItem}>
          <IconButton>
            <ChatBubbleOutlineIcon />
          </IconButton>
          <Typography variant="caption">{post?.commentsCount || 0}</Typography>
        </div>

        {/* SHARE */}
        <div className={Styles.actionItem}>
          <IconButton>
            <SendIcon />
          </IconButton>
          <Typography variant="caption">{post?.shares || 0}</Typography>
        </div>
      </div>

      {/* SAVE */}
      <div className={Styles.actionItem}>
        <IconButton onClick={() => setSaved(!saved)}>
          {saved ? <BookmarkIcon /> : <BookmarkBorderIcon />}
        </IconButton>
      </div>
    </div>
  );
};

export default PostActions;
