import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Users, DollarSign, AlertTriangle } from 'lucide-react';
import { Property, Tenant, Payment } from '@/types';

interface StatsCardsProps {
  properties: Property[];
  tenants: Tenant[];
  payments: Payment[];
}

export function StatsCards({ properties, tenants, payments }: StatsCardsProps) {
  const totalProperties = properties.length;
  const occupiedProperties = properties.filter(p => !p.isAvailable).length;
  const activeTenants = tenants.filter(t => t.isActive).length;
  const occupancyRate = totalProperties > 0 ? (occupiedProperties / totalProperties) * 100 : 0;

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyIncome = payments
    .filter(p => {
      const paymentDate = new Date(p.paymentDate);
      return paymentDate.getMonth() === currentMonth && 
             paymentDate.getFullYear() === currentYear &&
             p.status === 'paid';
    })
    .reduce((sum, p) => sum + p.amount, 0);

  const overduePayments = payments.filter(p => p.status === 'overdue').length;

  const stats = [
    {
      title: 'Total Properties',
      value: totalProperties,
      icon: Building2,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Active Tenants',
      value: activeTenants,
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Monthly Income',
      value: `$${monthlyIncome.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100',
    },
    {
      title: 'Overdue Payments',
      value: overduePayments,
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${stat.bgColor}`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              {stat.title === 'Total Properties' && (
                <p className="text-xs text-gray-500 mt-1">
                  {occupancyRate.toFixed(1)}% occupancy rate
                </p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}