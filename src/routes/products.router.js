// Aqui hay que hacer el post y el delete desde websocket, y los demas metodos probar que se hagan con Postman.
// Seguramente luego para el carrito lo mismo


import { Router } from "express";
import { ProductManager } from "../manager/productManager.js";

// importo el uploader para subir las imagenes, una por producto
import { uploader } from "../middlewares/multer.js";

// Al definir una nueva clase se indica el archivo donde alojar esa clase.
const PM = new ProductManager("./src/db/files/products.json");

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



// Nuevo POST recibe en uploader la/s imagenes


router.post("/", uploader.single("img"), async (req, res) => {
    const { nombre, porciones, recetadesc,  stock, price, categoria, codigo } = req.body;
    // aunque en el form se controla que ingrese valores numericos si vienen undefined se controla de esta manera
    const porcionesNum = parseInt(porciones, 10);
    const stockNum = parseInt(stock, 10);
    const priceNum = parseInt(price);

    console.log("Body:", req.body);
    console.log("Archivo:", req.file); // req.file si se subio un archivo

    
    if (!nombre || isNaN(porcionesNum) || !recetadesc || isNaN(stockNum) || isNaN(priceNum) || !categoria)
     
    return res.status(400).send({error: "Faltan datos para agregar al producto!"});
    
    // asigna la imagen a una constante
    const imgPath = req.file ? req.file.path : "";

    try {
        const newProduct = await PM.addProduct({
            nombre,
            porciones: porcionesNum,
            recetadesc,
            img: imgPath,
            maxprod: stockNum,
            precio: priceNum,
            categoria,
            codigo, 
            status: "T"
            
        });
        res.status(201).send(newProduct);


    }catch (error) {
        console.error(error);
        res.status(500).send({error: "Error al procesar la solicitud!"});
    }
 });


// UPDATE del producto

router.put("/:pid", async (req, res) => {
    const pid = req.params.pid;
    await PM.updateProduct(pid, req.body);
    res.status(200).send({message: "Producto actualizado correctamente!"});
})


// DELETE del producto

router.delete("/:pid", async (req, res) => {
    const pid = req.params.pid;
    await PM.deleteProduct(pid);
    console.log("Se elimino:", pid);
    res.status(201).send({message: "Producto eliminado correctamente!"});
});

export default router;