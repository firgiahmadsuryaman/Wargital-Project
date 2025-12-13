
import { format, parseISO } from 'date-fns';
import type { Order } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

type OrderStatusCardProps = {
  order: Order;
};

const statusMap: Record<Order['status'], { value: number; label: string; color: string }> = {
    'Menyiapkan': { value: 33, label: 'Menyiapkan', color: 'bg-yellow-500' },
    'Dalam perjalanan': { value: 66, label: 'Dalam Perjalanan', color: 'bg-blue-500' },
    'Terkirim': { value: 100, label: 'Terkirim', color: 'bg-green-500' },
};

export default function OrderStatusCard({ order }: OrderStatusCardProps) {
  const statusInfo = statusMap[order.status];
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(price);
  };

  const itemSummary = order.items.map(item => `${item.quantity}x ${item.name}`).join(', ');

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl font-bold font-headline">{order.restaurantName}</CardTitle>
          <p className="text-sm text-muted-foreground">ID Pesanan: {order.id}</p>
        </div>
        <Badge variant={order.status === 'Terkirim' ? 'secondary' : 'default'} className="whitespace-nowrap">
          {statusInfo.label}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
            <p className="text-sm font-medium">Item:</p>
            <p className="text-sm text-muted-foreground truncate">{itemSummary}</p>
        </div>
        <div className="space-y-2">
            <Progress value={statusInfo.value} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
                <span>Pesanan Dibuat</span>
                <span>Di Dapur</span>
                <span>Dalam Pengiriman</span>
                <span>Terkirim</span>
            </div>
        </div>
      </CardContent>
      <CardFooter className="bg-muted/50 p-4 flex justify-between items-center text-sm">
        <div>
          <span className="text-muted-foreground">Dipesan pada: </span>
          <span className="font-medium">{format(parseISO(order.orderDate), "d MMM yyyy, h:mm a")}</span>
        </div>
        <div>
            <span className="text-muted-foreground">Total: </span>
            <span className="font-bold text-base text-primary">{formatPrice(order.total)}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
