const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");

const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const blogRoute = require("./routes/posts");
const catRoute = require("./routes/categories");
dotenv.config();
const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGO_URI, {
    useCreateIndex: true,
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
  })
  .then(console.log("Connected to db"))
  .catch((err) => console.log(err));

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/blog", blogRoute);
app.use("/api/cat", catRoute);

app.listen(PORT, () => console.log(`Api is running at port ${PORT}`));
