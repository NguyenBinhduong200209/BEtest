import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const JWT_SECRET = "MY_SECRET_KEY";

const app = express();
app.use(express.json({ limit: "10mb" }));
const PORT = 8000;

mongoose.set("strictQuery", false);
mongoose
  .connect("mongodb+srv://be65:be65@cluster0.l2oavhg.mongodb.net/database")
  .then(() => console.log("Connected to database"))
  .catch((err) => console.log(err));

//Get user

const User = mongoose.model("user", {}, "user");
app.get("/user", async (req, res) => {
  try {
    const data = await User.find();
    console.log(data);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

//get Inventory có điểm lớn hơn 100

const Invent = mongoose.model("inventory", {}, "inventory");
app.get("/inventory", async (req, res) => {
  try {
    const data = await Invent.find({ score: { $lt: 100 } });
    console.log(data);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});
//get order
const Order = mongoose.model("order", {}, "order");

app.get("/order", async (req, res) => {
  try {
    const data = await Order.find();
    console.log(data);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});
///get all
app.get("/", async (req, res) => {
  try {
    const orders = await Order.find();
    const inventory = await Invent.find();
    const user = await User.find();

    res.json({
      user,
      inventory,
      orders,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});
//

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const orders = await Order.find();
    const inventory = await Invent.find();
    
  console.log(username);
  try {
    const token = jwt.sign(
      {
        username,
        password,
      },
      JWT_SECRET,
      {
        expiresIn: "3h",
      }
    );
    const result = await User.findOne({ username, password });

    if (result) {
      const dataSend = {
        token: token,
        username: username,
        password:password,
      };

      res.send({
        message: "Đăng nhập thành công",
        data: dataSend, 
        inventory,
        orders,
      });
      console.log(dataSend);
    } else {
      res.send({ message: "Sai email hoặc tài khoản !,", alert: false });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Lỗi server" });
  }
});

app.listen(PORT, () => {
  console.log(`App is running at http://localhost:${PORT}`);
});
