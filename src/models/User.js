const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    type: String,
    match: [
      /^[A-Z0-9][A-Z0-9._%+-]{0,63}@(?:(?=[A-Z0-9-]{1,63}\.)[A-Z0-9]+(?:-[A-Z0-9]+)*\.){1,8}[A-Z]{2,63}$/i,
      '{VALUE} is not a valid email address!'
    ],
    lowercase: true,
    unique: true,
    required: [true, 'User email address required!']
  },
  password: {
    type: String,
    required: [true, 'Password required!']
  },
  profile: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true }
  },
  role: {
    type: String,
    enum: ['Member', 'Client', 'Owner', 'Admin'],
    default: 'Member'
  },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date }
},
{
  timestamps: true
});

UserSchema.set('collection', 'users');

UserSchema.pre('save', function(next) {
  const user = this;
  const SALT_FACTOR = 5;

  if (!user.isModified('password')) return next();

  bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) { return cb(err); }

    cb(null, isMatch);
  });
}

UserSchema.methods.comparePasswordSync = function(candidatePassword) {
  try {
    return bcrypt.compareSync(candidatePassword, this.password);
  }
  catch(e) {
    return false;
  }
}

module.exports = mongoose.model('User', UserSchema);
