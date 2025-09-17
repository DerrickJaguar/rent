import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Payment, Tenant } from '@/types';
import { format } from 'date-fns';

interface RecentActivityProps {
  payments: Payment[];
  tenants: Tenant[];
}

export function RecentActivity({ payments, tenants }: RecentActivityProps) {
  const recentPayments = payments
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const getTenantName = (tenantId: string) => {
    const tenant = tenants.find(t => t.id === tenantId);
    return tenant?.fullName || 'Unknown Tenant';
  };

  const getStatusColor = (status: Payment['status']) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'partial':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Payments</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentPayments.length === 0 ? (
            <p className="text-sm text-gray-500">No recent payments</p>
          ) : (
            recentPayments.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    {getTenantName(payment.tenantId)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {format(new Date(payment.paymentDate), 'MMM dd, yyyy')}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    ${payment.amount.toLocaleString()}
                  </span>
                  <Badge className={getStatusColor(payment.status)}>
                    {payment.status}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}