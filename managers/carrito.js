const { promises: fs } = require('fs');

class Contenedor{
    constructor (nombreArchivo) {
        this.nombreArchivo = this.nombreArchivo;
    };

    newId(arr, cart = false){
        if (cart) {
            arr.sort((a, b) => {return a - b}) 
            cart.id = parseInt(arr[arr.length - 1].id) + 1 
            console.log(`Nuevo Id : ${cart.id}`)
            return cart.id;
        }
        return parseInt(arr[arr.length - 1].id + 1);
    };
    
    async updateCart(cart){
        let carts = await this.getAll()
        let index = carts.map(element => element.id).indexOf(cart.id)
        carts.splice(index, 1)
        console.log(cart)
        carts.push(cart)
        await this.saveCartProds(carts)
        return true
    };

    async saveCartProds(carts){
        try {
            await fs.writeFile(carts)
        } catch (error) {
            console.log(error)
        }
    };

    async getAll() {
        try {
            let cart = await fs.readFile(this.nombreArchivo, 'utf-8');
            return JSON.parse(cart);
        } catch (error) {
            console.log('Error al cargar carrito');
            console.error(error); 
        }
    };

    async getById(id){
        let carts = await this.getAll();
        let cart = carts.find(element => element.id == id);
        return cart ? cart : null;
    };

    async newCart(){
        try {
            let carts = await this.getAll();
            let id;
            if (carts.length > 0) {
                id = this.newId(carts);
            } else {
                id = 1;
            }
            let products = [];
            let timestamp = Date.now()

            let cart = {id, products, timestamp};

            carts.push(cart);
            await fs.writeFile(this.nombreArchivo, JSON.stringify(carts, null, 2));
            return cart;
        } catch (error) {
            console.log('Failed to create.');
            console.error(error);
        }
    };

    async deleteById(id){
        let carts = await this.getAll();
        if (!carts.length) {
            console.error('No se encuentra el carrito')
        } else {
            try {
                const delCart = carts.find(cart => cart.id == id);
                if (delCart === undefined) {
                    console.error('No existe el ID');
                } else {
                    let newArr = carts.filter(element => element != delCart);
                    await fs.writeFile(this.nombreArchivo, JSON.stringify(newArr, null, 2));
                    console.log(`Deleted cart: ${JSON.stringify(delCart)}`);
                    return delCart;
                } 
            } catch (error) {
                console.log('Error al intentar eliminar');
                console.error(error);
            }    
        };
    };
    
}

module.exports = Contenedor;