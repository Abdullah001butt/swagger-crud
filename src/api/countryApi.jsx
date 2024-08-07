import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const apiUrl = "http://207.180.230.73/Ecommerce/v1";

const countryApi = {
  getAllCountries: async () => {
    try {
      const response = await axios.get(`${apiUrl}/country`);
      return response.data;
    } catch (error) {
      console.error("Error fetching all countries:", error);
      throw error;
    }
  },
  getCountryById: async (id) => {
    try {
      const response = await axios.get(`${apiUrl}/country/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching country with id ${id}:`, error);
      throw error;
    }
  },
  getCountryByName: async (name) => {
    try {
      const response = await axios.get(`${apiUrl}/country/${name}/view`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching country with name ${name}:`, error);
      throw error;
    }
  },
  createCountry: async (data) => {
    try {
      // Generate a new UUID
      const countryId = uuidv4();

      // Create a new country with the generated UUID
      const response = await axios.post(
        `${apiUrl}/country`,
        { ...data, id: countryId }, // removed JSON.stringify
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error(`Error creating country:`, error);
      throw error;
    }
  },

  updateCountry: async (countryId, data) => {
    //eror here
    try {
      console.log("Updating country with id", countryId, "and data:", data);
      const response = await axios.put(`${apiUrl}/country/${countryId}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating country with id ${countryId}:`, error);
      throw error;
    }
  },
  deleteCountry: async (id) => {
    try {
      const response = await axios.delete(`${apiUrl}/country/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting country with id ${id}:`, error);
      throw error;
    }
  },
};

export default countryApi;
