import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Modal, Form, Button} from 'react-bootstrap';
import Navbar from "../components/Navbar";
import StylesTabla from '../assets/css/avg_encabezado.module.scss';
import PetService from '../services/PetService';
import Menu_recepcionista from '../components/Menu_recepcionista';


function Crud_mascota() {
    const [pets, setPets] = useState([]);
    const [error, setError] = useState(null);
    const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
    const [mostrarModalGuardar, setMostrarModalGuardar] = useState(false);
    const [datosFormularioEdicion, setDatosFormularioEdicion] = useState({ id: '', name: '', color: '', dateBirth: '', number_microchip: '', customer: '', breed: '' ,specie: '', genus: ''});
    const [mascotaSeleccionada, setMascotaSeleccionada] = useState(null);
    const [clientes, setClientes] = useState([]);
    const [razas, setRazas] = useState([]);
    const [generos, setGeneros] = useState([]);
    const [especies, setEspecies] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await PetService.getAllPets();
            console.log('Respuesta de la API:', response); // Agregar este registro para verificar la respuesta de la API
            setPets(response.data.DATA);
    
            // Obtener foraneas
            const clientes = response.data.DATA.map(mascota => ({ id: mascota.idcliente.id, name: mascota.idcliente.name }));
            const razas = response.data.DATA.map(mascota => ({ id: mascota.idraza.id, name: mascota.idraza.name }));
            const generos = response.data.DATA.map(mascota => ({ id: mascota.idgenmascota.id, name: mascota.idgenmascota.name }));
            const especies = response.data.DATA.map(mascota => ({ id: mascota.idespecie.id, name: mascota.idespecie.name }));
            
            // Filtrar valores únicos
            const clientesUnicos = clientes.filter((cliente, index, self) => self.findIndex(m => m.id === cliente.id) === index);
            const razasUnicas = razas.filter((raza, index, self) => self.findIndex(m => m.id === raza.id) === index);
            const especiesUnicas = especies.filter((especie, index, self) => self.findIndex(m => m.id === especie.id) === index);
            const generosUnicos = generos.filter((genero, index, self) => self.findIndex(m => m.id === genero.id) === index);
            setClientes(clientesUnicos);
            setRazas(razasUnicas);
            setEspecies(especiesUnicas);
            setGeneros(generosUnicos);
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

    const abrirModalEdicion = (mascota) => {
        setMascotaSeleccionada(mascota);
        setDatosFormularioEdicion({
            id: mascota.id,
            name: mascota.name,
            color: mascota.color,
            dateBirth: mascota.dateBirth,
            number_microchip: mascota.number_microchip,
            customer: mascota.idcliente.name,
            breed: mascota.idraza.name,
            specie: mascota.idespecie.name,
            genus: mascota.idgenmascota.name
        });
        setMostrarModalEdicion(true);
    };

    const cerrarModalEdicion = () => {
        setMostrarModalEdicion(false);
    };

    //Funcion para Guardar
    const handleGuardarMascota = async () => {
        try {
            // Obtener el ID del cliente seleccionado
            const idCliente = clientes.find(cliente => cliente.name === datosFormularioEdicion.customer)?.id;
            
            // Obtener el ID de la raza seleccionada
            const idRaza = razas.find(raza => raza.name === datosFormularioEdicion.breed)?.id;
            
            // Obtener el ID de la especie seleccionada
            const idEspecie = especies.find(especie => especie.name === datosFormularioEdicion.specie)?.id;
                        
            // Obtener el ID del genero seleccionado
            const idGenmascota = generos.find(genero => genero.name === datosFormularioEdicion.genus)?.id;
 
            const response = await PetService.createPet({
                name: datosFormularioEdicion.name,
                color: datosFormularioEdicion.color,
                dateBirth: datosFormularioEdicion.dateBirth,
                number_microchip: datosFormularioEdicion.number_microchip,
                idcliente: {
                    id: idCliente
                },
                idraza: {
                    id: idRaza
                },
                idespecie: {
                    id: idEspecie
                },
                idgenmascota: {
                    id: idGenmascota
                }
             
            });
            console.log('Respuesta de la API:', response.data);
            fetchData(); // Actualiza la tabla
            cerrarModalGuardar(); // Cierra el modal
            // Limpiar los datos del formulario
            setDatosFormularioEdicion({ id: '', name: '', color: '', dateBirth: '', number_microchip: '', customer: '', breed: '' ,specie: '', genus: ''});
        } catch (error) {
            console.error('Error al guardar la mascota:', error);
            // Manejar el error
        }
    };    


//Funcion de actualizar
const handleActualizarMascota = async (datosMascota) => {
    try {
        console.log('Datos de la mascota a actualizar:', datosMascota);

        // Obtener el ID del cliente seleccionado
        const idCliente = clientes.find(cliente => cliente.name === datosMascota.customer)?.id;
            
        // Obtener el ID de la raza seleccionada
        const idRaza = razas.find(raza => raza.name === datosMascota.breed)?.id;
                    
        // Obtener el ID de la especie seleccionada
        const idEspecie = especies.find(especie => especie.name === datosMascota.specie)?.id;

        // Obtener el ID del genero seleccionado
        const idGenmascota = generos.find(genero => genero.name === datosMascota.genus)?.id;
        
        const response = await PetService.updatePet(datosMascota.id, {
            name: datosMascota.name,
            color: datosMascota.color,
            dateBirth: datosMascota.dateBirth,
            number_microchip: datosMascota.number_microchip,
            idcliente: {
                id: idCliente
            },
            idraza: {
                id: idRaza
            },
            idespecie: {
                id: idEspecie
            },
            idgenmascota: {
                id: idGenmascota
            }
        });
        console.log('Respuesta de la API:', response.data);
        fetchData();//Actualiza la tabla
        cerrarModalEdicion();//Cierra el modal o ventana emergente

    } catch (error) {
        console.error('Error al actualizar la mascota:', error);
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
                <h1 className={StylesTabla.NombreTable}>Tabla Mascota</h1>
                <div>
                    <button className={StylesTabla.buttonHeader} onClick={() => abrirModalGuardar()}>Crear Mascota</button>
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
                        <th style={{ textAlign: "center" }}>Nombre</th>
                        <th style={{ textAlign: "center" }}>Color</th>
                        <th style={{ textAlign: "center" }}>Fecha Nacimiento</th>
                        <th style={{ textAlign: "center" }}># Microchip</th>
                        <th style={{ textAlign: "center" }}>Cliente</th>
                        <th style={{ textAlign: "center" }}>Raza</th>
                        <th style={{ textAlign: "center" }}>Especie</th>
                        <th style={{ textAlign: "center" }}>Genero</th>
                        <th style={{ textAlign: "center" }}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {pets.map(pet => (
                        <tr key={pet.id}>
                            <td style={{ textAlign: "center" }}>{pet.id}</td>
                            <td style={{ textAlign: "center" }}>{pet.name}</td>
                            <td style={{ textAlign: "center" }}>{pet.color}</td>
                            <td style={{ textAlign: "center" }}>{pet.dateBirth}</td>
                            <td style={{ textAlign: "center" }}>{pet.number_microchip}</td>
                            <td style={{ textAlign: "center" }}>{pet.idcliente.name}</td>
                            <td style={{ textAlign: "center" }}>{pet.idraza.name}</td>
                            <td style={{ textAlign: "center" }}>{pet.idespecie.name}</td>
                            <td style={{ textAlign: "center" }}>{pet.idgenmascota.name}</td>
                           
                            <td style={{ textAlign: "center" }}>
                                <button type="button" className="btn btn-primary btn-sm" style={{ height: '3rem', width: '3rem', background: 'transparent', boxShadow: 'none', borderColor: 'transparent' }} onClick={() => abrirModalEdicion(pet)}>
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
                <Modal.Title>Editar Mascota</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="formBasicName">
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control type="text" value={datosFormularioEdicion.name} onChange={(e) => setDatosFormularioEdicion({ ...datosFormularioEdicion, name: e.target.value })} />
                    </Form.Group>
                    <Form.Group controlId="formBasiclastName">
                        <Form.Label>Color</Form.Label>
                        <Form.Control type="text" value={datosFormularioEdicion.color} onChange={(e) => setDatosFormularioEdicion({ ...datosFormularioEdicion, color: e.target.value })} />
                    </Form.Group>
                    <Form.Group controlId="formBasicDni">
                        <Form.Label>Fecha Nacimiento</Form.Label>
                        <Form.Control type="date" value={datosFormularioEdicion.dateBirth} onChange={(e) => setDatosFormularioEdicion({ ...datosFormularioEdicion, dateBirth: e.target.value })} />
                    </Form.Group>
                    <Form.Group controlId="formBasicDni">
                        <Form.Label># Microchip</Form.Label>
                        <Form.Control type="text" value={datosFormularioEdicion.number_microchip} onChange={(e) => setDatosFormularioEdicion({ ...datosFormularioEdicion, number_microchip: e.target.value })} />
                    </Form.Group>
                    <Form.Group controlId="formBasicCity">
                        <Form.Label>Cliente</Form.Label>
                        <Form.Control as="select" value={datosFormularioEdicion.customer} onChange={(e) => setDatosFormularioEdicion({ ...datosFormularioEdicion, customer: e.target.value })}>
                            <option value="">Selecciona un cliente</option>
                            {clientes && clientes.map((cliente, index) => (
                                <option key={index} value={cliente.name}>{cliente.name}</option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="formBasicCity">
                        <Form.Label>Raza</Form.Label>
                        <Form.Control as="select" value={datosFormularioEdicion.breed} onChange={(e) => setDatosFormularioEdicion({ ...datosFormularioEdicion, breed: e.target.value })}>
                            <option value="">Selecciona una raza</option>
                            {razas && razas.map((raza, index) => (
                                <option key={index} value={raza.name}>{raza.name}</option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="formBasicCity">
                        <Form.Label>Especie</Form.Label>
                        <Form.Control as="select" value={datosFormularioEdicion.specie} onChange={(e) => setDatosFormularioEdicion({ ...datosFormularioEdicion, specie: e.target.value })}>
                            <option value="">Selecciona una especie</option>
                            {especies && especies.map((especie, index) => (
                                <option key={index} value={especie.name}>{especie.name}</option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="formBasicCity">
                        <Form.Label>Genero</Form.Label>
                        <Form.Control as="select" value={datosFormularioEdicion.genus} onChange={(e) => setDatosFormularioEdicion({ ...datosFormularioEdicion, genus: e.target.value })}>
                            <option value="">Selecciona un genero</option>
                            {generos && generos.map((genero, index) => (
                                <option key={index} value={genero.name}>{genero.name}</option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={cerrarModalEdicion}>Cancelar</Button>
                <Button variant="primary" style={{background:'#56208c', borderColor: 'transparent'}} onClick={() => handleActualizarMascota(datosFormularioEdicion)}>Guardar Cambios</Button>
            </Modal.Footer>
            </Modal>
            {/*Modal o ventana emergente para GUARDAR */}
            <Modal show={mostrarModalGuardar} onHide={cerrarModalGuardar}>
                <Modal.Header closeButton>
                    <Modal.Title>Crear Mascota</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formBasicName">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control type="text" onChange={(e) => setDatosFormularioEdicion({ ...datosFormularioEdicion, name: e.target.value })} />
                        </Form.Group>
                        <Form.Group controlId="formBasicLastName">
                            <Form.Label>Color</Form.Label>
                            <Form.Control type="text" onChange={(e) => setDatosFormularioEdicion({ ...datosFormularioEdicion, color: e.target.value })} />
                        </Form.Group>
                        <Form.Group controlId="formBasicDni">
                            <Form.Label>Fecha Nacimiento</Form.Label>
                            <Form.Control type="date" onChange={(e) => setDatosFormularioEdicion({ ...datosFormularioEdicion, dateBirth: e.target.value })} />
                        </Form.Group>
                        <Form.Group controlId="formBasicPhone">
                            <Form.Label># Microchip</Form.Label>
                            <Form.Control type="text" onChange={(e) => setDatosFormularioEdicion({ ...datosFormularioEdicion, number_microchip: e.target.value })} />
                        </Form.Group>
                        <Form.Group controlId="formBasicCity">
                            <Form.Label>Cliente</Form.Label>
                            <Form.Control as="select" onChange={(e) => setDatosFormularioEdicion({ ...datosFormularioEdicion, customer: e.target.value })}>
                                <option value="">Selecciona un cliente</option>
                                {clientes && clientes.map((cliente, index) => (
                                    <option key={index} value={cliente.name}>{cliente.name}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="formBasicCity">
                            <Form.Label>Raza</Form.Label>
                            <Form.Control as="select" onChange={(e) => setDatosFormularioEdicion({ ...datosFormularioEdicion, breed: e.target.value })}>
                                <option value="">Selecciona una raza</option>
                                {razas && razas.map((raza, index) => (
                                    <option key={index} value={raza.name}>{raza.name}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="formBasicCity">
                            <Form.Label>Especie</Form.Label>
                            <Form.Control as="select" onChange={(e) => setDatosFormularioEdicion({ ...datosFormularioEdicion, specie: e.target.value })}>
                                <option value="">Selecciona una especie</option>
                                {especies && especies.map((especie, index) => (
                                    <option key={index} value={especie.name}>{especie.name}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="formBasicCity">
                            <Form.Label>Genero</Form.Label>
                            <Form.Control as="select" onChange={(e) => setDatosFormularioEdicion({ ...datosFormularioEdicion, genus: e.target.value })}>
                                <option value="">Selecciona un genero</option>
                                {generos && generos.map((genero, index) => (
                                    <option key={index} value={genero.name}>{genero.name}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={cerrarModalGuardar}>Cancelar</Button>
                    <Button variant="primary" style={{background:'#56208c', borderColor: 'transparent'}} onClick={handleGuardarMascota}>Guardar Cambios</Button>
                </Modal.Footer>
            </Modal>
    </div>
    </div>
    </div>
    </>
);
}

export default Crud_mascota;






    