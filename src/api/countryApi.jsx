import axios from "axios";
import { nanoid } from "nanoid";

const apiUrl = "http://207.180.230.73/Ecommerce/v1";

const countryApi = {
  async getAllCountries() {
    try {
      const response = await axios.get(`${apiUrl}/country`);
      return response.data;
    } catch (error) {
      console.error("Error fetching all countries:", error);
      throw error;
    }
  },

  async getCountryById(id) {
    try {
      const response = await axios.get(`${apiUrl}/country/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching country with id ${id}:`, error);
      throw error;
    }
  },

  async getCountryByName(name) {
    try {
      const response = await axios.get(`${apiUrl}/country/${name}/view`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching country with name ${name}:`, error);
      throw error;
    }
  },

  async createCountry(data) {
    try {
      const countryId = nanoid();
      console.log("Request payload:", { ...data, id: countryId }); // <--- Add this line
      const response = await axios.post(
        `${apiUrl}/country`,
        { ...data, id: countryId },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Response from API endpoint:", response.data); // <--- Add this line
      return response.data;
    } catch (error) {
      console.error("Error creating country:", error);
      throw error;
    }
  },

  async updateCountry(countryId, data) {
    try {
      console.log(`Updating country with id ${countryId} and data:`, data);
      console.log("Data object:", data); // <--- Add this line
      if (!data) {
        throw new Error("Data object is undefined");
      }
      const response = await axios.put(`${apiUrl}/country/${countryId}`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("Response:", response);
      return response.data;
    } catch (error) {
      console.error(`Error updating country with id ${countryId}:`, error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
      }
      throw error;
    }
  },
  async deleteCountry(id) {
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
