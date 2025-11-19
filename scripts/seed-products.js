const mongoose = require('mongoose')
const fs = require('fs')
const path = require('path')

const MONGODB_URI = 'mongodb+srv://moustaphachaddi_db_user:rkcWcGbYQlcjzJtG@chaddi-cluster.md05jwq.mongodb.net/chaddi-store?retryWrites=true&w=majority&appName=chaddi-cluster'

const ProductSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  originalPrice: Number,
  category: String,
  image: String,
  rating: Number,
  reviews: Number,
  inStock: Boolean,
  featured: Boolean,
}, {
  timestamps: true,
})

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema)

async function seedProducts() {
  try {
    console.log('🔌 Connecting to MongoDB...')
    await mongoose.connect(MONGODB_URI)
    console.log('✅ Connected to MongoDB')
    
    // قراءة ملف المنتجات
    const productsPath = path.join(__dirname, '../src/data/products.json')
    const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf-8'))
    
    console.log(`📦 Found ${productsData.length} products`)
    
    // مسح المنتجات القديمة
    await Product.deleteMany({})
    console.log('🗑️  Cleared old products')
    
    // إضافة المنتجات الجديدة
    await Product.insertMany(productsData)
    console.log(`✅ Added ${productsData.length} products to database`)
    
    console.log('🎉 Seeding completed successfully!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding products:', error)
    process.exit(1)
  }
}

seedProducts()
