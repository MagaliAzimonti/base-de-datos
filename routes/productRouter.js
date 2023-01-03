const express = require("express");
const { Router } = express;
let productsRouter = new Router();

const Products = require('../components/products');
const products = new Products('products.json');

const isAdmin = require("../middlewares/index")


productsRouter.get('/', async (req, res, next) => {
    let stock = await products.getAll()
    stock.length > 0 ? res.json(stock) : res.send({ error: "archivo no encontrado" })
});

productsRouter.get('/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        let product = await products.getById(id);
        res.send(product);
    } catch (error) {
        console.log(error);
    }
});

productsRouter.post('/', isAdmin, async (req, res, next) => {
    try {
        let { nombre, precio, marca } = req.body
        if (nombre && precio && marca) {
            let newProd = {
                nombre,
                precio,
                marca
            };
            await products.save(newProd)
            res.json({ newProd })
        } else {
            res.send({ error: "producto no guardado" })
        }
    } catch (error) {
        console.log(error)
    }
})

productsRouter.put('/:id', isAdmin, async (req, res, next) => {
    try {
        let id = req.params.id
        let { nombre, precio, marca } = req.body
        if (nombre && precio && marca) {
            let updProd = { id, nombre, precio, marca };
            await products.updateById(updProd)
            res.json({ updProd })
        } else {
            res.send({ error: "producto no encontrado" })
        }
    } catch (error) {
        console.log(error)
    }
})

productsRouter.delete('/:id', isAdmin, async (req, res) => {
    let deleted = await products.getById(req.params.id);
    if (deleted) {
        await products.deleteById(req.params.id);
        res.json({ deleted_product: deleted });
    } else {
        console.log('No ha sido posible eliminar el producto');

    }
});

module.exports = productsRouter;