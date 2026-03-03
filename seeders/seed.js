import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

import connectDB from '../utils/db.js';
import User from '../models/User.js';
import Vendor from '../models/Vendor.js';
import Payout from '../models/Payout.js';
import PayoutAudit from '../models/PayoutAudit.js';

dotenv.config();

const seedDB = async () => {
    try {
        await connectDB();
        console.log('MongoDB Connected for Seeding...');
        await User.deleteMany({});
        await Vendor.deleteMany({});
        await Payout.deleteMany({});
        await PayoutAudit.deleteMany({});
        console.log('Cleared existing data.');
        const salt = await bcrypt.genSalt(10);
        const opsPassword = await bcrypt.hash('ops123', salt);
        const finPassword = await bcrypt.hash('fin123', salt);

        await User.create([
            { email: 'ops@demo.com', password: opsPassword, role: 'OPS' },
            { email: 'finance@demo.com', password: finPassword, role: 'FINANCE' }
        ]);
        console.log('Users seeded.');
        await Vendor.create([
            { name: 'Acme Corp', upi_id: 'acme@upi', bank_account: '1234567890', ifsc: 'ACME0001234', is_active: true }
        ])
        console.log('Vendors seeded.');

        console.log('Seeding completed successfully.');
        process.exit();
    } catch (err) {
        console.error('Error seeding DB', err);
        process.exit(1);
    }
};

seedDB();
