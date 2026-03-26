import React from "react";
import SidebarItem from "./SidebarItem";

import { FaHome, FaSearch, FaPlusSquare, FaHeart } from "react-icons/fa";
import { BsBookmark } from "react-icons/bs";
import Button from "../../ui/Button/Button";

import { useAuth } from "../../../hooks/useAuth";
import Styles from "./Sidebar.module.css";

import getProfileImage from "../../../utils/getProfileImage";
import { Link, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const { user, Logout } = useAuth();

  const navigate = useNavigate();

  // logout
  const handleLogout = () => {
    Logout();
    navigate("/login");
  };

  return (
    <div className={Styles.sidebar}>
      <div className={Styles.logo}>
        <Link to="/">
          <img src="/logo.png" alt="logo" />
        </Link>

        <Link to="/">
          <div className={Styles.text_logo}>
            <img src="/instaVerse-text-logo.png" alt="Instaverse" />
          </div>
        </Link>
      </div>

      <SidebarItem to="/" icon={<FaHome />} label="Home" />
      <SidebarItem to="/explore" icon={<FaSearch />} label="Explore" />
      <SidebarItem to="/create" icon={<FaPlusSquare />} label="Create" />
      <SidebarItem
        to="/notifications"
        icon={<FaHeart />}
        label="Notifications"
      />
      <SidebarItem to="/saved" icon={<BsBookmark />} label="Saved" />

      {/* Profile Mini */}
      <div className={Styles.profile_mini}>
        {/* LEFT */}
        <div
          className={Styles.profile_mini_left}
          onClick={() => navigate(`/profile/${user?.username}`)}
        >
          <img src={getProfileImage(user)} alt="profile" />
          <div>
            <p className={Styles.username}>{user?.username}</p>
            <span className={Styles.subtext}>
              {user?.name || "view profile"}
            </span>
          </div>
        </div>

        {/* RIGHT */}
        <div className={Styles.profile_mini_right}>
          <Button
            variant="outlined"
            color="error"
            fullWidth={false}
            sx={{ px: 2, py: 0.5, fontSize: "12px" }}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
