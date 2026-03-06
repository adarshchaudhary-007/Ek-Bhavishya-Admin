/**
 * Static mock data for Book Management
 */

export interface Book {
    _id: string;
    title: string;
    author: string;
    description: string;
    category: string;
    type: 'Digital' | 'Audio' | 'Both';
    price: number;
    isFree: boolean;
    status: 'Active' | 'Inactive' | 'Coming Soon';
    coverImage: string;
    totalPages?: number;
    duration?: string;
    language: string;
    isbn?: string;
    isFeatured: boolean;
    purchaseCount: number;
    rating: number;
    createdAt: string;
    updatedAt: string;
}

export const MOCK_BOOKS: Book[] = [
    { _id: 'b1', title: 'Complete Guide to Vedic Astrology', author: 'Dr. B.V. Raman', description: 'A comprehensive guide covering all aspects of Vedic astrology from basics to advanced predictive techniques.', category: 'Astrology', type: 'Digital', price: 499, isFree: false, status: 'Active', coverImage: '', totalPages: 342, language: 'English', isbn: '978-1234567890', isFeatured: true, purchaseCount: 1245, rating: 4.8, createdAt: '2026-01-15T10:00:00Z', updatedAt: '2026-03-01T10:00:00Z' },
    { _id: 'b2', title: 'Palmistry for Beginners', author: 'Cheiro', description: 'Learn the art of palm reading with this beautifully illustrated beginners guide.', category: 'Palmistry', type: 'Both', price: 299, isFree: false, status: 'Active', coverImage: '', totalPages: 180, duration: '4h 30m', language: 'Hindi', isFeatured: false, purchaseCount: 867, rating: 4.5, createdAt: '2026-01-20T10:00:00Z', updatedAt: '2026-02-15T10:00:00Z' },
    { _id: 'b3', title: 'Vastu Shastra: Home & Office', author: 'Pandit Gopal Sharma', description: 'Transform your living and working spaces with ancient Vastu principles adapted for modern times.', category: 'Vastu', type: 'Digital', price: 0, isFree: true, status: 'Active', coverImage: '', totalPages: 96, language: 'English', isFeatured: false, purchaseCount: 3200, rating: 4.2, createdAt: '2026-02-01T10:00:00Z', updatedAt: '2026-02-20T10:00:00Z' },
    { _id: 'b4', title: 'Numerology Decoded', author: 'Acharya Vinod Kumar', description: 'Uncover the hidden meanings behind numbers and how they influence your destiny.', category: 'Numerology', type: 'Audio', price: 399, isFree: false, status: 'Active', coverImage: '', duration: '6h 15m', language: 'Hindi', isFeatured: true, purchaseCount: 542, rating: 4.6, createdAt: '2026-02-10T10:00:00Z', updatedAt: '2026-03-03T10:00:00Z' },
    { _id: 'b5', title: 'Tarot Card Mastery', author: 'Maya Sharma', description: 'Master the 78 tarot cards with detailed interpretations, spreads, and real reading examples.', category: 'Tarot', type: 'Digital', price: 599, isFree: false, status: 'Coming Soon', coverImage: '', totalPages: 420, language: 'English', isFeatured: false, purchaseCount: 0, rating: 0, createdAt: '2026-03-05T10:00:00Z', updatedAt: '2026-03-05T10:00:00Z' },
    { _id: 'b6', title: 'Meditation & Spiritual Healing', author: 'Swami Anandamayi', description: 'A holistic guide to meditation techniques and spiritual healing practices.', category: 'Spirituality', type: 'Audio', price: 199, isFree: false, status: 'Inactive', coverImage: '', duration: '3h 45m', language: 'English', isFeatured: false, purchaseCount: 312, rating: 4.3, createdAt: '2026-01-05T10:00:00Z', updatedAt: '2026-02-25T10:00:00Z' },
];

export const BOOK_CATEGORIES = ['Astrology', 'Palmistry', 'Vastu', 'Numerology', 'Tarot', 'Spirituality', 'Wellness', 'Other'] as const;
