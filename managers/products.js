const { promises: fs } = require('fs');

class Contenedor{
    constructor (nombreArchivo) {
        this.nombreArchivo = nombreArchivo;
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
    async save(obj) {
        let stock = await this.getAll()
        if (stock.length == 0) {
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

    /* checkId(product, arr){
        arr.forEach(element => {
            if(element.id == product.id){
                console.log('El ID ya existe.');
                return this.newId(product, arr);
            } 
        });
        return product.id;
    } */
    newId(product, arr){
        arr.sort((a, b) => {return a - b}) 
        product.id = parseInt(arr[arr.length - 1].id) + 1
        console.log(`Product's new ID : ${product.id}`)
        return product.id;
    }
    async getAll(){
        try {
            let products = await fs.promises.readFile(this.nombreArchivo, 'utf-8');
            return JSON.parse(products);
        } catch (error) {
            console.log(error);
            return [];
        }
    }
    async getById(id){
        const products = await this.getAll();
        let product = products.find(element => element.id == id);
        return product ? product : null;
    }
    /* async saveProduct(obj){
        const products = await this.getAll();
        obj.id = parseInt(obj.id);
        obj.id = this.checkId(obj, products);
        obj.price = parseInt(obj.price);
        try {
            console.log(`New element : \n${JSON.stringify(obj)}`);
            products.push(obj);
            await fs.writeFile(this.nombreArchivo, JSON.stringify(products, null, 2));
            console.log('Product saved.');
            return obj;
        } catch (error) {
            console.error('Failed to save.');
            console.error(error);
        }
    } */
    async updateProduct(obj){
        const products = await this.getAll();
        let index = products.map(element => element.id).indexOf(obj.id);
        if (index >= 0) {
            try {
                products.splice(index, 1, obj);
                await fs.writeFile(this.nombreArchivo, JSON.stringify(products, null, 2));
            } catch (error) {
                console.error('Failed to update.');
                console.error(error);
            }            
        } else {
            console.log('NO index.');
        }
    }
    
    /* async deleteById(id) {
        try {
            let stock = await this.getAll()
            stock = stock.filter(prod => prod.id != id)
            await this.writeFile(stock)
            console.log(`Se ha eliminado el producto`)
        } catch (error) {
            console.log(error)
        }
    } */
    async deleteById(id) {
        let products = await this.getAll();
        if (!products.length) {
            console.error('No products.');
        } else {
            try {
                const delProd = products.find(prod => prod.id == id);
                if (delProd === undefined) {
                    console.error('Unexistent ID');
                } else {
                    let newArr = products.filter(element => element != delProd);
                    await fs.writeFile(this.nombreArchivo, JSON.stringify(newArr, null, 2));
                    console.log(`Deleted product: ${JSON.stringify(delProd)}`);
                    return delProd;
                }
            } catch (error) {
                console.error('Failed to delete.');
                console.error(error);
            }
        }
    } 
}

module.exports = Contenedor;