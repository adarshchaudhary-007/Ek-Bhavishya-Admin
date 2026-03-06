'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Star,
  ShoppingCart,
  Heart,
  Truck,
  Shield,
  RotateCcw,
  ArrowLeft,
  Minus,
  Plus,
  Check,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';

const productDB: Record<string, {
  id: string; name: string; category: string; price: number; originalPrice: number;
  rating: number; reviews: number; image: string; seller: string; inStock: boolean;
  description: string; weight: string; origin: string; certification: string;
  benefits: string[]; images: string[];
  reviewsList: { name: string; rating: number; text: string; date: string }[];
}> = {
  p1: {
    id: 'p1', name: 'Natural Blue Sapphire (Neelam)', category: 'Gemstones', price: 8500, originalPrice: 12000,
    rating: 4.8, reviews: 124, image: '💎', seller: 'Gem Palace', inStock: true,
    description: 'A premium quality natural Blue Sapphire (Neelam) stone, ideal for Saturn (Shani) related astrological remedies. Certified by GRS laboratory. This stone helps in enhancing career prospects, improving focus, and bringing discipline.',
    weight: '3.2 carats', origin: 'Sri Lanka (Ceylon)', certification: 'GRS Certified',
    benefits: ['Career growth & success', 'Protection from evil eye', 'Enhanced mental clarity', 'Wealth accumulation', 'Saturn pacification'],
    images: ['💎', '💎', '💎', '💎'],
    reviewsList: [
      { name: 'Ankit M.', rating: 5, text: 'Excellent quality sapphire. Noticed positive changes within weeks.', date: '2 days ago' },
      { name: 'Priya S.', rating: 4, text: 'Good quality stone. Delivery was on time. Packaging could be better.', date: '1 week ago' },
      { name: 'Raj K.', rating: 5, text: 'Authentic stone with proper certification. Very happy with purchase.', date: '2 weeks ago' },
    ],
  },
};

const defaultProduct = {
  id: 'default', name: 'Natural Blue Sapphire (Neelam)', category: 'Gemstones', price: 8500, originalPrice: 12000,
  rating: 4.8, reviews: 124, image: '💎', seller: 'Gem Palace', inStock: true,
  description: 'A premium quality natural Blue Sapphire (Neelam) stone, ideal for Saturn (Shani) related astrological remedies. Certified by GRS laboratory.',
  weight: '3.2 carats', origin: 'Sri Lanka (Ceylon)', certification: 'GRS Certified',
  benefits: ['Career growth', 'Protection from evil eye', 'Mental clarity', 'Wealth accumulation'],
  images: ['💎', '💎', '💎', '💎'],
  reviewsList: [
    { name: 'Ankit M.', rating: 5, text: 'Excellent quality sapphire.', date: '2 days ago' },
    { name: 'Priya S.', rating: 4, text: 'Good quality stone.', date: '1 week ago' },
  ],
};

export default function ProductDetailPage() {
  const { productId } = useParams();
  const router = useRouter();
  const product = productDB[productId as string] || defaultProduct;
  const [qty, setQty] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const addToCart = () => {
    toast.success(`${product.name} x${qty} added to your cart`);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <Button variant="ghost" size="sm" onClick={() => router.push('/shop')}>
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Shop
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Images */}
        <div className="space-y-4">
          <div className="bg-muted/30 rounded-2xl p-12 flex items-center justify-center border border-border">
            <span className="text-8xl">{product.images[selectedImage]}</span>
          </div>
          <div className="flex gap-2">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={`w-16 h-16 rounded-lg border-2 flex items-center justify-center text-2xl bg-muted/30 transition-colors ${
                  selectedImage === i ? 'border-primary' : 'border-border'
                }`}
              >
                {img}
              </button>
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="space-y-4">
          <div>
            <Badge variant="outline" className="mb-2">
              {product.category}
            </Badge>
            <h1 className="text-2xl font-bold">{product.name}</h1>
            <p className="text-sm text-muted-foreground mt-1">by {product.seller}</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`w-4 h-4 ${
                    s <= Math.round(product.rating)
                      ? 'fill-yellow-500 text-yellow-500'
                      : 'text-muted-foreground'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-medium">{product.rating}</span>
            <span className="text-sm text-muted-foreground">({product.reviews} reviews)</span>
          </div>

          <div className="flex items-end gap-3">
            <span className="text-3xl font-bold">₹{product.price.toLocaleString()}</span>
            <span className="text-lg text-muted-foreground line-through">
              ₹{product.originalPrice.toLocaleString()}
            </span>
            <Badge className="bg-green-500/10 text-green-600 border-green-500/30">
              {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
            </Badge>
          </div>

          <Separator />

          <p className="text-muted-foreground text-sm">{product.description}</p>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-2 rounded-lg border border-border">
              <p className="text-xs text-muted-foreground">Weight</p>
              <p className="text-sm font-medium">{product.weight}</p>
            </div>
            <div className="p-2 rounded-lg border border-border">
              <p className="text-xs text-muted-foreground">Origin</p>
              <p className="text-sm font-medium">{product.origin}</p>
            </div>
            <div className="p-2 rounded-lg border border-border">
              <p className="text-xs text-muted-foreground">Certified</p>
              <p className="text-sm font-medium">{product.certification}</p>
            </div>
          </div>

          {/* Quantity */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Quantity:</span>
            <div className="flex items-center border border-border rounded-lg">
              <button
                className="p-2 hover:bg-muted transition-colors"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-4 font-medium">{qty}</span>
              <button
                className="p-2 hover:bg-muted transition-colors"
                onClick={() => setQty((q) => q + 1)}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
              size="lg"
              onClick={addToCart}
            >
              <ShoppingCart className="w-4 h-4 mr-2" /> Add to Cart
            </Button>
            <Button variant="outline" size="lg" onClick={() => setIsWishlisted(!isWishlisted)}>
              <Heart
                className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`}
              />
            </Button>
          </div>

          {/* Trust */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { icon: Truck, text: 'Free Shipping' },
              { icon: Shield, text: 'Certified Genuine' },
              { icon: RotateCcw, text: '7-Day Returns' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Icon className="w-3.5 h-3.5 text-primary" /> {text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="benefits">
        <TabsList>
          <TabsTrigger value="benefits">Benefits</TabsTrigger>
          <TabsTrigger value="reviews">Reviews ({product.reviews})</TabsTrigger>
        </TabsList>
        <TabsContent value="benefits" className="mt-4">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-3">Astrological Benefits</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {product.benefits.map((b) => (
                  <div key={b} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500" /> {b}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reviews" className="mt-4">
          <Card>
            <CardContent className="p-6 space-y-4">
              {product.reviewsList.map((r, i) => (
                <div
                  key={i}
                  className="flex gap-3 pb-4 border-b border-border last:border-0 last:pb-0"
                >
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="text-xs">{r.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{r.name}</span>
                      <span className="text-xs text-muted-foreground">{r.date}</span>
                    </div>
                    <div className="flex gap-0.5 my-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3 h-3 ${
                            s <= r.rating
                              ? 'fill-yellow-500 text-yellow-500'
                              : 'text-muted-foreground'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">{r.text}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
