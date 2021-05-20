import React from "react";
import { ToastContainer } from "react-toastify";
import CustomHeader from "./custom-header";
import 'react-toastify/dist/ReactToastify.css';



export default function Layout({ goBack = "false", children }) {
  return (
    <div>
      <CustomHeader goBack={goBack} />
      <main>{children}</main>
      <ToastContainer />
    </div>
  );
}
