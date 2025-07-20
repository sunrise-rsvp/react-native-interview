import IntroRecordView from '@templates/IntroRecordView';
import { defaultBack } from '@utils/navigation';
import { router } from 'expo-router';
import React from 'react';

export default function ProfileIntroRecordScreen() {
  return (
    <IntroRecordView
      onRecordingFinished={(uri: string) => {
        router.replace(`/editProfile/preview?uri=${uri}`);
      }}
      handleBack={defaultBack('/editProfile/prep')}
    />
  );
}
