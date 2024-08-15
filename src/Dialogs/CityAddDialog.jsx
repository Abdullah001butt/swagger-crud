import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

const CityAddDialog = ({ open, handleClose, handleSave, countries }) => {
  const initialValues = {
    name: "",
    countryId: "",
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    countryId: Yup.number().required("Country is required"),
  });

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add City</DialogTitle>
      <DialogContent>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values, { resetForm }) => {
            handleSave(values);
            resetForm();
            handleClose();
          }}
        >
          {({ values, handleChange }) => (
            <Form>
              <div className="mb-2">
                <Field
                  as={TextField}
                  select
                  name="countryId"
                  label="Country"
                  value={values.countryId}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                >
                  {countries.map((country) => (
                    <MenuItem key={country.id} value={country.id}>
                      {country.name}
                    </MenuItem>
                  ))}
                </Field>
                <ErrorMessage
                  name="countryId"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              <div className="mb-2">
                <Field
                  type="text"
                  name="name"
                  placeholder="Name"
                  as={TextField}
                  fullWidth
                  variant="outlined"
                  margin="normal"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              <DialogActions>
                <Button onClick={handleClose} color="primary">
                  Cancel
                </Button>
                <Button type="submit" color="primary">
                  Add
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default CityAddDialog;
