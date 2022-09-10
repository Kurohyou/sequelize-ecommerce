const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  // find all categories
  try{
    const categories = await Category.findAll(
      {
        // include all products
        include:[
          {model:Product}
        ]
      });
      res.json(categories);
  }catch(err){
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  try{
    const cat = await Category.findByPk(
      req.params.id,
      {
        include:[{model:Product}]
      }
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
    res.json(cat);
  }catch(err){
    res.status(500).json(err);
  }
});

router.put('/:id', async (req, res) => {
  // update a category by its `id` value
  try{
    const cat = await (await Category.findByPk(req.params.id))
      .update({category_name:req.body.category_name});
    res.json(cat);
  }catch(err){
    res.status(500).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  try{
    const cat = await Category.findByPk(req.params.id);
    await cat.destroy();
    res.json(cat);
  }catch(err){
    res.status(500).json(err);
  }
});

module.exports = router;
