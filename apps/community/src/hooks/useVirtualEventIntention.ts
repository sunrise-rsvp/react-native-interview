import type { VirtualEventIntentionParams } from '@hoc/withEventIntention';
import useCheckUserEventEligibility from '@hooks/useCheckUserEventEligibility';
import useRsvpAndJoinEvent from '@hooks/useRsvpAndJoinEvent';
import { useBanner } from '@sunrise-ui/primitives';
import { router, usePathname } from 'expo-router';
import { useState } from 'react';

export default function useVirtualEventIntention(
  eventIntentionParams: VirtualEventIntentionParams,
  shouldRequestPermission?: boolean,
) {
  const { eventId, intention } = eventIntentionParams;
  const [isRunning, setIsRunning] = useState(false);
  const pathname = usePathname();
  const { showBanner } = useBanner();
  const cleanupBeforeNavigation = () => {
    setIsRunning(false);
  };

  const { checkUserEventEligibility } = useCheckUserEventEligibility(
    cleanupBeforeNavigation,
    shouldRequestPermission,
  );
  const { rsvpToEvent, joinEvent, isLoadingJoin, isLoadingRsvp } =
    useRsvpAndJoinEvent(eventId, cleanupBeforeNavigation);

  const isOnEventsPage = pathname.includes('/events');

  let isSettingUp = false;
  switch (intention) {
    case 'join':
      isSettingUp = isLoadingJoin;
      break;
    case 'rsvp':
      isSettingUp = isLoadingRsvp;
      break;
    default:
      break;
  }

  const notEventsPageAction = async () => {
    switch (intention) {
      case 'rsvp':
        await rsvpToEvent().then(() => {
          showBanner({
            text: "All set! You have officially RSVP'ed.",
            type: 'success',
          });
          cleanupBeforeNavigation();
          router.navigate('/events');
        });
        break;
      case 'join':
        await joinEvent(() => {
          router.navigate('/events');
        }).catch(() => {
          cleanupBeforeNavigation();
          router.navigate('/events');
        });
        break;
      default:
        break;
    }
  };

  const eventsPageAction = async () => {
    switch (intention) {
      case 'join':
        await joinEvent();
        break;
      case 'rsvp':
        await rsvpToEvent();
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
