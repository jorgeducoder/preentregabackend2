import { Router } from "express";
import { ProductManager } from "../manager/productManager.js";

const router = Router();
//const products = new ProductManager("./src/saborescaseros.json");
const products = new ProductManager("./src/db/files/products.json");


// renderizo  lista de productos existentes desde HTML en /products
// Obtiene los productos de la base en esta ruta y los renderiza con home.handlebars.
// No pasa por el socket por eso en public no precisa un js y utiliza el mismo css que para realtimeproducts

router.get("/", async(req, res) => {
    // renderizo la handlebars definida  
    try {
      const productList = await products.getProduct();
      // renderizo la handlebars definida
      res.render("home",
        {
          title: "Productos desde HTML",
          style: "productList.css",
          productList
        }
      );
      //console.log("Productlist en router.get de la view: ", productList);
    } catch (error) {
      res.status(500).send(error.message);
    }
  });

router.get("/realtimeproducts", async (req, res) => {
// router.get("/", async (req, res) => {   
try {
        const productList = await products.getProduct();
        res.render("realTimeProducts",
        {
            title: "Real Time Products",
            style: "realtimeproducts.css",
            productList
        }
        );
    } catch (error) {
        res.status(500).send(error.message);
    }    
});


export default router;