import React  from "react";
import "../styles/globals.css";
import Layout from "./components/layout";
import  CustomSnackBarProvider  from "./components/hooks/custom-snackbar-context";

function MyApp({ Component, pageProps }) {
  return (
    <CustomSnackBarProvider> 
      <Layout>
        <div className="container-fluid px-1">
          <Component {...pageProps} />
        </div>
      </Layout>
    </CustomSnackBarProvider>
  );
}

export default MyApp;
