import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import cityApi from "../api/cityApi";
import countryApi from "../api/countryApi"; // Import country API
import CityEditDialog from "../Dialogs/CityEditDialog";
import CityDeleteDialog from "../Dialogs/CityDeleteDialog";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { MenuItem, TextField } from "@mui/material";

const formikSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  countryId: Yup.number().required("Country is required"),
});

const City = () => {
  const queryClient = useQueryClient();
  const { data: countries, isLoading: isLoadingCountries } = useQuery(
    "countries",
    countryApi.getAllCountries
  ); // Fetch all countries
  const { data, error, isLoading } = useQuery("cities", cityApi.getAllCities);

  const [editedCity, setEditedCity] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    console.log("Countries:", countries?.data);
  }, [countries]);

  const createCity = useMutation(
    async (data) => {
      const country = countries?.data?.find((c) => c.id === data.countryId);
      if (!country) {
        throw new Error("Country not found");
      }
      return cityApi.createCity(data);
    },
    {
      onSuccess: () => queryClient.invalidateQueries("cities"),
      onError: (error) => {
        console.error("Error creating city:", error);
        alert(error.message);
      },
    }
  );

  const updateCity = useMutation(
    ({ id, data }) => cityApi.updateCity({ id, data }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("cities");
        setIsEditing(false);
        setEditedCity(null);
      },
      onError: (error) => {
        console.error("Error updating city:", error);
        alert(error.message);
      },
    }
  );

  const deleteCity = useMutation(cityApi.deleteCity, {
    onSuccess: () => queryClient.invalidateQueries("cities"),
    onError: (error) => {
      console.error("Error deleting city:", error);
      alert(error.message);
    },
  });

  const handleEdit = (city) => {
    setEditedCity(city);
    setIsEditing(true);
  };

  const handleDelete = (id) => deleteCity.mutate(id);

  const handleSave = (updatedCity) => {
    updateCity.mutate({
      id: updatedCity.id,
      data: {
        ...updatedCity,
      },
    });
  };

  const handleSubmit = (values, { resetForm }) => {
    console.log("Values being sent:", values);
    if (isEditing && editedCity) {
      updateCity.mutate({ id: editedCity.id, data: values });
    } else {
      createCity.mutate(values);
    }
    resetForm();
    setIsEditing(false);
    setEditedCity(null);
  };

  if (isLoading || isLoadingCountries) {
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
          countryId: "",
        }}
        validationSchema={formikSchema}
        onSubmit={handleSubmit}
      >
        {({ values, handleChange }) => (
          <Form className="mb-4">
            {!isEditing && (
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
                  {countries?.data.map((country) => (
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
            )}
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
          <CityEditDialog
            open={isEditing}
            handleClose={() => setIsEditing(false)}
            handleSave={handleSave}
            city={editedCity}
          />
          <CityDeleteDialog
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
