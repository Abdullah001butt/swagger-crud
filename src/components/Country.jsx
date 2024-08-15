import React, { useState } from "react";
import { useQuery, useQueryClient, useMutation } from "react-query";
import countryApi from "../api/countryApi";
import EditDialog from "../Dialogs/EditDialog";
import DeleteDialog from "../Dialogs/DeleteDialog";
import AddDialog from "../Dialogs/AddDialog";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import TablePagination from "@mui/material/TablePagination";

const Country = ({ selectedImage }) => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0); // MUI TablePagination uses 0-based index
  const [rowsPerPage, setRowsPerPage] = useState(3); // Set initial rows per page

  const { data, error, isLoading, isFetching } = useQuery(
    ["countries", page, rowsPerPage],
    () =>
      countryApi.getAllCountries({
        pageIndex: page + 1,
        pageSize: rowsPerPage,
      }),
    { keepPreviousData: true }
  );

  const [editedCountry, setEditedCountry] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [message, setMessage] = useState(null);

  const createCountry = useMutation(countryApi.createCountry, {
    onSuccess: () => {
      queryClient.invalidateQueries("countries");
      setMessage({ type: "success", text: "Country created successfully!" });
    },
    onError: () => {
      setMessage({ type: "error", text: "Failed to create country." });
    },
  });

  const updateCountry = useMutation(
    ({ id, data }) => countryApi.updateCountry({ id, data }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("countries");
        setIsEditing(false);
        setEditedCountry(null);
        setMessage({ type: "success", text: "Country updated successfully!" });
      },
      onError: () => {
        setMessage({ type: "error", text: "Failed to update country." });
      },
    }
  );

  const deleteCountry = useMutation(countryApi.deleteCountry, {
    onSuccess: () => {
      queryClient.invalidateQueries("countries");
      setMessage({ type: "success", text: "Country deleted successfully!" });
    },
    onError: () => {
      setMessage({ type: "error", text: "Failed to delete country." });
    },
  });

  const handleEdit = (country) => {
    setEditedCountry(country);
    setIsEditing(true);
  };

  const handleDelete = (id) => deleteCountry.mutate(id);

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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page
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
  const totalPages = data?.total_pages || 0;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Countries</h1>
      <button
        onClick={() => setIsAddDialogOpen(true)}
        className="bg-gradient-to-r from-green-400 to-blue-500 text-white font-semibold py-2 px-4 rounded shadow-md hover:from-green-500 hover:to-blue-600 transition duration-300"
      >
        Add Country
      </button>
      {message && (
        <div
          className={`mt-4 p-4 rounded ${
            message.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}
      <ul className="divide-y divide-gray-200 overflow-auto h-80 w-100 bg-white rounded shadow-md p-4 mt-4">
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
      <TablePagination
        component="div"
        count={totalPages * rowsPerPage} // Assuming totalPages is the total number of pages
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
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
      <AddDialog
        open={isAddDialogOpen}
        handleClose={() => setIsAddDialogOpen(false)}
        handleSave={(newCountry) => createCountry.mutate(newCountry)}
      />
    </div>
  );
};

export default Country;
