export enum UserRole {
  CUSTOMER = 'customer',
  HELPER = 'helper',
  ADMIN = 'admin',
}

export enum TaskUrgency {
  LOW = 'low',
  MEDIUM = 'medium',
  URGENT = 'urgent',
}

export enum TaskStatus {
  OPEN = 'OPEN',
  ASSIGNED = 'ASSIGNED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  DISPUTED = 'DISPUTED',
}

export enum BidStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}
