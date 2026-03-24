import React from "react";
import { NavLink } from "react-router-dom";
import styles from "./Sidebar.module.css";

const SidebarItem = ({ to, icon, label }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `${styles.sidebar_item} ${isActive ? styles.active : ""}`
      }
    >
      <span className={styles.icon}>{icon}</span>
      <span className={styles.label}>{label}</span>
    </NavLink>
  );
};

export default SidebarItem;
