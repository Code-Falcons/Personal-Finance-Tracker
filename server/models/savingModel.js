import mongoose from 'mongoose';

const SAVING_STATUS = Object.freeze({
  ACTIVE: "active",
  PAUSED: "paused",
  COMPLETED: "completed"
});

const savingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true
  },
  title: {
    type: String,
    required: [true, 'Saving title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  targetAmount: {
    type: Number,
    required: [true, 'Target amount is required'],
    min: [0.01, 'Target amount must be greater than 0']
  },
  currentAmount: {
    type: Number,
    default: 0,
    min: [0, 'Current amount cannot be negative']
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required'],
    default: Date.now,
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
      values: Object.values(SAVING_STATUS),
      message: `Status must be ${Object.values(SAVING_STATUS).join(' or ')}`
    },
    default: SAVING_STATUS.ACTIVE,
    index: true
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});
savingSchema.set('runValidators', true);



savingSchema.index({ userId: 1, status: 1 });
savingSchema.index({ userId: 1, status: 1, endDate: 1 });
savingSchema.index({ status: 1, endDate: 1 });


savingSchema.virtual('progressPercentage').get(function () {
  return Math.min(100, Math.round((this.currentAmount / this.targetAmount) * 100));
});


savingSchema.virtual('remainingAmount').get(function () {
  return Math.max(0, this.targetAmount - this.currentAmount);
});


savingSchema.virtual('daysRemaining').get(function () {
  const now = new Date();
  const diffTime = this.endDate - now;
  return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
});


savingSchema.virtual('dailySavingsNeeded').get(function () {
  const daysRemaining = this.daysRemaining;
  if (daysRemaining <= 0) return 0;
  return Math.round((this.remainingAmount / daysRemaining) * 100) / 100;
});

savingSchema.statics.findActiveByUser = async function (userId) {
  const now = new Date();
  return await this.find({
    userId,
    status: SAVING_STATUS.ACTIVE,
    startDate: { $lte: now },
    endDate: { $gte: now }
  });
};


savingSchema.methods.updateCurrentAmount = async function () {
  const Transaction = mongoose.model('transaction');

  const result = await Transaction.aggregate([
    {
      $match: {
        userId: this.userId,
        'saving._id': this._id,
        type: Transaction.TYPES.SAVING,
        date: { $gte: this.startDate, $lte: this.endDate }
      }
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$amount' }
      }
    }
  ]);

  const total = result.length > 0 ? result[0].total : 0;
  this.currentAmount = total;

  if (this.currentAmount >= this.targetAmount) {
    this.status = SAVING_STATUS.COMPLETED;
  }

  return this.status;
};

savingSchema.methods.checkExpiredAndUpdate= async function () {
  if (this.status === SAVING_STATUS.COMPLETED ||
    this.status === SAVING_STATUS.PAUSED) return true;
  
  if (this.endDate <= new Date()) {
    this.status = SAVING_STATUS.COMPLETED;
    await this.save();
    return true;
  }

  return false;
}

savingSchema.methods.sumRelatedTransaction = async function () {
  const Transaction = mongoose.model('transaction');
  const aggregation = await Transaction.aggregate([
    {
      $match: {
          userId: new mongoose.Types.ObjectId(this.userId),
          'saving._id': new mongoose.Types.ObjectId(this._id)
      }
    },
    { $group: { _id: null, total: { $sum: "$amount" } } }
  ]);

  const totalAmount = aggregation[0]?.total || 0;

  return totalAmount;
}


savingSchema.methods.pause = function () {
  if (this.status === SAVING_STATUS.COMPLETED) {
    throw new Error('Cannot pause a completed saving');
  }
  this.status = SAVING_STATUS.PAUSED;
  return this.toObject();
};


savingSchema.methods.resume = function () {
  if (this.status === SAVING_STATUS.COMPLETED) {
    throw new Error('Cannot resume a completed saving');
  }
  this.status = SAVING_STATUS.ACTIVE;
  return this.toObject();
};

const Saving = mongoose.model('saving', savingSchema);
Saving.STATUSES = SAVING_STATUS;

export default Saving;