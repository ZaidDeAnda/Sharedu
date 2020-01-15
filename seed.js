var mongoose = require("mongoose");
var Olimpiada = require("./models/olimpiada");
var User = require("./models/user");

var data = [
    {
        nombre: "Olimpiada de informática",
        descripcion: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illo temporibus voluptas",
        requisitos: ["Ser menor de 18 años", "Estudiar secundaria o preparatoria", "Tener gusto por las matemáticas y solución de problemas"],
        imagen: "https://lloydcode.files.wordpress.com/2016/06/puppy-coding.jpg",
        fecha: "01 de Diciembre",
        isOpen: true,
        encargado: {username: "Kuko"}
    },
    {
        nombre: "Olimpiada de Química",
        descripcion: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illo temporibus voluptas",
        requisitos: ["Ser menor de 18 años", "Estudiar secundaria o preparatoria", "Tener gusto por las matemáticas y solución de problemas"],
        imagen: "https://i.ytimg.com/vi/addK0b2Isw8/maxresdefault.jpg",
        fecha: "30 de Septiembre",
        isOpen: false,
        encargado: {username: "Kuko de Química"}
    },
    {
        nombre: "Olimpiada de Física",
        descripcion: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illo temporibus voluptas",
        requisitos: ["Ser menor de 18 años", "Estudiar secundaria o preparatoria", "Tener gusto por las matemáticas y solución de problemas"],
        imagen: "https://i.imgflip.com/1254jp.jpg",
        fecha: "24 de Octubre",
        isOpen: true,
        encargado: {username: "Kuko de Física"}
    },
    {
        nombre: "Olimpiada de Matemáticas",
        descripcion: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illo temporibus voluptas",
        requisitos: ["Ser menor de 18 años", "Estudiar secundaria o preparatoria", "Tener gusto por las matemáticas y solución de problemas"],
        imagen: "https://i.ytimg.com/vi/aBiJBZuPvAI/hqdefault.jpg",
        fecha: "24 de Octubre",
        isOpen: false,
        encargado: {username: "Kuko de Matemáticas"}
    },
];

function olympiadSeedDB() {
    // Removing all the data
    Olimpiada.deleteMany({}, function(err) {
        if(err) {
            console.log("There's an error sir");
        } else {
            console.log("Olimpiadas removidas!");
            // Add some olympiads
            data.forEach(function(seed) {
                Olimpiada.create(seed, function(err, createdOlympiad) {
                    if(err) {
                        console.log("An error in the creation of an Olympiad");
                        console.log(err);
                    } else {
                        console.log("Olympiad created!!");
                    }
                })
            });
        }
    });
}

module.exports = {olympiadSeedDB};