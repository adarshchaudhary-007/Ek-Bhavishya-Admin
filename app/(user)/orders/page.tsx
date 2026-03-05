'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function OrdersPage() {
  const orders = [
    {
      id: 'ORD-001',
      date: '2024-03-05',
      product: 'Ruby Gemstone Ring',
      amount: 2499,
      status: 'delivered',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
          Orders
        </h1>
        <p className="text-slate-600 dark:text-slate-300">Your shopping history</p>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12 text-slate-500">
            No orders yet
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{order.product}</p>
                    <p className="text-sm text-slate-500">{order.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">₹{order.amount}</p>
                    <Badge className="mt-2">
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
