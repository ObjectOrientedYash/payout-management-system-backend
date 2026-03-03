import Payout from '../models/Payout.js';
import PayoutAudit from '../models/PayoutAudit.js';
import { sendSuccess, sendError } from '../utils/response.js';

// Helper to create audit log
const createAuditLog = async (payout_id, action, user_id) => {
    await PayoutAudit.create({ payout_id, action, user_id });
};

// GET /payouts
export const getPayouts = async (req, res) => {
    try {
        const { status, vendor_id } = req.query;
        let query = {};
        if (status) query.status = status;
        if (vendor_id) query.vendor_id = vendor_id;

        const payouts = await Payout.find(query)
            .populate('vendor_id', 'name bank_account upi_id')
            .sort({ createdAt: -1 });
        return sendSuccess(res, 200, payouts, 'Payouts fetched successfully');
    } catch (error) {
        console.error(error.message);
        return sendError(res, 500, 'Server error', error.message);
    }
};

// GET /payouts/:id
export const getPayoutById = async (req, res) => {
    try {
        const payout = await Payout.findById(req.params.id).populate('vendor_id');
        if (!payout) {
            return sendError(res, 404, 'Payout not found');
        }

        const audits = await PayoutAudit.find({ payout_id: payout._id })
            .populate('user_id', 'email')
            .sort({ createdAt: -1 });

        return sendSuccess(res, 200, { payout, audits }, 'Payout fetched successfully');
    } catch (error) {
        console.error(error.message);
        return sendError(res, 500, 'Server error', error.message);
    }
};

// POST /payouts (OPS only)
export const createPayout = async (req, res) => {
    try {
        const { vendor_id, amount, mode, note } = req.body;

        if (!vendor_id || !amount || !mode) {
            return sendError(res, 400, 'Missing required fields');
        }

        if (amount <= 0) {
            return sendError(res, 400, 'Amount must be > 0');
        }

        const payout = new Payout({
            vendor_id,
            amount,
            mode,
            note,
            status: 'Draft'
        });

        await payout.save();
        await createAuditLog(payout._id, 'CREATED', req.user.id);

        return sendSuccess(res, 201, payout, 'Payout created successfully');
    } catch (error) {
        console.error(error.message);
        return sendError(res, 500, 'Server error', error.message);
    }
};

// POST /payouts/:id/submit (OPS only)
export const submitPayout = async (req, res) => {
    try {
        const payout = await Payout.findById(req.params.id);
        if (!payout) {
            return sendError(res, 404, 'Payout not found');
        }

        if (payout.status !== 'Draft') {
            return sendError(res, 400, 'Can only submit Draft payouts');
        }

        payout.status = 'Submitted';
        await payout.save();
        await createAuditLog(payout._id, 'SUBMITTED', req.user.id);

        return sendSuccess(res, 200, payout, 'Payout submitted successfully');
    } catch (error) {
        console.error(error.message);
        return sendError(res, 500, 'Server error', error.message);
    }
};

// POST /payouts/:id/approve (FINANCE only)
export const approvePayout = async (req, res) => {
    try {
        const payout = await Payout.findById(req.params.id);
        if (!payout) {
            return sendError(res, 404, 'Payout not found');
        }

        if (payout.status !== 'Submitted') {
            return sendError(res, 400, 'Can only approve Submitted payouts');
        }

        payout.status = 'Approved';
        await payout.save();
        await createAuditLog(payout._id, 'APPROVED', req.user.id);

        return sendSuccess(res, 200, payout, 'Payout approved successfully');
    } catch (error) {
        console.error(error.message);
        return sendError(res, 500, 'Server error', error.message);
    }
};

// POST /payouts/:id/reject (FINANCE only)
export const rejectPayout = async (req, res) => {
    try {
        const { decision_reason } = req.body;
        if (!decision_reason) {
            return sendError(res, 400, 'decision_reason is mandatory for rejection');
        }

        const payout = await Payout.findById(req.params.id);
        if (!payout) {
            return sendError(res, 404, 'Payout not found');
        }

        if (payout.status !== 'Submitted') {
            return sendError(res, 400, 'Can only reject Submitted payouts');
        }

        payout.status = 'Rejected';
        payout.decision_reason = decision_reason;
        await payout.save();
        await createAuditLog(payout._id, 'REJECTED', req.user.id);

        return sendSuccess(res, 200, payout, 'Payout rejected successfully');
    } catch (error) {
        console.error(error.message);
        return sendError(res, 500, 'Server error', error.message);
    }
};
