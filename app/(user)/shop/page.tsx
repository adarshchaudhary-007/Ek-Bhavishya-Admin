'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart } from 'lucide-react';

export default function ShopPage() {
  const products = [
    { id: 1, name: 'Gemstone Ring (Ruby)', price: 2499, rating: 4.8 },
    { id: 2, name: 'Gemstone Ring (Emerald)', price: 1999, rating: 4.6 },
    { id: 3, name: 'Astrology Book Bundle', price: 599, rating: 4.9 },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
          Shop
        </h1>
        <p className="text-slate-600 dark:text-slate-300">Explore our collection of astrology products</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="hover:shadow-lg transition-shadow">
            <div className="bg-linear-to-r from-amber-500 to-orange-600 h-40 flex items-center justify-center text-white text-4xl">
              💎
            </div>
            <CardHeader>
              <CardTitle className="text-lg">{product.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Badge variant="outline">⭐ {product.rating}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-emerald-600">₹{product.price}</span>
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                  <ShoppingCart size={16} className="mr-1" />
                  Add
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
