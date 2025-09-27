import mongoose from 'mongoose';

const BUDGET_STATUS = Object.freeze({
  IN_PROGRESS: "in-progress",
  OVER: "over",
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


const budgetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true
  },
  category: {
    type: categorySnapshotSchema,
    required: [true, 'Category is required']
  },
  amountLimit: {
    type: Number,
    required: [true, 'Amount limit is required'],
    min: [0.01, 'Amount limit must be greater than 0']
  },
  currentAmount: {
    type: Number,
    default: 0,
    min: [0, 'Current amount cannot be negative']
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required'],
    index: true
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required'],
    index: true,
    validate: {
      validator: function (endDate) {
        return endDate > this.startDate;
      },
      message: 'End date must be after start date'
    }
  },
  status: {
    type: String,
    required: [true, 'Status is required'],
    enum: {
      values: Object.values(BUDGET_STATUS),
      message: `Status must be ${Object.values(BUDGET_STATUS).join(' or ')}`
    },
    default: BUDGET_STATUS.IN_PROGRESS,
    index: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});
budgetSchema.set('runValidators', true);


budgetSchema.index({ userId: 1, 'category.id': 1, status: 1 });
budgetSchema.index({ userId: 1, status: 1, endDate: 1 });
budgetSchema.index({ status: 1, endDate: 1 });


budgetSchema.virtual('utilizationPercentage').get(function () {
  return Math.round((this.currentAmount / this.amountLimit) * 100);
});


budgetSchema.virtual('remainingAmount').get(function () {
  return Math.max(0, this.amountLimit - this.currentAmount);
});


budgetSchema.virtual('daysRemaining').get(function () {
  const now = new Date();
  const diffTime = this.endDate - now;
  return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
});


budgetSchema.statics.findInProgressByUserAndCategory = async function (userId, categoryId) {
  const now = new Date();
  return await this.find({
    userId,
    'category._id': categoryId,
    status: BUDGET_STATUS.IN_PROGRESS,
    startDate: { $lte: now },
    endDate: { $gte: now }
  });
};


budgetSchema.methods.updateCurrentAmount = async function () {
  const Transaction = mongoose.model('transaction');

  const result = await Transaction.aggregate([
    {
      $match: {
        budgetId: this._id,
        'category._id': this.category._id,
        type: Transaction.TYPES.EXPENSE,
        date: {
          $gte: this.startDate,
          $lte: this.endDate
        }
      }
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$amount' }
      }
    }
  ]);

  let total = result.length > 0 ? result[0].total : 0;

  this.currentAmount = total;

  if (this.currentAmount >= this.amountLimit) {
    this.status = BUDGET_STATUS.OVER;
  }

  return this.status;
};


budgetSchema.methods.isOverlapped = async function () {
  const overlapping = await this.constructor.findOne({
    _id: { $ne: this._id },
    userId: this.userId,
    'category._id': this.category._id,
    startDate: { $lte: this.endDate },
    endDate: { $gte: this.startDate }
  });


  return !!overlapping;
};

budgetSchema.methods.checkExpiredAndUpdate = async function () {
  if (this.status === BUDGET_STATUS.OVER) return true;

  if (this.endDate <= new Date()) {
    this.status = BUDGET_STATUS.OVER;
    await this.save();
    return true;
  }

  return false;
}

budgetSchema.methods.isThereTransactionsAttached = async function () {
  const Transaction = mongoose.model('transaction');
  const isThere = await Transaction.findOne({
    budgetId: this._id,
    userId: this.userId,
    'category._id': this.category._id,
    type: Transaction.TYPES.EXPENSE,
    date: { $gte: this.startDate, $lte: this.endDate },
  });

  return isThere;
}

budgetSchema.methods.addTransactions = async function () {
  const Transaction = mongoose.model('transaction');

  await Transaction.updateMany(
    {
      userId: this.userId,
      'category._id': this.category._id,
      type: Transaction.TYPES.EXPENSE,
      date: { $gte: this.startDate, $lte: this.endDate },
      budgetId: { $exists: false }
    },
    { $set: { budgetId: this._id } }
  );
}

let Budget = mongoose.model('budget', budgetSchema);
Budget.STATUSES = BUDGET_STATUS;

export default Budget;