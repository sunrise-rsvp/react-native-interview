import { BidHistoryProvider } from '@contexts/useBidHistory';
import { CurrentRoomProvider } from '@contexts/useCurrentRoom';
import { NameTagsControlProvider } from '@contexts/useNameTagsControl';
import { RoomStageProvider } from '@contexts/useRoomStage';
import { RoomTabProvider } from '@contexts/useRoomTab';
import React, { type PropsWithChildren } from 'react';

export default function RoomContextProviders({ children }: PropsWithChildren) {
  return (
    <CurrentRoomProvider>
      <NameTagsControlProvider>
        <RoomStageProvider>
          <RoomTabProvider>
            <BidHistoryProvider>{children}</BidHistoryProvider>
          </RoomTabProvider>
        </RoomStageProvider>
      </NameTagsControlProvider>
    </CurrentRoomProvider>
  );
}
