const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

mongoose.connect('mongodb+srv://Growth:01402@mydb.qhgx1yd.mongodb.net/store?appName=mydb')
  .then(async () => {
    const userSchema = mongoose.Schema({}, { strict: false });
    const User = mongoose.models.User || mongoose.model('User', userSchema);
    
    const productSchema = mongoose.Schema({}, { strict: false });
    const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
    
    const adminUser = await User.findOne({ isAdmin: true });
    if (!adminUser) { console.log('no admin'); process.exit(1); }
    
    const product = await Product.findOne({});
    if (!product) { console.log('no product'); process.exit(1); }
    
    console.log('Testing with product:', product._id);
    
    // Create a new unique user to avoid "already reviewed"
    const testUser = new User({
        username: 'testuser_' + Date.now(),
        email: 'test_' + Date.now() + '@test.com',
        password: 'password',
        isAdmin: false
    });
    await testUser.save();
    
    const token = jwt.sign({ userId: testUser._id }, 'abac12afsdkjladf', { expiresIn: '30d' });
    
    // Make request via fetch
    const res = await fetch(`http://localhost:5000/api/products/${product._id}/reviews`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Cookie': `jwt=${token}`
        },
        body: JSON.stringify({
            rating: 5,
            comment: 'Great product with an image!',
            image: 'https://res.cloudinary.com/dk5szuxuv/image/upload/v1781363326/MERN-E-Commerce-Store/j4esn7vgjq9jbaoi4s3v.png'
        })
    });
    
    const text = await res.text();
    console.log('Status:', res.status);
    console.log('Response:', text);
    
    // Cleanup
    await User.findByIdAndDelete(testUser._id);
    
    process.exit(0);
  });
