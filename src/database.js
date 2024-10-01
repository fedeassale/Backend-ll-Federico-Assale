import mongoose from "mongoose";

mongoose.connect("mongodb+srv://fedeassale17:fedeassale17@cluster0.nxt6m.mongodb.net/Entrega-Final?retryWrites=true&w=majority&appName=Cluster0")
.then(()=>console.log("nos conectamos"))
.catch((err)=>console.log(err));