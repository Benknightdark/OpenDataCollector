import { Snackbar } from "@material-ui/core";
import React, { useContext, useState } from "react";

export const SnackBarContext = React.createContext({
  message: "",
  autoHideDuration: 6000,
});
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
        ></Snackbar>
      </div>
    )
  );
}
export const useSnackBarContext = () => {
  const value = useContext(SnackBarContext);
  const setMessage=(message)=>{value.message=message}
  return [setMessage];
};
