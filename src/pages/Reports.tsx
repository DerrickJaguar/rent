import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Download, TrendingUp, Building2, Users, DollarSign } from 'lucide-react';
import { Property, Tenant, Payment } from '@/types';
import { storage } from '@/lib/storage';
import { format, subMonths, startOfMonth, endOfMonth, isSameMonth } from 'date-fns';

export default function Reports() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [reportPeriod, setReportPeriod] = useState('12months');

  useEffect(() => {
    setProperties(storage.getProperties());
    setTenants(storage.getTenants());
    setPayments(storage.getPayments());
  }, []);

  // Generate monthly income data
  const generateIncomeData = () => {
    const months = parseInt(reportPeriod.replace('months', '')) || 12;
    const data = [];
    
    for (let i = months - 1; i >= 0; i--) {
      const month = subMonths(new Date(), i);
      const monthStart = startOfMonth(month);
      const monthEnd = endOfMonth(month);
      
      const monthlyIncome = payments
        .filter(p => {
          const paymentDate = new Date(p.paymentDate);
          return paymentDate >= monthStart && paymentDate <= monthEnd && p.status === 'paid';
        })
        .reduce((sum, p) => sum + p.amount, 0);
      
      data.push({
        month: format(month, 'MMM yyyy'),
        income: monthlyIncome,
        shortMonth: format(month, 'MMM'),
      });
    }
    
    return data;
  };

  // Generate occupancy data
  const generateOccupancyData = () => {
    const occupiedProperties = properties.filter(p => !p.isAvailable).length;
    const availableProperties = properties.filter(p => p.isAvailable).length;
    
    return [
      { name: 'Occupied', value: occupiedProperties, color: '#3b82f6' },
      { name: 'Available', value: availableProperties, color: '#e5e7eb' },
    ];
  };

  // Generate property type data
  const generatePropertyTypeData = () => {
    const typeCount = properties.reduce((acc, property) => {
      acc[property.type] = (acc[property.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(typeCount).map(([type, count]) => ({
      type: type.charAt(0).toUpperCase() + type.slice(1),
      count,
      income: properties
        .filter(p => p.type === type && !p.isAvailable)
        .reduce((sum, p) => sum + p.rentAmount, 0),
    }));
  };

  const incomeData = generateIncomeData();
  const occupancyData = generateOccupancyData();
  const propertyTypeData = generatePropertyTypeData();

  const totalIncome = incomeData.reduce((sum, item) => sum + item.income, 0);
  const averageMonthlyIncome = totalIncome / incomeData.length;
  const occupancyRate = properties.length > 0 ? ((properties.length - properties.filter(p => p.isAvailable).length) / properties.length) * 100 : 0;

  const exportReport = () => {
    const reportData = {
      period: reportPeriod,
      generatedAt: new Date().toISOString(),
      summary: {
        totalProperties: properties.length,
        occupiedProperties: properties.filter(p => !p.isAvailable).length,
        activeTenants: tenants.filter(t => t.isActive).length,
        totalIncome,
        averageMonthlyIncome,
        occupancyRate,
      },
      monthlyIncome: incomeData,
      propertyTypes: propertyTypeData,
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rental-report-${format(new Date(), 'yyyy-MM-dd')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Reports & Analytics</h1>
          <p className="text-gray-600">Insights into your rental business</p>
        </div>
        <div className="flex gap-2">
          <Select value={reportPeriod} onValueChange={setReportPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="12months">Last 12 Months</SelectItem>
              <SelectItem value="24months">Last 24 Months</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={exportReport} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Income</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalIncome.toLocaleString()}</div>
            <p className="text-xs text-gray-500">Last {reportPeriod.replace('months', ' months')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Avg Monthly Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${averageMonthlyIncome.toLocaleString()}</div>
            <p className="text-xs text-gray-500">Per month average</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Occupancy Rate</CardTitle>
            <Building2 className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{occupancyRate.toFixed(1)}%</div>
            <p className="text-xs text-gray-500">Current occupancy</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active Tenants</CardTitle>
            <Users className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tenants.filter(t => t.isActive).length}</div>
            <p className="text-xs text-gray-500">Current tenants</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Income Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Income Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={incomeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="shortMonth" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Income']}
                  labelFormatter={(label) => `Month: ${label}`}
                />
                <Line type="monotone" dataKey="income" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Occupancy Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Property Occupancy</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={occupancyData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {occupancyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Property Type Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Property Type Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {propertyTypeData.map((type) => (
              <div key={type.type} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Building2 className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">{type.type}</p>
                    <p className="text-sm text-gray-500">{type.count} properties</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">${type.income.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">Monthly income</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Payments Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Status Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {['paid', 'pending', 'overdue', 'partial'].map((status) => {
              const statusPayments = payments.filter(p => p.status === status);
              const statusTotal = statusPayments.reduce((sum, p) => sum + p.amount, 0);
              const statusColor = {
                paid: 'bg-green-100 text-green-800',
                pending: 'bg-yellow-100 text-yellow-800',
                overdue: 'bg-red-100 text-red-800',
                partial: 'bg-orange-100 text-orange-800',
              }[status];

              return (
                <div key={status} className="text-center p-4 border rounded-lg">
                  <Badge className={statusColor}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </Badge>
                  <p className="text-2xl font-bold mt-2">{statusPayments.length}</p>
                  <p className="text-sm text-gray-500">payments</p>
                  <p className="text-lg font-semibold mt-1">${statusTotal.toLocaleString()}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}