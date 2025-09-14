import mongoose from 'mongoose';

const TRANSACTION_TYPE = Object.freeze({
  INCOME: 'income',
  EXPENSE: 'expense',
  SAVING: 'saving'
});

const categorySnapshotSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category ID is required']
  },
  name: {
    type: String,
    required: [true, 'Category name snapshot is required'],
    trim: true
  }
});

const savingSnapshotSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Saving',
    required: [true, 'Saving ID is required']
  },
  title: {
    type: String,
    required: [true, 'Saving title snapshot is required'],
    trim: true
  }
});


const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0.01, 'Amount must be greater than 0']
  },
  date: {
    type: Date,
    required: [true, 'Date is required'],
    default: Date.now,
    index: true
  },
  type: {
    type: String,
    required: [true, 'Transaction type is required'],
    enum: {
      values: Object.values(TRANSACTION_TYPE),
      message: `Type must be either ${Object.values(TRANSACTION_TYPE).join(' or ')}`
    }
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  category: {
    type: categorySnapshotSchema,
    required: false,
    validate: {
      validator: function (value) {
        if (value && this.type == TRANSACTION_TYPE.SAVING) {
          return false;
        }
        return true;
      },
      message: 'Category reference is only allowed for income and expense transactions'
    }
  },
  budgetId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Budget',
    required: false,
    validate: {
      validator: function (value) {
        if (value && (this.type == TRANSACTION_TYPE.SAVING || this.type == TRANSACTION_TYPE.INCOME)) {
          return false;
        }
        return true;
      },
      message: 'Category reference is only allowed for income and expense transactions'
    }
  },
  saving: {
    type: savingSnapshotSchema,
    required: false,
    validate: {
      validator: function (value) {
        if (value && this.type !== TRANSACTION_TYPE.SAVING) {
          return false;
        }
        return true;
      },
      message: 'Saving reference is only allowed for saving transactions'
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});
transactionSchema.set('runValidators', true);



transactionSchema.index({ userId: 1, date: -1 });
transactionSchema.index({ userId: 1, 'category._id': 1, date: -1 });
transactionSchema.index({ userId: 1, type: 1, date: -1 });
transactionSchema.index({ 'saving._id': 1, date: -1 });

transactionSchema.virtual('formattedAmount').get(function () {
  return this.type === TRANSACTION_TYPE.EXPENSE ? -Math.abs(this.amount) : Math.abs(this.amount);
});

transactionSchema.statics.getSummary = async function (userId, startDate, endDate) {
  const match = {
    userId: new mongoose.Types.ObjectId(userId)
  };

  if (startDate || endDate) {
    match.date = {};
    if (startDate) match.date.$gte = new Date(startDate);
    if (endDate) match.date.$lte = new Date(endDate);
  }

  return await this.aggregate([
    { $match: match },
    {
      $group: {
        _id: '$type',
        total: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    }
  ]);
};

transactionSchema.statics.getCategoryWiseSpending = async function (userId, startDate, endDate) {
  const match = {
    userId: new mongoose.Types.ObjectId(userId),
    type: TRANSACTION_TYPE.EXPENSE
  };

  if (startDate || endDate) {
    match.date = {};
    if (startDate) match.date.$gte = new Date(startDate);
    if (endDate) match.date.$lte = new Date(endDate);
  }
  
  return await this.aggregate([
    {
      $match: match
    },
    {
      $group: {
        _id: {
          categoryId: '$category._id',
          categoryName: '$category.name'
        },
        total: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { total: -1 }
    }
  ]);
};

const Transaction = mongoose.model('transaction', transactionSchema);
Transaction.TYPES = TRANSACTION_TYPE;

export default Transaction;