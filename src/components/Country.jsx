import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import countryApi from "../api/countryApi";
import { nanoid } from "nanoid";

const Country = () => {
  const { data, error, isLoading } = useQuery(
    "countries",
    countryApi.getAllCountries
  );
  const queryClient = useQueryClient();

  const [newCountry, setNewCountry] = useState({ name: "", code: "" });
  const [editedCountry, setEditedCountry] = useState(null);

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
      console.log("Mutation Parameters:", { id, data });
      if (!id || !data) {
        throw new Error("ID and data are required to update a country");
      }
      return countryApi.updateCountry({ id, data });
    },
    {
      onSuccess: () => queryClient.invalidateQueries("countries"),
    }
  );

  const { mutate: deleteCountry } = useMutation(
    "deleteCountry",
    countryApi.deleteCountry,
    {
      onSuccess: () => queryClient.invalidateQueries("countries"),
    }
  );

  useEffect(() => {
    if (editedCountry) {
      updateCountry({ id: editedCountry.id, data: newCountry });
    }
  }, [editedCountry]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const countryId = nanoid();
    createCountry({ ...newCountry, id: countryId });
    console.log("Created Country with ID:", countryId);
  };

  const handleEdit = (country) => {
    console.log("Editing Country:", country);
    setEditedCountry(country);
    setNewCountry({ name: country.name, code: country.code });
  };

  const handleDelete = (id) => {
    deleteCountry(id);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h1>Countries</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={newCountry.name || ""}
          onChange={(event) =>
            setNewCountry({ ...newCountry, name: event.target.value })
          }
          placeholder="Name"
        />
        <input
          type="text"
          value={newCountry.code || ""}
          onChange={(event) =>
            setNewCountry({ ...newCountry, code: event.target.value })
          }
          placeholder="Code"
        />
        <button type="submit">Create Country</button>
      </form>
      <ul>
        {data.data.map((country) => (
          <li key={country.id}>
            <span>{country.name}</span>
            <button onClick={() => handleEdit(country)}>Edit</button>
            <button onClick={() => handleDelete(country.id)}>Delete</button>
          </li>
        ))}
      </ul>
      {editedCountry && (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            updateCountry({
              id: editedCountry.id,
              data: { name: editedCountry.name, code: editedCountry.code },
            });
          }}
        >
          <input
            type="text"
            value={editedCountry.name || ""}
            onChange={(event) =>
              setEditedCountry({ ...editedCountry, name: event.target.value })
            }
            placeholder="Name"
          />
          <input
            type="text"
            value={editedCountry.code || ""}
            onChange={(event) =>
              setEditedCountry({ ...editedCountry, code: event.target.value })
            }
            placeholder="Code"
          />
          <button type="submit">Update Country</button>
        </form>
      )}
    </div>
  );
};

export default Country;
