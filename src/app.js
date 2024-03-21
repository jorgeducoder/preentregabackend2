// Nuevo app para WS. Como siempre en app va el "cuerpo" principal de la ejecucion hasta levantar el servidor del cliente y el socket

import express from "express";
// Para trabajar con handlebars
import handlebars from "express-handlebars";

// Importa el server desde socket.io
import { Server } from "socket.io";

import __dirname from "./utils.js";

// Lo que voy a tener en las views a mostrar en el socket, en este caso el index donde estan definidas las rutas
//import viewsRouter from "./routes/views.router.js";
import viewsRouter from "./routes/index.js";

// Define la variable para express
const app = express();


// Define los middlewerd
app.engine("handlebars", handlebars.engine());
app.set("views",`${__dirname}/views`);
app.set("view engine", "handlebars");

app.use(express.static(`${__dirname}/../public`));

app.use("/", viewsRouter);

// Notese el cambio al levantar el puerto 8080, define una variable httpserver para luego levantar el socket
const PORT = 8080;
const httpServer = app.listen(PORT, () => {
    console.log(`Servidor activo en http://localhost:${PORT}`);
});

const socketServer = new Server(httpServer);
console.log("active en: ", socketServer);

// Conecta los clientes al socket. Explicado y hecho en 01:14 de la clase.
// Primero se escucha el evento de conexion. En socket.id se tiene el id del cliente que se conecto
socketServer.on("connection", socket => {
    console.log("Nuevo cliente conectado -----> ", socket.id);
    // El socket del lado del servidor recibe el emit del cliente desde index.js
    socket.on("message", data => {
        console.log("Recibi el dato: ", data);
    });
    // agrega los emit del socket servidor hacia el o los clientes depende el tipo de emit que se necesite 
    //segun la aplicacion que se esta trabajando. En clase se hizo una encuesta sobre aplicaciones y tipos de emit necesarios. 
    // Ejemplo de facebook, si alguien cambia su estado es un broadcast

    socket.emit('evento_para_socket_individual', 'Este mensaje sólo lo debe recibir el socket');
    socket.broadcast.emit('evento_para_todos_menos_el_socket_actual', 'Este mensaje lo verán TODOS los sockets conectados menos el socket actual');
    socketServer.emit('evento_para_todos', 'Este mensaje lo reciben TODOS los Sockets conectados');
});