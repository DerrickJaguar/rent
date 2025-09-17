import { StatsCards } from '@/components/dashboard/StatsCards';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import UpcomingDueDates from '@/components/dashboard/UpcomingDueDates';
import { storage } from '@/lib/storage';
import { useState, useEffect } from 'react';
import { Property, Tenant, Payment } from '@/types';

export default function Dashboard() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);

  useEffect(() => {
    setProperties(storage.getProperties());
    setTenants(storage.getTenants());
    setPayments(storage.getPayments());
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      </div>
      
      <StatsCards 
        properties={properties}
        tenants={tenants}
        payments={payments}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity payments={payments} tenants={tenants} />
        <UpcomingDueDates tenants={tenants} properties={properties} />
      </div>
    </div>
  );
}