const express = require("express");

const productRouter = require('./routes/productRouter');

const app = express();
const PORT = 3030 || process.env.PORT;

//MiddleWares
app.use(express.json());
app.use(express.urlencoded({ extended:true }));

app.use(express.static('public'), productRouter);

app.use('/api/productos', productRouter);



const Carts = require('./managers/carrito');
const carts = new Carts('carrito.json');
const Products = require('./managers/products');
const products = new Products('products.json');

//Cart Routes

app.post('/api/carrito', async (req, res) => {
    try {
        let cart = await carts.newCart();
        res.json({
            cart: cart
        });
    } catch (error) {
        console.error('Failed to create');
        console.error(error);
    }
});
app.delete('/api/carrito/:id', async (req, res) => {
    try {
        let deleted = await carts.deleteById(req.params.id);
        res.json({deleted_cart: deleted})
    } catch (error) {
        console.error('Failed to delete');
        console.error(error);
    }
});

app.get('/api/carrito/:id/productos', async (req, res) => {
    let cart = await carts.getById(req.params.id);
    if (cart) {
        try {
            res.json({
                cart_id: cart.id,
                cart_products: cart.products
            });
        } catch (error) {
            console.error('Failed to get');
            console.error(error);
        }
    } else {
        res.json({
            error: 'There is no Cart with this ID'
        });
    };
});

app.post('/api/carrito/:id/productos', async (req, res) => {
    let cart = await carts.getById(req.params.id);
    let product = await products.getById(req.body.id); //Se envía el id del producto mediante el BODY.
    try {
        cart.products.push(product);
        await carts.updateCart(cart);
        res.json({
            added_product: product,
            cart: cart
        });
    } catch (error) {
        console.error('Failed to add.');
        console.error(error);
    }
});

app.delete('/api/carrito/:id/productos/:id_prod', async (req, res) => {
    let cart = await carts.getById(req.params.id);
    let product = await products.getById(req.params.id_prod);
    if (cart && product) {
        let check = cart.products.some(elem => elem.id == product.id);
        if (check) {
            await carts.updateCart({...cart, "products": cart.products.filter(elem => elem.id != product.id)});
            res.json({deleted_product: product});
        } else {
            res.json({"error": "Product is not in the cart."});
        };
    } else {
        res.json({"error": "No Cart or Product with this ID."});
    };
});


let connected_server = app.listen(PORT, () => console.log(`Server on http://localhost:${PORT}`));
connected_server.on('error', error => console.log(error));