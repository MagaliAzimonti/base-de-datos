const express = require("express")

let admin = true

const isAdmin = (req,res,next)=>{
    if(admin){
        next()
    }
    else{
        res.send("no tiene permiso para esta ruta")
    }
}

module.exports = isAdmin;