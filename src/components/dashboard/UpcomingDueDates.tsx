import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, AlertTriangle } from 'lucide-react';
import { Tenant, Property } from '@/types';
import { format, differenceInDays, addDays } from 'date-fns';

interface UpcomingDueDatesProps {
  tenants: Tenant[];
  properties: Property[];
}

export default function UpcomingDueDates({ tenants, properties }: UpcomingDueDatesProps) {
  const today = new Date();
  const thirtyDaysFromNow = addDays(today, 30);

  // Get upcoming rent due dates (assuming rent is due on the 1st of each month)
  const upcomingRentDates = tenants
    .filter(tenant => tenant.isActive)
    .map(tenant => {
      const property = properties.find(p => p.id === tenant.propertyId);
      const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
      const daysUntilDue = differenceInDays(nextMonth, today);
      
      return {
        id: tenant.id,
        type: 'rent' as const,
        tenant: `${tenant.firstName} ${tenant.lastName}`,
        property: property ? `${property.address}, ${property.city}` : 'Unknown Property',
        amount: tenant.rentAmount,
        dueDate: nextMonth,
        daysUntilDue,
        isOverdue: daysUntilDue < 0,
        isUrgent: daysUntilDue <= 7 && daysUntilDue >= 0,
      };
    });

  // Get upcoming lease expiries
  const upcomingLeaseExpiries = tenants
    .filter(tenant => tenant.isActive && tenant.leaseEndDate <= thirtyDaysFromNow)
    .map(tenant => {
      const property = properties.find(p => p.id === tenant.propertyId);
      const daysUntilExpiry = differenceInDays(tenant.leaseEndDate, today);
      
      return {
        id: tenant.id,
        type: 'lease' as const,
        tenant: `${tenant.firstName} ${tenant.lastName}`,
        property: property ? `${property.address}, ${property.city}` : 'Unknown Property',
        dueDate: tenant.leaseEndDate,
        daysUntilExpiry,
        isExpired: daysUntilExpiry < 0,
        isUrgent: daysUntilExpiry <= 14 && daysUntilExpiry >= 0,
      };
    });

  // Combine and sort all upcoming items
  const allUpcomingItems = [
    ...upcomingRentDates.map(item => ({
      ...item,
      sortDate: item.dueDate,
      displayType: 'Rent Payment',
    })),
    ...upcomingLeaseExpiries.map(item => ({
      ...item,
      sortDate: item.dueDate,
      displayType: 'Lease Expiry',
    })),
  ].sort((a, b) => a.sortDate.getTime() - b.sortDate.getTime());

  const getStatusBadge = (item: typeof allUpcomingItems[0]) => {
    if (item.type === 'rent') {
      if (item.isOverdue) {
        return <Badge className="bg-red-100 text-red-800">Overdue</Badge>;
      }
      if (item.isUrgent) {
        return <Badge className="bg-orange-100 text-orange-800">Due Soon</Badge>;
      }
      return <Badge className="bg-blue-100 text-blue-800">Upcoming</Badge>;
    } else {
      if (item.isExpired) {
        return <Badge className="bg-red-100 text-red-800">Expired</Badge>;
      }
      if (item.isUrgent) {
        return <Badge className="bg-yellow-100 text-yellow-800">Expiring Soon</Badge>;
      }
      return <Badge className="bg-green-100 text-green-800">Active</Badge>;
    }
  };

  const getIcon = (item: typeof allUpcomingItems[0]) => {
    if (item.type === 'rent') {
      return item.isOverdue || item.isUrgent ? 
        <AlertTriangle className="h-4 w-4 text-orange-500" /> : 
        <Calendar className="h-4 w-4 text-blue-500" />;
    } else {
      return item.isExpired || item.isUrgent ? 
        <AlertTriangle className="h-4 w-4 text-red-500" /> : 
        <Clock className="h-4 w-4 text-green-500" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="mr-2 h-5 w-5" />
          Upcoming Due Dates
        </CardTitle>
        <CardDescription>
          Rent payments and lease expiries in the next 30 days
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {allUpcomingItems.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p>No upcoming due dates in the next 30 days</p>
            </div>
          ) : (
            allUpcomingItems.slice(0, 8).map((item, index) => (
              <div key={`${item.type}-${item.id}-${index}`} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-start space-x-3">
                  {getIcon(item)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <p className="text-sm font-medium text-gray-900">{item.displayType}</p>
                      {getStatusBadge(item)}
                    </div>
                    <p className="text-sm text-gray-600 truncate">{item.tenant}</p>
                    <p className="text-xs text-gray-500 truncate">{item.property}</p>
                    {item.type === 'rent' && (
                      <p className="text-sm font-semibold text-green-600">
                        ${item.amount?.toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">
                    {format(item.sortDate, 'MMM dd')}
                  </p>
                  <p className="text-xs text-gray-500">
                    {item.type === 'rent' 
                      ? `${Math.abs(item.daysUntilDue)} days ${item.daysUntilDue < 0 ? 'overdue' : 'left'}`
                      : `${Math.abs(item.daysUntilExpiry)} days ${item.daysUntilExpiry < 0 ? 'expired' : 'left'}`
                    }
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}