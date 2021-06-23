let pagina = 1;

const cita = {
    nombre: '',
    fecha: '',
    hora: '',
    servicios:[]
}

document.addEventListener('DOMContentLoaded', function(){
    iniciarApp();
});

function iniciarApp(){
    mostrarServicios();

    //Resalta el tab actual segun el id que se presiona

    mostrarSeccion();

    //Oculta el tab el cual se presiona
    cambiarSeccion();

    //Paginacion

    paginaSiguiente();

    paginaAnterior();

    //Comprueba la pagina actual para ocultar o desplegar la paginacion
    botonesPaginador();

    //Muestra el mensaje de la cita
    mostrarResumen();

    //Almacenar el nombre de la cita en el objeto
    nombreCita();

    //Almacenar  laf echa de la cita en el objeto
    fechaCita();

    //Deshabilita dias pasados
    deshabilitarFechaAnterior();

    //Almacena la hora de la cita en el objeto
    horaCita();
}

function mostrarSeccion(){
    
    //Eliminar mostrar seccion
    const seccionAnterior = document.querySelector('.mostrar-seccion');
    if(seccionAnterior){
        seccionAnterior.classList.remove('mostrar-seccion');
    }

    const seccionActual = document.querySelector(`#paso-${pagina}`);
    seccionActual.classList.add('mostrar-seccion');

    //Eliminar la clase de actual en el tab anterior
    const tabAnterior = document.querySelector('.tabs .actual');
    if(tabAnterior){
        tabAnterior.classList.remove('actual');
    }

  

    //Resalta el tab actual

    const tab = document.querySelector(`[data-paso="${pagina}"]`);
    tab.classList.add('actual');
}

function cambiarSeccion(){
    const enlaces = document.querySelectorAll('.tabs button');

    enlaces.forEach(enlace => {
        enlace.addEventListener('click', e =>{
            e.preventDefault();

            pagina = parseInt(e.target.dataset.paso);

            //Llamando la funcion de mostrarseccion
            mostrarSeccion();

            botonesPaginador();

        });


    })
}

async function mostrarServicios(){
    try{
        const resultado = await fetch('./servicios.json');
        const db = await resultado.json();
        const {servicios} = db;

        //Generar el html
        servicios.forEach(servicio =>{
            const {id, nombre, precio} = servicio;

            //DOM Scripting

            const nombreServicio = document.createElement('P');
            nombreServicio.textContent = nombre;
            nombreServicio.classList.add('nombre-servicio');

            const precioServicio = document.createElement('P');
            precioServicio.textContent = `$ ${precio}`;
            precioServicio.classList.add('precio-servicio');

            //Contenedor del cardview

            const servicioDiv = document.createElement('DIV');
            servicioDiv.classList.add('servicio');
            servicioDiv.dataset.idServicio = id;

            //Seleccionando card para la cita

            servicioDiv.onclick = seleccionarServicio;

            //Inyeccion precio y nombre

            servicioDiv.appendChild(nombreServicio);
            servicioDiv.appendChild(precioServicio);

            //Insercion en el HTML

            document.querySelector('#servicios').appendChild(servicioDiv);
        })

    }catch(error){
        console.log(error);
    }
}

function seleccionarServicio(e){
    let elemento;
    if(e.target.tagName === 'P'){
        elemento = e.target.parentElement;
    }else{
        elemento = e.target;
    }

    if(elemento.classList.contains('seleccionado')){
        elemento.classList.remove('seleccionado');

        const id = parseInt(elemento.dataset.idServicio);

        eliminarServicio(id);
    }else{
        elemento.classList.add('seleccionado');


        const servicioObj = {
            id: parseInt(elemento.dataset.idServicio),
            nombre: elemento.firstElementChild.textContent,
            precio: elemento.firstElementChild.nextElementSibling.textContent
        }

        // console.log(servicioObj);
        agregarServicio(servicioObj);
    }

}

function eliminarServicio(id){
    const {servicios} = cita;
    cita.servicios = servicios.filter( servicio => servicio.id !== id);
    console.log(cita);
}

function agregarServicio(servicioObj){
    const {servicios} = cita;

    cita.servicios = [...servicios, servicioObj];
    console.log(cita);
}

function paginaSiguiente(){
    const paginaSiguiente = document.querySelector('#siguiente');
    paginaSiguiente.addEventListener('click', () =>{
        pagina++;
        console.log(pagina);

        botonesPaginador();
    });
}

function paginaAnterior(){
    const paginaAnterior = document.querySelector('#anterior');
    paginaAnterior.addEventListener('click', () =>{
        pagina--;
        console.log(pagina);

        botonesPaginador();
    });
}

function botonesPaginador(){
    const paginaSiguiente = document.querySelector('#siguiente');
    const paginaAnterior = document.querySelector('#anterior');

    if(pagina === 1){
        paginaAnterior.classList.add('ocultar');
    }else if(pagina === 3){
        paginaSiguiente.classList.add('ocultar');
        paginaAnterior.classList.remove('ocultar');

        mostrarResumen(); //Estamos en la pagina 3
    }else{
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    }

    mostrarSeccion(); //Cambia el tab segun pagina
}


function mostrarResumen(){
    //Destructuring
    const {nombre, fecha, hora, servicios} = cita;

    //Seleccionar el resumen
    const resumenDiv = document.querySelector('.contenido-resumen');

    //Limpia el HTML existente
    while(resumenDiv.firstChild){
        resumenDiv.removeChild(resumenDiv.firstChild);
    }

    //Validacion del objeto

    if(Object.values(cita).includes('')){
        const noServicios =document.createElement('P');
        noServicios.textContent = 'Faltan datos del servicio, nombre, fecha o hora.';

        noServicios.classList.add('invalidar-cita');
        resumenDiv.appendChild(noServicios);

        return;

    }

    //Heading del resumen

    const headingCita = document.createElement('H3');
    headingCita.textContent = 'Resumen de la Cita';

    //Mostrar el resumen

    const nombreCita = document.createElement('P');
    nombreCita.innerHTML = `<span>Nombre:</span> ${nombre}`;

    const fechaCita = document.createElement('P');
    fechaCita.innerHTML = `<span>Fecha:</span> ${fecha}`;

    const horaCita = document.createElement('P');
    horaCita.innerHTML = `<span>Hora:</span> ${hora}`;

    const serviciosCita = document.createElement('DIV');
    serviciosCita.classList.add('resumen-servicios');

    const headingServicios = document.createElement('H3');
    headingServicios.textContent = 'Resumen de Servicios';
    
    serviciosCita.appendChild(headingServicios);

    let cantidad = 0;

    //Iterar sobre el arreglo de servicios

    servicios.forEach( servicio =>{

        const{nombre, precio} = servicio;
        const contenedorServicio = document.createElement('DIV');
        contenedorServicio.classList.add('contenedor-servicio');
        
        const textoServicio = document.createElement('P');
        textoServicio.textContent = nombre;

        const precioServicio = document.createElement('P');
        precioServicio.textContent = precio;
        precioServicio.classList.add('precio');

        const totalServicio = precio.split('$'); 

        cantidad += parseInt(totalServicio[1].trim());

        //Colocar texto y precio en el div
        contenedorServicio.appendChild(textoServicio);
        contenedorServicio.appendChild(precioServicio);

        serviciosCita.appendChild(contenedorServicio);
    });

    

    resumenDiv.appendChild(headingCita);
    resumenDiv.appendChild(nombreCita);
    resumenDiv.appendChild(fechaCita);
    resumenDiv.appendChild(horaCita);

    resumenDiv.appendChild(serviciosCita);

    const cantidadPagar = document.createElement('P');
    cantidadPagar.classList.add('total');
    cantidadPagar.innerHTML = `<span>Total a pagar: </span> $ ${cantidad}`;

    resumenDiv.appendChild(cantidadPagar);

}

function nombreCita(){
    const nombreInput = document.querySelector('#nombre');

    nombreInput.addEventListener('input', e =>{
        const nombreTexto = e.target.value.trim();

        //Validacion de que nombreTexto debe tener algo
        if(nombreTexto === '' || nombreTexto.length < 3){
            mostrarAlerta('Nombre no valido', 'error');
        }else{
            const alerta = document.querySelector('.alerta');
            if(alerta){
                alerta.remove();
            }
            cita.nombre = nombreTexto;
        }
    });
}

function mostrarAlerta(mensaje, tipo){

    //Si hay una alerta creada no insertar otra

    const alertaPrevia = document.querySelector('.alerta');
    if(alertaPrevia){
        return;
    }

    const alerta = document.createElement('DIV');
    alerta.textContent = mensaje;
    alerta.classList.add('alerta');

    if(tipo === 'error'){
        alerta.classList.add('error');
    }

    //Insertar la alerta en el HTML

    const formulario = document.querySelector('.formulario');
    formulario.appendChild(alerta);

    //Eliminar al alerta

    setTimeout(()=>{
        alerta.remove();
    }, 3000);

}

function fechaCita(){
    const fechaInput = document.querySelector('#fecha');
    fechaInput.addEventListener('input', (e) =>{
        const dia = new Date(e.target.value).getUTCDay();
        if([0,6].includes(dia)){
            e.preventDefault();
            fechaInput.value = '';
            mostrarAlerta('Fines de semana no válidos', 'error');
        }else{
            cita.fecha = fechaInput.value;
        }
    })
}

function deshabilitarFechaAnterior(){
    const inputFecha = document.querySelector('#fecha');


    const fechaAhora = new Date();
    const year = fechaAhora.getFullYear();
    const month = fechaAhora.getMonth()+1;
    const day = fechaAhora.getDate()+1;

    const fechaDeshabilitar = `${year}-${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day}`;
    inputFecha.min = fechaDeshabilitar;

}

function horaCita(){
    const inputHora = document.querySelector('#hora');
    inputHora.addEventListener('input', (e)=>{
        const horaCita = e.target.value;
        const hora = horaCita.split(':');

        if(hora[0]<10 || hora[0]>18){
            mostrarAlerta('Hora no valida', 'error');
            setTimeout(()=>{
                inputHora.value = '';
            }, 2000);
            
        }else{
            cita.hora = horaCita;
            
        }

        console.log(cita);
    });
}