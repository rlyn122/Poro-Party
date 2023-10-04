const path = require("path")
const express = require("express")
const morgan = require("morgan")
const compression = require("compression")
const PORT = process.env.PORT || 8080
const app = express()
const socketio = require("socket.io")
module.exports = app

const createApp = () =>{

    //logging middleware
    app.use(morgan("dev"))

    //parse middleware
    app.use(express.json())
    app.use(express.urlencoded({extended:true}))

    //compression middleware
    app.use(compression());

    //static file serving middleware
    app.use(express.static(path.join(__dirname, "..","public")))

    //sends html file
    app.use("*", (req,res) => {
        res.sendFile(path.join(__dirname, "..", "public/login.html"))
    })

    //error handling endware
    app.use((err,req,res,next) => {
        console.log(err)
        console.error(err.stack)
        res.status(err.status || 500).send(err.message || "Internal server error.")
    })

    //remaining requests, error handling
    app.use((req,res,next)=>{
        if(path.extname(req.path).length) {
            const err = new Error("Not found")
            err.status = 404
            next(err)  
        }
        else {
            next()
        }
    })

    const startListening = () => {
        //start listening, create server object
        const server = app.listen(PORT, ()=>
        console.log(`server listening at port ${PORT}`))
    }

    async function bootApp() {
        await createApp();
        await startListening();
    }
}