import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Modal, Form, Button} from 'react-bootstrap';
import Navbar from "../components/Navbar_almacenista";
import StylesTabla from '../assets/css/avg_encabezado.module.scss';
import ProductService from '../services/ProductService';
import Menu_almacenista from '../components/Menu_almacenista';

function Crud_Prducto() {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
    const [mostrarModalGuardar, setMostrarModalGuardar] = useState(false);
    const [datosFormularioEdicion, setDatosFormularioEdicion] = useState({ id: '', name: '', expiration: '', amount: '', batch: '', category:'', provider: '', state: '' });
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    const [categorias, setCategorias] = useState([]);
    const [estados, setEstados] = useState([]);
    const [proveedores, setProveedores] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await ProductService.getAllProducts();
            setProducts(response.data.DATA);
            // Obtener categorias, proveedores y estados disponibles
            const categorias = response.data.DATA.map(producto => ({ id: producto.idcategoria.id, name: producto.idcategoria.name }));
            const proveedores = response.data.DATA.map(producto => ({ id: producto.idproveedor.id, name: producto.idproveedor.name }));
            const estados = response.data.DATA.map(producto => ({ id: producto.idestado.id, name: producto.idestado.name }));
            // Filtrar valores únicos
            const categoriasUnicas = categorias.filter((categoria, index, self) => self.findIndex(m => m.id === categoria.id) === index);
            const proveedoresUnicos = proveedores.filter((proveedor, index, self) => self.findIndex(e => e.id === proveedor.id) === index);
            const estadosUnicos = estados.filter((estado, index, self) => self.findIndex(e => e.id === estado.id) === index);
            setCategorias(categoriasUnicas);
            setProveedores(proveedoresUnicos);
            setEstados(estadosUnicos);
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

    const abrirModalEdicion = (producto) => {
        setProductoSeleccionado(producto);
        setDatosFormularioEdicion({
            id: producto.id,
            name: producto.name,
            expiration: producto.expiration,
            amount: producto.amount,
            batch: producto.batch,
            category: producto.idcategoria.name,
            provider: producto.idproveedor.name,
            state: producto.idestado.name
        });
        setMostrarModalEdicion(true);
    };

    const cerrarModalEdicion = () => {
        setMostrarModalEdicion(false);
    };

    //Funcion para Guardar
    const handleGuardarProducto = async () => {
        try {
            // Obtener el ID de la categoria seleccionada
            const idCategoria = categorias.find(categoria => categoria.name === datosFormularioEdicion.category)?.id;
            
            // Obtener el ID del estado seleccionada
            const idProveedor = proveedores.find(proveedor => proveedor.name === datosFormularioEdicion.provider)?.id;
            
            // Obtener el ID del estado seleccionada
            const idEstado = estados.find(estado => estado.name === datosFormularioEdicion.state)?.id;

            const response = await ProductService.createProduct({
                name: datosFormularioEdicion.name,
                expiration: datosFormularioEdicion.expiration,
                amount: datosFormularioEdicion.amount,
                batch: datosFormularioEdicion.batch,
                idcategoria: {
                    id: idCategoria
                },
                idproveedor: {
                    id: idProveedor
                },
                idestado: {
                    id: idEstado
                }
                
            });
            console.log('Respuesta de la API:', response.data);
            fetchData(); // Actualiza la tabla
            cerrarModalGuardar(); // Cierra el modal
            // Limpiar los datos del formulario
            setDatosFormularioEdicion({ id: '', name: '', expiration: '', amount: '', batch: '', category:'', provider: '', state: '' });
        } catch (error) {
            console.error('Error al guardar el producto:', error);
            // Manejar el error
        }
    };    

    //Funcion de actualizar
    const handleActualizarProducto = async (datosProducto) => {
        try {
            console.log('Datos del producto a actualizar:', datosProducto);

            // Obtener el ID de la categoria seleccionada
            const idCategoria = categorias.find(categoria => categoria.name === datosProducto.category)?.id;
            
            // Obtener el ID del proveedor seleccionado
            const idProveedor = proveedores.find(proveedor => proveedor.name === datosProducto.provider)?.id;

            // Obtener el ID del estado seleccionado
            const idEstado = estados.find(estado => estado.name === datosProducto.state)?.id;

            const response = await ProductService.updateProduct(datosProducto.id, {
                name: datosProducto.name,
                expiration: datosProducto.expiration,
                amount: datosProducto.amount,
                batch: datosProducto.batch,
                idcategoria: {
                    id: idCategoria
                },
                idproveedor: {
                    id: idProveedor
                },
                idestado: {
                    id: idEstado
                }
            });
            console.log('Respuesta de la API:', response.data);
            fetchData();//Actualiza la tabla
            cerrarModalEdicion();//Cierra el modal o ventana emergente

        } catch (error) {
            console.error('Error al actualizar el producto:', error);
            // Manejar el error
        }
    };      

    return (
        <>
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }} >
        <Menu_almacenista/>
        <div style={{ display: 'flex', flexGrow: 1 }}>
        <div>
            <Navbar/>
        </div>
        {/*Tabla donde se muestra todo*/}
        <div className={StylesTabla.containerTable}>
            <div className={StylesTabla.TableHeader}>
                <section className="table__header">
                    <h1 className={StylesTabla.NombreTable}>Tabla productos</h1>
                    <div>
                        <button className={StylesTabla.buttonHeader} onClick={() => abrirModalGuardar()}>Crear Producto</button>
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
                            <th style={{ textAlign: "center" }}>Producto</th>
                            <th style={{ textAlign: "center" }}>Fecha vencimiento</th>
                            <th style={{ textAlign: "center" }}>Cantidad</th>
                            <th style={{ textAlign: "center" }}>Lote</th>
                            <th style={{ textAlign: "center" }}>Proveedor</th>
                            <th style={{ textAlign: "center" }}>Categoria</th>
                            <th style={{ textAlign: "center" }}>Estado</th>
                            <th style={{ textAlign: "center" }}>Acciones</th>

                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product.id}>
                                <td style={{ textAlign: "center" }}>{product.id}</td>
                                <td style={{ textAlign: "center" }}>{product.name}</td>
                                <td style={{ textAlign: "center" }}>{product.expiration}</td>
                                <td style={{ textAlign: "center" }}>{product.amount}</td>
                                <td style={{ textAlign: "center" }}>{product.batch}</td>
                                <td style={{ textAlign: "center" }}>{product.idcategoria.name}</td>
                                <td style={{ textAlign: "center" }}>{product.idproveedor.name}</td>
                                <td style={{ textAlign: "center" }}>{product.idestado.name}</td>
                                <td style={{ textAlign: "center" }}>
                                    <button type="button" className="btn btn-primary btn-sm" style={{ height: '3rem', width: '3rem', background: 'transparent', boxShadow: 'none', borderColor: 'transparent' }} onClick={() => abrirModalEdicion(product)}>
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
                    <Modal.Title>Editar Producto</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formBasicDate">
                            <Form.Label>Producto</Form.Label>
                            <Form.Control type="text" value={datosFormularioEdicion.name} onChange={(e) => setDatosFormularioEdicion({ ...datosFormularioEdicion, name: e.target.value })} />
                        </Form.Group>
                        <Form.Group controlId="formBasicName">
                            <Form.Label>Fecha Vencimiento</Form.Label>
                            <Form.Control type="date" value={datosFormularioEdicion.expiration} onChange={(e) => setDatosFormularioEdicion({ ...datosFormularioEdicion, expiration: e.target.value })} />
                        </Form.Group>
                        <Form.Group controlId="formBasicHour">
                            <Form.Label>Cantidad</Form.Label>
                            <Form.Control type="int" value={datosFormularioEdicion.amount} onChange={(e) => setDatosFormularioEdicion({ ...datosFormularioEdicion, amount: e.target.value })} />
                        </Form.Group>
                        <Form.Group controlId="formBasicHour">
                            <Form.Label>Lote</Form.Label>
                            <Form.Control type="number" value={datosFormularioEdicion.batch} onChange={(e) => setDatosFormularioEdicion({ ...datosFormularioEdicion, batch: e.target.value })} />
                        </Form.Group>
                        <Form.Group controlId="formBasicPetName">
                            <Form.Label>Categoria</Form.Label>
                            <Form.Control as="select" value={datosFormularioEdicion.category} onChange={(e) => setDatosFormularioEdicion({ ...datosFormularioEdicion, category: e.target.value })}>
                                <option value="">Selecciona una categoria</option>
                                {categorias.map((categoria, index) => (
                                    <option key={index} value={categoria.name}>{categoria.name}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="formBasicPetName">
                            <Form.Label>Proveedor</Form.Label>
                            <Form.Control as="select" value={datosFormularioEdicion.provider} onChange={(e) => setDatosFormularioEdicion({ ...datosFormularioEdicion, provider: e.target.value })}>
                                <option value="">Selecciona un proveedor</option>
                                {proveedores.map((proveedor, index) => (
                                    <option key={index} value={proveedor.name}>{proveedor.name}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="formBasicSpecialty">
                            <Form.Label>Estado</Form.Label>
                            <Form.Control as="select" value={datosFormularioEdicion.state} onChange={(e) => setDatosFormularioEdicion({ ...datosFormularioEdicion, state: e.target.value })}>
                                <option value="">Selecciona un estado</option>
                                {estados.map((estado, index) => (
                                    <option key={index} value={estado.name}>{estado.name}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={cerrarModalEdicion}>Cancelar</Button>
                    <Button variant="primary" style={{background:'#56208c', borderColor: 'transparent'}} onClick={() =>handleActualizarProducto(datosFormularioEdicion)}>Actualizar Producto</Button>
                </Modal.Footer>
            </Modal>
                {/*Modal o ventana emejernte para GUARDAR */}
                <Modal show={mostrarModalGuardar} onHide={cerrarModalGuardar}>
                    <Modal.Header closeButton>
                        <Modal.Title>Generar Producto</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="formBasicDate">
                                <Form.Label>Producto</Form.Label>
                                <Form.Control type="text" placeholder="Ingrese el nombre del producto" onChange={(e) => setDatosFormularioEdicion({ ...datosFormularioEdicion, name: e.target.value })} />
                            </Form.Group>
                            <Form.Group controlId="formBasicHour">
                                <Form.Label>Fecha Vencimiento</Form.Label>
                                <Form.Control type="date" placeholder="Ingrese la fecha de vencimiento" onChange={(e) => setDatosFormularioEdicion({ ...datosFormularioEdicion, expiration: e.target.value })} />
                            </Form.Group>
                            <Form.Group controlId="formBasicDate">
                                <Form.Label>Cantidad</Form.Label>
                                <Form.Control type="text" placeholder="Ingrese la cantidad del producto" onChange={(e) => setDatosFormularioEdicion({ ...datosFormularioEdicion, amount: e.target.value })} />
                            </Form.Group>
                            <Form.Group controlId="formBasicHour">
                                <Form.Label>Lote</Form.Label>
                                <Form.Control type="number" placeholder="Ingrese el lote del producto" onChange={(e) => setDatosFormularioEdicion({ ...datosFormularioEdicion, batch: e.target.value })} />
                            </Form.Group>
                            <Form.Group controlId="formBasicPetName">
                                <Form.Label>Categoria</Form.Label>
                                <Form.Control as="select" onChange={(e) => setDatosFormularioEdicion({ ...datosFormularioEdicion, category: e.target.value })}>
                                    <option value="">Selecciona una categoria</option>
                                    {categorias.map((categoria, index) => (
                                        <option key={index} value={categoria.name}>{categoria.name}</option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                            <Form.Group controlId="formBasicPetName">
                                <Form.Label>Proveedor</Form.Label>
                                <Form.Control as="select" onChange={(e) => setDatosFormularioEdicion({ ...datosFormularioEdicion, provider: e.target.value })}>
                                    <option value="">Selecciona un proveedor</option>
                                    {proveedores.map((proveedor, index) => (
                                        <option key={index} value={proveedor.name}>{proveedor.name}</option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                            <Form.Group controlId="formBasicSpecialty">
                                <Form.Label>Estado</Form.Label>
                                <Form.Control as="select" onChange={(e) => setDatosFormularioEdicion({ ...datosFormularioEdicion, state: e.target.value })}>
                                    <option value="">Selecciona un estado</option>
                                    {estados.map((estado, index) => (
                                        <option key={index} value={estado.name}>{estado.name}</option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={cerrarModalGuardar}>Cancelar</Button>
                        <Button variant="primary" style={{background:'#56208c', borderColor: 'transparent'}} onClick={handleGuardarProducto}>Guardar Producto</Button>
                    </Modal.Footer>
                </Modal>
        </div>
        </div>
        </div>
        </>
    );
}

export default Crud_Prducto;