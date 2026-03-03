import mongoose from 'mongoose';

const VendorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    upi_id: {
        type: String,
        required: false
    },
    bank_account: {
        type: String,
        required: false
    },
    ifsc: {
        type: String,
        required: false
    },
    is_active: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

export default mongoose.model('Vendor', VendorSchema);
