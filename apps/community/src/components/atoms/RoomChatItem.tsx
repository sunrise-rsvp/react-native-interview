import { useGetProfile } from '@queries/profiles';
import { type Message } from '@sunrise-ui/api/messenger';
import { TextBold, TextReg, useUserAuth } from '@sunrise-ui/primitives';
import React, { useEffect } from 'react';
import { Text, type StyleProp, type TextStyle } from 'react-native';
import Animated, { useSharedValue, withTiming } from 'react-native-reanimated';

type Props = {
  message: Message;
  style?: StyleProp<TextStyle>;
  animateFadeOut?: boolean;
};

const TIMEOUT = 5000;

export function RoomChatItem({ message, style, animateFadeOut }: Props) {
  const { currentUserId } = useUserAuth();
  const opacity = useSharedValue(1);
  const { data: profile, isLoading } = useGetProfile(message.user_id);

  useEffect(() => {
    if (animateFadeOut) {
      const timeout = setTimeout(() => {
        opacity.value = withTiming(0, {
          duration: 2000,
        });
      }, TIMEOUT);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [animateFadeOut]);

  if (isLoading) return null;

  return (
    <Animated.View style={{ opacity }}>
      <Text style={style}>
        <TextBold>
          {profile?.first_name} {profile?.last_name}
          {currentUserId === message.user_id ? ' (you): ' : ': '}
        </TextBold>
        <TextReg>{message.content}</TextReg>
      </Text>
    </Animated.View>
  );
}
