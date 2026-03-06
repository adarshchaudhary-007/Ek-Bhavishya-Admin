'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Plus, History, TrendingUp, TrendingDown, Wallet, Gift } from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAddWalletMoney, useWalletSummary, useWalletTransactions } from '@/lib/hooks/use-user-app';
import { WalletTransaction } from '@/types';

export default function WalletPage() {
  const [isAddMoneyOpen, setIsAddMoneyOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [filterType, setFilterType] = useState('all');
  const { data: wallet, isLoading: isWalletLoading } = useWalletSummary();
  const { data: transactions = [], isLoading: isTransactionsLoading } = useWalletTransactions();
  const addWalletMoneyMutation = useAddWalletMoney();

  const handleAddMoney = async () => {
    const parsed = Number(amount);
    if (!parsed || Number.isNaN(parsed)) return;
    await addWalletMoneyMutation.mutateAsync(parsed);
    setAmount('');
    setIsAddMoneyOpen(false);
  };

  const quickAmounts = [100, 500, 1000, 5000];
  const filteredTransactions = transactions.filter((t: WalletTransaction) =>
    filterType === 'all' || t.type === filterType
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Wallet className="w-8 h-8 text-emerald-600" />
          <h1 className="text-3xl font-bold text-gray-900">Your Wallet</h1>
        </div>
        <p className="text-gray-600">Manage your balance and transactions</p>
      </div>

      {/* Main Balance Card */}
      <Card className="overflow-hidden border-0 bg-gradient-to-br from-emerald-500 via-emerald-600 to-green-600 text-white shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-8">
            <div>
              <p className="text-emerald-100 text-sm font-medium mb-2">Available Balance</p>
              <div className="text-5xl font-bold">₹{(wallet?.balance ?? 0).toLocaleString()}</div>
              <p className="text-emerald-100 text-sm mt-2">Ready to spend on astrology services</p>
            </div>
            <CreditCard className="w-12 h-12 text-emerald-200" />
          </div>

          {/* Quick Action Buttons */}
          <div className="flex gap-3 flex-wrap">
            <Dialog open={isAddMoneyOpen} onOpenChange={setIsAddMoneyOpen}>
              <DialogTrigger asChild>
                <Button className="bg-white text-emerald-600 hover:bg-emerald-50 font-medium">
                  <Plus size={20} className="mr-2" />
                  Add Money
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add Money to Wallet</DialogTitle>
                  <DialogDescription>
                    Choose an amount or enter a custom amount to add to your wallet
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  {/* Quick Amount Buttons */}
                  <div className="grid grid-cols-4 gap-2">
                    {quickAmounts.map(amt => (
                      <Button
                        key={amt}
                        onClick={() => setAmount(String(amt))}
                        variant={amount === String(amt) ? 'default' : 'outline'}
                        className="text-sm"
                      >
                        ₹{amt / 1000 >= 1 ? `${amt / 1000}K` : amt}
                      </Button>
                    ))}
                  </div>

                  {/* Custom Amount */}
                  <div>
                    <Label htmlFor="amount" className="text-sm font-medium">Custom Amount (₹)</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="Enter amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      min="0"
                      step="10"
                      className="mt-2"
                    />
                  </div>

                  <Button
                    onClick={handleAddMoney}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
                    disabled={!amount || Number.isNaN(Number(amount)) || addWalletMoneyMutation.isPending}
                  >
                    {addWalletMoneyMutation.isPending ? 'Processing...' : 'Proceed to Payment'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <Button variant="outline" className="text-white border-white hover:bg-white/20 font-medium">
              <History size={20} className="mr-2" />
              View History
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-emerald-600">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-red-600" />
              Total Spent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-600">₹{(wallet?.totalSpent ?? 0).toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">Last 30 days</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-600">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              Total Added
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">₹{(wallet?.totalAdded ?? 0).toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">All time</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-600">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Gift className="w-4 h-4 text-blue-600" />
              Pending Refunds
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">₹{(wallet?.pendingRefunds ?? 0).toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">In processing</p>
          </CardContent>
        </Card>
      </div>

      {/* Transaction History */}
      <Card>
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>All your wallet transactions</CardDescription>
            </div>
            <History className="w-5 h-5 text-gray-400" />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {/* Filter Tabs */}
          <div className="flex gap-2 p-4 border-b bg-gray-50">
            {['all', 'credit', 'debit'].map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  filterType === type
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                }`}
              >
                {type === 'all' ? 'All' : type === 'credit' ? 'Added' : 'Spent'}
              </button>
            ))}
          </div>

          {/* Transactions List */}
          <div className="divide-y">
            {isWalletLoading || isTransactionsLoading ? (
              <div className="text-center py-12 text-gray-500">
                <Wallet className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p>Loading wallet data...</p>
              </div>
            ) : filteredTransactions.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <CreditCard className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p>No {filterType !== 'all' ? filterType : ''} transactions found</p>
              </div>
            ) : (
              filteredTransactions.map((transaction: WalletTransaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    {/* Icon */}
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg text-white ${
                        transaction.type === 'credit'
                          ? 'bg-green-100 text-green-600'
                          : 'bg-red-100 text-red-600'
                      }`}
                    >
                      {transaction.type === 'credit' ? '+' : '-'}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm">{transaction.description}</p>
                      <p className="text-xs text-gray-500 mt-1">{transaction.date}</p>
                    </div>
                  </div>

                  {/* Amount & Status */}
                  <div className="text-right">
                    <p
                      className={`font-bold text-sm ${
                        transaction.type === 'credit'
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      {transaction.type === 'credit' ? '+' : '-'}₹{Math.abs(transaction.amount).toLocaleString()}
                    </p>
                    <Badge
                      variant={
                        transaction.status === 'completed' ? 'default' : 'secondary'
                      }
                      className="text-xs mt-2 bg-blue-100 text-blue-700 border-0"
                    >
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
          Wallet
        </h1>
        <p className="text-slate-600 dark:text-slate-300">Manage your account balance</p>
      </div>

      {/* Balance Card */}
      <Card className="mb-8 bg-linear-to-r from-emerald-500 to-green-600 text-white border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard size={24} />
            Available Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="text-5xl font-bold mb-2">₹{wallet?.balance ?? 0}</div>
            <p className="text-emerald-100">Ready to spend</p>
          </div>
          <div className="flex gap-4">
            <Dialog open={isAddMoneyOpen} onOpenChange={setIsAddMoneyOpen}>
              <DialogTrigger asChild>
                <Button className="bg-white text-emerald-600 hover:bg-slate-100">
                  <Plus size={20} className="mr-2" />
                  Add Money
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Money to Wallet</DialogTitle>
                  <DialogDescription>
                    Enter the amount you want to add to your wallet
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="amount">Amount (₹)</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="100"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      min="0"
                      step="10"
                    />
                  </div>
                  <Button
                    onClick={handleAddMoney}
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                    disabled={!amount || Number.isNaN(Number(amount)) || addWalletMoneyMutation.isPending}
                  >
                    Proceed to Payment
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <Button variant="outline" className="text-white border-white hover:bg-white/10">
              <History size={20} className="mr-2" />
              View History
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-slate-600 dark:text-slate-300">
              Total Spent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">₹{wallet?.totalSpent ?? 0}</div>
            <p className="text-xs text-slate-500 mt-1">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-slate-600 dark:text-slate-300">
              Total Added
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">₹{wallet?.totalAdded ?? 0}</div>
            <p className="text-xs text-slate-500 mt-1">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-slate-600 dark:text-slate-300">
              Pending Refunds
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">₹{wallet?.pendingRefunds ?? 0}</div>
            <p className="text-xs text-slate-500 mt-1">None</p>
          </CardContent>
        </Card>
      </div>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>All your wallet transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isWalletLoading || isTransactionsLoading ? (
              <div className="text-center py-8 text-slate-500">Loading wallet data...</div>
            ) : transactions.length === 0 ? (
              <div className="text-center py-8 text-slate-500">No transactions found.</div>
            ) : transactions.map((transaction: WalletTransaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${
                      transaction.type === 'credit'
                        ? 'bg-green-600'
                        : 'bg-red-600'
                    }`}
                  >
                    {transaction.type === 'credit' ? '+' : '-'}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{transaction.description}</p>
                    <p className="text-xs text-slate-500">{transaction.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`font-bold text-sm ${
                      transaction.type === 'credit'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {transaction.type === 'credit' ? '+' : ''}₹{Math.abs(transaction.amount)}
                  </p>
                  <Badge
                    variant={
                      transaction.status === 'completed' ? 'default' : 'secondary'
                    }
                    className="text-xs mt-1"
                  >
                    {transaction.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
