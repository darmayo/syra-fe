import React, { useState } from 'react';
import { Globe, AlertTriangle, Shield, Activity, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { Domain, SecurityLog } from '../types';

interface DomainCardProps {
  domain: Domain;
  logs: SecurityLog[];
  onDelete: (domainId: string) => Promise<void>;
}

const remediationMessages: Record<number, string> = {
  900001: 'Ensure input fields are sanitized to prevent XSS attacks.',
  900011: 'Review JavaScript usage to avoid potential XSS vulnerabilities.',
  900012: 'Implement Content Security Policy (CSP) to mitigate XSS risks.',
  900013: 'Validate and escape user input to prevent XSS attacks.',
  900002: 'Use parameterized queries to prevent SQL injection.',
  900003: 'Avoid dynamic SQL queries to reduce SQL injection risks.',
  900004: 'Sanitize user inputs to prevent SQL injection.',
  900005: 'Implement database access controls to mitigate SQL injection.',
  900008: 'Monitor database queries for unusual patterns.',
  900009: 'Use an ORM to abstract database queries and prevent SQL injection.',
  900006: 'Implement rate limiting to mitigate DDoS attacks.',
  900007: 'Use a web application firewall (WAF) to block DDoS traffic.',
};

const getRemediationMessage = (ruleId: number | undefined): string | null => {
  if (ruleId && remediationMessages[ruleId]) {
    return remediationMessages[ruleId];
  }
  return null;
};

export function DomainCard({ domain, logs, onDelete }: DomainCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const hasThreats = logs.some(log => ['sql_injection', 'ddos', 'xss'].includes(log.type));

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;

    return `[${month}/${day}/${year} ${displayHours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')} ${ampm}]`;
  };

  const getLogIcon = (log: SecurityLog) => {
    if (log.type === 'sql_injection') return <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 text-red-500 flex-shrink-0" />;
    if (log.type === 'ddos') return <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 text-orange-500 flex-shrink-0" />;
    if (log.type === 'xss') return <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 text-purple-500 flex-shrink-0" />;
    return <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />;
  };

  const getLogColor = (log: SecurityLog) => {
    if (log.type === 'sql_injection') return 'text-red-600';
    if (log.type === 'ddos') return 'text-orange-600';
    if (log.type === 'xss') return 'text-purple-600';
    return 'text-gray-600';
  };

  const getStatusColor = () => {
    if (hasThreats) return 'bg-red-100 text-red-800 border-red-200';
    return 'bg-green-100 text-green-800 border-green-200';
  };

  const getStatusText = () => {
    if (hasThreats) return 'Threats Detected';
    return 'Secure';
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${domain.name}? This action cannot be undone.`)) {
      try {
        setIsDeleting(true);
        await onDelete(domain.id);
      } catch (error) {
        console.error('Failed to delete domain:', error);
        alert('Failed to delete domain. Please try again.');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const formatLogMessage = (log: SecurityLog) => {
    // For Wazuh logs, show more detailed information
    if (log.rule_id && log.srcip) {
      return `${log.title} from ${log.srcip}`;
    }
    return log.title;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 overflow-hidden group flex flex-col h-full">
      {/* Header */}
      <div className="p-4 sm:p-5 lg:p-6 border-b border-gray-100">
        <div className="flex items-start justify-between mb-3 sm:mb-4">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
              <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 truncate mb-1">
                {domain.name}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 truncate">
                {domain.url}
              </p>
            </div>
          </div>

          {/* Delete Button */}
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Delete domain"
          >
            {isDeleting ? (
              <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </button>
        </div>

        {/* Status Badge */}
        {/* <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs sm:text-sm font-medium border ${getStatusColor()}`}>
          {getStatusText()}
        </div> */}
      </div>

      {/* Security Logs */}
      <div className="flex-1 flex flex-col p-4 sm:p-5 lg:p-6">
        <div className="flex items-center mb-3 sm:mb-4">
          <h4 className="text-sm sm:text-base font-semibold text-gray-700 flex items-center gap-2">
            <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
            Security Logs ( {logs.length} )
          </h4>
        </div>
        {/* Set a fixed max height and make it scrollable */}
        <div className="overflow-y-auto space-y-2 sm:space-y-3 max-h-64" style={{ minHeight: 0 }}>
          {logs.length > 0 ? (
            logs.map((log) => (
              <div key={log.id} className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                {getLogIcon(log)}
                <div className="min-w-0 flex-1">
                  <div className={`${getLogColor(log)} text-xs sm:text-sm leading-relaxed break-words`}>
                    <span className="hidden sm:inline font-mono text-xs text-gray-500">
                      {formatTimestamp(log.timestamp)}
                    </span>
                    <span className="sm:hidden font-mono text-xs text-gray-500">
                      [{new Date(log.timestamp).toLocaleTimeString('en-US', { hour12: true })}]
                    </span>
                    <span className="ml-2">{formatLogMessage(log)}</span>
                  </div>
                  {log.rule_id && log.type !== 'monitoring' && (
                    <div className="mt-1 text-xs text-gray-400 font-mono">
                      Rule ID: {log.rule_id} | Status: {log.status_code} | {log.blocked ? 'BLOCKED' : 'ALLOWED'}
                    </div>
                  )}
                  {log.rule_id && (
                    <div className="mt-2 text-xs text-blue-600 font-medium">
                      Threat Remediation: {getRemediationMessage(log.rule_id) || 'No specific remediation available.'}
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg text-center">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mx-auto" />
              <span className="text-xs sm:text-sm text-gray-500">No recent activity</span>
            </div>
          )}
        </div>
      </div>

      {/* Threat Alert */}
      {hasThreats && (
        <div className="p-4 sm:p-5 lg:p-6 bg-red-50 border-t border-red-100">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-red-500 mt-0.5 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <h5 className="text-sm sm:text-base font-semibold text-red-800 mb-2">
                Security Threat Detected
              </h5>
              <p className="text-xs sm:text-sm text-red-700 leading-relaxed">
                Wazuh security system has detected and blocked malicious activities. The affected requests have been automatically isolated to prevent further attacks.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}