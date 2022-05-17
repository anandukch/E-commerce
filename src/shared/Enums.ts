export enum STATUS {
  ACTIVE = 'active',
  DISABLED = 'disabled',
  DELETED = 'deleted',
}

export enum ROLES {
  ADMIN = 'admin',
  CUSTOMER = 'customer',
}

export enum ORDER_STATUS {
  RECEIVED = 'RECEIVED',
  ACCEPTED = 'ACCEPTED',
  COMPLETED = 'COMPLETED',
  REJECTED = 'REJECTED',
  CANCELLATION_REQUESTED = 'CANCELLATION_REQUESTED',
}

export enum QUERY_STATUS {
  ACTIVE = 'active',
  RESOLVED = 'resolved',
}

export enum USER_STATUS {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export enum CONFIGURATIONS {
  ORDER_NUMBER = 'ORDER_NUMBER',
}

export enum STOCK_STATUS {
  ADDITION = 'ADDITION',
  REDUCTION = 'REDUCTION'
}
