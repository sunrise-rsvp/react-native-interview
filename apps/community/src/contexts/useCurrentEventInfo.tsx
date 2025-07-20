import { useSafeContext } from '@sunrise-ui/primitives';
import React, { createContext, useState, type PropsWithChildren } from 'react';

export type CurrentEventContextType = {
  currentEventId: string;
  setCurrentEventId: (id: string) => void;
  currentRoomId: string;
  setCurrentRoomId: (id: string) => void;
  ticketToken: string;
  setTicketToken: (token: string) => void;
  roomToken: string;
  setRoomToken: (token: string) => void;
  ticketId: string;
  setTicketId: (token: string) => void;
  resetInfo: () => void;
};

// @ts-expect-error -- don't use default, instead console error if component not used in appropriate context
const CurrentEventContext = createContext<CurrentEventContextType>();
CurrentEventContext.displayName = 'CurrentEventContext';

export const CurrentEventInfoProvider = ({ children }: PropsWithChildren) => {
  const [currentEventId, setCurrentEventId] = useState('');
  const [currentRoomId, setCurrentRoomId] = useState('');
  const [ticketToken, setTicketToken] = useState('');
  const [ticketId, setTicketId] = useState('');
  const [roomToken, setRoomToken] = useState('');

  const resetInfo = () => {
    setRoomToken('');
    setTicketToken('');
    setCurrentRoomId('');
    setCurrentEventId('');
    setTicketId('');
  };

  return (
    <CurrentEventContext.Provider
      value={{
        currentEventId,
        setCurrentEventId,
        currentRoomId,
        setCurrentRoomId,
        ticketToken,
        setTicketToken,
        roomToken,
        setRoomToken,
        ticketId,
        setTicketId,
        resetInfo,
      }}
    >
      {children}
    </CurrentEventContext.Provider>
  );
};

export default function useCurrentEventInfo() {
  return useSafeContext(CurrentEventContext);
}
