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

        let { amount, type, categoryId, notes, savingId, budgetId } = req.body;

        const newTransaction = new Transaction({
            userId: userId,
            amount,
            type,
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
                const err = new Error("Cannot add transaction to an expired or paused saving.");
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
                    if (new Date() < budget.startDate) {
                        const err = new Error("Cannot add transaction to a budget that hasn't started yet.");
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

export const deleteTransaction = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const transactionId = req.params.id;

        const user = await User.findById(userId);
        const transaction = await Transaction.findById(transactionId);

        if (!transaction) {
            const err = new Error("Transaction not found");
            err.statusCode = 404;
            return next(err);
        }

        if (transaction.type === Transaction.TYPES.SAVING) {
            var saving = await Saving.findById(transaction.saving._id);
            if (!saving) {
                const err = new Error("Associated saving not found");
                err.statusCode = 404;
                return next(err);
            }
            if (saving.status == Saving.STATUSES.PAUSED) {
                const err = new Error("Cannot delete transaction from an paused saving.");
                err.statusCode = 409;
                return next(err);
            }

            let result = user.decrementTotalSaving(transaction.amount);
            if (!result.success) {
                const err = new Error(result.message);
                err.statusCode = 409;
                return next(err);
            }

            await transaction.deleteOne();
            await saving.updateCurrentAmount();
            await user.save();

            if (saving.targetAmount > saving.currentAmount &&
                saving.endDate > new Date()) {

                saving.status = Saving.STATUSES.ACTIVE;
            }
            await saving.save();

        } else if (transaction.type === Transaction.TYPES.EXPENSE) {
            let result = user.incrementBalance(transaction.amount);
            if (!result.success) {
                const err = new Error(result.message);
                err.statusCode = 409;
                return next(err);
            }

            await transaction.deleteOne();
            await user.save();

            if (transaction.budgetId) {
                var budget = await Budget.findById(transaction.budgetId);
                if (!budget) {
                    const err = new Error("Deleted, but associated budget not found");
                    err.statusCode = 404;
                    return next(err);
                }

                await budget.updateCurrentAmount();

                if (budget.amountLimit > budget.currentAmount &&
                    budget.endDate > new Date()) {
                    budget.status = Budget.STATUSES.IN_PROGRESS;
                }
                await budget.save();
            }
        } else {
            let result = user.decrementBalance(transaction.amount);
            if (!result.success) {
                const err = new Error(result.message);
                err.statusCode = 409;
                return next(err);
            }

            await transaction.deleteOne();
            await user.save();
        }

        res.status(200).json({ success: true, message: "Transaction deleted successfully" });
    } catch (error) {
        next(error);
    }
}

export const getTransactions = async (req, res, next) => {
    try {
        const userID = req.user.id;

        const page = parseInt(req.query.page, 10) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;

        const transactions = await Transaction.find({ userId: userID })
            .skip(skip)
            .limit(limit)
            .sort({ date: -1 });

        if (!transactions) {
            const err = new Error("No transactions found");
            err.statusCode = 404;
            return next(err);
        }

        res.status(200).json({
            success: true,
            data: transactions
        });

    } catch (error) {
        next(error);
    }
}

export const updateTransaction = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);
        const transactionId = req.params.id;
        let { amount, notes } = req.body;

        const transaction = await Transaction.findById(transactionId);

        if (!transaction) {
            const err = new Error("Transaction not found");
            err.statusCode = 404;
            return next(err);
        }

        if (amount && transaction.amount !== amount && amount > 0) {
            var result;
            if (transaction.type === Transaction.TYPES.SAVING) {
                if (transaction.amount < amount)
                    result = user.incrementTotalSaving(amount - transaction.amount);
                else
                    result = user.decrementTotalSaving(transaction.amount - amount);
            } else {
                if (transaction.type === Transaction.TYPES.INCOME) {
                    if (transaction.amount < amount)
                        result = user.incrementBalance(amount - transaction.amount);
                    else
                        result = user.decrementBalance(transaction.amount - amount);
                } else {
                    if (transaction.amount < amount)
                        result = user.decrementBalance(amount - transaction.amount);
                    else
                        result = user.incrementBalance(transaction.amount - amount);
                }
            }

            if (!result.success) {
                const err = new Error(result.message);
                err.statusCode = 409;
                return next(err);
            }
            transaction.amount = amount;
        }

        if (notes) {
            transaction.notes = notes;
        }

        if (transaction.type === Transaction.TYPES.SAVING) {
            var saving = await Saving.findById(transaction.saving._id);

            if (!saving) {
                const err = new Error("Associated saving not found");
                err.statusCode = 404;
                return next(err);
            }

            await transaction.save();

            let result = await saving.updateCurrentAmount();

            if (result === Saving.STATUSES.COMPLETED) {
                user.addNotification("Congratulations! You've completed your saving goal: " +
                    saving.title + ", which is from " + saving.startDate.toDateString() +
                    " to " + saving.endDate.toDateString());
            }
            await user.save();

            if (saving.targetAmount > saving.currentAmount &&
                saving.endDate > new Date()) {
                saving.status = Saving.STATUSES.ACTIVE;
            }
            await saving.save();

        } else if (transaction.type === Transaction.TYPES.EXPENSE) {
            if (transaction.budgetId) {
                var budget = await Budget.findById(transaction.budgetId);

                if (!budget) {
                    const err = new Error("Associated budget not found");
                    err.statusCode = 404;
                    return next(err);
                }

                await transaction.save();

                let result = await budget.updateCurrentAmount();

                if (result === Budget.STATUSES.OVER) {
                    user.addNotification("Alert! Your budget reached the limit for: "
                        + budget.category.name + ", which is from " + budget.startDate.toDateString() +
                        " to " + budget.endDate.toDateString());
                }
                await user.save();

                if (budget.amountLimit > budget.currentAmount &&
                    budget.endDate > new Date()) {
                    budget.status = Budget.STATUSES.IN_PROGRESS;
                } else {

                }
                await budget.save();
            }
        }

        await transaction.save();
        await user.save();

        res.status(200).json({ success: true, data: transaction });
    } catch (error) {
        next(error);
    }
}