import axios from "axios";

const Url_employee = 'http://localhost:8080/api/employees';

class EmployeeService {
    getAllEmployees() {
        return axios.get(`${Url_employee}/all`);
    }

    getIdEmployee(id) {
        return axios.get(`${Url_employee}/Get/${id}`);
    }

    createEmployee(employeeData) {
        return axios.post(`${Url_employee}/create`, employeeData);
    }

    updateEmployee(id, updatedData) {
        return axios.put(`${Url_employee}/update/${id}`, updatedData);
    }
}

export default new EmployeeService();