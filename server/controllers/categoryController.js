export const getCat = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, data: "Hello" });
  } catch (error) {
    next(error);
  }
};
