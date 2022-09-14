import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;
  const category = req.query.category;
  console.log("params:"+req.params)
  console.log("query.keyword:"+req.query.keyword)
  console.log("query.status:"+req.query.category)
  var keyword = {category};
  if(req.query.keyword!=""){
    keyword.name={$regex:req.query.keyword,$options:'i',}
  }
  console.log("query:"+JSON.stringify(keyword))
  const count = await Product.countDocuments({ ...keyword });
  const products = await Product.find({ ...keyword })
    .limit(pageSize)
    //eg. if page is 3, then skip the first 2 pages' products
    .skip(pageSize * (page - 1));
    //console.log(JSON.stringify(produc))
  res.status(200).json({ products, page, pages: Math.ceil(count / pageSize) });
});

// @desc    Fetch on sale products by seller
// @route   GET /api/myproducts/
// @access  Public
const getMyProducts = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;
 // console.log("query:"+req.query.email)
  //console.log("query:"+JSON.stringify(keyword))
  const count = await Product.countDocuments({
    sellerEmail: req.query.email,
  });
  //console.log("sellerEmail:"+count)
  const products = await Product.find({
    sellerEmail: req.query.email,
  }).limit(pageSize)
    //eg. if page is 3, then skip the first 2 pages' products
    .skip(pageSize * (page - 1));
  res.status(200).json({ products, page, pages: Math.ceil(count / pageSize) });
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const id = req.params.id;
  if (!id.match(/^[0-9a-fA-F]{20,26}$/)) {
    throw new Error('Invalid id format!');
  }

  const product = await Product.findById(req.params.id);

  if (product) {
    res.status(200).json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const idValue = req.params.id;
  if (idValue.match(/^[0-9a-fA-F]{20-26}$/)) {
    throw new Error('Invalid id format!');
  }
  const user = req.user;
  const product = await Product.findById(req.params.id);

  if (product) {
    //check if this delete action allowed. only admin or the seller can delete the book
    if (product.sellerEmail === user.email || user.isAdmin) {
      product.status = 'deleted'
      await product.save();
      res.status(200).json({ message: 'Product removed!' });
    } else {
      res.status(404);
      throw new Error('Action not authorized!');
    }
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const {
    sellerEmail,
    name,
    price,
    description,
    image,
    category,
    status,
  } = req.body;
  if (price < 0) {
    throw new Error('price must >= 0!');
  }
  const product = new Product({
    name: name,
    price: price,
    sellerEmail: sellerEmail,
    image: image,
    category: category,
    description: description,
    status: status,
  });

  const createdProduct = await product.save();
  res.status(200).json(createdProduct);
});

// @desc    Update the status of a book
// @route   PUT update/status/:id
// @access  Private
const updateProductStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  await Product.updateOne(
    { _id: req.params.id },
    { status: status },
    (err, res) => {
      if (err) {
        res.status(400)
        throw new Error(err);
      }
      res.status(200)
    }
  );
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    description,
    image,
    category,
  } = req.body;

  const product = await Product.findById(req.params.id);
  const user = req.user;
  if (product) {
    //check if this update action allowed. only the seller can update the book
    if (product.sellerEmail == user.email) {
      product.name = name;
      product.price = price;
      product.sellerEmail = req.user.email;
      product.description = description;
      product.image = image;
      product.category = category;
      const updatedProduct = await product.save();
      res.status(200).json(updatedProduct);
    } else {
      res.status(404);
      throw new Error('Action not authorized!');
    }
  } else {
    res.status(404);
    throw new Error('Product not found!');
  }
});

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ category: 'power' })
    .sort({ price: -1 })
    .limit(3);

  res.status(200).json(products);
});

export {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  getTopProducts,
  getMyProducts,
  updateProductStatus,
};
