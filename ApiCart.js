const path = require("path")
const express = require("express")
const crypto = require("crypto")

module.exports = class Api {
    /**
     * 
     * @param {Express App} app 
     * @param {object} config 
     * @param {Contenedor} contenedor
     */
    constructor(app, config, contenedor) {

        this.app = app
        this.contenedor = contenedor;
        this.apiRouter = express.Router()

        this.apiRouter.get("/:id/productos", (req, res) => {

            contenedor.getAllEntries(req.params.id, "products")
                .then((products) => {
                    if (products.length == 0)
                        res.status(404).sendFile(path.join(__dirname, config.notFound))
                    else
                    res.status(200).send(JSON.stringify(products))
                })
                .catch((err) => {
                    console.log(err)
                    res.status(404).sendFile(path.join(__dirname, config.notFound))
                })
        })

        this.apiRouter.get("/:id/productos", (req, res) => {

            this.contenedor.getById(req.params.id)
                .then((cart) => {
                    if (cart.products == 0)
                        res.status(404).send(JSON.stringify({ error: 'no hay items' }))
                    else
                        res.status(200).send(JSON.stringify(cart.products))
                })
                .catch((err) => {
                    console.log(err)
                    res.status(404).send(JSON.stringify({ error: 'item no encontrado' }))
                })
        })

        
        this.apiRouter.post("/", (req, res) => {

            const newCart = {products: []}

            this.contenedor.save(newCart)
                .then((id) => {
                            res.status(200).send(JSON.stringify({id}))                          
                })
                .catch((err) => {
                    console.log(err)
                    res.status(501).send(JSON.stringify({ error: 'cart no creado' }))
                })
        })

        this.apiRouter.post("/:cartID/:productos", (req, res) => {

            const cartID = req.params.cartID
            const productID = req.query.productID
            const productName = req.query.productName
            const productDescription = req.query.productDescription
            const productCode = req.query.productCode
            const productImageUrl = req.query.productImageUrl
            const productPrice = req.query.productPrice
            const productStock = req.query.productStock

            const data = [productID, productName, productDescription, productCode, productImageUrl, productPrice, productStock]

            if (data.some((entry)=>entry==undefined)) {
                res.status(404).send(JSON.stringify({ error: "datos incorrectos" }))
                return
            }

            const newProduct = {productID, productName, productDescription, productCode, productImageUrl, productPrice, productStock}

            contenedor.addToEntry(cartID, "products", newProduct)
                .then(() => {
                    res.status(200).send(JSON.stringify({ success: 'item agregado' }))
                })
                .catch((err) => {
                    console.log(err)
                    res.status(501).send(JSON.stringify({ error: 'item no agregado' }))
                })

        })

        this.apiRouter.delete("/:cartID/:productID", (req, res) => {

            contenedor.deleteByEntryID(req.params.cartID, "products", "productID", req.params.productID)
                .then(() => {
                    res.status(200).send(JSON.stringify({ success: 'item eliminado' }))
                })
                .catch((err) => {
                    console.log(err)
                    res.status(400).send(JSON.stringify({ error: 'no se pudo eliminar' }))
                })
        })

        this.apiRouter.delete("/:id", (req, res) => {

            contenedor.deleteByID(req.params.id)
                .then(() => {
                    res.status(200).send(JSON.stringify({ success: 'item eliminado' }))
                })
                .catch((err) => {
                    console.log(err)
                    res.status(400).send(JSON.stringify({ error: 'no se pudo eliminar' }))
                })
        })

        
        app.use(config.apiRoute, this.apiRouter)
            
        app.use((req, res, next) => {
            res.status(404).send({
                status: 404,
                error: 'Not found'
            })
        })
        
        app.use("/", express.static(path.join(__dirname, 'public')))
    }

}
