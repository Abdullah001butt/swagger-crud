import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import countryApi from "../api/countryApi";
import { nanoid } from "nanoid";

const Country = () => {
  const { data, error, isLoading } = useQuery(
    "countries", // key
    countryApi.getAllCountries // function to fetch data
  );
  console.log("Data:", data);

  const [newCountry, setNewCountry] = useState({ name: "", code: "" });
  const [editedCountry, setEditedCountry] = useState(null);

  const queryClient = useQueryClient();

  const { mutate: createCountry } = useMutation(
    "createCountry", // key
    async (newCountry) => {
      const countryId = nanoid();
      return countryApi.createCountry({ ...newCountry, id: countryId });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("countries"); // invalidate cache
      },
    }
  );

  const { mutate: updateCountry } = useMutation(
    "updateCountry", // key
    countryApi.updateCountry, // function to update country
    {
      onSuccess: () => {
        queryClient.invalidateQueries("countries"); // invalidate cache
      },
    }
  );

  const { mutate: deleteCountry } = useMutation(
    "deleteCountry", // key
    countryApi.deleteCountry, // function to delete country
    {
      onSuccess: () => {
        queryClient.invalidateQueries("countries"); // invalidate cache
      },
    }
  );

  useEffect(() => {
    if (editedCountry) {
      updateCountry(editedCountry.id, editedCountry); // Pass editedCountry directly
    }
  }, [editedCountry]);

  const handleSubmit = (event) => {
    event.preventDefault();
    createCountry(newCountry);
    setNewCountry({ name: "", code: "" });
  };

  const handleEdit = (country) => {
    setEditedCountry({ ...country }); // Set the editedCountry state with the country data
  };

  const handleDelete = (id) => {
    deleteCountry(id);
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
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-red-100">
        <div className="text-lg font-bold text-red-600">
          <i className="fas fa-exclamation-triangle" /> Error: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-4 pt-6 md:p-6 lg:p-12">
      <h1 className="text-3xl font-bold mb-4">Countries</h1>
      <form onSubmit={handleSubmit} className="flex flex-wrap mb-4">
        <input
          type="text"
          value={newCountry.name}
          onChange={(event) =>
            setNewCountry({ ...newCountry, name: event.target.value })
          }
          placeholder="Name"
          className="w-full p-2 pl-10 text-sm text-gray-700 border border-gray-300 rounded-md"
        />
        <input
          type="text"
          value={newCountry.code}
          onChange={(event) =>
            setNewCountry({ ...newCountry, code: event.target.value })
          }
          placeholder="Code"
          className="w-full p-2 pl-10 text-sm text-gray-700 border border-gray-300 rounded-md"
        />
        <button
          type="submit"
          className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-md"
        >
          Create Country
        </button>
      </form>
      <ul className="divide-y divide-gray-200">
        {data.data.map((country) => (
          <li key={country.id} className="py-4 flex justify-between">
            <div className="flex items-center">
              <span className="text-lg">{country.name}</span>
              {country.flag.file_name && (
                <img
                  src={`/flags/${country.flag.file_name}`}
                  alt={country.name}
                  className="w-6 h-6 ml-2 rounded-full"
                />
              )}
            </div>
            <div className="flex items-center">
              <button
                onClick={() => handleEdit(country)}
                className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-md"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(country.id)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md ml-2"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
      {editedCountry && (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            const updatedCountry = {
              ...editedCountry,
              name: event.target.name.value,
              code: event.target.code.value,
            };
            updateCountry(updatedCountry.id, updatedCountry);
          }}
          className="flex flex-wrap mb-4"
        >
          <input
            type="text"
            value={editedCountry.name}
            onChange={(event) =>
              setEditedCountry({ ...editedCountry, name: event.target.value })
            }
            placeholder="Name"
            className="w-full p-2 pl-10 text-sm text-gray-700 border border-gray-300 rounded-md"
            name="name"
          />
          <input
            type="text"
            value={editedCountry.code}
            onChange={(event) =>
              setEditedCountry({ ...editedCountry, code: event.target.value })
            }
            placeholder="Code"
            className="w-full p-2 pl-10 text-sm text-gray-700 border border-gray-300 rounded-md"
            name="code"
          />
          <button
            type="submit"
            className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-md"
          >
            Update Country
          </button>
        </form>
      )}
    </div>
  );
};

export default Country;
