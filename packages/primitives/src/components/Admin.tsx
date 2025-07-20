import type { PropsWithChildren } from 'react';
import { useUserAuth } from '../contexts/useUserAuth';
import { UserRole } from '../utils/auth';

export const Admin = ({ children }: PropsWithChildren) => {
  const { currentUserRole } = useUserAuth();

  return currentUserRole === UserRole.ADMIN ? children : null;
};
