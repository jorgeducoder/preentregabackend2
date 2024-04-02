import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import __dirname from "./utils.js";
import router from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
// lo utilizo en el socket import { ProductManager } from "./service/ProductManager.js";
import Sockets from "./sockets.js";


const app = express();
const port = 8080;
// lo utilizo en el socket const products = new ProductManager();

// Middleware
app.use(express.static(`${__dirname}/../public`));

// Para decirle que tu servidor puede recibir datos primitivos desde el cuerpo de la app debes decirle que va a usar la herramienta de express
// para poder utilizar JSON en tus rutas

app.use(express.json()); // Tu server podra leer los datos recibidos por los cuerpos de las paginas (req.body)
app.use(express.urlencoded({ extended: true })); //Podra leer cantidades grandes de datos/complejos. JSON muy grandes 


app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");


// cambio a cartsRouter y dejo solo router porque asi se llaman los router en cart.router.js y product.router.js respectivamente
app.use("/api/products", router);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

// Start servidor
const httpServer = app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});


// Set up WebSocket server
const io = new Server(httpServer);
Sockets(io);

