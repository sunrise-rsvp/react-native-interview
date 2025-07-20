import InboxItem from '@molecules/InboxItem';
import { useGetProfile } from '@queries/profiles';
import { type IntroductionHalf } from '@sunrise-ui/api/network';
import { useUserAuth } from '@sunrise-ui/primitives';
import React from 'react';

type Props = {
  introHalves: IntroductionHalf[];
  openIntro: (id: string) => void;
  activeIntroId?: string;
};

export default function InboxItemIntro({
  introHalves,
  openIntro,
  activeIntroId,
}: Props) {
  const { currentUserId } = useUserAuth();
  const currentUserIntroHalf = introHalves.find(
    (i) => i.person.user_id === currentUserId,
  );
  const currentIntro = currentUserIntroHalf?.introduced_to;
  const otherIntroPerson = introHalves.find(
    (i) => i.person.user_id !== currentUserId,
  )?.person;
  const { data: introducerProfile } = useGetProfile(
    currentIntro?.introducer_id,
  );

  if (
    !currentUserIntroHalf ||
    !currentIntro ||
    !otherIntroPerson ||
    !introducerProfile
  )
    return;

  return (
    <InboxItem
      key={`message-list-item-${currentIntro.id}`}
      userId={otherIntroPerson.user_id}
      subtext={`from ${introducerProfile.first_name} ${introducerProfile.last_name}`}
      timestamp={currentIntro.created_date as string}
      onPress={() => {
        if (currentIntro.id) openIntro(currentIntro.id);
      }}
      isActive={activeIntroId === currentIntro.id}
    />
  );
}
