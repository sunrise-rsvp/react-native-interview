import { useUpdateProfileVideo } from '@queries/profiles';
import { useSearchParams } from '@sunrise-ui/primitives';
import IntroPreviewView from '@templates/IntroPreviewView';
import { router } from 'expo-router';
import React from 'react';

export default function ProfileIntroPreviewScreen() {
  const { uri } = useSearchParams<{ uri: string }>();

  const { mutateAsync: updateProfileVideo, isPending } =
    useUpdateProfileVideo();

  const handleSave = async () => {
    await updateProfileVideo(uri);
    router.navigate('/editProfile');
  };

  return <IntroPreviewView handleSave={handleSave} isSaving={isPending} />;
}
