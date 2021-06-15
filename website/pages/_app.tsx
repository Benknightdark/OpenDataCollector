import React, { useState } from "react";
import "../styles/globals.css";
import Layout from "./components/layout";
import { SnackbarProvider } from "notistack";
import { Button, Snackbar } from "@material-ui/core";
import { Alert, Color } from "@material-ui/lab";
import { SnackBarProvider } from "./components/hooks/custom-snackbar-context";

function MyApp({ Component, pageProps }) {
  const notistackRef = React.createRef<SnackbarProvider>();
  const onClickDismiss = (key) => () => {
    notistackRef.current.closeSnackbar(key);
  };
  const [snack, setSnack] = useState({
    message: "",
    color: "",
    open: false,
  });
  return (
    <SnackBarProvider>
      {/* <SnackbarProvider
        maxSnack={3}
        ref={notistackRef}
        action={(key) => (
          <Button
            variant="contained"
            color="primary"
            component="span"
            onClick={onClickDismiss(key)}
          >
            關閉
          </Button>
        )}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      > */}
      <Layout>
        <div className="container-fluid px-1">
          <Component {...pageProps} />
        </div>
      </Layout>
      {/* </SnackbarProvider> */}

      {/* <Snackbar open={snack.open}>
        <Alert>{snack.message}</Alert>
      </Snackbar> */}
    </SnackBarProvider>
  );
}

export default MyApp;
