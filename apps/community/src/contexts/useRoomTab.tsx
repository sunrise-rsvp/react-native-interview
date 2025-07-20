import useCurrentEventInfo from '@contexts/useCurrentEventInfo';
import useRoomStage from '@contexts/useRoomStage';
import { useGetRoom } from '@queries/rooms';
import { useSafeContext } from '@sunrise-ui/primitives';
import { getRoomTimeLeft } from '@utils/timing';
import React, {
  createContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from 'react';

type RoomTabContextType = {
  currentRoomTab?: RoomTab;
  setCurrentRoomTab: (tab?: RoomTab) => void;
  currentTokenTab: TokenTab;
  setCurrentTokenTab: (tab?: TokenTab) => void;
};

export enum RoomTab {
  TOKENS = 'tokens',
  CHAT = 'chat',
  ATTENDEES = 'attendees',
  SETTINGS = 'settings',
}

export enum TokenTab {
  BUY = 'buy',
  EXTEND = 'extend',
  BID = 'bid',
}

// @ts-expect-error -- don't use default, instead console error if component not used in appropriate context
const RoomTabContext = createContext<RoomTabContextType>();
RoomTabContext.displayName = 'RoomTabContext';

export const RoomTabProvider = ({ children }: PropsWithChildren) => {
  const { isUserOnStage } = useRoomStage();
  const { currentRoomId } = useCurrentEventInfo();
  const [currentRoomTab, setCurrentRoomTab] = useState<RoomTab>();
  const [currentTokenTab, setCurrentTokenTab] = useState<TokenTab>(
    TokenTab.BUY,
  );
  const { data: room } = useGetRoom(currentRoomId);
  const { isAlmostFinished, millisecondsLeft } = getRoomTimeLeft(room);

  const setCurrentRoomTabWrapper = (tab?: RoomTab) => {
    if (tab) setCurrentRoomTab(tab);
    else {
      setCurrentRoomTab(undefined);
      setCurrentTokenTab(TokenTab.BUY);
    }
  };

  const setCurrentTokenTabWrapper = (tab?: TokenTab) => {
    if (tab) {
      setCurrentRoomTab(RoomTab.TOKENS);
      setCurrentTokenTab(tab);
    } else {
      setCurrentRoomTabWrapper();
    }
  };

  useEffect(() => {
    const limit = isUserOnStage ? 30000 : 10000;

    if (millisecondsLeft && millisecondsLeft > limit) {
      const timeout = setTimeout(() => {
        setCurrentTokenTab(TokenTab.EXTEND);
      }, millisecondsLeft - limit);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [millisecondsLeft, isAlmostFinished, isUserOnStage]);

  return (
    <RoomTabContext.Provider
      value={{
        currentRoomTab,
        setCurrentRoomTab: setCurrentRoomTabWrapper,
        currentTokenTab,
        setCurrentTokenTab: setCurrentTokenTabWrapper,
      }}
    >
      {children}
    </RoomTabContext.Provider>
  );
};

export default function useRoomTab() {
  return useSafeContext(RoomTabContext);
}
