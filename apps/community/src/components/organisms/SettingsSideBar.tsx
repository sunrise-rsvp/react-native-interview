import useCurrentEventInfo from '@contexts/useCurrentEventInfo';
import useDisconnectOrLeaveRoom from '@hooks/useDisconnectOrLeaveRoom';
import AvAccessButton from '@molecules/AvAccessButton';
import {
  useGetCurrentAuctionRound,
  useSelectHighestBidder,
} from '@queries/auctions';
import { useCreateExtension } from '@queries/extensions';
import { useGetRoom } from '@queries/rooms';
import { useCreateTokenTransaction } from '@queries/tokens';
import {
  Admin,
  Button,
  ButtonVariants,
  MediaDeviceType,
  NonNative,
  TextInput,
} from '@sunrise-ui/primitives';
import React, { useState } from 'react';
import { View } from 'react-native';

export default function SettingsSideBar() {
  const { currentRoomId } = useCurrentEventInfo();
  const { mutateAsync: createExtension } = useCreateExtension();
  const { mutateAsync: addTokens, isPending: isPendingTokens } =
    useCreateTokenTransaction();
  const { mutateAsync: selectHighestBidder, isPending: isPendingAuction } =
    useSelectHighestBidder();
  const [tokensToAdd, setTokensToAdd] = useState('');
  const disconnectOrLeaveRoom = useDisconnectOrLeaveRoom();
  const { data: round } = useGetCurrentAuctionRound();
  const { data: room } = useGetRoom(currentRoomId);

  return (
    <View style={{ padding: 20, gap: 20 }}>
      <Admin>
        <Button
          onPress={async () => {
            await createExtension();
          }}
          variant={ButtonVariants.PURPLE}
        >
          Create extension
        </Button>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
          <TextInput
            label="Add tokens"
            value={tokensToAdd}
            onChange={(text) => {
              setTokensToAdd(text);
            }}
          />
          <Button
            onPress={async () => {
              await addTokens({ quantity: parseInt(tokensToAdd, 10) });
              setTokensToAdd('');
            }}
            variant={ButtonVariants.PINK}
            disabled={isPendingTokens}
            loading={isPendingTokens}
          >
            {isPendingTokens ? '' : 'Add Tokens'}
          </Button>
        </View>
        <Button
          onPress={async () => {
            if (round && room)
              await selectHighestBidder({
                userId: room.user_id,
                roundId: round.round_id,
              });
          }}
          variant={ButtonVariants.PURPLE}
          disabled={isPendingAuction}
          loading={isPendingAuction}
        >
          {isPendingAuction ? '' : 'Select Highest Bidder'}
        </Button>
      </Admin>
      <Button onPress={disconnectOrLeaveRoom} variant={ButtonVariants.PURPLE}>
        Leave room
      </Button>
      <NonNative>
        <AvAccessButton variant={MediaDeviceType.CAMERA} />
        <AvAccessButton variant={MediaDeviceType.MICROPHONE} />
      </NonNative>
    </View>
  );
}
