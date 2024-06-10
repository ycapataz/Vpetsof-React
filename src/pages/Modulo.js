import React from 'react'
import '../assets/css/nosotros.css'
import '../assets/css/consejos.css'
import Logo_Software from '../assets/images/Logo Software sin fondo.png'
import agendamiento from '../assets/images/agendamiento.png'
import historia from '../assets/images/historia.png'
import inventario from '../assets/images/inventario.jpg'
import { Link, NavLink } from 'react-router-dom';
import Footer from '../components/Footer';
import Menu from '../components/Menu';

function Modulo() {
    return (
    <>
    <Menu />
    <div>
        <div className="wrapper">
            <img src={Logo_Software} alt />
            <div className="text-box">
                <h2>VPETSOFT</h2>
                <h2> ¿Quienes somos?</h2>
                <p>
                    VPETSOFT es un proyecto de software enfocado a la veterinaria y a solucionar
                    algunos de sus procesos que se hacian de forma manual, lo que ocasionaba perdida de informacion
                    y tiempo. Este grupo esta conformado por 3 integrantes del tecnologo de Analisis y desarrollo de software,
                    quienes son Yeison Capataz, Alejandra Velasco y Juan Horta. Se trabajaran con 3 modulos. El sistema a
                    desarrollar es un software de gestión de servicios veterinarios que permitirá a las clínicas y veterinarios
                    llevar a cabo un registro y seguimiento de las citas e ingreso de pacientes, historias clínicas veterinarias y
                    control de inventario. El sistema contará con una interfaz de usuario intuitiva y fácil de usar, que permitirá
                    una gestión eficiente y precisa de los servicios.
                </p>
            </div>
        </div>
        {/*se crea una clase containerr que tendra las 3 tarjetas (nosotros, mision, vision)*/}
        <div className="containerr">
            {/*se crea una clase cardd que contendra la imagen e informacion de la primera tarjeta (NOSOTROS)*/}
            <div className="cardd">
                {/*se usa la etiqueta figure para almacenar la imagen de la primera tarjeta*/}
                <figure>
                    <img src={agendamiento} />
                </figure>
                {/*se crea la clase contenidoo con la informacion de la primera tarjeta (NOSOTROS)*/}
                <div className="contenidoo">
                    <h3>GESTION DE AGENDAMIENTO Y REGISTRO</h3>
                    <p>
                        Este módulo permitirá a los usuarios registrar y gestionar las citas de los pacientes,
                        incluyendo la fecha, hora, información de la mascota y el veterinario asignado. Además,
                        permitirá organizar citas de los pacientes en la clínica. La funcionalidad es realizar
                        la selección de la fecha y hora de la cita.
                    </p>
                    {/*Se crea un enlace*/}
                    <li><NavLink to="/Clientes" activeClassName="active">Agendamiento</NavLink></li>
                </div>
            </div>
            {/*se crea una clase cardd que contendra la imagen e informacion de la segunda tarjeta (MISION)*/}
            <div className="cardd">
                {/*se usa la etiqueta figure para almacenar la imagen de la segunda tarjeta*/}
                <figure>
                    <img src={historia} />
                </figure>
                {/*se crea la clase contenidoo con la informacion de la segunda tarjeta (MISION)*/}
                <div className="contenidoo">
                    <h3>GESTION DE HISTORIAS CLINICAS</h3>
                    <p>
                        Este módulo permitirá a los usuarios llevar a cabo un registro detallado de las historias clínicas
                        de los pacientes, incluyendo su información personal, datos médicos, tratamientos, exámenes médicos
                        y medicaciones. Los usuarios podrán acceder a la información de los pacientes y realizar un seguimiento
                        detallado de su estado de salud a lo largo del tiempo.
                    </p>
                    {/*Se crea un enlace*/}
                    <li><NavLink to="/Registro_clinico" activeClassName="active">Historias Clinicas</NavLink></li>
                </div>
            </div>
            {/*se crea una clase cardd que contendra la imagen e informacion de la tercera tarjeta (VISION)*/}
            <div className="cardd">
                {/*se usa la etiqueta figure para almacenar la imagen de la tercera tarjeta*/}
                <figure>
                    <img src={inventario} />
                </figure>
                {/*se crea la clase contenidoo con la informacion de la tercera tarjeta (VISION)*/}
                <div className="contenidoo">
                    <h3>GESTION DE INVENTARIO</h3>
                    <p>
                        Este módulo permitirá a los usuarios llevar a cabo un registro detallado del inventario de productos
                        y suministros utilizados en la clínica veterinaria, incluyendo su cantidad y fecha de vencimiento y
                        distinta información de los productos, además de poder ver distinta información de los proveedores.
                        Los usuarios también podrán realizar el seguimiento de los movimientos del inventario, como la entrada y
                        salida de productos, y la dispensación de productos a los pacientes.
                    </p>
                    {/*Se crea un enlace*/}
                    <li><NavLink to="/Proveedor" activeClassName="active">Inventario</NavLink></li>
                </div>
            </div>
        </div>
        <br /><br /><br />
        <Footer />
    </div>
    
    </>
    )
}

export default Modulo