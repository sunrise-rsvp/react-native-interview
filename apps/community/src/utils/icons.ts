import { RoomTab } from '@contexts/useRoomTab';
import {
  Chatting01Icon,
  Coins02Icon,
  Settings01Icon,
  UserGroupIcon,
} from '@hugeicons/core-free-icons';

export function getTabsIcon(tab: RoomTab) {
  switch (tab) {
    case RoomTab.CHAT:
      return Chatting01Icon;
    case RoomTab.ATTENDEES:
      return UserGroupIcon;
    case RoomTab.SETTINGS:
      return Settings01Icon;
    default:
      return Coins02Icon;
  }
}
