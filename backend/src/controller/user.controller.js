const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken");
const dotenv=require("dotenv");
const UserModel = require("../models/user.model");
const BlackListed = require("../models/blacklisted.model");
dotenv.config()

const acc_secretKey=process.env.ACCESSSTOKEN_SECRETEKEY
const ref_secretKey=process.env.REFRESHTOKEN_SECRETEKEY



const register = async (req, res) => {
    try {
      const { name, email, gender, password } = req.body;
      bcrypt.hash(password, 10,async(err,hash)=>{
        if(err){
           return res.status(400).send({msg:"somthing went wrong in hash password",error:err})
        }else{
       const user=new UserModel({email,gender,name,password:hash});
       await user.save()
       return res.send({msg:"user register successfully",user:user})
        }
      });
     
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  };


  


  
//login
const login=async(req,res)=>{
    const { email, password } = req.body;
   
   
    try {
        const cookieOption={
            httpOnly:true,
            secure:true,
            sameSite:"None"
        }
       
        const findUser= await UserModel.findOne({email})
        const payload={userId:findUser._id,name:findUser.name}
        if(findUser){
        bcrypt.compare(password,findUser.password,(err,result)=>{
            if(result){
                const accesstoken=jwt.sign(payload,acc_secretKey,{expiresIn:"1d"})
                const refreshtoken=jwt.sign(payload,ref_secretKey,{expiresIn:"7d"})
                res.cookie("accesstoken",accesstoken,cookieOption)
                res.cookie("refreshtoken",refreshtoken,cookieOption)
                return res.status(200).send({msg:"Login successfull !",userId:findUser._id,name:findUser.name})
            }else{
                return res.status(200).send({msg:"your password is wrong please correct it",err:err})
            }
        })   
        }else{
        return res.status(200).send({msg:"your credential is wrong or You have to register first"})
        }
       
    } catch (error) {
        return res.status(400).send({msg:"something went wrong",error:error.message})
    }
}





const logout = async (req, res) => {
    try {
        const accesstoken = req.cookies.accesstoken;
        const refreshtoken = req.cookies.refreshtoken;
        console.log(req.cookies)
        console.log({ "accessToken": accesstoken, "refreshToken": refreshtoken });

        const loggedOutTokens = await BlackListed.findOne({ accesstoken, refreshtoken });

        if (loggedOutTokens) {
            return res.status(200).send({ msg: "You are already logged out , you have to login again." });
        } else {
            const blackListData = new BlackListed({ accesstoken, refreshtoken });
            await blackListData.save();
            return res.status(200).send({ msg: "You are logged out now." });
        }

    } catch (error) {
        return res.status(400).send({ msg: "Something went wrong", error: error.message });
    }
};


  
  

  module.exports={register,login,logout}