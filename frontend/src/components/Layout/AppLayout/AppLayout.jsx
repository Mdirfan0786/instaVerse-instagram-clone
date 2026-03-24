import React from "react";
import Styles from "./AppLayout.module.css";
import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import RightSidebar from "../RightSidebar/RightSidebar";

const AppLayout = () => {
  return (
    <div className={Styles.layout}>
      <div className={Styles.sidebar_layout}>
        <Sidebar />
      </div>

      <div className={Styles.main_content}>
        <div className={Styles.page_content}>
          <Outlet />
        </div>
      </div>

      <div className={Styles.right_sidebar_layout}>
        <RightSidebar />
      </div>
    </div>
  );
};

export default AppLayout;
