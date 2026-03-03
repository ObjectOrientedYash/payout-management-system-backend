import mongoose from 'mongoose';

const PayoutAuditSchema = new mongoose.Schema({
    payout_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payout',
        required: true
    },
    action: {
        type: String,
        enum: ['CREATED', 'SUBMITTED', 'APPROVED', 'REJECTED'],
        required: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

export default mongoose.model('PayoutAudit', PayoutAuditSchema);
