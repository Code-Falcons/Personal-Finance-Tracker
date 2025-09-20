import Budget from '../models/budgetModel.js';
import Category from '../models/categoryModel.js';
import Transaction from '../models/transactionModel.js';
import User from '../models/userModel.js';
import Saving from '../models/savingModel.js';
import mongoose from 'mongoose';


export const getSavings = async (req, res, next) => {
    try {
        const userID = req.user.id;

        const page = parseInt(req.query.page, 10) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;

        const savings = await Saving.find({ userId: userID })
            .skip(skip)
            .limit(limit)
            .sort({ endDate: 1 });

        if (!savings) {
            const err = new Error("No savings found");
            err.statusCode = 404;
            return next(err);
        }

        for (let saving of savings) {
            await saving.checkExpiredAndUpdate();
        }

        res.status(200).json({
            success: true,
            data: savings
        });

    } catch (error) {
        next(error);
    }
};

export const addSaving = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { title, targetAmount, endDate, notes} = req.body;

        const newSaving = new Saving({
            userId,
            title,
            targetAmount,
            endDate,
            notes
        });        

        await newSaving.save();

        res.status(201).json({ success: true, data: newSaving });
    } catch (error) {
        next(error);
    }
}

export const deleteSaving = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);
        const { id } = req.params;

        const saving = await Saving.findById(id);
        if (!saving) {
            const err = new Error("No saving found");
            err.statusCode = 404;
            return next(err);
        }

        const totalAmount = await saving.sumRelatedTransaction();

        if (totalAmount > 0) {
            const result = await user.decrementTotalSaving(totalAmount);
            if (!result.success) {
                const err = new Error(result.message);
                err.statusCode = 409;
                return next(err);
            }
            await user.save();
        }
        
        await Transaction.deleteMany(
            { userId, 'saving._id': id}
        );

        await saving.deleteOne();
        
        res.status(200).json({ success: true, message: "Deleted Successfully" });
    } catch (error) {
        next(error);
    }
}


export const updateSaving = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { id: savingId } = req.params;
        let { targetAmount, endDate, notes} = req.body;
        endDate = endDate? new Date(endDate) : false;

        if (!savingId) {
            const err = new Error("Saving Id that was sent is invalid or missed");
            err.statusCode = 404;
            return next(err);
        }

        const saving = await Saving.findById(savingId);
        if (!saving) {
            const err = new Error("Saving not found");
            err.statusCode = 404;
            return next(err);
        }

        if (targetAmount) {
            if (targetAmount > 0) {
                saving.targetAmount = targetAmount;
                if (saving.currentAmount >= saving.targetAmount) {
                    saving.status = Saving.STATUSES.COMPLETED;
                } else {
                    saving.status = Saving.STATUSES.ACTIVE;
                }
            } else {
                const err = new Error("You Cannot update saving's target amount by zero or negative number");
                err.statusCode = 400;
                return next(err);
            }
        }

        if (endDate) {
            if (endDate > saving.endDate) {
                saving.endDate = endDate;
            } else {
                const err = new Error("The updated end date must be greater than the current saving end date");
                err.statusCode = 400;
                return next(err);
            }
        }

        if (notes) {
            saving.notes = notes;
        }

        await saving.save();
        res.status(200).json({
            success: true,
            data: saving
        });
    } catch (error) {
        next(error);
    }
}

export const getActiveSavingsByUser = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const savings = await Saving.findActiveByUser(userId);
        if (!savings) {
            const err = new Error("A problem happend in searching about savings");
            err.statusCode = 400;
            return next(err);
        }

        res.status(200).json({ success: true, data: savings });
    } catch (error) {
        next(error);
    }
}

export const pauseSaving = async (req, res, next) => {
    try {   
        const { id:savingId } = req.params;
        const saving = await Saving.findById(savingId);
        
        if (!saving) {
            const err = new Error("No saving found");
            err.statusCode = 404;
            return next(err);
        }

        saving.pause();
        await saving.save();
        
        res.status(200).json({ success: true, data: "Saving is paused successfully" });
    } catch (error) {
        next(error);
    }
}

export const resumeSaving = async (req, res, next) => {
    try {
        const { id: savingId } = req.params;
        let { endDate } = req.body;

        if (!endDate) {
            const err = new Error("You have to send End Date");
            err.statusCode = 400;
            return next(err);
        }

        endDate = new Date(endDate);
        
        const saving = await Saving.findById(savingId);
        
        if (!saving) {
            const err = new Error("No saving found");
            err.statusCode = 404;
            return next(err);
        }

        if (saving.endDate > endDate) {
            const err = new Error("Old End Date must not be greater than new one");
            err.statusCode = 400;
            return next(err);
        }

        saving.resume();
        saving.endDate = endDate;
        await saving.save();

        res.status(200).json({ success: true, data: "Saving is resumed successfully" });
    } catch (error) {
        next(error);
    }
}