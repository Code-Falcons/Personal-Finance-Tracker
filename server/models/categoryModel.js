import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true
  },
  name: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true,
    maxlength: [50, 'Category name cannot exceed 50 characters']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});
categorySchema.set('runValidators', true);

categorySchema.index({ userId: 1, name: 1 }, { unique: true });

categorySchema.virtual('transactionCount', {
  ref: 'Transaction',
  localField: '_id',
  foreignField: 'category.id',
  count: true
});

categorySchema.statics.findByUserAndName = async function (userId, name) {
  return await this.find({ userId, name }).sort({ name: 1 });
};

categorySchema.methods.isInUse = async function () {
  const Transaction = mongoose.model('transaction');
  const Budget = mongoose.model('budget');

  const [transactionCount, budgetCount] = await Promise.all([
    Transaction.countDocuments({ 'category.id': this._id }),
    Budget.countDocuments({ 'category.id': this._id })
  ]);

  return transactionCount > 0 || budgetCount > 0;
};

export default mongoose.model('category', categorySchema);