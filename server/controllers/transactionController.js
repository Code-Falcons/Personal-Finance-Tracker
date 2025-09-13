import Transaction from '../models/transactionModel.js';

export const getSummary = async (req, res) => {
    try {
        const userId = req.user.id;
        const { startDate, endDate } = req.query;

        const summary = await Transaction.getSummary(userId, startDate, endDate);
        res.status(200).json({ success: true, data: summary });
    } catch (error) {
        console.error('Error fetching transaction summary:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
}

export const getCategorySpending = async (req, res) => {
    try {
        const userId = req.user.id;
        const { startDate, endDate } = req.query;

        const result = await Transaction.getCategoryWiseSpending(userId, startDate, endDate);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        console.error('Error fetching category-wise spending:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
}