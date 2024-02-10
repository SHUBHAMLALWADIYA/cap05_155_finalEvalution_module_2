const jwt=require("jsonwebtoken");
const cookieParser=require("cookie-parser")
const dotenv=require("dotenv");

dotenv.config();



const auth=async(req,res,next)=>{
 
   
   
    console.log(process.env.REFRESHTOKEN_SECRETEKEY)
    console.log(process.env.REFRESHTOKEN_SECRETEKEY)
    console.log(process.env.MONGO_ATLASH_URI)
    console.log(process.env.PORT)

    const accesstoken=req.cookies.accesstoken;
    const refreshtoken=req.cookies.refreshtoken;
    console.log(req.cookies)
    try {
        const logoutData= await BlackListed.exists({accesstoken})
        if(logoutData){
            res.status(200).send({msg:"please login"})
        }

        jwt.verify(accesstoken,process.env.ACCESSSTOKEN_SECRETEKEY,async(err,decoded)=>{
            if(decoded){
            req.userId=decoded.userId;
            console.log("decoded",decoded)
                next()
            }else{
                if(err.message==="jwt expired"){
                    jwt.verify(refreshtoken,process.env.REFRESHTOKEN_SECRETEKEY,(err,decoded)=>{
                        const cookieOption={
                            httpOnly:true,
                            secure:true,
                            sameSite:"None"
                        
                        }
                        if (decoded) {
                            const accesstoken = jwt.sign({userId:decoded.userId,name:decoded.name}, process.env.ACCESSSTOKEN_SECRETEKEY, {expiresIn: "15m"});
                           
                           
                            res.cookie("accesstoken", accesstoken,cookieOption);
                          
                            next();
                          } else {
                            res.send("login again because both token expried");
                          }

                    })
                }
            }
        })




    } catch (error) {
        console.log(error)
        return res.send({ error: error.message, message: "please login again" });
    }
}


module.exports=auth