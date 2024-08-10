import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import cityApi from "../api/cityApi";
import countryApi from "../api/countryApi"; // Import country API
import EditDialog from "../Dialogs/EditDialog";
import DeleteDialog from "../Dialogs/DeleteDialog";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const formikSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  countryId: Yup.number().required("Country is required"), // Add country ID validation
});

const City = () => {
  const queryClient = useQueryClient();
  const { data: countries } = useQuery("countries", countryApi.getAllCountries); // Fetch all countries
  const { data, error, isLoading } = useQuery("cities", cityApi.getAllCities);

  const [editedCity, setEditedCity] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const createCity = useMutation(cityApi.createCity, {
    onSuccess: () => queryClient.invalidateQueries("cities"),
  });

  const updateCity = useMutation(
    ({ id, data }) => cityApi.updateCity({ id, data }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("cities");
        setIsEditing(false);
        setEditedCity(null);
      },
    }
  );

  const deleteCity = useMutation(cityApi.deleteCity, {
    onSuccess: () => queryClient.invalidateQueries("cities"),
  });

  const handleEdit = (city) => {
    setEditedCity(city);
    setIsEditing(true);
  };

  const handleDelete = (id) => deleteCity.mutate(id);

  const handleSave = (updatedCity) => {
    updateCity
      .mutate({
        id: updatedCity.id,
        data: {
          ...updatedCity,
          countryId: updatedCity.countryId,
        },
      })
      .then((response) => {
        if (!response.success) {
          // Display an error message to the user
          alert(response.message);
        } else {
          // City updated successfully
          setIsEditing(false);
          setEditedCity(null);
        }
      })
      .catch((error) => {
        // Handle any unexpected errors
        console.error(error);
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
        <p className="text-lg font-medium text-red-600">Error loading cities</p>
      </div>
    );
  }

  const cities = data?.data || [];

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Cities</h1>
      <Formik
        initialValues={{
          name: "",
          countryId: "", // Initialize country ID field
        }}
        validationSchema={formikSchema}
        onSubmit={(values, { resetForm }) => {
          if (isEditing && editedCity) {
            updateCity.mutate({ id: editedCity.id, data: values });
          } else {
            createCity.mutate(values);
          }
          resetForm();
          setIsEditing(false);
          setEditedCity(null);
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
              <label>Country:</label>
              <Field
                as="select"
                name="countryId"
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="">Select a country</option>
                {countries?.data?.map((country) => (
                  <option key={country.id} value={country.id}>
                    {country.name}
                  </option>
                ))}
              </Field>
              <ErrorMessage
                name="countryId"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded"
            >
              {isEditing ? "Update City" : "Add City"}
            </button>
          </Form>
        )}
      </Formik>
      <ul className="divide-y divide-gray-200 overflow-auto h-80 w-100 bg-white rounded shadow-md p-4">
        {cities.map((city, index) => (
          <li
            key={city.id}
            className="flex items-center justify-between p-4 hover:bg-gray-100"
          >
            <div className="flex items-center">
              <span className="text-lg font-medium pr-4">{index + 1}.</span>
              <span className="text-lg font-medium">{city.name}</span>
            </div>
            <div>
              <button
                onClick={() => handleEdit(city)}
                className="bg-yellow-500 text-white px-3 py-1 rounded mr-2 hover:bg-yellow-600"
              >
                <EditIcon />
              </button>
              <button
                onClick={() => {
                  setIsDeleteDialogOpen(true);
                  setEditedCity(city);
                }}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                <DeleteIcon />
              </button>
            </div>
          </li>
        ))}
      </ul>
      {editedCity && (
        <>
          <EditDialog
            open={isEditing}
            handleClose={() => setIsEditing(false)}
            handleSave={handleSave}
            city={editedCity}
          />
          <DeleteDialog
            open={isDeleteDialogOpen}
            handleClose={() => setIsDeleteDialogOpen(false)}
            handleDelete={handleDelete}
            city={editedCity}
          />
        </>
      )}
    </div>
  );
};

export default City;
