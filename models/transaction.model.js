const transactionSchema = new mongoose.Schema({
    type: { type: String, enum: ['income', 'expense'], required: true },
    amount: { type: Number, required: true },
    category: { type: String, default: 'Others' },
    description: String,
    date: { type: Date, default: Date.now }
  });