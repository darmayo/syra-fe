import { Domain, SecurityLog, User, AttackStats } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.replace('/');
    throw new Error('No authentication token found');
  }
  return { Authorization: `Bearer ${token}` };
}

async function handleResponse(response: Response) {
  if (response.status === 403) {
    localStorage.removeItem('token');
    window.location.replace('/');
    throw new Error('Unauthorized');
  }
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'API error');
  }
  return response.json();
}

export const apiService = {
  // Fetch the current user
  getCurrentUser: async (): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/api/user`, {
      headers: {
        ...getAuthHeaders(),
      },
    });
    return handleResponse(response);
  },

  // Fetch all domains
  getDomains: async (): Promise<Domain[]> => {
    const response = await fetch(`${API_BASE_URL}/api/domain`, {
      headers: {
        ...getAuthHeaders(),
      },
    });
    return handleResponse(response);
  },

  // Add a new domain
  addDomain: async (domain: { name: string; url: string }): Promise<Domain> => {
    const response = await fetch(`${API_BASE_URL}/api/domain`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(domain),
    });
    return handleResponse(response);
  },

  // Delete a domain
  deleteDomain: async (domainId: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/domain?domainId=${domainId}`, {
      method: 'DELETE',
      headers: {
        ...getAuthHeaders(),
      },
    });
    await handleResponse(response);
  },

  // Fetch security logs
  getSecurityLogs: async (): Promise<SecurityLog[]> => {
    const response = await fetch(`${API_BASE_URL}/api/security-logs`, {
      headers: {
        ...getAuthHeaders(),
      },
    });
    return handleResponse(response);
  },

  // Fetch attack statistics
  getAttackStats: async (): Promise<AttackStats> => {
    const response = await fetch(`${API_BASE_URL}/api/security-logs`, {
      headers: {
        ...getAuthHeaders(),
      },
    });

    const logs: SecurityLog[] = await handleResponse(response);

    // Classification of rule IDs
    const xssRuleIds = [900001, 900011, 900012, 900013];
    const sqlInjectionRuleIds = [900002, 900003, 900004, 900005, 900008, 900009];
    const ddosRuleIds = [900006, 900007];

    // Calculate statistics
    const stats: AttackStats = logs.reduce(
      (acc, log) => {
        if (log.rule_id && xssRuleIds.includes(log.rule_id)) {
          acc.xss++;
        } else if (log.rule_id && sqlInjectionRuleIds.includes(log.rule_id)) {
          acc.sqlInjection++;
        } else if (log.rule_id && ddosRuleIds.includes(log.rule_id)) {
          acc.ddos++;
        }
        acc.total++;
        return acc;
      },
      { ddos: 0, sqlInjection: 0, xss: 0, total: 0 } as AttackStats
    );

    return stats;
  },
};
