import React from 'react';
import { Shield, AlertTriangle, Bug } from 'lucide-react';
import { AttackStats } from '../types';

interface AttackStatsCardProps {
  stats: AttackStats;
  loading: boolean;
}

interface AttackCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
  loading: boolean;
}

function AttackCard({ title, value, icon, color, bgColor, borderColor, loading }: AttackCardProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-5 lg:p-6">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-xl animate-pulse"></div>
          <div className="w-16 h-8 sm:w-20 sm:h-10 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
        <div className="h-4 sm:h-5 bg-gray-200 rounded animate-pulse mb-2"></div>
        <div className="h-3 sm:h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl shadow-sm border-2 ${borderColor} p-4 sm:p-5 lg:p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group`}>
      <div className="flex items-center justify-between mb-4 sm:mb-5">
        <div className={`w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 ${bgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
        <div className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${color} tabular-nums`}>
          {value.toLocaleString()}
        </div>
      </div>
      <div>
        <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 mb-1">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-gray-500">
          {value === 0 ? 'No attacks detected' : `${value} attack${value !== 1 ? 's' : ''} detected`}
        </p>
      </div>
    </div>
  );
}

export function AttackStatsCard({ stats, loading }: AttackStatsCardProps) {
  const attackTypes = [
    {
      title: 'DDoS Attacks',
      value: stats.ddos,
      icon: <Shield className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-red-600" />,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    },
    {
      title: 'SQL Injection',
      value: stats.sqlInjection,
      icon: <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-orange-600" />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    },
    {
      title: 'XSS Attacks',
      value: stats.xss,
      icon: <Bug className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-purple-600" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    }
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="text-center sm:text-left">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
          Attack Statistics
        </h2>
        <p className="text-sm sm:text-base text-gray-600">
          Real-time security monitoring across all your domains
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
        {attackTypes.map((attack) => (
          <AttackCard
            key={attack.title}
            title={attack.title}
            value={attack.value}
            icon={attack.icon}
            color={attack.color}
            bgColor={attack.bgColor}
            borderColor={attack.borderColor}
            loading={loading}
          />
        ))}
      </div>
    </div>
  );
}