import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import countryApi from "../api/countryApi";
import { nanoid } from "nanoid";

const formikSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  code: Yup.string().required("Code is required"),
});

const Country = () => {
  const { data, error, isLoading } = useQuery(
    "countries",
    countryApi.getAllCountries
  );
  const queryClient = useQueryClient();

  const [editedCountry, setEditedCountry] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const { mutate: createCountry } = useMutation(
    "createCountry",
    async (newCountry) => {
      const countryId = nanoid();
      return countryApi.createCountry({ ...newCountry, id: countryId });
    },
    {
      onSuccess: () => queryClient.invalidateQueries("countries"),
    }
  );

  const { mutate: updateCountry } = useMutation(
    "updateCountry",
    ({ id, data }) => {
      if (!id || !data) {
        throw new Error("ID and data are required to update a country");
      }
      return countryApi.updateCountry({ id, data });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("countries");
        setIsEditing(false); // Hide the form after a successful update
      },
    }
  );

  const { mutate: deleteCountry } = useMutation(
    "deleteCountry",
    countryApi.deleteCountry,
    {
      onSuccess: () => queryClient.invalidateQueries("countries"),
    }
  );

  const handleEdit = (country) => {
    setEditedCountry(country);
    setIsEditing(true); // Show the form when editing
  };

  const handleDelete = (id) => {
    deleteCountry(id);
  };

  if (isLoading) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center text-red-500">Error: {error.message}</div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Countries</h1>
      <Formik
        initialValues={{ name: "", code: "" }}
        validationSchema={formikSchema}
        onSubmit={(values, { resetForm }) => {
          if (isEditing && editedCountry) {
            updateCountry({ id: editedCountry.id, data: values });
          } else {
            const countryId = nanoid();
            createCountry({ ...values, id: countryId });
          }
          resetForm();
          setEditedCountry(null);
        }}
      >
        {({ resetForm }) => (
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
              <Field
                type="text"
                name="code"
                placeholder="Code"
                className="w-full p-2 border border-gray-300 rounded"
              />
              <ErrorMessage
                name="code"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              {isEditing ? "Update Country" : "Create Country"}
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setIsEditing(false);
                  setEditedCountry(null);
                }}
                className="w-full mt-2 bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            )}
          </Form>
        )}
      </Formik>
      <ul className="space-y-2">
        {data.data.map((country) => (
          <li
            key={country.id}
            className="p-2 border border-gray-300 rounded flex justify-between items-center"
          >
            <span>{country.name}</span>
            <div>
              <button
                onClick={() => handleEdit(country)}
                className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(country.id)}
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Country;
