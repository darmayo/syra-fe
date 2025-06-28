export interface Domain {
  id: string;
  name: string;
  url: string;
  createdAt: string;
}

export interface SecurityLog {
  id: string;
  domainId: string;
  timestamp: string;
  type: 'sql_injection' | 'ddos' | 'xss' | 'clean' | 'no_threats' | 'monitoring';
  message: string;
  severity: 'high' | 'medium' | 'low' | 'info';
  ipAddress?: string;
  blocked: boolean;
  // New fields from Wazuh API
  agent_id?: number;
  agent_ip?: string;
  agent_name?: string;
  rule_id?: number;
  title?: string;
  srcip?: string;
  status_code?: number;
  url?: string;
  full_log?: string;
  raw_data?: string;
}

export interface AttackStats {
  ddos: number;
  sqlInjection: number;
  xss: number;
  total: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

// Wazuh API Response Interface
export interface WazuhSecurityLog {
  agent_id: number;
  agent_ip: string;
  agent_name: string;
  decoder_name: string;
  full_log: string;
  id: string;
  location: string;
  manager_name: string;
  pretext: string;
  protocol: string;
  raw_data: string;
  rule_id: number;
  severity: string;
  srcip: string;
  status_code: number;
  text: string;
  timestamp: string;
  title: string;
  url: string;
}