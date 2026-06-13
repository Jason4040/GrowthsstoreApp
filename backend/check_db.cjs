const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://Growth:01402@mydb.qhgx1yd.mongodb.net/store?appName=mydb')
  .then(async () => {
    // We need to use mongoose directly since productModel is ES module and we are in CommonJS unless we import()
    const productSchema = mongoose.Schema({}, { strict: false });
    const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
    
    const p = await Product.findOne({'reviews.image': { $exists: true, $ne: '' }});
    console.log(p ? p.reviews.map(r => r.image) : 'no reviews with image');
    process.exit(0);
  });
