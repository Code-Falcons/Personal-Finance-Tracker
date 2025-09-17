import categoryModel from "../models/categoryModel.js";

export const createCategory = async (req, res, next) => {
  try {
    const { userId, name } = req.body;

    const existing = await categoryModel.findByUserAndName(userId, name);

    if (existing.length > 0) {
      const error = new Error("Category already exists for this user");
      err.statusCode = 400;
      return next(error);
    }

    const category = await categoryModel.create({ userId, name });
    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
};

export const getCategories = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const categories = await Category.find({ userId }).sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    next(error);
  }
};

export const getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      const error = new Error("Category not found");
      err.statusCode = 404;
      return next(error);
    }
    res.json(category);
  } catch (error) {
    next(error);
  }
};
