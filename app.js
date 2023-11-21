require("dotenv").config();
const express = require("express");
const cors = require("cors");
const dbConnection = require("./db");


const app = express();
app.use(express.json());
dbConnection();


app.use(
    cors({
        origin: "http://localhost:3000",
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    })
);


app.use("/auth", require("./Routes/auth"));
app.use("/product", require("./Routes/salepurchase"));

app.use("/",(req,res)=>{
    return res.json({msg:'Welcome To The Tribe Tech Solutions'});
})

const port = process.env.PORT || 8000;
app.listen(port, () => console.log("Listening on port " + port));