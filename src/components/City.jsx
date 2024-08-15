import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import cityApi from "../api/cityApi";
import countryApi from "../api/countryApi"; // Import country API
import CityEditDialog from "../Dialogs/CityEditDialog";
import CityDeleteDialog from "../Dialogs/CityDeleteDialog";
import CityAddDialog from "../Dialogs/CityAddDialog";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import TablePagination from "@mui/material/TablePagination";

const City = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0); // MUI TablePagination uses 0-based index
  const [rowsPerPage, setRowsPerPage] = useState(3); // Set initial rows per page

  const { data: countries, isLoading: isLoadingCountries } = useQuery(
    "countries",
    countryApi.getAllCountries
  ); // Fetch all countries
  const { data, error, isLoading, isFetching } = useQuery(
    ["cities", page, rowsPerPage],
    () => cityApi.getAllCities({ pageIndex: page + 1, pageSize: rowsPerPage }),
    { keepPreviousData: true }
  );

  const [editedCity, setEditedCity] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    console.log("Countries:", countries?.data);
  }, [countries]);

  const createCity = useMutation(cityApi.createCity, {
    onSuccess: () => {
      queryClient.invalidateQueries("cities");
      setMessage({ type: "success", text: "City created successfully!" });
    },
    onError: () => {
      setMessage({ type: "error", text: "Failed to create city." });
    },
  });

  const updateCity = useMutation(
    ({ id, data }) => cityApi.updateCity({ id, data }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("cities");
        setIsEditing(false);
        setEditedCity(null);
        setMessage({ type: "success", text: "City updated successfully!" });
      },
      onError: () => {
        setMessage({ type: "error", text: "Failed to update city." });
      },
    }
  );

  const deleteCity = useMutation(cityApi.deleteCity, {
    onSuccess: () => {
      queryClient.invalidateQueries("cities");
      setMessage({ type: "success", text: "City deleted successfully!" });
    },
    onError: () => {
      setMessage({ type: "error", text: "Failed to delete city." });
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page
  };

  const handleCloseMessage = () => {
    setMessage(null);
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
        <p className="text-lg font-medium text-red-600">Error loading cities</p>
      </div>
    );
  }

  const cities = data?.data || [];
  const totalCities = data?.total || 0; // Assuming total number of cities is provided

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Cities</h1>
      <button
        onClick={() => setIsAddDialogOpen(true)}
        className="bg-gradient-to-r from-green-400 to-blue-500 text-white font-semibold py-2 px-4 rounded shadow-md hover:from-green-500 hover:to-blue-600 transition duration-300"
      >
        Add City
      </button>
      {message && (
        <div
          className={`mt-4 p-4 rounded relative ${
            message.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message.text}
          <button
            onClick={handleCloseMessage}
            className="absolute top-0 right-0 mt-2 mr-2 text-lg font-bold"
          >
            <CloseIcon />
          </button>
        </div>
      )}
      <ul className="divide-y divide-gray-200 overflow-auto h-80 w-100 bg-white rounded shadow-md p-4 mt-4">
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
      <TablePagination
        component="div"
        count={totalCities}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[3, 5, 10]}
        labelRowsPerPage="Rows per page"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} of ${count}`
        }
        slotProps={{
          actions: {
            nextButton: {
              disabled: (page + 1) * rowsPerPage >= totalCities,
            },
          },
        }}
      />
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
      <CityAddDialog
        open={isAddDialogOpen}
        handleClose={() => setIsAddDialogOpen(false)}
        handleSave={(newCity) => createCity.mutate(newCity)}
        countries={countries?.data || []}
      />
    </div>
  );
};

export default City;
