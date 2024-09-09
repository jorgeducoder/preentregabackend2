import { Router } from "express";
import { ProductManager } from "../manager/productManager.js";

const router = Router();
//const products = new ProductManager("./src/saborescaseros.json");
const products = new ProductManager("./src/db/files/products.json");


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