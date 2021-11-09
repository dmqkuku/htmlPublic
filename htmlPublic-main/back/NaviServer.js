// import express from "express";
const express = require("express")
// import path from "path";
const path = require("path")
//import fetch from "node-fetch";
const fetch = require("node-fetch");


const app = express();
app.use(express.json());

const port = 3000;
if(!__dirname){
    __dirname = path.resolve();
}

app.get("/", (request, response) => {
    response.sendFile(path.join(__dirname + "/front/index.html"));
})
app.get("/index", (request, response) => {
    response.sendFile(path.join(__dirname + "/front/Navi2.html"));
})

app.post("/findPath", (request, response) => {
    const {fromLocLong, fromLocLat, toLocLong, toLocLat} = request.body;
    console.log(request.body);

    const apiKey = '200a065a611af48cc480e5c99c022801';
    //const apiKey = 'e9c5a05e82a299bcb079763ee5535cf3'
    
    const fromLongEncoded = fromLocLong
    const formLatiEncoded = fromLocLat
    const toLongEncoded = toLocLong
    const toLatiEncoded = toLocLat

    // const myInit = {
    //     method : "GET",
    //     headers : myHeaders,
    //     mode : "cors"
    // }
    //let myRequest = new Request(`https://apis-navi-kakaomoility.com/v1/directions?origin=${fromGeoLoc.longitude},${fromGeoLoc.latitude}&destination=${movingLoc.longitude},${movingLoc.latitude}`)
    //https://apis-navi.kakaomobility.com/v1/directions?priority=RECOMMEND&car_type=1&car_fuel=GASOLINE&origin=127.0292881%2C37.4923615&destination=127.0292881%2C37.4923615
    const url = `https://apis-navi.kakaomobility.com/v1/directions?origin=${fromLongEncoded},${formLatiEncoded}&destination=${toLongEncoded},${toLatiEncoded}&priority=RECOMMEND&car_type=1&car_fuel=GASOLINE`
    console.log(`Fetching from ${url}`)
    
    fetch(url, {
        method : "GET"
        ,headers : {
            Authorization : `KakaoAK ${apiKey}`
        }
    })
    .then(function(response){
        //console.log(response.headers['content-encoding']);
        return response.text();
    })
    .then(function(data){
        //console.log(data);
        return JSON.parse(data);
    }).then(function(jsonObj){
        console.log(`결과 : ${jsonObj.routes[0].result_msg}`);
        //console.log(jsonObj.routes[0].sections);
        console.log(`Distance : ${jsonObj.routes[0].sections[0].distance}`)
        //console.log(`Road : ${jsonObj.routes[0].sections[0].roads}`)
        response.send(JSON.stringify(jsonObj.routes[0].sections[0].roads));
    }).catch(function(error){
        console.error(error);
    })
    //response.send({msg : "success"});
})
app.listen('3000', () => {
    console.log(`app is lisening from localhost:3000`);
})
