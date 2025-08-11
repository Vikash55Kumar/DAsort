import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { dataService } from '../../services/dataService';
import type { KPIData } from '../../types';
import KPICard from '../../components/dashboard/KPICard';
import ChartCard from '../../components/dashboard/ChartCard';
import ActivityLog from '../../components/dashboard/ActivityLog';
import Loader from '../../components/common/Loader';
import {
  FolderIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [kpiData, setKpiData] = useState<KPIData | null>(null);
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [kpi, analytics] = await Promise.all([
          dataService.getKPIData(),
          dataService.getAnalyticsData({
            start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            end: new Date().toISOString(),
          }),
        ]);
        
        setKpiData(kpi);
        setChartData(analytics);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        // Mock data for demo purposes
        setKpiData({
          totalDatasets: 24,
          recordsProcessed: 156789,
          anomaliesFixed: 2341,
          jobCodesMatched: 89234,
        });
        setChartData({
          monthlyRecords: [
            { name: 'Jan', value: 12000 },
            { name: 'Feb', value: 19000 },
            { name: 'Mar', value: 15000 },
            { name: 'Apr', value: 21000 },
            { name: 'May', value: 18000 },
          ],
          jobCategories: [
            { name: 'Professional', value: 35 },
            { name: 'Service', value: 28 },
            { name: 'Sales', value: 20 },
            { name: 'Skilled Trades', value: 17 },
          ],
          processingTrend: [
            { name: 'Week 1', value: 85 },
            { name: 'Week 2', value: 92 },
            { name: 'Week 3', value: 88 },
            { name: 'Week 4', value: 95 },
          ],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const mockActivities = [
    {
      id: '1',
      type: 'upload' as const,
      description: 'Uploaded survey dataset "Rural Employment 2024"',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      user: 'John Doe',
    },
    {
      id: '2',
      type: 'search' as const,
      description: 'Searched for "software developer" occupation code',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      user: 'Jane Smith',
    },
    {
      id: '3',
      type: 'clean' as const,
      description: 'Cleaned dataset with 234 anomalies detected',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      user: 'Mike Wilson',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Loader size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.name}!
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Here's what's happening with your NCO classification system today.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <KPICard
          title="Total Datasets"
          value={kpiData?.totalDatasets || 0}
          icon={<FolderIcon className="h-6 w-6" />}
          color="blue"
          trend={{ value: 12, isPositive: true }}
        />
        <KPICard
          title="Records Processed"
          value={kpiData?.recordsProcessed || 0}
          icon={<DocumentTextIcon className="h-6 w-6" />}
          color="green"
          trend={{ value: 8, isPositive: true }}
        />
        <KPICard
          title="Anomalies Fixed"
          value={kpiData?.anomaliesFixed || 0}
          icon={<ExclamationTriangleIcon className="h-6 w-6" />}
          color="yellow"
          trend={{ value: 3, isPositive: false }}
        />
        <KPICard
          title="Job Codes Matched"
          value={kpiData?.jobCodesMatched || 0}
          icon={<MagnifyingGlassIcon className="h-6 w-6" />}
          color="green"
          trend={{ value: 15, isPositive: true }}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 mb-8">
        <ChartCard
          title="Monthly Records Processed"
          type="bar"
          data={chartData?.monthlyRecords || []}
          dataKey="value"
          nameKey="name"
        />
        <ChartCard
          title="Job Categories Distribution"
          type="pie"
          data={chartData?.jobCategories || []}
          dataKey="value"
          nameKey="name"
        />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ChartCard
            title="Processing Accuracy Trend"
            type="line"
            data={chartData?.processingTrend || []}
            dataKey="value"
            nameKey="name"
            height={250}
          />
        </div>
        <div>
          <ActivityLog activities={mockActivities} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
