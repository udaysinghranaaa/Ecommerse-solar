const SubCategory = require("../models/SubCategory");

exports.createSubCategory = async (req, res) => {
  const sub = await SubCategory.create({
    name: req.body.name,
    category: req.body.category,
  });

  res.json(sub);
};

exports.getSubCategories = async (req, res) => {
  const sub = await SubCategory.find({
    category: req.params.categoryId,
  });

  res.json(sub);
};