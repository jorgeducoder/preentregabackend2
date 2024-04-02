// Aqui hay que hacer el post y el delete desde websocket, y los demas metodos probar que se hagan con Postman.
// Seguramente luego para el carrito lo mismo


import { Router } from "express";
import { ProductManager } from "../manager/productManager.js";

// Al definir una nueva clase se indica el archivo donde alojar esa clase.
const PM = new ProductManager("./src/saborescaseros.json");

// Define los metodos para el router de usuarios
const router = Router();



router.get("/", async (req, res) => {
    const {limit} = req.query;
    // Debe ir adentro del get porque utilizo products para el params, si carga uno solo es el que queda para el slice
    let products = await PM.getProduct();
    if (limit) {
       products = products.slice(0, limit);
       }
   // getProductbyId(id);
    res.send(products);
});  

router.get('/:pid', async (req, res) => {
    
    let productId = req.params.pid;
    // Convierto el tipo para que no haya problemas en ProductManager con el ===
    const products = await PM.getProductbyId(parseInt(productId));
    res.send({products});
});


router.post("/", async (req, res) => {
    const { nombre, porciones, recetadesc, img, maxprod, precio, categoria, status } = req.body;
    console.log("Body:", req.body);
    console.log(nombre, porciones, recetadesc, img, maxprod, precio, categoria, status );
    if (!nombre || !porciones || !recetadesc || !img || !maxprod || !precio || !categoria || !status)
     
    return res.status(400).send({error: "Faltan datos para agregar al producto!"});

    //res.send( await PM.addProduct(req.body)); da error en el header pero devuelve codigo 200 idem el update
     await PM.addProduct(req.body);

    res.status(201).send({message: "Producto creado correctamente!"});
});

router.put("/:pid", async (req, res) => {
    const pid = req.params.pid;
    await PM.updateProduct(pid, req.body);
    res.status(200).send({message: "Producto actualizado correctamente!"});
})

router.delete("/:pid", async (req, res) => {
    const pid = req.params.pid;
    await PM.deleteProduct(pid);
    console.log("Se elimino:", pid);
    res.status(201).send({message: "Producto eliminado correctamente!"});
});

export default router;