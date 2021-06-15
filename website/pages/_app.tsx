import React from "react";
import "../styles/globals.css";
import Layout from "./components/layout";
import CustomSnackBarProvider from "./components/hooks/custom-snackbar-context";
import CustomAuthContext from "./components/hooks/custom-auth-context";

function MyApp({ Component, pageProps }) {
  return (
    <CustomAuthContext>
      <CustomSnackBarProvider>
        <Layout>
          <div className="container-fluid px-1">
            <Component {...pageProps} />
          </div>
        </Layout>
      </CustomSnackBarProvider>
    </CustomAuthContext>
  );
}

export default MyApp;
