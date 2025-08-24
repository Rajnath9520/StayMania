const mongoose = require("mongoose");
const initData = require("./data.js");
const listing = require("../models/listing.js");


const MONGO_URL="mongodb://127.0.0.1:27017/wonderlust";

main().then(()=>{
    console.log("conncted to DB");
}).catch(err =>{
    console.log(err);
})

async function main(){
    await mongoose.connect(MONGO_URL);
}

const intiDB = async()=>{
    await listing.deleteMany({});
    initData.data = initData.data.map((obj) =>(
        {...obj, owner:"689f1135afd4ab017578ca94"}
    ));
    await listing.insertMany(initData.data);
    console.log("data was initialized");
}
intiDB();