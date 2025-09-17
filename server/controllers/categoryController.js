import categoryModel from "../models/categoryModel.js";

export const createCategory = async (req, res, next) => {
  try {
    const { userId, name } = req.body;

    const existing = await categoryModel.findByUserAndName(userId, name);

    if (existing.length > 0) {
      const error = new Error("Category already exists for this user");
      error.statusCode = 400;
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
    const categories = await categoryModel.find({ userId }).sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    next(error);
  }
};

export const getCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const category = await categoryModel.findById(id);
    if (!category) {
      const error = new Error("Category not found");
      error.statusCode = 404;
      return next(error);
    }

    res.json(category);
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const category = await categoryModel.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!category) {
      const error = new Error("Category not found");
      error.statusCode = 404;
      return next(error);
    }

    res.json(category);
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const category = await categoryModel.findById(id);
    if (!category) {
      const error = new Error("Category not found");
      error.statusCode = 404;
      return next(error);
    }

    const inUse = await category.isInUse();
    if (inUse) {
      const error = new Error("Category is in use and cannot be deleted");
      error.statusCode = 400;
      return next(error);
    }

    await category.deleteOne();
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    next(error);
  }
};
