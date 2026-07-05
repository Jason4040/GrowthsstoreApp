import asyncHandler from "../middlewares/asyncHandler.js";
import Product from "../models/productModel.js";

const addProduct = asyncHandler(async (req, res) => {
  try {
    const { name, description, price, priceUGX, priceRWF, category, quantity, brand, discountQtyThreshold, discountType, discountUSD, discountUGX, discountRWF, stockStatus, availabilityStartDate, availabilityEndDate, negotiable, availableIn, isPinned, condition, images: imagesStr, video } = req.fields;
    
    let images = [];
    if (imagesStr) {
      try {
        images = JSON.parse(imagesStr);
      } catch (e) {
        images = [imagesStr];
      }
    }

    // Validation
    switch (true) {
      case !name:
        return res.json({ error: "Name is required" });
      case !description:
        return res.json({ error: "Description is required" });
      case !price:
        return res.json({ error: "Price is required" });
      case !category:
        return res.json({ error: "Category is required" });
    }

    const product = new Product({ 
      ...req.fields, 
      priceUGX: priceUGX || 0, 
      priceRWF: priceRWF || 0,
      discountQtyThreshold: discountQtyThreshold || 0,
      discountType: discountType || 'per_item',
      discountUSD: discountUSD || 0,
      discountUGX: discountUGX || 0,
      discountRWF: discountRWF || 0,
      stockStatus: stockStatus || 'in_stock',
      availabilityStartDate: availabilityStartDate || null,
      availabilityEndDate: availabilityEndDate || null,
      negotiable: negotiable === 'true' || negotiable === true,
      availableIn: availableIn || 'Both',
      isPinned: isPinned === 'true' || isPinned === true,
      condition: condition || 'Brand New',
      images,
      video: video || null,
    });
    await product.save();
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});

const updateProductDetails = asyncHandler(async (req, res) => {
  try {
    const { name, description, price, priceUGX, priceRWF, category, quantity, brand, discountQtyThreshold, discountType, discountUSD, discountUGX, discountRWF, stockStatus, availabilityStartDate, availabilityEndDate, negotiable, availableIn, isPinned, condition, images: imagesStr, video } = req.fields;

    let images = undefined;
    if (imagesStr !== undefined) {
      if (imagesStr) {
        try {
          images = JSON.parse(imagesStr);
        } catch (e) {
          images = [imagesStr];
        }
      } else {
        images = [];
      }
    }

    // Validation
    switch (true) {
      case !name:
        return res.json({ error: "Name is required" });
      case !description:
        return res.json({ error: "Description is required" });
      case !price:
        return res.json({ error: "Price is required" });
      case !category:
        return res.json({ error: "Category is required" });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { 
        ...req.fields, 
        priceUGX: priceUGX || 0, 
        priceRWF: priceRWF || 0,
        discountQtyThreshold: discountQtyThreshold || 0,
        discountType: discountType || 'per_item',
        discountUSD: discountUSD || 0,
        discountUGX: discountUGX || 0,
        discountRWF: discountRWF || 0,
        stockStatus: stockStatus || 'in_stock',
        availabilityStartDate: availabilityStartDate || null,
        availabilityEndDate: availabilityEndDate || null,
        negotiable: negotiable === 'true' || negotiable === true,
        ...(availableIn !== undefined && { availableIn }),
        ...(isPinned !== undefined && { isPinned: isPinned === 'true' || isPinned === true }),
        ...(condition !== undefined && { condition }),
        ...(images !== undefined && { images }),
        ...(video !== undefined && { video: video || null }),
      },
      { new: true }
    );

    await product.save();

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});

const removeProduct = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

const fetchProducts = asyncHandler(async (req, res) => {
  try {
    const pageSize = 6;

    const keyword = req.query.keyword
      ? {
        name: {
          $regex: req.query.keyword,
          $options: "i",
        },
      }
      : {};

    const count = await Product.countDocuments({ ...keyword });
    const products = await Product.find({ ...keyword })
      .populate("category")
      .sort({ _id: -1 })
      .limit(pageSize);

    res.json({
      products,
      page: 1,
      pages: Math.ceil(count / pageSize),
      hasMore: false,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

const fetchProductById = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category");
    if (product) {
      return res.json(product);
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: "Product not found" });
  }
});

const fetchAllProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({})
      .populate("category")
      .limit(12)
      .sort({ _id: -1 });

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

const addProductReview = asyncHandler(async (req, res) => {
  try {
    const { rating, comment, image } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        alreadyReviewed.rating = Number(rating);
        alreadyReviewed.comment = comment;
        if (image) {
          alreadyReviewed.image = image;
        }
        alreadyReviewed.name = req.user.username;
      } else {
        const review = {
          name: req.user.username,
          rating: Number(rating),
          comment,
          image,
          user: req.user._id,
        };
        product.reviews.push(review);
      }

      product.numReviews = product.reviews.length;

      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

      await product.save();
      res.status(201).json({ message: "Review added" });
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});

const fetchTopProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({}).populate("category").sort({ rating: -1 }).limit(4);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});

const fetchNewProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find().populate("category").sort({ isPinned: -1, _id: -1 }).limit(5);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});

const filterProducts = asyncHandler(async (req, res) => {
  try {
    const { checked, radio } = req.body;

    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };

    const products = await Product.find(args).populate("category");
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

const deleteReview = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      const reviewIndex = product.reviews.findIndex(
        (r) => r._id.toString() === req.params.reviewId.toString()
      );

      if (reviewIndex === -1) {
        res.status(404);
        throw new Error("Review not found");
      }

      product.reviews.splice(reviewIndex, 1);
      product.numReviews = product.reviews.length;
      
      if (product.reviews.length > 0) {
        product.rating =
          product.reviews.reduce((acc, item) => item.rating + acc, 0) /
          product.reviews.length;
      } else {
        product.rating = 0;
      }

      await product.save();
      res.status(200).json({ message: "Review deleted" });
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});

const toggleHideReview = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      const review = product.reviews.find(
        (r) => r._id.toString() === req.params.reviewId.toString()
      );

      if (!review) {
        res.status(404);
        throw new Error("Review not found");
      }

      review.isHidden = !review.isHidden;
      await product.save();
      res.status(200).json({ message: "Review visibility toggled" });
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});

const toggleProductPin = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      product.isPinned = !product.isPinned;
      await product.save();
      res.status(200).json({ message: "Product pin status updated", isPinned: product.isPinned });
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});

export {
  addProduct,
  updateProductDetails,
  removeProduct,
  fetchProducts,
  fetchProductById,
  fetchAllProducts,
  addProductReview,
  fetchTopProducts,
  fetchNewProducts,
  filterProducts,
  deleteReview,
  toggleHideReview,
  toggleProductPin,
};
