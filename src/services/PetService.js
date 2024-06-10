import axios from "axios";

const Url_pet = 'http://localhost:8080/api/pet';

class PetService {
    getAllPets() {
        return axios.get(`${Url_pet}/all`);
    }

    getIdPet(id) {
        return axios.get(`${Url_pet}/Get/${id}`);
    }

    createPet(petData) {
        return axios.post(`${Url_pet}/create`, petData);
    }

    updatePet(id, updatedData) {
        return axios.put(`${Url_pet}/update/${id}`, updatedData);
    }
}

export default new PetService();