import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"

interface RecentSalesProps {
    data?: any[];
}

export function RecentSales({ data = [] }: RecentSalesProps) {
    if (!data || data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-10 text-muted-foreground italic text-sm">
                No recent transactions found
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {data.map((sale) => (
                <div key={sale.id} className="flex items-center">
                    <Avatar className="h-9 w-9 border border-emerald-100 shadow-sm">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${sale.name}`} alt="Avatar" />
                        <AvatarFallback className="bg-emerald-50 text-emerald-700 font-bold">
                            {sale.name?.substring(0, 2).toUpperCase() || 'CU'}
                        </AvatarFallback>
                    </Avatar>
                    <div className="ml-4 space-y-1">
                        <p className="text-sm font-bold leading-none text-emerald-950">{sale.name}</p>
                        <p className="text-xs text-muted-foreground font-medium">
                            {sale.email}
                        </p>
                    </div>
                    <div className="ml-auto font-black text-emerald-600">
                        +₹{sale.amount.toLocaleString()}
                    </div>
                </div>
            ))}
        </div>
    )
}
