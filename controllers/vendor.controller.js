import Vendor from '../models/Vendor.js';
import { sendSuccess, sendError } from '../utils/response.js';

// GET /vendors
export const getVendors = async (req, res) => {
    try {
        const vendors = await Vendor.find().sort({ createdAt: -1 });
        return sendSuccess(res, 200, vendors, 'Vendors fetched successfully');
    } catch (error) {
        console.error(error.message);
        return sendError(res, 500, 'Server error', error.message);
    }
};

// POST /vendors
export const createVendor = async (req, res) => {
    try {
        const { name, upi_id, bank_account, ifsc, is_active } = req.body;

        if (!name) {
            return sendError(res, 400, 'Name is required');
        }

        const vendor = new Vendor({
            name,
            upi_id,
            bank_account,
            ifsc,
            is_active: is_active !== undefined ? is_active : true
        });

        await vendor.save();
        return sendSuccess(res, 201, vendor, 'Vendor created successfully');
    } catch (error) {
        console.error(error.message);
        return sendError(res, 500, 'Server error', error.message);
    }
};
