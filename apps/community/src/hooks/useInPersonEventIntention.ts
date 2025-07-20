import type { InPersonEventIntentionParams } from '@hoc/withEventIntention';
import useCheckUserEventEligibility from '@hooks/useCheckUserEventEligibility';
import {
  TICKET_CHECKOUT_URL,
  useUserAdminProfile,
} from '@sunrise-ui/api-client';
import { router, usePathname } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useState } from 'react';

export default function useInPersonEventIntention(
  eventIntentionParams: InPersonEventIntentionParams,
  shouldRequestPermission?: boolean,
) {
  const { intention } = eventIntentionParams;
  const { data: userAdminProfile, isLoading: isLoadingAdminProfile } =
    useUserAdminProfile();

  const [isRunning, setIsRunning] = useState(false);
  const pathname = usePathname();
  const isOnEventsPage = pathname.includes('/events');
  const cleanupBeforeNavigation = () => {
    setIsRunning(false);
  };

  const { checkUserEventEligibility } = useCheckUserEventEligibility(
    cleanupBeforeNavigation,
    shouldRequestPermission,
  );

  let isSettingUp = false;
  switch (intention) {
    case 'buyTicket':
      isSettingUp = isLoadingAdminProfile;
      break;
    default:
      break;
  }

  const handleBuyTicket = async () => {
    // const redirectUrl = Linking.createURL('events');
    await WebBrowser.openBrowserAsync(
      `${TICKET_CHECKOUT_URL}/events/${eventIntentionParams.eventId}/?email=${encodeURIComponent(userAdminProfile?.email ?? '')}`,
    );
  };

  const notEventsPageAction = async () => {
    switch (intention) {
      case 'buyTicket':
        await handleBuyTicket();
        break;
      default:
        break;
    }
    cleanupBeforeNavigation();
    router.navigate('/events');
  };

  const eventsPageAction = async () => {
    switch (intention) {
      case 'buyTicket':
        await handleBuyTicket();
        break;
      default:
        break;
    }
  };

  let eventIntention;
  if (intention) {
    eventIntention = async () => {
      setIsRunning(true);
      try {
        const isEligible =
          await checkUserEventEligibility(eventIntentionParams);
        if (isEligible) {
          if (isOnEventsPage) await eventsPageAction();
          else await notEventsPageAction();
        }
        return isEligible;
      } finally {
        setIsRunning(false);
      }
    };
  }

  return {
    eventIntention,
    isSettingUp,
    isRunning,
  };
}
