import React from "react";
import Styles from "./AppLayout.module.css";
import Navbar from "../Navbar/Navbar";
import { Style } from "@mui/icons-material";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <div className={Styles.appLayout}>
      {/* Navbar */}
      <Navbar />

      {/* Main layout */}
      <div className={Styles.main_layout}>
        <div className={Styles.left_Container}></div>
        <div className={Styles.content}>
          <Outlet />
        </div>
        <div className={Styles.right_Container}></div>
      </div>
    </div>
  );
};

export default AppLayout;
