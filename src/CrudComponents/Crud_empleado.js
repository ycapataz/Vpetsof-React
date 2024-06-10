import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Modal, Form, Button} from 'react-bootstrap';
import Navbar from "../components/Navbar";
import StylesTabla from '../assets/css/avg_encabezado.module.scss';
import CustomerService from '../services/CustomerService';
import Menu_recepcionista from '../components/Menu_recepcionista';


function Crud_Clientes() {
    const [customers, setCustomers] = useState([]);
    const [error, setError] = useState(null);
    const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
    const [mostrarModalGuardar, setMostrarModalGuardar] = useState(false);
    const [datosFormularioEdicion, setDatosFormularioEdicion] = useState({ id: '', name: '', lastName: '', dni: '', phone: '', mail: '', address: '' ,city: ''});
    const [clienteSeleccionada, setClienteSeleccionada] = useState(null);
    const [ciudades, setCiudades] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await CustomerService.getAllCustomers();
            setCustomers(response.data.DATA);
            // Obtener ciudad
            const ciudades = response.data.DATA.map(cliente => ({ id: cliente.idciudad.id, name: cliente.idciudad.name }));
        
            // Filtrar valores únicos
            const ciudadesUnicas = ciudades.filter((ciudad, index, self) => self.findIndex(m => m.id === ciudad.id) === index);
            setCiudades(ciudadesUnicas);

        } catch (error) {
            setError(error.message);
        }
    };

    const abrirModalGuardar = () => {
        setMostrarModalGuardar(true);
    };
    
    const cerrarModalGuardar = () =>{
        setMostrarModalGuardar(false);
    };

    const abrirModalEdicion = (cliente) => {
        setClienteSeleccionada(cliente);
        setDatosFormularioEdicion({
            id: cliente.id,
            name: cliente.name,
            lastName: cliente.lastName,
            dni: cliente.dni,
            phone: cliente.phone,
            mail: cliente.mail,
            address: cliente.address,
            city: cliente.idciudad.name,
        });
        setMostrarModalEdicion(true);
    };

    const cerrarModalEdicion = () => {
        setMostrarModalEdicion(false);
    };

    //Funcion para Guardar
    const handleGuardarCliente = async () => {
        try {
            // Obtener el ID de la ciudad seleccionada
            const idCiudad = ciudades.find(ciudad => ciudad.name === datosFormularioEdicion.city)?.id;
 
            const response = await CustomerService.createCustomer({
                name: datosFormularioEdicion.name,
                lastName: datosFormularioEdicion.lastName,
                dni: datosFormularioEdicion.dni,
                phone: datosFormularioEdicion.phone,
                mail: datosFormularioEdicion.mail,
                address: datosFormularioEdicion.address,
                idciudad: {
                    id: idCiudad
                },
             
            });
            console.log('Respuesta de la API:', response.data);
            fetchData(); // Actualiza la tabla
            cerrarModalGuardar(); // Cierra el modal
            // Limpiar los datos del formulario
            setDatosFormularioEdicion({ id: '', name: '', lastName: '', dni: '', phone: '', mail: '', address: '', city: ''});
        } catch (error) {
            console.error('Error al guardar el propietario:', error);
            // Manejar el error
        }
    };    


//Funcion de actualizar
const handleActualizarCliente = async (datosCliente) => {
    try {
        console.log('Datos del Propietario a actualizar:', datosCliente);

        // Obtener el ID de la iudad seleccionada
        const idCiudad = ciudades.find(ciudad => ciudad.name === datosCliente.city)?.id;
        
        const response = await CustomerService.updateCustomer(datosCliente.id, {
            name: datosCliente.name,
            lastName: datosCliente.lastName,
            dni: datosCliente.dni,
            phone: datosCliente.phone,
            mail: datosCliente.mail,
            address: datosCliente.address,
            idciudad: {
                id: idCiudad
            },
        });
        console.log('Respuesta de la API:', response.data);
        fetchData();//Actualiza la tabla
        cerrarModalEdicion();//Cierra el modal o ventana emergente

    } catch (error) {
        console.error('Error al actualizar el propietario:', error);
        // Manejar el error
    }
};      

return (
    <>
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }} >
    <Menu_recepcionista/>
    <div style={{ display: 'flex', flexGrow: 1 }}>
    <div>
        <Navbar/>
    </div>
    {/*Tabla donde se muestra todo*/}
    <div className={StylesTabla.containerTable}>
        <div className={StylesTabla.TableHeader}>
            <section className="table__header">
                <h1 className={StylesTabla.NombreTable}>Tabla Propietario</h1>
                <div>
                    <button className={StylesTabla.buttonHeader} onClick={() => abrirModalGuardar()}>Crear Propietario</button>
                </div>
                <br/>
                <div className={StylesTabla.DivInpuctsearch}>
                    <input className={StylesTabla.Inpuctsearch} type="search" placeholder="Buscar" />
                    <i className="bi bi-search-heart" style={{ color: '#56208c', position: 'absolute', top: '10px', right: '1rem', fontSize: '1.2rem' }}></i>
                </div>
            </section>
        </div>
        <div className={StylesTabla.tablebody}>
            <table className="table table-striped table-hover">
                <thead>
                    <tr>
                        <th style={{ textAlign: "center" }}>Id</th>
                        <th style={{ textAlign: "center" }}>Nombres</th>
                        <th style={{ textAlign: "center" }}>Apellidos</th>
                        <th style={{ textAlign: "center" }}>No Cedula</th>
                        <th style={{ textAlign: "center" }}>Telefono</th>
                        <th style={{ textAlign: "center" }}>Mail</th>
                        <th style={{ textAlign: "center" }}>Direccion</th>
                        <th style={{ textAlign: "center" }}>Ciudad</th>
                        <th style={{ textAlign: "center" }}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {customers.map(customer => (
                        <tr key={customer.id}>
                            <td style={{ textAlign: "center" }}>{customer.id}</td>
                            <td style={{ textAlign: "center" }}>{customer.name}</td>
                            <td style={{ textAlign: "center" }}>{customer.lastName}</td>
                            <td style={{ textAlign: "center" }}>{customer.dni}</td>
                            <td style={{ textAlign: "center" }}>{customer.phone}</td>
                            <td style={{ textAlign: "center" }}>{customer.mail}</td>
                            <td style={{ textAlign: "center" }}>{customer.address}</td>
                            <td style={{ textAlign: "center" }}>{customer.idciudad.name}</td>
                           
                            <td style={{ textAlign: "center" }}>
                                <button type="button" className="btn btn-primary btn-sm" style={{ height: '3rem', width: '3rem', background: 'transparent', boxShadow: 'none', borderColor: 'transparent' }} onClick={() => abrirModalEdicion(customer)}>
                                    <i className="bi bi-pencil-square" style={{ fontSize: '2rem', textAlign: "center", cursor: 'pointer' }}></i>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        {/*Modal o ventana emejernte para EDITAR */}
        <Modal show={mostrarModalEdicion} onHide={cerrarModalEdicion}>
            <Modal.Header closeButton>
                <Modal.Title>Editar Propietario</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="formBasicName">
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control type="text" value={datosFormularioEdicion.name} onChange={(e) => setDatosFormularioEdicion({ ...datosFormularioEdicion, name: e.target.value })} />
                    </Form.Group>
                    <Form.Group controlId="formBasiclastName">
                        <Form.Label>Apellidos</Form.Label>
                        <Form.Control type="text" value={datosFormularioEdicion.lastName} onChange={(e) => setDatosFormularioEdicion({ ...datosFormularioEdicion, lastName: e.target.value })} />
                    </Form.Group>
                    <Form.Group controlId="formBasicDni">
                        <Form.Label>Cedula</Form.Label>
                        <Form.Control type="int" value={datosFormularioEdicion.dni} onChange={(e) => setDatosFormularioEdicion({ ...datosFormularioEdicion, dni: e.target.value })} />
                    </Form.Group>
                    <Form.Group controlId="formBasicPhone">
                        <Form.Label>Telefono</Form.Label>
                        <Form.Control type="text" value={datosFormularioEdicion.phone} onChange={(e) => setDatosFormularioEdicion({ ...datosFormularioEdicion, phone: e.target.value })} />
                    </Form.Group>
                    <Form.Group controlId="formBasicMail">
                        <Form.Label>Mail</Form.Label>
                        <Form.Control type="text" value={datosFormularioEdicion.mail} onChange={(e) => setDatosFormularioEdicion({ ...datosFormularioEdicion, mail: e.target.value })} />
                    </Form.Group>
                    <Form.Group controlId="formBasicAddress">
                        <Form.Label>Direccion</Form.Label>
                        <Form.Control type="int" value={datosFormularioEdicion.address} onChange={(e) => setDatosFormularioEdicion({ ...datosFormularioEdicion, address: e.target.value })} />
                    </Form.Group>
                    <Form.Group controlId="formBasicCity">
                        <Form.Label>Ciudad</Form.Label>
                        <Form.Control as="select" value={datosFormularioEdicion.city} onChange={(e) => setDatosFormularioEdicion({ ...datosFormularioEdicion, city: e.target.value })}>
                            <option value="">Selecciona una ciudad</option>
                            {ciudades.map((ciudad, index) => (
                                <option key={index} value={ciudad.name}>{ciudad.name}</option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={cerrarModalEdicion}>Cancelar</Button>
                <Button variant="primary" style={{background:'#56208c', borderColor: 'transparent'}} onClick={() => handleActualizarCliente(datosFormularioEdicion)}>Guardar Cambios</Button>
            </Modal.Footer>
            </Modal>
            {/*Modal o ventana emergente para GUARDAR */}
            <Modal show={mostrarModalGuardar} onHide={cerrarModalGuardar}>
                <Modal.Header closeButton>
                    <Modal.Title>Crear Propietario</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formBasicName">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control type="text" onChange={(e) => setDatosFormularioEdicion({ ...datosFormularioEdicion, name: e.target.value })} />
                        </Form.Group>
                        <Form.Group controlId="formBasicLastName">
                            <Form.Label>Apellidos</Form.Label>
                            <Form.Control type="text" onChange={(e) => setDatosFormularioEdicion({ ...datosFormularioEdicion, lastName: e.target.value })} />
                        </Form.Group>
                        <Form.Group controlId="formBasicDni">
                            <Form.Label>Cedula</Form.Label>
                            <Form.Control type="int" onChange={(e) => setDatosFormularioEdicion({ ...datosFormularioEdicion, dni: e.target.value })} />
                        </Form.Group>
                        <Form.Group controlId="formBasicPhone">
                            <Form.Label>Telefono</Form.Label>
                            <Form.Control type="text" onChange={(e) => setDatosFormularioEdicion({ ...datosFormularioEdicion, phone: e.target.value })} />
                        </Form.Group>
                        <Form.Group controlId="formBasicMail">
                            <Form.Label>Mail</Form.Label>
                            <Form.Control type="text" onChange={(e) => setDatosFormularioEdicion({ ...datosFormularioEdicion, mail: e.target.value })} />
                        </Form.Group>
                        <Form.Group controlId="formBasicAddress">
                            <Form.Label>Direccion</Form.Label>
                            <Form.Control type="text" onChange={(e) => setDatosFormularioEdicion({ ...datosFormularioEdicion, address: e.target.value })} />
                        </Form.Group>
                        <Form.Group controlId="formBasicCity">
                            <Form.Label>Ciudad</Form.Label>
                            <Form.Control as="select" onChange={(e) => setDatosFormularioEdicion({ ...datosFormularioEdicion, city: e.target.value })}>
                                <option value="">Selecciona una ciudad</option>
                                {ciudades.map((ciudad, index) => (
                                    <option key={index} value={ciudad.name}>{ciudad.name}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={cerrarModalGuardar}>Cancelar</Button>
                    <Button variant="primary" style={{background:'#56208c', borderColor: 'transparent'}} onClick={handleGuardarCliente}>Guardar Cambios</Button>
                </Modal.Footer>
            </Modal>
    </div>
    </div>
    </div>
    </>
);
}

export default Crud_Clientes;