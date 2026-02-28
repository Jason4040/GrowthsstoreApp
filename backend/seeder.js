import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "./models/userModel.js";
import Category from "./models/categoryModel.js";
import Product from "./models/productModel.js";
import Order from "./models/orderModel.js";
import connectDB from "./config/db.js";

dotenv.config();

const seedDatabase = async () => {
    try {
        await connectDB();

        // Clear existing data
        await Order.deleteMany();
        await Product.deleteMany();
        await Category.deleteMany();
        await User.deleteMany();

        // 1. Create Users
        const hashedPassword = await bcrypt.hash("password123", 10);

        const adminUser = {
            username: "Admin User",
            email: "admin@example.com",
            password: hashedPassword,
            isAdmin: true,
        };

        const regularUsers = Array.from({ length: 10 }).map((_, i) => ({
            username: `User ${i + 1}`,
            email: `user${i + 1}@example.com`,
            password: hashedPassword,
            isAdmin: false,
        }));

        const createdUsers = await User.insertMany([adminUser, ...regularUsers]);
        console.log("✅ Users seeded");

        // 2. Create Categories
        const categoriesData = [
            { name: "Shoes" },
            { name: "Pants" },
            { name: "Devices" }
        ];

        const createdCategories = await Category.insertMany(categoriesData);
        console.log("✅ Categories seeded");

        const getCatId = (name) => createdCategories.find(c => c.name === name)._id;

        // 3. Create Products
        const productsData = [
            // Shoes
            {
                name: "Gray Sport Shoe",
                image: "https://cdn.salla.sa/gXmRK/H0t0sJZopuiOsQtqp4euPrdkBZvTg4r21135F720.jpg",
                brand: "Nike",
                quantity: 100,
                category: getCatId("Shoes"),
                description: "Premium gray sports shoe designed for athletic endurance.",
                rating: 5,
                numReviews: 12,
                price: 120,
                countInStock: 25,
            },
            {
                name: "White Airforce",
                image: "https://en.afew-store.com/cdn/shop/collections/nike-air-force-1_b2cf1627-3a21-4bed-9543-0c879b80afa0.jpg?v=1675693070&width=2400",
                brand: "Nike",
                quantity: 100,
                category: getCatId("Shoes"),
                description: "Classic pristine White Airforce 1 sneakers.",
                rating: 4.5,
                numReviews: 45,
                price: 150,
                countInStock: 15,
            },
            {
                name: "Black Canvas Sneakers",
                image: "https://rukminim2.flixcart.com/image/480/640/xif0q/shoe/p/r/p/-original-imah6f53fymygmxw.jpeg?q=90",
                brand: "Puma",
                quantity: 100,
                category: getCatId("Shoes"),
                description: "Durable and stylish black canvas sneakers for daily wear.",
                rating: 4,
                numReviews: 8,
                price: 85,
                countInStock: 30,
            },

            // Pants
            {
                name: "Classic Khaki Trousers",
                image: "https://upload.wikimedia.org/wikipedia/commons/d/da/Trousers-colourisolated.jpg",
                brand: "Levis",
                quantity: 100,
                category: getCatId("Pants"),
                description: "Essential classic khaki trousers for formal and casual occasions.",
                rating: 4,
                numReviews: 20,
                price: 60,
                countInStock: 50,
            },
            {
                name: "Calvin Klein Designer Jeans",
                image: "https://www.calvinklein.com.hk/dw/image/v2/BGLQ_PRD/on/demandware.static/-/Sites-ck-master-catalog/default/dw897e0cda/J224581/C25_01_J224581PCF_MO-ST-F1.jpg?sw=1024&sh=1348&q=90",
                brand: "Calvin Klein",
                quantity: 100,
                category: getCatId("Pants"),
                description: "Premium washed blue denim designer jeans by Calvin Klein.",
                rating: 5,
                numReviews: 15,
                price: 130,
                countInStock: 10,
            },
            {
                name: "Brooklyn Cargo Pants",
                image: "https://brooklynindustries.com/cdn/shop/products/0010049_84364_front.jpg?v=1676670309&width=2000",
                brand: "Brooklyn Ind.",
                quantity: 100,
                category: getCatId("Pants"),
                description: "Functional and stylish cargo pants with utility pockets.",
                rating: 4.2,
                numReviews: 11,
                price: 90,
                countInStock: 18,
            },

            // Devices
            {
                name: "Samsung Galaxy Ultra",
                image: "https://hips.hearstapps.com/hmg-prod/images/samsung-galaxy-promo-007-68f2b27d156b5.jpg?crop=0.512xw:0.683xh;0.342xw,0.141xh&resize=640:*",
                brand: "Samsung",
                quantity: 100,
                category: getCatId("Devices"),
                description: "Latest generation flagship Samsung Galaxy smartphone.",
                rating: 5,
                numReviews: 55,
                price: 1199,
                countInStock: 5,
            },
            {
                name: "Samsung Galaxy S25",
                image: "https://www.att.com/scmsassets/global/devices/phones/samsung/samsung-galaxy-s25/defaultimage/navy-hero-zoom.png",
                brand: "Samsung",
                quantity: 100,
                category: getCatId("Devices"),
                description: "Navy blue edition Samsung Galaxy S25 phone.",
                rating: 4.8,
                numReviews: 24,
                price: 999,
                countInStock: 8,
            },
            {
                name: "Apple iPhone 17 Pro",
                image: "https://t-mobile.scene7.com/is/image/Tmusprod/Apple-iPhone-17-Pro-4x3-1:4x3?ts=1757617103913&dpr=on",
                brand: "Apple",
                quantity: 100,
                category: getCatId("Devices"),
                description: "The ultimate iPhone 17 Pro running the latest iOS.",
                rating: 5,
                numReviews: 110,
                price: 1299,
                countInStock: 12,
            },
            {
                name: "Apple iPhone 16 Plus (Pink)",
                image: "https://powermaccenter.com/cdn/shop/files/iPhone_16_Pink_PDP_Image_Position_1__en-WW.jpg?v=1726235981&width=1445",
                brand: "Apple",
                quantity: 100,
                category: getCatId("Devices"),
                description: "Beautiful Pink iPhone 16 Plus with extended battery.",
                rating: 4.7,
                numReviews: 32,
                price: 899,
                countInStock: 22,
            },
            {
                name: "High-End Gaming PC Setup",
                image: "https://i.pcmag.com/imagery/roundups/06PC8eeQkHaoNm2FyCAxigV-48.fit_lim.size_1050x.jpg",
                brand: "Custom Intel",
                quantity: 100,
                category: getCatId("Devices"),
                description: "Ultra-high performance RGB gaming PC setup.",
                rating: 5,
                numReviews: 19,
                price: 2499,
                countInStock: 3,
            },
            {
                name: "Microsoft Surface Studio",
                image: "https://cdn-dynmedia-1.microsoft.com/is/image/microsoftcorp/MSFT-All-in-One_1040x585?scl=1",
                brand: "Microsoft",
                quantity: 100,
                category: getCatId("Devices"),
                description: "A brilliant, color-accurate all-in-one touchscreen PC from Microsoft.",
                rating: 4.5,
                numReviews: 14,
                price: 3499,
                countInStock: 2,
            },
            {
                name: "Microsoft Surface Laptop",
                image: "https://cdn-dynmedia-1.microsoft.com/is/image/microsoftcorp/Feature-Surface-Laptop-13-8-7ED-Ocean-Pro-12-Violet:VP1-539x349",
                brand: "Microsoft",
                quantity: 100,
                category: getCatId("Devices"),
                description: "Sleek and portable Violet colored Surface Laptop.",
                rating: 4.8,
                numReviews: 41,
                price: 1399,
                countInStock: 15,
            }
        ];

        await Product.insertMany(productsData);
        console.log("✅ Products seeded");

        console.log("🚀 Database seeded successfully!");
        process.exit();
    } catch (error) {
        console.error(`❌ Error seeding database: ${error.message}`);
        process.exit(1);
    }
};

seedDatabase();
