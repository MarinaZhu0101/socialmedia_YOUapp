require("dotenv").config();
const express = require('express');
// const mysql = require("mysql2");
const path = require("path");
const cors = require('cors');
const mongoose = require('./models/db'); 

const app = express();

// const DBCONFIG = {
//     host: process.env.DB_HOST,
//     user: process.env.DB_USERNAME,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_DATABASE,
//     port: process.env.DB_PORT,
// };

// const connection = mysql.createConnection( DBCONFIG );

// function onConnectionReady(error) {
//     if (error != null) {
//         console.log(error);
//     } else {
//         console.log("connection successful");
//     }
// }
// connection.connect(onConnectionReady);

// CORS configuration
const corsOptions = {
  origin: 'https://youapp-client.vercel.app', // Replace with your frontend URL
  methods: 'GET,POST,PUT,DELETE',
  credentials: true // if you need to send cookies or use authentication
};

app.use(cors(corsOptions));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); //通过express设置静态文件服务访问

const port = 5050;

//Routers

app.get('/', (req, res) =>{
    return res.send('Hello, You\'ve reached your APP!');
});

const postRouter = require('./routes/Posts');
app.use("/posts", postRouter);

const authRouter = require('./routes/Users');
app.use("/auth", authRouter);

const commentRouter = require('./routes/Comments');
app.use("/comments", commentRouter);

const LikesRouter = require('./routes/Likes');
app.use("/likes", LikesRouter);

app.listen(port, () => console.log(`APP listening on port ${port}!`));
