const express = require('express');
const path = require("path")
const Contenedor = require('./Contenedor');
const ApiProducts = require('./ApiProducts')
const ApiCart = require('./ApiCart')

const app = express()
const APP_PORT = 8080;
const ADMIN_MODE = true

app.listen(APP_PORT, () => {

    const configProducts = {
        apiRoute: "/api/productos",
        notAllowed: "public/notAllow.html",
        notFound: "public/noProducts.html"
    }
    new ApiProducts(app, ADMIN_MODE, configProducts, new Contenedor("./data/productos.json"))

    const configCart = {
        apiRoute: "/api/carrito",
        notFound: "public/noItems.html"
    }
    new ApiCart(app, configCart, new Contenedor("./data/carrito.json"))

    console.log("listening on port " + APP_PORT)
});