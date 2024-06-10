import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Nosotros from './pages/Nosotros';
import RedDeAtencion from './pages/Error_404';
import Contacto from './pages/Contactenos';
import IniciarSesion from './pages/IniciarSesion';
import Registrarse from './pages/Registrarse';
import MapaSitio from './pages/MapaSitio';
import Modulo from './pages/Modulo';
import CrudCitas from './CrudComponents/Crud_citas';
import CrudRegistroClinico from './CrudComponents/CrudRegistroClinico';
import CrudClientes from './CrudComponents/Crud_Clientes';
import CrudProducto from './CrudComponents/Crud_producto';
import CrudFormulaMedica from './CrudComponents/CrudFormulaMedica';
import CrudProveedor from './CrudComponents/Crud_proveedor';
import CrudMascota from './CrudComponents/Crud_mascota';
import CrudEmpleado from './CrudComponents/Crud_empleado';

function App() {
  return (
    <>
    <Router>
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/servicios" element={<Modulo />} />
        <Route path="/red-de-atencion" element={<RedDeAtencion />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/iniciosesion" element={<IniciarSesion />} />
        <Route path="/registrarse" element={<Registrarse />} />
        <Route path="/mapa_del_sitio" element={<MapaSitio />} />
        <Route path="/Cita" element={<CrudCitas />} />
        <Route path="/registroClinico" element={<CrudRegistroClinico />} />
        <Route path="/Clientes" element={<CrudClientes />} />
        <Route path="/Producto" element={<CrudProducto />} />
        <Route path="/Proveedor" element={<CrudProveedor />} />
        <Route path="/Registro_clinico" element={<CrudRegistroClinico />} />
        <Route path="/Fomula_Medica" element={<CrudFormulaMedica />} />
        <Route path="/Mascotas" element={<CrudMascota />} />
        <Route path="/Empleados" element={<CrudEmpleado />} />
      </Routes>
    </div>
  </Router>
  </>
  );
}

export default App;