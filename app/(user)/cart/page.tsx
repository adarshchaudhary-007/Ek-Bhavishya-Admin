'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Minus, Plus, ShoppingBag, ArrowLeft, Tag, Truck, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

const initialCartItems = [
  { id: 'p1', name: 'Natural Blue Sapphire (Neelam)', price: 8500, originalPrice: 12000, qty: 1, image: '💎', seller: 'Gem Palace' },
  { id: 'p4', name: 'Tiger Eye Crystal Bracelet', price: 650, originalPrice: 999, qty: 2, image: '🧿', seller: 'Crystal World' },
  { id: 'p7', name: 'Ganesh Puja Complete Kit', price: 899, originalPrice: 1299, qty: 1, image: '🪔', seller: 'Pooja Bhandar' },
];

export default function CartPage() {
  const router = useRouter();
  const [items, setItems] = useState(initialCartItems);
  const [coupon, setCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);

  const updateQty = (id: string, delta: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
      )
    );
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    toast.success('Item removed from cart');
  };

  const applyCoupon = () => {
    if (coupon.toLowerCase() === 'astro10') {
      setCouponApplied(true);
      toast.success('10% discount applied to your order');
    } else {
      toast.error('Please enter a valid coupon code');
    }
  };

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const savings = items.reduce((s, i) => s + (i.originalPrice - i.price) * i.qty, 0);
  const discount = couponApplied ? Math.round(subtotal * 0.1) : 0;
  const shipping = subtotal > 5000 ? 0 : 99;
  const total = subtotal - discount + shipping;

  if (items.length === 0) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="text-center py-20">
          <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">Add some cosmic items to your cart!</p>
          <Button onClick={() => router.push('/shop')} className="bg-emerald-600 hover:bg-emerald-700 text-white">
            Browse Shop
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Shopping Cart</h1>
          <p className="text-muted-foreground text-sm">
            {items.length} item{items.length > 1 ? 's' : ''} in your cart
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={() => router.push('/shop')}>
          <ArrowLeft className="w-4 h-4 mr-1" /> Continue Shopping
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div
                    className="w-20 h-20 rounded-xl bg-muted/30 flex items-center justify-center text-3xl shrink-0 cursor-pointer"
                    onClick={() => router.push(`/shop/${item.id}`)}
                  >
                    {item.image}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="font-medium text-sm line-clamp-1 cursor-pointer hover:text-primary"
                      onClick={() => router.push(`/shop/${item.id}`)}
                    >
                      {item.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{item.seller}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-bold">₹{item.price.toLocaleString()}</span>
                      <span className="text-xs text-muted-foreground line-through">
                        ₹{item.originalPrice.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-border rounded-lg">
                        <button
                          className="p-1.5 hover:bg-muted transition-colors"
                          onClick={() => updateQty(item.id, -1)}
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-sm font-medium">{item.qty}</span>
                        <button
                          className="p-1.5 hover:bg-muted transition-colors"
                          onClick={() => updateQty(item.id, 1)}
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <button
                        className="text-red-500 hover:text-red-600 p-1"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold">₹{(item.price * item.qty).toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-green-500">
                <span>Savings</span>
                <span>-₹{savings.toLocaleString()}</span>
              </div>
              {couponApplied && (
                <div className="flex justify-between text-sm text-green-500">
                  <span>Coupon (ASTRO10)</span>
                  <span>-₹{discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span>
                  {shipping === 0 ? (
                    <Badge variant="secondary" className="text-green-600 text-xs">
                      FREE
                    </Badge>
                  ) : (
                    `₹${shipping}`
                  )}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>₹{total.toLocaleString()}</span>
              </div>

              {/* Coupon */}
              {!couponApplied && (
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Coupon code"
                      className="pl-10"
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" onClick={applyCoupon}>
                    Apply
                  </Button>
                </div>
              )}

              <p className="text-xs text-muted-foreground">
                Try: <code className="bg-muted px-1 rounded">ASTRO10</code> for 10% off
              </p>

              <Button
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                size="lg"
                onClick={() => toast.info('Checkout coming soon!')}
              >
                Proceed to Checkout
              </Button>

              <div className="space-y-2 pt-2">
                {[
                  { icon: Truck, text: 'Free shipping on orders above ₹5,000' },
                  { icon: Shield, text: 'Secure payment & certified products' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Icon className="w-3.5 h-3.5 text-primary shrink-0" /> {text}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
