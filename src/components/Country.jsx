import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import countryApi from "../api/countryApi";
import EditDialog from "../Dialogs/EditDialog";
import DeleteDialog from "../Dialogs/DeleteDialog";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const formikSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  flag: Yup.object().shape({
    file_name: Yup.string().required("Flag file name is required"),
    file_content: Yup.string().required("Flag file content is required"),
    file_extension: Yup.string().required("Flag file extension is required"),
  }),
});

const Country = ({ selectedImage }) => {
  const queryClient = useQueryClient();
  const { data, error, isLoading } = useQuery(
    "countries",
    countryApi.getAllCountries
  );

  const [editedCountry, setEditedCountry] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const createCountry = useMutation(countryApi.createCountry, {
    onSuccess: () => queryClient.invalidateQueries("countries"),
  });

  const updateCountry = useMutation(
    ({ id, data }) => countryApi.updateCountry({ id, data }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("countries");
        setIsEditing(false);
        setEditedCountry(null);
      },
    }
  );

  const deleteCountry = useMutation(countryApi.deleteCountry, {
    onSuccess: () => queryClient.invalidateQueries("countries"),
  });

  const handleEdit = (country) => {
    setEditedCountry(country);
    setIsEditing(true);
  };

  const handleDelete = (id) => deleteCountry.mutate(id);

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

  const handleSave = (updatedCountry) => {
    updateCountry.mutate({
      id: updatedCountry.id,
      data: {
        ...updatedCountry,
        flag: {
          ...updatedCountry.flag,
          file_content: selectedImage,
          file_name: updatedCountry.flag.file_name || "default_name.png", // Ensure file_name is set
        },
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div
          className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full"
          role="status"
        >
          <span className="sr-only">Loading...</span>
        </div>
        <p className="text-lg font-medium text-gray-600 ml-4">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-red-100 p-4 rounded">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 text-red-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="text-lg font-medium text-red-600">
          Error loading countries
        </p>
      </div>
    );
  }

  const countries = data?.data || [];

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Countries</h1>
      <Formik
        initialValues={{
          name: "",
          flag: {
            file_name: "",
            file_content: "",
            file_extension: "",
          },
        }}
        validationSchema={formikSchema}
        onSubmit={(values, { resetForm }) => {
          if (isEditing && editedCountry) {
            updateCountry.mutate({ id: editedCountry.id, data: values });
          } else {
            createCountry.mutate(values);
          }
          resetForm();
          setIsEditing(false);
          setEditedCountry(null);
        }}
      >
        {({ setFieldValue }) => (
          <Form className="mb-4">
            <div className="mb-2">
              <Field
                type="text"
                name="name"
                placeholder="Name"
                className="w-full p-2 border border-gray-300 rounded"
              />
              <ErrorMessage
                name="name"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>
            <div className="mb-2">
              <input
                type="file"
                name="flag.file_content"
                onChange={(event) => handleFileChange(event, setFieldValue)}
                className="w-full p-2 border border-gray-300 rounded"
              />
              <ErrorMessage
                name="flag.file_content"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>
            <Field type="hidden" name="flag.file_name" />
            <Field type="hidden" name="flag.file_content" />
            <Field type="hidden" name="flag.file_extension" />
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded"
            >
              {isEditing ? "Update Country" : "Add Country"}
            </button>
          </Form>
        )}
      </Formik>
      <ul className="divide-y divide-gray-200 overflow-auto h-80 w-100 bg-white rounded shadow-md p-4">
        {countries.map((country, index) => (
          <li
            key={country.id}
            className="flex items-center justify-between p-4 hover:bg-gray-100"
          >
            <div className="flex items-center">
              <span className="text-lg font-medium pr-4">{index + 1}.</span>
              <img
                src={country.flag.file_path}
                alt={country.name}
                width={50}
                className="mr-4 rounded"
              />
              <span className="text-lg font-medium">{country.name}</span>
            </div>
            <div>
              <button
                onClick={() => handleEdit(country)}
                className="bg-yellow-500 text-white px-3 py-1 rounded mr-2 hover:bg-yellow-600"
              >
                <EditIcon />
              </button>
              <button
                onClick={() => {
                  setIsDeleteDialogOpen(true);
                  setEditedCountry(country);
                }}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                <DeleteIcon />
              </button>
            </div>
          </li>
        ))}
      </ul>
      {editedCountry && (
        <>
          <EditDialog
            open={isEditing}
            handleClose={() => setIsEditing(false)}
            handleSave={handleSave}
            country={editedCountry}
          />
          <DeleteDialog
            open={isDeleteDialogOpen}
            handleClose={() => setIsDeleteDialogOpen(false)}
            handleDelete={handleDelete}
            country={editedCountry}
          />
        </>
      )}
    </div>
  );
};

export default Country;
