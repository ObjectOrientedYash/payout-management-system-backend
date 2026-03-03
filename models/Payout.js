import mongoose from 'mongoose';

const PayoutSchema = new mongoose.Schema({
    vendor_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor',
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0.01
    },
    mode: {
        type: String,
        enum: ['UPI', 'IMPS', 'NEFT'],
        required: true
    },
    note: {
        type: String,
        required: false
    },
    status: {
        type: String,
        enum: ['Draft', 'Submitted', 'Approved', 'Rejected'],
        default: 'Draft'
    },
    decision_reason: {
        type: String,
        required: function () {
            return this.status === 'Rejected';
        }
    }
}, { timestamps: true });

export default mongoose.model('Payout', PayoutSchema);
