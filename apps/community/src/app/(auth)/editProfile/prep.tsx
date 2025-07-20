import DosAndDonts from '@molecules/DosAndDonts';
import { PageHeader } from '@sunrise-ui/primitives';
import IntroPrepView from '@templates/IntroPrepView';
import { router } from 'expo-router';
import React from 'react';

const dos = ['Your experience', "If you're hiring", "If you're job seeking"];

const donts = ['Your headline', "What you're selling", 'Inappropriate stuff'];

export default function ProfileIntroPrepScreen() {
  const onPressRecord = () => {
    router.navigate('/editProfile/record');
  };

  const pageHeader = (
    <PageHeader
      header="Let's record your intro."
      subheader="People will watch this 15 second video before meeting you."
    />
  );

  return (
    <IntroPrepView
      page="profile"
      onPressRecord={onPressRecord}
      pageHeader={pageHeader}
    >
      <DosAndDonts dos={dos} donts={donts} useRowOnMobile={true} />
    </IntroPrepView>
  );
}
