import useCurrentEventInfo from '@contexts/useCurrentEventInfo';
import { useGetRoom } from '@queries/rooms';
import { useSafeContext, useUserAuth } from '@sunrise-ui/primitives';
import React, { createContext, useState, type PropsWithChildren } from 'react';

type FlexDirection = 'row' | 'column';

type CurrentRoomContextType = {
  flexDirection: FlexDirection;
  setFlexDirection: (direction: FlexDirection) => void;
  hostId?: string;
  isHost: boolean;
};

// @ts-expect-error -- don't use default, instead console error if component not used in appropriate context
const CurrentRoomContext = createContext<CurrentRoomContextType>();
CurrentRoomContext.displayName = 'CurrentRoomContext';

export const CurrentRoomProvider = ({ children }: PropsWithChildren) => {
  const { currentUserId } = useUserAuth();
  const { currentRoomId } = useCurrentEventInfo();
  const { data: room } = useGetRoom(currentRoomId);
  const [flexDirection, setFlexDirection] = useState<FlexDirection>('column');
  const hostId = room?.user_id;

  return (
    <CurrentRoomContext.Provider
      value={{
        flexDirection,
        setFlexDirection,
        hostId,
        isHost: hostId === currentUserId,
      }}
    >
      {children}
    </CurrentRoomContext.Provider>
  );
};

export default function useCurrentRoom() {
  return useSafeContext(CurrentRoomContext);
}
