import express from 'express';
import mongoose from 'mongoose';

const app = express();
app.use(express.json({ limit: "10mb" }));
const PORT = 8000;

mongoose.set("strictQuery", false);

// Kết nối đến MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/testweb65", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Định nghĩa schema và model
const productSchema = new mongoose.Schema({
  order: String,
  inventory: String,
  user: String
});

const Product = mongoose.model('Product', productSchema);

app.get('/product', async (req, res) => {
  try {
    const allProducts = await Product.find();
    res.json(allProducts);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

app.listen(PORT, () => {
  console.log(`App is running at http://localhost:${PORT}`);
});
