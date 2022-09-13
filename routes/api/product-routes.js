const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
const defaultOptions = {
  // include all products
  include:[
    Category,
    { model: Tag, through: ProductTag }
  ]
};
router.get('/', async (req, res) => {
  // find all products
  try {
    const products = await Product.findAll(defaultOptions);
    res.json(products);
  } catch (err) {
    res.status(500).json(err);
  }
  // be sure to include its associated Category and Tag data
});

// get one product
router.get('/:id', async (req, res) => {
  // find a single product by its `id`
  try {
    const product = await Product.findByPk(
      req.params.id,
      defaultOptions
    )
    res.json(product);
  } catch (err) {
    res.status(500).json(err);
  }
  // be sure to include its associated Category and Tag data
});

// create new product
router.post('/', async (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
  try{
    const product = await Product.create(req.body);
    if (req.body.tagIds.length) {
      const productTagIdArr = req.body.tagIds.map((tag_id) => {
        return {
          product_id: product.id,
          tag_id,
        };
      });
      await ProductTag.bulkCreate(productTagIdArr);
    }
    const fullProduct = await Product.findByPk(
      product.id,
      defaultOptions
    );
    res.status(200).json(fullProduct);
  }catch(err){
    console.log(err);
    res.status(400).json(err);
  }
});

// update product
router.put('/:id', async (req, res) => {
  try{
    // update product data
    await Product.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    const productTags = await ProductTag.findAll({ where: { product_id: req.params.id } });
    const productTagIds = productTags.map(({ tag_id }) => tag_id);
    // create filtered list of new tag_ids
    const newProductTags = req.body.tagIds
      .filter((tag_id) => !productTagIds.includes(tag_id))
      .map((tag_id) => {
        return {
          product_id: req.params.id,
          tag_id,
        };
      });
    // figure out which ones to remove
    const productTagsToRemove = productTags
      .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
      .map(({ id }) => id);
      
      await Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);

      // Send the fully updated product back
      const fullProduct = await Product.findByPk(
        req.params.id,
        defaultOptions
      )
      res.status(200).json(fullProduct);
  }catch(err){
    console.log(err);
    res.status(400).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  // delete one product by its `id` value
  try{
    const product = await Product.findByPk(req.params.id,defaultOptions);
    console.log(product);
    await product.destroy();
    res.json(product);
  }catch(err){
    res.status(500).json(err);
  }
});

module.exports = router;
