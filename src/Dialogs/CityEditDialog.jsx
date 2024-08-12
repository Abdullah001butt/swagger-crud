import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";

const CityEditDialog = ({ open, handleClose, handleSave, city }) => {
  const formik = useFormik({
    initialValues: {
      name: city?.name || "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
    }),
    enableReinitialize: true,
    onSubmit: (values) => {
      handleSave({ ...city, ...values });
    },
  });

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Edit City</DialogTitle>
      <DialogContent>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            margin="dense"
            id="name"
            name="name"
            label="City Name"
            type="text"
            fullWidth
            value={formik.values.name}
            onChange={formik.handleChange}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={formik.handleSubmit} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CityEditDialog;
