export type AccountType = 'local' | 'ldap';

export interface AccountTypeOption {
  value: AccountType;
  label: string;
}

export interface AccountTag {
  text: string;
}

export interface Account {
  tags: AccountTag[];
  type: AccountType;
  login: string;
  password: string;
}

export const ACCOUNT_TYPES: AccountType[] = ['local', 'ldap'];

export const ACCOUNT_TYPE_OPTIONS: AccountTypeOption[] = [
  { value: 'local', label: 'Локальный' },
  { value: 'ldap', label: 'LDAP' }
];

export const ACCOUNT_TYPE_LABELS: Record<AccountType, string> = {
  'local': 'Локальный',
  'ldap': 'LDAP'
};
