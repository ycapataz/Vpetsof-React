import axios from "axios";

const Url_city = 'http://localhost:8080/api/city';

class CityService {
    getAllCities() {
        return axios.get(`${Url_city}/all`);
    }

    getIdCities(id) {
        return axios.get(`${Url_city}/Get/${id}`);
    }

    createCity(cityData) {
        return axios.post(`${Url_city}/create`, cityData);
    }

    updateCity(id, updatedData) {
        return axios.put(`${Url_city}/update/${id}`, updatedData);
    }
}

export default new CityService();