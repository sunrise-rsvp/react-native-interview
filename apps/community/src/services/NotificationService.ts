import AsyncStorage from '@react-native-async-storage/async-storage';
import { NOTIFICATIONS_WEBSOCKET_URL } from '@sunrise-ui/api-client';
import { type Message } from '@sunrise-ui/api/messenger';

type WebsocketEvent = {
  data: string;
};

type WebsocketEventData<K extends keyof WebsocketEventTypeMap> = {
  id: string;
  event_type: K;
  event: WebsocketEventTypeMap[K];
};

type SimpleEventType = {
  UserJoinedStage: UserJoinedStage;
  NewExtensionRoundCreated: NewExtensionRoundCreated;
  ExtensionAchieved: ExtensionAchieved;
  ExtensionCommitmentCreated: ExtensionCommitmentCreated;
  HostJoinedVideoRoom: HostJoinedVideoRoom;
  NewAuctionRoundCreated: NewAuctionRoundCreated;
  NewHighestBidPlaced: NewHighestBidPlaced;
  AuctionRoundClosed: AuctionRoundClosed;
  TicketCreated: TicketCreated;
};

type ListenerEventTypeMap = {
  MessageSent: Message;
} & SimpleEventType;

type WebsocketEventTypeMap = {
  MessageSent: MessageSent;
} & SimpleEventType;

function isEventType<K extends keyof WebsocketEventTypeMap>(
  data: WebsocketEventData<keyof WebsocketEventTypeMap>,
  eventType: K,
): data is WebsocketEventData<K> {
  return data?.event_type === eventType;
}

type MessageSent = {
  content: string;
  conversation_id: string;
  message_id: string;
  timestamp: string;
  users: string[];
  user_id: string;
};

export type UserJoinedStage = {
  user_id: string;
  room_id: string;
  is_host: boolean;
};

export type HostJoinedVideoRoom = {
  event_id: string;
  room_id: string;
  user_id: string;
};

type NewExtensionRoundCreated = {
  room_id: string;
  round_id: string;
  price: number;
};

type ExtensionAchieved = {
  room_id: string;
  round_id: string;
  extend_by_sec: string;
  timestamp: string;
};

type ExtensionCommitmentCreated = {
  user_id: string;
  room_id: string;
  round_id: string;
  value: number;
  total: number;
  price: number;
};

type NewAuctionRoundCreated = {
  created_date: string;
  price: number;
  room_id: string;
  round_id: string;
};

type NewHighestBidPlaced = {
  created_date: string;
  amount: number;
  room_id: string;
  round_id: string;
  user_id: string;
};

type AuctionRoundClosed = NewHighestBidPlaced;

export type TicketCreated = {
  event_id: string;
  id: string;
  ticket_type_id: string;
  user_id: string;
};

let retryAttempts = 0;
const MAX_BACKOFF = 300000;

export class NotificationService {
  private websocket: WebSocket | undefined;
  private readonly onError: () => void;
  private readonly listeners: {
    [K in keyof ListenerEventTypeMap]: Array<
      (event: ListenerEventTypeMap[K]) => Promise<void> | void
    >;
  };

  constructor(onError: () => void) {
    this.listeners = {
      MessageSent: [],
      HostJoinedVideoRoom: [],
      UserJoinedStage: [],
      NewExtensionRoundCreated: [],
      ExtensionAchieved: [],
      ExtensionCommitmentCreated: [],
      NewHighestBidPlaced: [],
      NewAuctionRoundCreated: [],
      AuctionRoundClosed: [],
      TicketCreated: [],
    };
    this.onError = onError;
  }

  openSocket = async () => {
    if (this.websocket && this.websocket.readyState !== WebSocket.CLOSED) {
      return; // Avoid opening a new WebSocket
    }

    const authToken = await AsyncStorage.getItem('authToken');
    this.websocket = new WebSocket(
      `${NOTIFICATIONS_WEBSOCKET_URL}?token=${authToken}`,
    );
    this.websocket.onmessage = this.onMessage;
    this.websocket.onopen = this.onConnectionOpen;
    this.websocket.onclose = this.onConnectionClose;
    this.websocket.onerror = this.onError;
  };

  closeSocket = () => {
    retryAttempts = 0;
    if (!this.websocket) return;
    this.websocket.close(1000);
  };

  onConnectionOpen = () => {
    retryAttempts = 0;
  };

  onConnectionClose = (ev: CloseEvent) => {
    if (ev.code !== 1000) {
      console.warn('Websocket closed with event', ev);
      const delay = Math.min(MAX_BACKOFF, 1.5 ** retryAttempts * 1000);
      setTimeout(async () => {
        retryAttempts++;
        await this.openSocket();
      }, delay);
    }
  };

  addListener = <K extends keyof ListenerEventTypeMap>(
    eventType: K,
    listener: (event: ListenerEventTypeMap[K]) => Promise<void> | void,
  ) => {
    const listeners = this.listeners[eventType];
    listeners.push(listener);

    return () => {
      listeners.splice(listeners.indexOf(listener), 1);
    };
  };

  onMessage = async (websocketEvent: WebsocketEvent) => {
    const data = JSON.parse(websocketEvent.data) as WebsocketEventData<
      keyof WebsocketEventTypeMap
    >;
    console.debug('Websocket message', data);

    if (isEventType(data, 'MessageSent')) {
      const { event, event_type } = data;
      const message: Message = {
        content: event.content,
        timestamp: event.timestamp,
        _id: event.message_id,
        conversation_id: event.conversation_id,
        user_id: event.user_id,
      };
      await Promise.allSettled(
        this.listeners[event_type].map(async (listener) => listener(message)),
      );
    } else {
      const { event, event_type } = data;
      await Promise.allSettled(
        // @ts-expect-error -- until I get better at TS
        this.listeners[event_type]?.map(async (listener) => listener(event)) ??
          [],
      );
    }
  };
}

let notificationServiceInstance: NotificationService;

export function initialiseNotificationService(onError: () => void) {
  if (!notificationServiceInstance) {
    notificationServiceInstance = new NotificationService(onError);
  }

  notificationServiceInstance.openSocket().catch(onError);
  return notificationServiceInstance;
}
