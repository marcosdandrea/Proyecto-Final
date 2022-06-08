const express = require('express');
const path = require("path")
const Contenedor = require('./Contenedor');
const ApiProducts = require('./ApiProducts')
const ApiCart = require('./ApiCart')

const app = express()
const APP_PORT = 8080;

app.listen(APP_PORT, () => {

    const middlewareAuthentication = (req, res, next) => {
        req.user = {
            username: "mdandrea",
            isAdmin: true
        };
        //res.status(401).send (JSON.stringify({error: "User not authenticated"}))
        next();
    }

    const middlewareAuthorization = (req, res, next) => {
        if (req.user.isAdmin) next();
        else res.status(403).send (JSON.stringify({error: "User not authorized"}))
    }

    const configProducts = {
        apiRoute: "/api/productos",
        notAllowed: "public/notAllow.html",
        notFound: "public/noProducts.html",
        middlewareAuthentication,
        middlewareAuthorization
    }
    new ApiProducts(app, configProducts, new Contenedor("./data/productos.json"))

    const configCart = {
        apiRoute: "/api/carrito",
        notFound: "public/noItems.html"
    }
    new ApiCart(app, configCart, new Contenedor("./data/carrito.json"))

    app.use((req, res, next) => {
        res.status(404).send({
            status: 404,
            error: 'Not found'
        })
    })

    console.log("listening on port " + APP_PORT)
});