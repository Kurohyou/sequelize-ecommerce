const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint
const defaultOptions = {
  // include all products
  include:[
    Product
  ]
};

router.get('/', async (req, res) => {
  // find all categories
  try{
    const categories = await Category.findAll(defaultOptions);
      res.json(categories);
  }catch(err){
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  try{
    const cat = await Category.findByPk(
      req.params.id,
      defaultOptions
    )
    res.json(cat);
  }catch(err){
    res.status(500).json(err);
  }
  // find one category by its `id` value
  // be sure to include its associated Products
});

router.post('/', async (req, res) => {
  // create a new category
  try{
    const cat = await Category.create({category_name:req.body.category_name});

    const fullCat = await Category.findByPk(cat.id,defaultOptions)
    res.json(fullCat);
  }catch(err){
    res.status(500).json(err);
  }
});

router.put('/:id', async (req, res) => {
  // update a category by its `id` value
  try{
    const cat = await Category.findByPk(req.params.id)
    await cat.update({category_name:req.body.category_name});

    const fullCat = await Category.findByPk(cat.id,defaultOptions)
    res.json(fullCat);
  }catch(err){
    res.status(500).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  try{
    const cat = await Category.findByPk(req.params.id,defaultOptions);
    await cat.destroy();
    res.json(cat);
  }catch(err){
    res.status(500).json(err);
  }
});

module.exports = router;
