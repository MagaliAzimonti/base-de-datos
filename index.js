const express = require("express");
const productsRouter = require('./routes/productRouter');
const cartRouter = require('./routes/cartRouter');
const app = express();
const PORT = 3030 || process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/productos', productsRouter);
app.use('/carrito', cartRouter);

app.get('/', (req, res, next) => {
    res.send(`<h1 style="color:rgb(255, 110, 146);text-align:center">Bienvenido a Frater Solis - Cosmética Natural<h1>
    <button><a href="http://localhost:3030/productos">Productos</a></button>
    <button><a href="http://localhost:3030/carrito">Carrito</a></button>
    `)
})

let connected_server = app.listen(PORT, () => console.log(`Server on http://localhost:${PORT}`));
connected_server.on('error', error => console.log(error));