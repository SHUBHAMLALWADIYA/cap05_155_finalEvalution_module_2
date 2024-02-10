const mongoose=require("mongoose");


const blackListSchema=mongoose.Schema({
    accesstoken:String,
    refreshtoken:String
},{versionKey:false})

const BlackListed=mongoose.model("blackList",blackListSchema);

module.exports=BlackListed;