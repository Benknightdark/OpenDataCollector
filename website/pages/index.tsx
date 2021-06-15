import React, { useContext } from "react";
import Dashboard from "./components/dahsboard";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import {
  CustomSnackBar,
  SnackBarContext,
  useSnackBarContext,
} from "./components/hooks/custom-snackbar-context";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      padding: theme.spacing(2),
    },
  })
);
export default function Home() {
  const classes = useStyles();
  const [setMessage] = useSnackBarContext();
  setMessage("show")
  return (
    <div className={classes.root}>
        <CustomSnackBar />
        <Grid container spacing={3}>
          <Dashboard serviceName="kao-service" />
          <Dashboard serviceName="tainan-service" />
          <Dashboard serviceName="taichung-service" />
          <Dashboard serviceName="pthg-service" />
        </Grid>
    </div>
  );
  // return (

  //   <div className='row  bd-highlight'>
  //     <Dashboard serviceName='kao-service' />
  //     <Dashboard serviceName='tainan-service' />
  //     <Dashboard serviceName='taichung-service' />
  //     <Dashboard serviceName='pthg-service' />
  //   </div>

  // )
}
