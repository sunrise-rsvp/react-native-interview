import { useUserAuth } from '@sunrise-ui/primitives';
import ProfileView from '@templates/ProfileView';
import React from 'react';

export default function UserProfileScreen() {
  const { currentUserId } = useUserAuth();

  return <ProfileView userId={currentUserId} />;
}
