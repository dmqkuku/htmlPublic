import express from "express";
import path from "path";
//const session = require("express-session");
//const uuid = require("uuid");
//const fs = require("fs");
//const WebSocket = require("ws");
import fetch from "node-fetch";
import os from "os";
import zlib from "zlib";

function getServerIp(){
    var ifaces = os.networkInterfaces();
    var result = '';
    for(var dev in ifaces){
        var alias = 0;
        ifaces[dev].forEach(function(details){
            if(details.family == 'IPv4' && details.internal == false){
                result = details.address
                alias++;
            }
        })
    }
    return result;
}

const app = express();
app.use(express.json());
// const sessionParser = session({
//     saveUninitialized :false
//     ,secret : "$eCuRiTy2"
//     ,resave : false
// })
const port = 3000;
const __dirname = path.resolve();

app.get("/", (request, response) => {
    response.sendFile(path.join(__dirname + "/Navi2.html"));
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

console.log(getServerIp());