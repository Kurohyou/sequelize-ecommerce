const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

const defaultOptions = {
  // include all products
  include:[
    { model: Product, through: ProductTag }
  ]
};
router.get('/', async (req, res) => {
  // find all tags
  try {
    const tag = await Tag.findAll(defaultOptions);
    res.json(tag);
  } catch (err) {
    res.status(500).json(err);
  }
  // be sure to include its associated Product data
});

router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  try {
    const tag = await Tag.findOne(
      {
        where:{
          id:req.params.id
        }
      },
      defaultOptions
    )
    res.json(tag);
  } catch (err) {
    res.status(500).json(err);
  }
  // be sure to include its associated Product data
});

router.post('/', async (req, res) => {
  // create a new tag
  try{
    const tag = await Tag.create({tag_name:req.body.tag_name});
    const fullTag = await Tag.findByPk(tag.id,defaultOptions);
    res.json(fullTag);
  }catch(err){
    res.status(500).json(err);
  }
});

router.put('/:id', async (req, res) => {
  // update a tag's name by its `id` value
  try{
    const tag = await Tag.findByPk(req.params.id)
    await tag.update({tag_name:req.body.tag_name});
    const fullTag = await Tag.findByPk(tag.id,defaultOptions);
    res.json(fullTag);
  }catch(err){
    res.status(500).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  // delete on tag by its `id` value
  try{
    const tag = await Tag.findByPk(req.params.id);
    await tag.destroy();
    res.json(tag);
  }catch(err){
    res.status(500).json(err);
  }
});

module.exports = router;
