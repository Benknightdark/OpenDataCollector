import React, { useEffect, useState } from "react";
import CustomHeader from "./custom-header";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import ArrowBack from "@material-ui/icons/ArrowBack";
import Container from "@material-ui/core/Container";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { useRouter } from "next/router";
import Button from "@material-ui/core/Button";
import AssignmentTurnedInSharpIcon from "@material-ui/icons/AssignmentTurnedInSharp";
import { signOut } from "next-auth/client";
import { useCustomSnackBar } from "./hooks/custom-snackbar-context";
import { useCustomAuthContext } from "./hooks/custom-auth-context";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));
export default function Layout({ children }) {
  const classes = useStyles();
  const [canGoBack, setGoBack] = useState("false");
  const router = useRouter();
  const showSnackBar = useCustomSnackBar();
  const showDisplaName = useCustomAuthContext();
  useEffect(() => {
    if (window.history.length > 1) {
      setGoBack("true");
    }
  });
  return (
    <React.Fragment>
      <CustomHeader goBack={canGoBack} />
      <div className={classes.root}>
        <AppBar position="static" className="custom-nav-bar">
          <Toolbar>
            {canGoBack == "true" && (
              <IconButton
                edge="start"
                className={classes.menuButton}
                color="inherit"
                aria-label="arrowBack"
                onClick={() => {
                  router.back();
                }}
              >
                <ArrowBack />
              </IconButton>
            )}
            <Typography
              variant="h6"
              className={classes.title}
              style={{ cursor: "pointer" }}
              onClick={() => {
                router.push("/");
              }}
            >
              OpenDataCollector
            </Typography>
            {/* displayName */}
            {showDisplaName["displayName"] ? (
              <div>
                <IconButton
                  aria-label="排程"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  color="inherit"
                  onClick={async () => {
                    router.push("/task");
                  }}
                >
                  <AssignmentTurnedInSharpIcon />
                </IconButton>
                <IconButton
                  aria-label="登出"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  color="inherit"
                  onClick={async () => {
                    await signOut({ redirect: false });
                    showSnackBar.showSnackBar("登出", "info");
                    location.reload()
                  }}
                >
                  <ExitToAppIcon />
                </IconButton>
              </div>
            ) : (
              <div>
                <Button
                  color="inherit"
                  onClick={async () => {
                    router.push("/auth/register");
                  }}
                >
                  註冊
                </Button>
                <Button
                  color="inherit"
                  onClick={async () => {
                    router.push("/auth/signin");
                  }}
                >
                  登入
                </Button>
              </div>
            )}
          </Toolbar>
        </AppBar>
      </div>
      <Container maxWidth="xl">{children}</Container>
    </React.Fragment>
  );
}
