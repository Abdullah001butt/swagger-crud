import axios from "axios";

const apiUrl = "http://207.180.230.73/Ecommerce/v1";

const cityApi = {
  // Get all cities
  async getAllCities({ pageIndex, pageSize }) {
    return axios
      .get(`${apiUrl}/city`, {
        params: { pageIndex, pageSize },
      })
      .then((response) => response.data);
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
    console.log("Creating city with data:", data);
    try {
      const response = await axios.post(`${apiUrl}/city`, data);
      console.log("Response from server:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error creating city:", error);
      if (error.response) {
        const errorMessage = error.response.data.message;
        console.error("Error message:", errorMessage);
        throw new Error(errorMessage);
      } else {
        throw error;
      }
    }
  },

  // Update an existing city
  async updateCity({ id, data }) {
    if (!id || !data) {
      throw new Error("ID and data are required to update a city");
    }
    try {
      const response = await axios.put(`${apiUrl}/city/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Error updating city:", error);
      if (error.response) {
        const errorMessage = error.response.data.message;
        console.error("Error message:", errorMessage);
        throw new Error(errorMessage);
      } else {
        throw error;
      }
    }
  },

  // Delete a city
  async deleteCity(id) {
    try {
      const response = await axios.delete(`${apiUrl}/city/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting city:", error);
      if (error.response) {
        const errorMessage = error.response.data.message;
        console.error("Error message:", errorMessage);
        throw new Error(errorMessage);
      } else {
        throw error;
      }
    }
  },
};

export default cityApi;
