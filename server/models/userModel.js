import mongoose from 'mongoose';

const financialProfileSchema = new mongoose.Schema({
  currentBalance: {
    type: Number,
    default: 0,
    required: true
  },
  totalSavings: {
    type: Number,
    default: 0,
    required: true
  }
}, { _id: false });


const notificationSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  date: {
    type: Date,
    default: Date.now,
    required: true
  },
  read: {
    type: Boolean,
    default: false,
    required: true
  }
});


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6
  },
  refreshTokens: [{
    type: String,
    default: null
  }],
  currency: {
    type: String,
    required: true,
  },
  financialProfile: {
    type: financialProfileSchema,
    default: () => ({})
  },
  notifications: {
    type: [notificationSchema],
    default: []
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});
userSchema.set('runValidators', true);



userSchema.index({ refreshToken: 1 });

userSchema.pre('save', function (next) {
  if (this.notifications && this.notifications.length > 20) {
    this.notifications = this.notifications
      .slice(0, 20);
  }
  next();
});

userSchema.methods.addNotification = async function (message) {
  this.notifications.unshift({
    message,
    date: new Date(),
    read: false
  });
  await this.save();
  return this.toObject();
};

userSchema.methods.markNotificationAsRead = async function (notificationId) {
  const notification = this.notifications.id(notificationId);
  if (notification) {
    notification.read = true;
    await this.save();
  }
  return this.toObject();
};

userSchema.methods.markAllNotificationsAsRead = async function () {
  this.notifications.forEach(notification => {
    notification.read = true;
  });
  await this.save();
  return this.toObject();
};

export default mongoose.model('user', userSchema);