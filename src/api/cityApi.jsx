// cityApi.js
import axios from "axios";

const apiUrl = "http://207.180.230.73/Ecommerce/v1";

const cityApi = {
  // Get all cities
  async getAllCities() {
    return axios.get(`${apiUrl}/city`).then((response) => response.data);
  },

  // Get city by ID
  async getCityById(id) {
    return axios.get(`${apiUrl}/city/${id}`).then((response) => response.data);
  },

  // Get city by name
  async getCityByName(name) {
    return axios
      .get(`${apiUrl}/city/${name}/view`)
      .then((response) => response.data);
  },

  // Create a new city
  async createCity(data) {
    try {
      const response = await axios.post(`${apiUrl}/city`, data);
      return response.data;
    } catch (error) {
      if (error.response) {
        // API returned an error response
        const errorMessage = error.response.data.message;
        throw new Error(errorMessage);
      } else {
        // Network error or other unexpected error
        throw error;
      }
    }
  },

  // Update an existing city
  async updateCity({ id, data }) {
    if (!id || !data) {
      throw new Error("ID and data are required to update a city");
    }
    return axios
      .put(`${apiUrl}/city/${id}`, data)
      .then((response) => response.data);
  },

  // Delete a city
  async deleteCity(id) {
    return axios
      .delete(`${apiUrl}/city/${id}`)
      .then((response) => response.data);
  },
};

export default cityApi;
