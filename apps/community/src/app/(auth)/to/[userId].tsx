import { useSearchParams } from '@sunrise-ui/primitives';
import ProfileView from '@templates/ProfileView';
import React from 'react';

export default function UserProfileScreen() {
  const { userId } = useSearchParams<{ userId: string }>();

  return <ProfileView userId={userId} />;
}
