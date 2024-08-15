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

const AddDialog = ({ open, handleClose, handleSave }) => {
  const initialValues = {
    name: "",
    flag: {
      file_name: "",
      file_content: "",
      file_extension: "",
    },
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    flag: Yup.object().shape({
      file_name: Yup.string().required("Flag file name is required"),
      file_content: Yup.string().required("Flag file content is required"),
      file_extension: Yup.string().required("Flag file extension is required"),
    }),
  });

  const handleFileChange = (event, setFieldValue) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result.split(",")[1];
        setFieldValue("flag.file_name", file.name);
        setFieldValue("flag.file_content", base64String);
        setFieldValue("flag.file_extension", file.name.split(".").pop());
      };
      reader.onerror = (error) => console.error("Error reading file:", error);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add Country</DialogTitle>
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
          {({ setFieldValue }) => (
            <Form>
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
              </div>
              <div className="mb-2">
                <input
                  type="file"
                  name="flag.file_content"
                  onChange={(event) => handleFileChange(event, setFieldValue)}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <Field type="hidden" name="flag.file_name" />
              <Field type="hidden" name="flag.file_content" />
              <Field type="hidden" name="flag.file_extension" />
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

export default AddDialog;
