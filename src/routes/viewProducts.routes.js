import { Router } from "express";
//import ProductManager from "../controllers/product.controller.js";
import ProductManager from "../manager/productManager.js";
const router = Router();
const PM= new ProductManager('./src/saborescseros.json');

router.get('/', async (req, res) => {
    const products = await PM.getProduct();
    res.render('home', {products});
})

export default router;