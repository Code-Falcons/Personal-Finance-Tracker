import Transaction from '../models/transactionModel.js';
import Category from '../models/categoryModel.js';
import Saving from '../models/savingModel.js';
import User from '../models/userModel.js';
import Budget from '../models/budgetModel.js';

export const getSummary = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { startDate, endDate } = req.query;

        const summary = await Transaction.getSummary(userId, startDate, endDate);
        res.status(200).json({ success: true, data: summary });
    } catch (error) {
        next(error);
    }
}

export const getCategorySpending = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { startDate, endDate } = req.query;

        const result = await Transaction.getCategoryWiseSpending(userId, startDate, endDate);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
}


// saving transaction must not have category and budget,
// and income transactions must not have saving and budget
// and expense transactions must not have saving and may have budget
export const addTransaction = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);

        const { amount, type, categoryId, date, notes, savingId, budgetId } = req.body;

        const newTransaction = new Transaction({
            userId: userId,
            amount,
            type,
            date,
            notes,
        });

        if (savingId) {
            var saving = await Saving.findById(savingId);
            if (!saving) {
                const err = new Error("SavingId is invalid");
                err.statusCode = 400;
                return next(err);
            } 
            if (await saving.checkExpiredAndUpdate()) {
                const err = new Error("Cannot add transaction to an expired saving.");
                err.statusCode = 409;
                return next(err);
            }

            newTransaction.saving = { _id: savingId, title: saving.title };
            let result = user.incrementTotalSaving(amount);

            if (!result.success) {
                const err = new Error(result.message);
                err.statusCode = 409;
                return next(err);
            }
        } else if (categoryId) {
            var category = await Category.findById(categoryId).select('name');
            if (!category) {
                const err = new Error("CategoryId is invalid");
                err.statusCode = 400;
                return next(err);
            }

            newTransaction.category = { _id: categoryId, name: category.name };

            let result;
            if (type === Transaction.TYPES.INCOME)
                result = user.incrementBalance(amount);
            else {
                if (budgetId) {
                    var budget = await Budget.findById(budgetId);
                    if (!budget) {
                        const err = new Error("BudgetId is invalid");
                        err.statusCode = 400;
                        return next(err);
                    }
                    if (await budget.checkExpiredAndUpdate()) {
                        const err = new Error("Cannot add transaction to an expired budget.");
                        err.statusCode = 409;
                        return next(err);
                    }

                    newTransaction.budgetId = budgetId;
                }
                result = user.decrementBalance(amount);
            }

            if (!result.success) {
                const err = new Error(result.message);
                err.statusCode = 409;
                return next(err);
            }
        } else {
            const err = new Error("Either categoryId or savingId must be provided");
            err.statusCode = 400;
            return next(err);
        }

        await newTransaction.save();

        if (savingId) {
            const result = await saving.updateCurrentAmount();
            await saving.save();

            if (result === Saving.STATUSES.COMPLETED) {
                user.addNotification("Congratulations! You've completed your saving goal: " + saving.title);
            }
        }

        if (budgetId) {
            const result = await budget.updateCurrentAmount();
            await budget.save();

            if (result === Budget.STATUSES.OVER) {
                user.addNotification("Alert! Your budget is over the limit for: " + budget.category.name);
            }
        }

        await user.save();

        res.status(201).json({ success: true, data: newTransaction });
    } catch (error) {
        next(error);
    }
};