import useStartOrGetConversation from '@queries/conversations';
import { Button, useUserAuth, type ButtonProps } from '@sunrise-ui/primitives';
import { router } from 'expo-router';
import React from 'react';

type Props = {
  userId: string | undefined;
};
export default function SendMessageButton({
  userId,
  ...otherProps
}: Props & Partial<ButtonProps>) {
  const { currentUserId } = useUserAuth();
  const {
    mutateAsync: startOrGetConversation,
    isPending: isStartingOrGettingConversation,
  } = useStartOrGetConversation();

  const handleSendMessage = async () => {
    if (!userId) return;
    const conversation = await startOrGetConversation({
      userId,
    });
    router.navigate(`/inbox/connected/${conversation._id}`);
  };

  const enabled = userId && userId !== currentUserId;

  return (
    <Button
      onPress={handleSendMessage}
      loading={isStartingOrGettingConversation}
      disabled={Boolean(!enabled)}
      {...otherProps}
    >
      Message
    </Button>
  );
}
