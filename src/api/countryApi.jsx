import axios from "axios";
import { nanoid } from "nanoid";

const apiUrl = "http://207.180.230.73/Ecommerce/v1";

const countryApi = {
  // Get all countries
  async getAllCountries() {
    return axios.get(`${apiUrl}/country`).then((response) => response.data);
  },

  // Get country by ID
  async getCountryById(id) {
    return axios
      .get(`${apiUrl}/country/${id}`)
      .then((response) => response.data);
  },

  // Get country by name
  async getCountryByName(name) {
    return axios
      .get(`${apiUrl}/country/${name}/view`)
      .then((response) => response.data);
  },

  // Create a new country
  async createCountry(data) {
    const countryId = nanoid();
    return axios
      .post(`${apiUrl}/country`, { ...data, id: countryId })
      .then((response) => response.data);
  },

  // Update an existing country
  async updateCountry({ id, data }) {
    if (!id || !data) {
      throw new Error("ID and data are required to update a country");
    }
    return axios
      .put(`${apiUrl}/country/${id}`, data)
      .then((response) => response.data);
  },

  // Delete a country
  async deleteCountry(id) {
    return axios
      .delete(`${apiUrl}/country/${id}`)
      .then((response) => response.data);
  },
};

export default countryApi;
