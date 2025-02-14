import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true, // чтобы избежать дублей
  },
});

export default mongoose.model('UserId', userSchema);;