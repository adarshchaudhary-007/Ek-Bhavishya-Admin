/**
 * Static mock data for Wallet & Withdrawal Management
 */

export interface WalletTransaction {
    _id: string;
    user: { _id: string; name: string; };
    type: 'credit' | 'debit';
    amount: number;
    reason: string;
    description: string;
    balanceAfter: number;
    status: string;
    createdAt: string;
}

export interface WithdrawalRequest {
    _id: string;
    astrologer: {
        _id: string;
        name: string;
        email: string;
        bankDetails: {
            accountHolderName: string;
            accountNumber: string;
            ifscCode: string;
            bankName: string;
        };
    };
    amount: number;
    status: 'Pending' | 'Approved' | 'Rejected' | 'Processed';
    adminComments?: string;
    processedAt?: string;
    createdAt: string;
    updatedAt: string;
}

export const MOCK_WALLET_TRANSACTIONS: WalletTransaction[] = [
    { _id: 'wt1', user: { _id: 'u1', name: 'Rahul Sharma' }, type: 'credit', amount: 500, reason: 'Recharge', description: 'Wallet recharge via UPI', balanceAfter: 1500, status: 'Completed', createdAt: '2026-03-05T10:00:00Z' },
    { _id: 'wt2', user: { _id: 'u1', name: 'Rahul Sharma' }, type: 'debit', amount: 200, reason: 'Call', description: 'Consultation with Pandit Rajesh Kumar (12 min)', balanceAfter: 1300, status: 'Completed', createdAt: '2026-03-05T11:00:00Z' },
    { _id: 'wt3', user: { _id: 'u2', name: 'Priya Verma' }, type: 'credit', amount: 1000, reason: 'Recharge', description: 'Wallet recharge via Card', balanceAfter: 2500, status: 'Completed', createdAt: '2026-03-04T09:30:00Z' },
    { _id: 'wt4', user: { _id: 'u3', name: 'Amit Patel' }, type: 'credit', amount: 300, reason: 'Refund', description: 'Refund for cancelled call session', balanceAfter: 800, status: 'Completed', createdAt: '2026-03-04T15:00:00Z' },
    { _id: 'wt5', user: { _id: 'u4', name: 'Sneha Gupta' }, type: 'debit', amount: 599, reason: 'Purchase', description: 'Book purchase: Vedic Astrology Guide', balanceAfter: 401, status: 'Completed', createdAt: '2026-03-03T18:00:00Z' },
    { _id: 'wt6', user: { _id: 'u5', name: 'Karan Singh' }, type: 'credit', amount: 100, reason: 'Referral', description: 'Referral bonus for inviting Deepak Rao', balanceAfter: 600, status: 'Completed', createdAt: '2026-03-02T12:00:00Z' },
];

export const MOCK_WITHDRAWALS: WithdrawalRequest[] = [
    {
        _id: 'wd1',
        astrologer: { _id: 'a1', name: 'Pandit Rajesh Kumar', email: 'rajesh@example.com', bankDetails: { accountHolderName: 'Rajesh Kumar', accountNumber: 'XXXX1234', ifscCode: 'SBIN0001234', bankName: 'State Bank of India' } },
        amount: 15000,
        status: 'Pending',
        createdAt: '2026-03-05T08:00:00Z',
        updatedAt: '2026-03-05T08:00:00Z',
    },
    {
        _id: 'wd2',
        astrologer: { _id: 'a2', name: 'Jyotish Sunita Devi', email: 'sunita@example.com', bankDetails: { accountHolderName: 'Sunita Devi', accountNumber: 'XXXX5678', ifscCode: 'HDFC0005678', bankName: 'HDFC Bank' } },
        amount: 8500,
        status: 'Pending',
        createdAt: '2026-03-04T14:00:00Z',
        updatedAt: '2026-03-04T14:00:00Z',
    },
    {
        _id: 'wd3',
        astrologer: { _id: 'a3', name: 'Acharya Vikram Shastri', email: 'vikram@example.com', bankDetails: { accountHolderName: 'Vikram Shastri', accountNumber: 'XXXX9012', ifscCode: 'ICIC0009012', bankName: 'ICICI Bank' } },
        amount: 22000,
        status: 'Approved',
        adminComments: 'Verified. Processing bank transfer.',
        createdAt: '2026-03-03T10:00:00Z',
        updatedAt: '2026-03-04T09:00:00Z',
    },
    {
        _id: 'wd4',
        astrologer: { _id: 'a4', name: 'Guru Anand Mishra', email: 'anand@example.com', bankDetails: { accountHolderName: 'Anand Mishra', accountNumber: 'XXXX3456', ifscCode: 'PUNB0003456', bankName: 'Punjab National Bank' } },
        amount: 5000,
        status: 'Rejected',
        adminComments: 'Bank details verification failed. Please update your bank account.',
        createdAt: '2026-03-01T11:00:00Z',
        updatedAt: '2026-03-02T16:00:00Z',
    },
    {
        _id: 'wd5',
        astrologer: { _id: 'a1', name: 'Pandit Rajesh Kumar', email: 'rajesh@example.com', bankDetails: { accountHolderName: 'Rajesh Kumar', accountNumber: 'XXXX1234', ifscCode: 'SBIN0001234', bankName: 'State Bank of India' } },
        amount: 12000,
        status: 'Processed',
        adminComments: 'Transfer completed. UTR: SBIN2026030512345',
        processedAt: '2026-02-28T14:00:00Z',
        createdAt: '2026-02-26T09:00:00Z',
        updatedAt: '2026-02-28T14:00:00Z',
    },
];
