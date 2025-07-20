import Colors from '@constants/Colors';
import { UserCircleIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { TextLight, useUserAuth } from '@sunrise-ui/primitives';
import React from 'react';
import { View, type ViewStyle } from 'react-native';

type Props = {
  style: ViewStyle;
  hostId?: string;
};

export default function EmptyStage({ style, hostId }: Props) {
  const { currentUserId } = useUserAuth();
  const currentUserIsHost = hostId === currentUserId;

  return (
    <View style={style}>
      <HugeiconsIcon
        icon={UserCircleIcon}
        color={Colors.dark.text}
        strokeWidth={1}
        size={100}
      />
      <TextLight>
        {currentUserIsHost
          ? 'Bring up a guest to join you on stage!'
          : 'Raise your hand to go on stage!'}
      </TextLight>
    </View>
  );
}
