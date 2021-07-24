const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

//Connect Database
connectDB();

//Using Cors
app.use(cors());

//Init Middleware( include  bodyparser through express)
app.use(express.json({ extended: false }));

app.get("/", (req, res) => res.send("Employee Management System Backend Api Running"));

//Define Routes


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
