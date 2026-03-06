/**
 * Static mock data for Product Management
 */

export interface Product {
    _id: string;
    name: string;
    description: string;
    seller: { _id: string; businessName: string; };
    category: string;
    price: number;
    mrp: number;
    stock_count: number;
    images: string[];
    is_verified: boolean;
    is_listed: boolean;
    status: 'Draft' | 'Published' | 'Out of Stock';
    weight?: string;
    material?: string;
    rating: number;
    reviewCount: number;
    createdAt: string;
    updatedAt: string;
}

export const MOCK_PRODUCTS: Product[] = [
    { _id: 'pr1', name: 'Natural Rose Quartz Crystal', description: 'High-quality natural rose quartz crystal for love and healing energy. Ethically sourced.', seller: { _id: 's1', businessName: 'Divine Crystals Shop' }, category: 'Crystals', price: 1299, mrp: 1999, stock_count: 45, images: [], is_verified: true, is_listed: true, status: 'Published', weight: '150g', material: 'Natural Quartz', rating: 4.6, reviewCount: 89, createdAt: '2026-02-01T10:00:00Z', updatedAt: '2026-03-01T10:00:00Z' },
    { _id: 'pr2', name: 'Yellow Sapphire Ring (Pukhraj)', description: 'Certified natural yellow sapphire ring in sterling silver. Lab-tested for authenticity.', seller: { _id: 's2', businessName: 'Astro Gems Palace' }, category: 'Gemstones', price: 15999, mrp: 24999, stock_count: 8, images: [], is_verified: true, is_listed: true, status: 'Published', weight: '12g', material: 'Sterling Silver + Sapphire', rating: 4.8, reviewCount: 34, createdAt: '2026-01-15T10:00:00Z', updatedAt: '2026-03-02T10:00:00Z' },
    { _id: 'pr3', name: 'Panchmukhi Rudraksha Mala', description: 'Authentic 5-face Rudraksha mala with 108 beads. Energized and ready to wear.', seller: { _id: 's1', businessName: 'Divine Crystals Shop' }, category: 'Malas', price: 899, mrp: 1499, stock_count: 120, images: [], is_verified: false, is_listed: false, status: 'Draft', weight: '80g', material: 'Rudraksha Beads', rating: 0, reviewCount: 0, createdAt: '2026-03-05T08:00:00Z', updatedAt: '2026-03-05T08:00:00Z' },
    { _id: 'pr4', name: 'Brass Navratna Pendant', description: 'Handcrafted 9-gem pendant set in brass. Each stone represents a planet.', seller: { _id: 's3', businessName: 'Vedic Store India' }, category: 'Jewelry', price: 8499, mrp: 12999, stock_count: 15, images: [], is_verified: false, is_listed: false, status: 'Draft', weight: '25g', material: 'Brass + Gemstones', rating: 0, reviewCount: 0, createdAt: '2026-03-04T12:00:00Z', updatedAt: '2026-03-04T12:00:00Z' },
    { _id: 'pr5', name: 'Complete Puja Samagri Kit', description: 'All-in-one puja kit with incense, diya, kumkum, chandan, camphor, and sacred thread.', seller: { _id: 's3', businessName: 'Vedic Store India' }, category: 'Puja Items', price: 599, mrp: 799, stock_count: 200, images: [], is_verified: true, is_listed: true, status: 'Published', weight: '500g', material: 'Mixed', rating: 4.3, reviewCount: 156, createdAt: '2026-01-20T10:00:00Z', updatedAt: '2026-02-28T10:00:00Z' },
    { _id: 'pr6', name: 'Emerald Stone (3 Carat)', description: 'Natural Colombian emerald. Certified by GIA. Ideal for Mercury-related remedies.', seller: { _id: 's2', businessName: 'Astro Gems Palace' }, category: 'Gemstones', price: 25000, mrp: 35000, stock_count: 0, images: [], is_verified: true, is_listed: true, status: 'Out of Stock', weight: '0.6g', material: 'Natural Emerald', rating: 4.9, reviewCount: 12, createdAt: '2026-01-10T10:00:00Z', updatedAt: '2026-03-03T10:00:00Z' },
    { _id: 'pr7', name: 'Amethyst Bracelet (Healing)', description: 'Genuine amethyst bead bracelet for spiritual growth and stress relief.', seller: { _id: 's1', businessName: 'Divine Crystals Shop' }, category: 'Crystals', price: 1999, mrp: 2999, stock_count: 55, images: [], is_verified: false, is_listed: false, status: 'Draft', weight: '40g', material: 'Natural Amethyst', rating: 0, reviewCount: 0, createdAt: '2026-03-06T06:00:00Z', updatedAt: '2026-03-06T06:00:00Z' },
];

export const PRODUCT_CATEGORIES = ['Crystals', 'Gemstones', 'Malas', 'Jewelry', 'Puja Items', 'Yantras', 'Books', 'Other'] as const;
