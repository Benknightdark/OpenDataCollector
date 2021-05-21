import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import CustomHeader from "./custom-header";
import 'react-toastify/dist/ReactToastify.css';
export default function Layout({ children }) {

  const [canGoBack, setGoBack] = useState("false")
  useEffect(() => {
    if (window.history.length >1) {
      setGoBack("true")
      console.log(canGoBack)
    }
  })
  return (
    <div>
      <CustomHeader goBack={canGoBack} />
      <main>{children}</main>
      <ToastContainer />
      <div id='root'></div>
    </div>
  );
}


