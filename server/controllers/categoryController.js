import categoryModel from "../models/categoryModel.js";

export const createCategory = async (req, res, next) => {
  try {
    console.log("ssada");
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
