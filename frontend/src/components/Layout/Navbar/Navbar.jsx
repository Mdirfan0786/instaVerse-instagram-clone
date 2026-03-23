import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Styles from "./Navbar.module.css";

// MUI Icons
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import LogoutSharpIcon from "@mui/icons-material/LogoutSharp";

import { AuthContext } from "../../../context/AuthContext";
import getProfileImage from "../../../utils/getProfileImage.js";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  const { user, Logout } = useContext(AuthContext);

  const navigate = useNavigate();
  const location = useLocation();

  // close dropdown on route change
  useEffect(() => {
    setOpen(false);
  }, [location]);

  // toggle dropdown
  const handleToggle = () => {
    setOpen((prev) => !prev);
  };

  // close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // logout
  const handleLogout = () => {
    Logout();
    navigate("/login");
  };

  return (
    <nav>
      {/* Left */}
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

      {/* Right */}
      <div className={Styles.right_content}>
        <div className={Styles.profile_container} ref={dropdownRef}>
          <img
            src={getProfileImage(user)}
            alt="profile"
            className={Styles.profile_img}
            onClick={handleToggle}
          />

          <div className={`${Styles.dropdown} ${open ? Styles.show : ""}`}>
            <Link to={`/profile/${user?.username}`}>
              <PersonIcon className={Styles.icon} />
              Profile
            </Link>

            <Link to="/settings">
              <SettingsIcon className={Styles.icon} />
              Settings
            </Link>
            <Link to="/saved">
              <BookmarkBorderIcon className={Styles.icon} />
              Saved
            </Link>

            <div className={Styles.divider}></div>

            <div onClick={handleLogout} className={Styles.logout}>
              <LogoutSharpIcon className={Styles.icon} />
              Logout
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
