const express = require("express");
const { Router } = express;
let cartRouter = new Router();

const Carts = require('../components/carrito');
const carts = new Carts('carrito.json');
const Products = require('../components/products');
const products = new Products('products.json');

cartRouter.get('/', async (req, res, next) => {
    let stock = await carts.getAll()
    stock.length > 0 ? res.json(stock) : res.send({ error: "archivo no encontrado" })
});

cartRouter.post('/', async (req, res, next) => {
    try {
        let cart = await carts.newCart()
        res.json(cart)
    } catch (error) {
        console.log(error);
    }
});

cartRouter.delete('/:id', async (req, res, next) => {
    try {
        let deleted = await carts.deleteById(req.params.id);
        res.json({ eliminado: deleted })
    } catch (error) {
        console.log(error);
    }
});

cartRouter.get('/:id/productos', async (req, res, next) => {
    let cart = await carts.getById(req.params.id);
    try {
        res.json(cart);
        console.log(cart)
    } catch (error) {
        console.log(error)
    }
});

cartRouter.post('/:id/productos/:id_prod', async (req, res, next) => {
    try {
        let product = req.params.id_prod;
        let cartId = req.params.id;
        let getProduct = await products.getById(product);
        let addedToCart = await carts.addProduct(getProduct, cartId)
        res.json(addedToCart)
    } catch (error) {
        console.log(error);
    }
});

cartRouter.delete('/:id/productos/:id_prod', async (req, res, next) => {
    try {
        let productId = req.params.id_prod;
        let cartId = req.params.id;
        let getProduct = await products.getById(productId);
        await carts.deleteProduct(cartId, productId)
        res.json({
            eliminado: getProduct
        })
        console.log(getProduct)
    } catch (error) {
        console.log(error)
    }
})

module.exports = cartRouter;
