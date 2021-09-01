import React from "react";
import "../styles/globals.css";
import Layout from "./components/layout";
import CustomSnackBarProvider from "./components/hooks/custom-snackbar-context";
import CustomAuthProvider from "./components/hooks/custom-auth-context";

function MyApp({ Component, pageProps }) {
  return (
    <CustomAuthProvider>
      <CustomSnackBarProvider>
        <Layout>
          <div className="container-fluid px-1">
            <Component {...pageProps} />
          </div>
        </Layout>
      </CustomSnackBarProvider>
    </CustomAuthProvider>
  );
}

export default MyApp;
