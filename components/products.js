const fs = require('fs');

class Products {
    constructor(nombreArchivo) {
        this.nombreArchivo = nombreArchivo;
    };

    async getAll() {
        try {

            let data = await fs.promises.readFile(this.nombreArchivo, 'utf-8');
            let stock = JSON.parse(data);
            return stock

        } catch (error) {
            console.log(error);
            return [];
        }
    }

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

    async save(obj) {
        let stock = await this.getAll();
        if (stock.length === 0) {
            obj.id = 1

        } else {
            obj.id = stock[stock.length - 1].id + 1

        }
        try {
            stock.push(obj)
            await this.writeFile(stock)
            console.log(`Se ha añadido correctamente ${JSON.stringify(obj)}`)

        } catch (error) {
            console.log(error, "No se ha guardado correctamente")
        }
    }

    async getById(id) {
        const products = await this.getAll();
        let product = products.find(element => element.id == id);
        return product ? product : null;
    }

    async updateProduct(obj) {
        const products = await this.getAll();
        let index = products.map(element => element.id).indexOf(obj.id);
        if (index >= 0) {
            try {
                products.splice(index, 1, obj);
                await ths.writeFile(products);
            } catch (error) {
                console.log(error)

            }
        } else {
            console.log('NO index.');
        }
    }

    async updateById(obj) {
        try {
            let stock = await this.getAll();
            stock.map(prod => {
                if (prod.id == obj.id) {
                    prod.nombre = obj.nombre,
                        prod.precio = prod.precio,
                        prod.marca = prod.marca
                }
            })
            await this.writeFile(stock)
            return stock
        } catch (error) {
            console.log(error)
        }
    }

    async deleteById(id) {
        let stock = await this.getAll();
        const findId = stock.find(prod => prod.id == id);
        if (stock) {
            try {
                if (findId) {
                    let filter = stock.filter(product => product != findId);
                    await this.writeFile(filter);
                    console.log(`Se ha eliminado el producto: ${JSON.stringify(findId)}`);
                } else if (findId === undefined) {
                    console.error("No se encuentra el ID")
                }
            } catch (error) {
                console.log(error);
            }
        } else {
            console.log("No hay productos")
        }
    }
}

module.exports = Products;