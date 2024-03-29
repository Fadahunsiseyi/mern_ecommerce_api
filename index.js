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
const blogRouter = require('./routes/blogRoute')
const productCategoryRouter = require('./routes/productCategoryRoute')
const blogCategoryRouter = require('./routes/blogCategoryRoute')
const brandRouter = require('./routes/brandRoute')
const couponRouter = require('./routes/couponRoute')

connectDb();

app.use(morgan())
app.use(bodyParser.json());
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended:false}))
app.use("/api/user", authRouter);
app.use('/api/product',productRouter)
app.use('/api/blog',blogRouter)
app.use('/api/category',productCategoryRouter)
app.use('/api/blogcategory',blogCategoryRouter)
app.use('/api/brand', brandRouter)
app.use('/api/coupon',  couponRouter)

app.use(notFound)
app.use(errorHandler)


app.listen(PORT, () => {
  console.log(`Server is listening on port  ${PORT} `);
});