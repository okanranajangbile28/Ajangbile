import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/productsModel';

dotenv.config({ path: './config.env' });

// CONNECT DB
const DB = process.env.DATABASE?.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD as string,
);

mongoose.connect(DB as string).then(() => {
  console.log('DB connected for seeding');
});

// SAMPLE PRODUCTS
const products = [
  {
    productName: 'African Herbal Soap',
    description: 'Traditional cleansing soap',
    price: 5000,
    priceID: 'price_001',
    totalQuantity: 20,
    unit: 'piece',
    discount: 10,
    category: 'Herbal',
    images: ['https://via.placeholder.com/300'],
    featured: true,
  },
  {
    productName: 'Spiritual Candle',
    description: 'Used for prayer and meditation',
    price: 3000,
    priceID: 'price_002',
    totalQuantity: 15,
    unit: 'piece',
    discount: 0,
    category: 'Spiritual',
    images: ['https://via.placeholder.com/300'],
    featured: false,
  },
];

// IMPORT DATA INTO DB
const importData = async () => {
  try {
    await Product.create(products);
    console.log('Data successfully loaded 🚀');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

// DELETE ALL DATA
const deleteData = async () => {
  try {
    await Product.deleteMany();
    console.log('Data successfully deleted 🗑️');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

// RUN BASED ON COMMAND
if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
