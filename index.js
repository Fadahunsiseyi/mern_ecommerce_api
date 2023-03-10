const express = require("express");
const app = express();
const connectDb = require("./config/connectDb");
require("dotenv").config();
const { PORT } = process.env;
const authRouter = require("./routes/authRoute");
const productRouter = require("./routes/productRoute");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { notFound, errorHandler } = require("./middleswares/errorHandler");
const morgan = require('morgan');

connectDb();

app.use(morgan())
app.use(bodyParser.json());
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended:false}))
app.use("/api/user", authRouter);
app.use('/api/product',productRouter)

app.use(notFound)
app.use(errorHandler)


app.listen(PORT, () => {
  console.log(`Server is listening on port  ${PORT} `);
});