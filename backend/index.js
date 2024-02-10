const express=require("express")
const dotenv=require("dotenv");
const cookieParser=require("cookie-parser")
const cors=require("cors")
dotenv.config()
const app=express();
const connection=require("./src/db")
const userRouter = require("./src/router/user.route");
const postRouter = require("./src/router/post.route");
const PORT=process.env.PORT



app.use(express.json())
app.use(cookieParser())
app.use(cors())




app.use("/users",userRouter)
app.use("/posts",postRouter)

app.listen(PORT,async()=>{
    try {
        await connection
        console.log("db connection is build");
        console.log("server is running very good..")
    } catch (error) {
        console.log({error:error,msg:"error in connection..."})
    }
})

