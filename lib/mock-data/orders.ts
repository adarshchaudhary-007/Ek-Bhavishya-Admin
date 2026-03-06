/**
 * Static mock data for Order Management
 * Replace with real API calls when backend is ready
 */

export interface OrderItem {
    _id: string;
    product: {
        name: string;
        image: string;
        price: number;
    };
    quantity: number;
    price: number;
    status: string;
}

export interface Order {
    _id: string;
    orderId: string;
    user: {
        _id: string;
        name: string;
        email: string;
        phone: string;
    };
    seller: {
        _id: string;
        businessName: string;
    };
    items: OrderItem[];
    totalAmount: number;
    shippingCharge: number;
    discount: number;
    finalAmount: number;
    order_status: string;
    payment_status: string;
    payment_method: string;
    shippingAddress: {
        name: string;
        address: string;
        city: string;
        state: string;
        pincode: string;
        phone: string;
    };
    tracking: {
        trackingId?: string;
        courier?: string;
        estimatedDelivery?: string;
    };
    cancelledBy?: string;
    cancellationReason?: string;
    refundAmount?: number;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

export const MOCK_ORDERS: Order[] = [
    {
        _id: '1',
        orderId: 'EB-ORD-20260301-001',
        user: { _id: 'u1', name: 'Rahul Sharma', email: 'rahul@example.com', phone: '+91 9876543210' },
        seller: { _id: 's1', businessName: 'Divine Crystals Shop' },
        items: [
            { _id: 'i1', product: { name: 'Rose Quartz Crystal', image: '', price: 1299 }, quantity: 2, price: 2598, status: 'Shipped' },
            { _id: 'i2', product: { name: 'Rudraksha Mala', image: '', price: 899 }, quantity: 1, price: 899, status: 'Shipped' },
        ],
        totalAmount: 3497,
        shippingCharge: 99,
        discount: 200,
        finalAmount: 3396,
        order_status: 'Shipped',
        payment_status: 'Paid',
        payment_method: 'UPI',
        shippingAddress: { name: 'Rahul Sharma', address: '42, MG Road, Lajpat Nagar', city: 'New Delhi', state: 'Delhi', pincode: '110024', phone: '+91 9876543210' },
        tracking: { trackingId: 'DL1234567890', courier: 'Delhivery', estimatedDelivery: '2026-03-08' },
        createdAt: '2026-03-01T10:30:00Z',
        updatedAt: '2026-03-03T14:20:00Z',
    },
    {
        _id: '2',
        orderId: 'EB-ORD-20260302-002',
        user: { _id: 'u2', name: 'Priya Verma', email: 'priya@example.com', phone: '+91 9812345678' },
        seller: { _id: 's2', businessName: 'Astro Gems Palace' },
        items: [
            { _id: 'i3', product: { name: 'Yellow Sapphire Ring', image: '', price: 15999 }, quantity: 1, price: 15999, status: 'Processing' },
        ],
        totalAmount: 15999,
        shippingCharge: 0,
        discount: 500,
        finalAmount: 15499,
        order_status: 'Processing',
        payment_status: 'Paid',
        payment_method: 'Card',
        shippingAddress: { name: 'Priya Verma', address: '15B, Koramangala', city: 'Bangalore', state: 'Karnataka', pincode: '560034', phone: '+91 9812345678' },
        tracking: {},
        createdAt: '2026-03-02T08:15:00Z',
        updatedAt: '2026-03-02T08:15:00Z',
    },
    {
        _id: '3',
        orderId: 'EB-ORD-20260228-003',
        user: { _id: 'u3', name: 'Amit Patel', email: 'amit@example.com', phone: '+91 9900112233' },
        seller: { _id: 's1', businessName: 'Divine Crystals Shop' },
        items: [
            { _id: 'i4', product: { name: 'Navratna Pendant', image: '', price: 8499 }, quantity: 1, price: 8499, status: 'Delivered' },
        ],
        totalAmount: 8499,
        shippingCharge: 149,
        discount: 0,
        finalAmount: 8648,
        order_status: 'Delivered',
        payment_status: 'Paid',
        payment_method: 'Online',
        shippingAddress: { name: 'Amit Patel', address: '203, Ambawadi Complex', city: 'Ahmedabad', state: 'Gujarat', pincode: '380006', phone: '+91 9900112233' },
        tracking: { trackingId: 'BL9876543210', courier: 'BlueDart', estimatedDelivery: '2026-03-04' },
        createdAt: '2026-02-28T16:45:00Z',
        updatedAt: '2026-03-04T11:30:00Z',
    },
    {
        _id: '4',
        orderId: 'EB-ORD-20260303-004',
        user: { _id: 'u4', name: 'Sneha Gupta', email: 'sneha@example.com', phone: '+91 9988776655' },
        seller: { _id: 's3', businessName: 'Vedic Store India' },
        items: [
            { _id: 'i5', product: { name: 'Puja Samagri Kit', image: '', price: 599 }, quantity: 3, price: 1797, status: 'Pending' },
            { _id: 'i6', product: { name: 'Brass Diya Set', image: '', price: 349 }, quantity: 2, price: 698, status: 'Pending' },
        ],
        totalAmount: 2495,
        shippingCharge: 49,
        discount: 100,
        finalAmount: 2444,
        order_status: 'Pending',
        payment_status: 'Paid',
        payment_method: 'Wallet',
        shippingAddress: { name: 'Sneha Gupta', address: '78, Civil Lines', city: 'Jaipur', state: 'Rajasthan', pincode: '302006', phone: '+91 9988776655' },
        tracking: {},
        createdAt: '2026-03-03T12:00:00Z',
        updatedAt: '2026-03-03T12:00:00Z',
    },
    {
        _id: '5',
        orderId: 'EB-ORD-20260225-005',
        user: { _id: 'u5', name: 'Karan Singh', email: 'karan@example.com', phone: '+91 9871234567' },
        seller: { _id: 's2', businessName: 'Astro Gems Palace' },
        items: [
            { _id: 'i7', product: { name: 'Emerald Stone (3 Carat)', image: '', price: 25000 }, quantity: 1, price: 25000, status: 'Cancelled' },
        ],
        totalAmount: 25000,
        shippingCharge: 0,
        discount: 1000,
        finalAmount: 24000,
        order_status: 'Cancelled',
        payment_status: 'Refunded',
        payment_method: 'UPI',
        shippingAddress: { name: 'Karan Singh', address: '22, Sector 15', city: 'Chandigarh', state: 'Punjab', pincode: '160015', phone: '+91 9871234567' },
        tracking: {},
        cancelledBy: 'User',
        cancellationReason: 'Changed my mind after consulting another astrologer',
        refundAmount: 24000,
        createdAt: '2026-02-25T09:00:00Z',
        updatedAt: '2026-02-27T15:30:00Z',
    },
    {
        _id: '6',
        orderId: 'EB-ORD-20260304-006',
        user: { _id: 'u6', name: 'Megha Joshi', email: 'megha@example.com', phone: '+91 9823456789' },
        seller: { _id: 's1', businessName: 'Divine Crystals Shop' },
        items: [
            { _id: 'i8', product: { name: 'Amethyst Bracelet', image: '', price: 1999 }, quantity: 1, price: 1999, status: 'Refund Initiated' },
        ],
        totalAmount: 1999,
        shippingCharge: 79,
        discount: 0,
        finalAmount: 2078,
        order_status: 'Refund Initiated',
        payment_status: 'Pending',
        payment_method: 'COD',
        shippingAddress: { name: 'Megha Joshi', address: '12, Deccan Gymkhana', city: 'Pune', state: 'Maharashtra', pincode: '411004', phone: '+91 9823456789' },
        tracking: {},
        cancellationReason: 'Product arrived damaged',
        refundAmount: 2078,
        createdAt: '2026-03-04T07:45:00Z',
        updatedAt: '2026-03-05T10:00:00Z',
    },
];

export const ORDER_STATUSES = [
    'Pending',
    'Confirmed',
    'Processing',
    'Packed',
    'Shipped',
    'Out for Delivery',
    'Delivered',
    'Cancelled',
    'Refund Initiated',
    'Refunded',
    'Failed',
] as const;
