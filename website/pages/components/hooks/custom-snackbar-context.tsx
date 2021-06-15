import { Button, Snackbar } from "@material-ui/core";
import { Alert, Color } from "@material-ui/lab";
import React, { createContext, useContext } from "react";

type CustomSnackBarContextActions = {
  showSnackBar: (text: string, typeColor: Color) => void;
};

const CustomSnackBarContext = createContext({} as CustomSnackBarContextActions);

interface CustomSnackBarContextProviderProps {
  children: React.ReactNode;
}

const CustomSnackBarProvider: React.FC<CustomSnackBarContextProviderProps> = ({
  children,
}) => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [message, setMessage] = React.useState<string>("");
  const [typeColor, setTypeColor] = React.useState<Color>("info");

  const showSnackBar = (text: string, color: Color) => {
    setMessage(text);
    setTypeColor(color);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setTypeColor("info");
  };

  return (
    <CustomSnackBarContext.Provider value={{ showSnackBar }}>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        onClose={handleClose}
        action={
          <Button variant="contained" color="primary" onClick={handleClose}>
            關閉
          </Button>
        }
      >
        <Alert onClose={handleClose} severity={typeColor}>
          {message}
        </Alert>
      </Snackbar>
      {children}
    </CustomSnackBarContext.Provider>
  );
};

const useSnackBar = (): CustomSnackBarContextActions => {
  const context = useContext(CustomSnackBarContext);

  if (!context) {
    throw new Error("useSnackBar must be used within an SnackBarProvider");
  }

  return context;
};

export { CustomSnackBarProvider, useSnackBar };
