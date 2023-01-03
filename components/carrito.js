const fs = require('fs');

class Carts {
    constructor(nombreArchivo) {
        this.nombreArchivo = nombreArchivo;
    };

    async getAll() {
        try {
            let cart = await fs.promises.readFile(this.nombreArchivo, 'utf-8');
            return JSON.parse(cart);
        } catch (error) {
            console.log('Error al cargar carrito');
            console.error(error);
        }
    };

    async writeFile(datos) {
        await this.getAll()
        try {
            await fs.promises.writeFile(
                this.nombreArchivo,
                JSON.stringify(datos, null, 2)
            )
        } catch (error) {
            console.log(error)
        }
    }

    async addProduct(product, cartId) {
        try {
            const cart = await this.getCartById(cartId);
            const { id, timestamp, productos } = cart[0]
            console.log(JSON.stringify(cart))
            productos.push(product)
            let carts = await this.getAll();
            carts.map((e) => {
                if (e.id == cart[0].id) {
                    e.productos = [...e.productos, product]
                }
            })
            await this.writeFile(carts)
            return cart
        } catch (error) {
            console.log(error)
        }
    };

    async updateCart(cart) {
        let carts = await this.getAll()
        let index = carts.map(element => element.id).indexOf(cart.id)
        carts.splice(index, 1)
        console.log(cart)
        carts.push(cart)
        await this.saveCartProds(carts)
        return true
    };

    async getById(id) {
        let carts = await this.getAll();
        let cart = carts.find(element => element.id == id);
        if (cart) {
            return cart
        } else {
            return "el ID no existe"
        }
    };

    async getCartById(id) {
        let carts = await this.getAll();
        let cart = carts.filter(element => element.id == id);
        if (cart) {
            return cart
        } else {
            return "el ID no existe"
        }
    };

    async newCart() {
        try {
            let cartProds = await this.getAll();
            let cart = {};
            let idCounter = 0;
            let date = new Date();
            if (cartProds.length > 0) {
                idCounter = cartProds[cartProds.length - 1].id + 1;
                cart = {
                    id: idCounter,
                    timestamp: date,
                    productos: [],
                };
                console.log(cart);
                cartProds.push(cart);
            } else {
                idCounter = 1;
                cart = {
                    id: idCounter,
                    timestamp: date,
                    productos: [],
                };
                console.log(cart);
                cartProds.push(cart);
            }
            await this.writeFile(cartProds);
            return cart;
        } catch (error) {
            console.log(error);
        }
    };

    async deleteById(id) {
        let cartProds = await this.getAll();
        try {
            const cartFind = cartProds.find(cart => cart.id == id);
            if (cartFind === undefined) {
                console.log('El ID no existe');
            } else {
                let newCart = cartProds.filter(element => element != cartFind);
                await this.writeFile(newCart);
                console.log(`Eliminado: ${JSON.stringify(cartFind)}`);
                return cartFind;
            }
        } catch (error) {
            console.log(error);
        }
    };

    async deleteProduct(cartId, productId) {
        try {
            const cart = await this.getCartById(cartId);
            const { id, timestamp, productos } = cart[0]
            let newProducts = productos.filter(e => e.id != productId);
            let carts = await this.getAll();
            carts.map((e) => {
                if (e.id == cart[0].id) {
                    e.productos = newProducts;
                }
            })
            await this.writeFile(carts)
        } catch (error) {
            console.log(error)
        }
    }


}

module.exports = Carts;