const Converter = require("csv-converter-to-pdf-and-html");
const path = require("path");
const express = require('express')
const multer = require('multer')
const fs=require('fs');
const { clearScreenDown } = require("readline");

const app = express()

app.use(express.static("ucsv"));

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "ucsv")
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname) 
  },
})

var upload = multer({ storage: storage }).single('file')

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html")
})

app.post('/convert', (req, res) => {
    
    upload(req, res, (err) => {
        if (!err){
            const converter = new Converter();
            const filePath = path.resolve(req.file.path); 
            const destinationPath = path.resolve('./ucsv', req.file.originalname); 
            converter.HTMLAndPDFConverter(filePath, destinationPath)
            
            const p=req.file.originalname+'.html'
            app.get(+p, (req, res) => {
              res.sendFile(__dirname + p)
            })
            res.redirect(p)

          }
    })
  })

app.listen(3000)