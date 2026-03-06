/**
 * Static mock data for Reviews & Ratings
 */

export interface Review {
    _id: string;
    user: {
        _id: string;
        name: string;
        email: string;
        avatar?: string;
    };
    astrologer: {
        _id: string;
        name: string;
        specializations: string[];
    };
    rating: number;
    comment: string;
    callSessionId?: string;
    isVisible: boolean;
    isApproved: boolean;
    isFlagged: boolean;
    flagReason?: string;
    adminNotes?: string;
    createdAt: string;
    updatedAt: string;
}

export const MOCK_REVIEWS: Review[] = [
    {
        _id: 'r1',
        user: { _id: 'u1', name: 'Rahul Sharma', email: 'rahul@example.com' },
        astrologer: { _id: 'a1', name: 'Pandit Rajesh Kumar', specializations: ['Vedic', 'Kundli'] },
        rating: 5,
        comment: 'Absolutely amazing reading! Pandit ji predicted everything accurately. The career advice was spot on and I got the promotion he predicted within 2 weeks. Highly recommend!',
        callSessionId: 'cs001',
        isVisible: true,
        isApproved: true,
        isFlagged: false,
        createdAt: '2026-03-01T10:00:00Z',
        updatedAt: '2026-03-01T10:00:00Z',
    },
    {
        _id: 'r2',
        user: { _id: 'u2', name: 'Priya Verma', email: 'priya@example.com' },
        astrologer: { _id: 'a2', name: 'Jyotish Sunita Devi', specializations: ['Tarot', 'Numerology'] },
        rating: 4,
        comment: 'Good session overall. Tarot reading was insightful. Slight delay in starting the session but the predictions were accurate.',
        callSessionId: 'cs002',
        isVisible: true,
        isApproved: true,
        isFlagged: false,
        createdAt: '2026-03-02T14:30:00Z',
        updatedAt: '2026-03-02T14:30:00Z',
    },
    {
        _id: 'r3',
        user: { _id: 'u3', name: 'Amit Patel', email: 'amit@example.com' },
        astrologer: { _id: 'a1', name: 'Pandit Rajesh Kumar', specializations: ['Vedic', 'Kundli'] },
        rating: 2,
        comment: 'Very generic predictions. The astrologer did not ask my birth details properly. Not worth the money. Felt like a robotic reading from a script.',
        callSessionId: 'cs003',
        isVisible: false,
        isApproved: false,
        isFlagged: true,
        flagReason: 'Potentially defamatory content',
        createdAt: '2026-03-03T09:15:00Z',
        updatedAt: '2026-03-04T11:00:00Z',
    },
    {
        _id: 'r4',
        user: { _id: 'u4', name: 'Sneha Gupta', email: 'sneha@example.com' },
        astrologer: { _id: 'a3', name: 'Acharya Vikram Shastri', specializations: ['Vastu', 'Palmistry'] },
        rating: 5,
        comment: 'Best Vastu consultation ever! Acharya ji gave detailed remedies for my new home and business. Already seeing positive changes. Will consult again.',
        isVisible: true,
        isApproved: true,
        isFlagged: false,
        createdAt: '2026-02-28T16:00:00Z',
        updatedAt: '2026-02-28T16:00:00Z',
    },
    {
        _id: 'r5',
        user: { _id: 'u5', name: 'Karan Singh', email: 'karan@example.com' },
        astrologer: { _id: 'a2', name: 'Jyotish Sunita Devi', specializations: ['Tarot', 'Numerology'] },
        rating: 3,
        comment: 'Average experience. The predictions were okay but I expected more depth for the price. The session felt rushed.',
        isVisible: true,
        isApproved: false,
        isFlagged: false,
        createdAt: '2026-03-04T11:45:00Z',
        updatedAt: '2026-03-04T11:45:00Z',
    },
    {
        _id: 'r6',
        user: { _id: 'u6', name: 'Megha Joshi', email: 'megha@example.com' },
        astrologer: { _id: 'a4', name: 'Guru Anand Mishra', specializations: ['Vedic', 'Lal Kitab'] },
        rating: 1,
        comment: 'Terrible experience! Used abusive language during the call. DO NOT consult this person.',
        callSessionId: 'cs006',
        isVisible: false,
        isApproved: false,
        isFlagged: true,
        flagReason: 'Reports abusive behavior from astrologer',
        adminNotes: 'Investigating this complaint. Call recording requested.',
        createdAt: '2026-03-05T08:30:00Z',
        updatedAt: '2026-03-05T09:00:00Z',
    },
    {
        _id: 'r7',
        user: { _id: 'u7', name: 'Deepak Rao', email: 'deepak@example.com' },
        astrologer: { _id: 'a3', name: 'Acharya Vikram Shastri', specializations: ['Vastu', 'Palmistry'] },
        rating: 4,
        comment: 'Very knowledgeable astrologer. Palmistry reading was quite detailed. Only wish the session was a bit longer.',
        isVisible: true,
        isApproved: false,
        isFlagged: false,
        createdAt: '2026-03-05T15:20:00Z',
        updatedAt: '2026-03-05T15:20:00Z',
    },
];
