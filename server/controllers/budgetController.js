import Budget from '../models/budgetModel.js';
import Category from '../models/categoryModel.js';
import Transaction from '../models/transactionModel.js';
import User from '../models/userModel.js';

export const getBudgets = async (req, res, next) => {
    try {
        const userID = req.user.id;

        const page = parseInt(req.query.page, 10) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;

        const budgets = await Budget.find({ userId: userID })
            .skip(skip)
            .limit(limit)
            .sort({ endDate: 1 });

        if (!budgets) {
            const err = new Error("No budgets found");
            err.statusCode = 404;
            return next(err);
        }

        for (let budget of budgets) {
            await budget.checkExpiredAndUpdate();
        }

        res.status(200).json({
            success: true,
            data: budgets
        });

    } catch (error) {
        next(error);
    }
};

export const addBudget = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { categoryId, amountLimit, startDate, endDate } = req.body;

        const newBudget = new Budget({
            userId,
            amountLimit,
            startDate,
            endDate,
        });

        var categoryObj = await Category.findById(categoryId);
        newBudget.category = { _id: categoryId, name: categoryObj.name };

        await newBudget.save();

        if (await newBudget.isOverlapped()) {
            await newBudget.deleteOne();
            const err = new Error("The budget that you are trying to add is overlapped with other budgets");
            err.statusCode = 409;
            return next(err);
        }

        await newBudget.addTransactions()
        if (await newBudget.updateCurrentAmount() === Budget.STATUSES.OVER) {
            var user = await User.findById(userId);
            user.addNotification("Alert! Your budget with id=" + newBudget._id + " is over the limit for: " + newBudget.category.name);
            await user.save();
        }

        await newBudget.save();

        res.status(201).json({ success: true, data: newBudget });
    } catch (error) {
        next(error);
    }
}

export const deleteBudget = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const budget = await Budget.findById(id);
        if (!budget) {
            const err = new Error("No budget found");
            err.statusCode = 404;
            return next(err);
        }

        await Transaction.updateMany(
            { userId, budgetId: id },
            { $unset: { budgetId: "" } }
        );

        await budget.deleteOne();

        res.status(200).json({ success: true, message: "Deleted Successfully" });
    } catch (error) {
        next(error);
    }
}

export const getInProgressBudgetsByUserAndCategory = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { categoryId } = req.query;

        const category = await Category.findById(categoryId);
        if (!category) {
            const err = new Error("No category found");
            err.statusCode = 404;
            return next(err);
        }

        const budgets = await Budget.findInProgressByUserAndCategory(userId, categoryId);
        if (!budgets) {
            const err = new Error("A problem happend in searching about budgets");
            err.statusCode = 400;
            return next(err);
        }

        res.status(200).json({ success: true, data: budgets });
    } catch (error) {
        next(error);
    }
}

export const updateBudget = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { id: budgetId } = req.params
        let { amountLimit, endDate, categoryId } = req.body;
        endDate = endDate? new Date(endDate) : false;

        if (!budgetId) {
            const err = new Error("Budget Id that was sent is invalid or missed");
            err.statusCode = 404;
            return next(err);
        }

        const budget = await Budget.findById(budgetId);
        if (!budget) {
            const err = new Error("Budget not found");
            err.statusCode = 404;
            return next(err);
        }

        if (amountLimit) {
            if (amountLimit > 0) {
                budget.amountLimit = amountLimit;
                if (budget.currentAmount >= budget.amountLimit) {
                    budget.status = Budget.STATUSES.OVER;
                } else {
                    budget.status = Budget.STATUSES.IN_PROGRESS;
                }
            } else {
                const err = new Error("You Cannot update budget's amount limit by zero or negative number");
                err.statusCode = 400;
                return next(err);
            }
        }

        if (endDate) {
            if (endDate > budget.endDate) {
                budget.endDate = endDate;
            } else {
                const err = new Error("The updated end date must be greater than the current budget end date");
                err.statusCode = 400;
                return next(err);
            }
        }


        if (categoryId) {
            const category = await Category.findById(categoryId);
            if (!category) {
                const err = new Error("CategoryId that was sent is invalid");
                err.statusCode = 404;
                return next(err);
            }

            if (await budget.isThereTransactionsAttached()) {
                const err = new Error("You Cannot update budget's category that has transactions associated with it");
                err.statusCode = 409;
                return next(err);
            }

            budget.category = { _id: categoryId, name: category.name };

            if (await budget.isOverlapped()) {
                const err = new Error("The budget that you are trying to add is overlapped with other budgets");
                err.statusCode = 409;
                return next(err);
            }

            await budget.addTransactions();
            if (await budget.updateCurrentAmount() === Budget.STATUSES.OVER) {
                var user = await User.findById(userId);
                user.addNotification("Alert! Your budget with id=" + budget._id + " is over the limit for: " + budget.category.name);
                await user.save();
            }
        }

        await budget.save();
        res.status(200).json({
            success: true,
            data: budget
        });
    } catch (error) {
        next(error);
    }
}