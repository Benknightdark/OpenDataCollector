import { Button, Snackbar } from "@material-ui/core";
import React, { useContext, useState } from "react";
// Snackbar 全域設定
export const SnackBarContext = React.createContext({
  message: "",
  autoHideDuration: 6000,
});

// Snackbar UI
export function CustomSnackBar() {
  const value = useContext(SnackBarContext);
  const [open, setOpen] = useState(value.message == "" ? false : true);
  return (
    value.message != "" && (
      <div>
        <Snackbar
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={open}
          autoHideDuration={value.autoHideDuration}
          message={value.message}
          onClose={() => {
            setOpen(false);
          }}
          action={
            <Button variant="contained" color="primary" component="span" 
            onClick={()=>{setOpen(false)}}>
            關閉
          </Button>
          }
        ></Snackbar>
      </div>
    )
  );
}

// 使用 custom snackbar context
export const useCustomSnackBarContext = () => {
  const value = useContext(SnackBarContext);
  const setMessage = (message) => {
    value.message = message;
  };
  return [setMessage];
};
