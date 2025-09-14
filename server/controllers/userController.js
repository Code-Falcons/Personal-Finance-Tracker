import User from '../models/userModel.js';

export const getCurrentUser = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select('-password -refreshTokens');
        if (!user) {
            const err = new Error("User not found");
            err.statusCode = 404;
            return next(err);
        }
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        next(error)
    }
};