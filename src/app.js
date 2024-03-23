import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import __dirname from "./utils.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
// lo utilizo en el socket import { ProductManager } from "./service/ProductManager.js";
import Sockets from "./sockets.js";


const app = express();
const port = 8080;
// lo utilizo en el socket const products = new ProductManager();

// Middleware
app.use(express.static(`${__dirname}/../public`));
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");



app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

// Start servidor
const httpServer = app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

//const socketServer = new Server(httpServer);

// Esto lo hago en el sockets.js para modularizar
/*socketServer.on("connection", (socket) => {
  console.log("Cliente conectado: ", socket.id);

  socket.on("requestProducts", async () => {
    const productList = await products.getProducts();
    socket.emit("productList", productList);
  });
});*/



// Set up WebSocket server
const io = new Server(httpServer);
Sockets(io);

