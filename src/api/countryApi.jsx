import axios from "axios";

const apiUrl = "http://207.180.230.73/Ecommerce/v1";

const countryApi = {
  async getAllCountries({ pageIndex, pageSize }) {
    return axios
      .get(`${apiUrl}/country`, {
        params: { pageIndex, pageSize },
      })
      .then((response) => response.data);
  },
  async createCountry(countryData) {
    return axios.post(`${apiUrl}/country`, countryData);
  },
  async updateCountry({ id, data }) {
    return axios.put(`${apiUrl}/country/${id}`, data);
  },
  async deleteCountry(id) {
    return axios.delete(`${apiUrl}/country/${id}`);
  },
};

export default countryApi;
