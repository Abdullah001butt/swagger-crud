import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";

const CityDeleteDialog = ({ open, handleClose, handleDelete, city }) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Delete City</DialogTitle>
      <DialogContent>
        Are you sure you want to delete the city "{city?.name}"?
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button
          onClick={() => handleDelete(city.id)}
          color="secondary"
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CityDeleteDialog;
