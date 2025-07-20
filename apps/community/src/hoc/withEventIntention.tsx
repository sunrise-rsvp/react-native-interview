import useInPersonEventIntention from '@hooks/useInPersonEventIntention';
import useVirtualEventIntention from '@hooks/useVirtualEventIntention';
import { useSearchParams } from '@sunrise-ui/primitives';
import React from 'react';

type InPersonEventIntentionType = 'buyTicket' | 'checkin';
type VirtualEventIntentionType = 'join' | 'rsvp';

export type EventIntentionProps = {
  eventIntention?: () => Promise<boolean | undefined>;
  isRunning?: boolean;
  isSettingUp?: boolean;
};

export type VirtualEventIntentionParams = {
  eventId?: string;
  intention?: VirtualEventIntentionType;
  eventType?: 'virtual';
};

export type InPersonEventIntentionParams = {
  eventId?: string;
  intention?: InPersonEventIntentionType;
  eventType?: 'inPerson';
};

export type EventIntentionParams =
  | InPersonEventIntentionParams
  | VirtualEventIntentionParams;

export default function withEventIntention<TComponentProps extends object>(
  Component: React.ComponentType<TComponentProps & EventIntentionProps>,
  shouldRequestPermission?: boolean,
) {
  const WithEventIntention = (props: TComponentProps) => {
    const eventIntentionParams = useSearchParams<EventIntentionParams>();
    const { eventType } = eventIntentionParams;

    if (eventType === 'virtual') {
      return (
        <WithVirtualEventIntention
          eventIntentionParams={eventIntentionParams}
          shouldRequestPermission={shouldRequestPermission}
        >
          {(eventIntentionProps) => (
            <Component {...eventIntentionProps} {...props} />
          )}
        </WithVirtualEventIntention>
      );
    }

    if (eventType === 'inPerson') {
      return (
        <WithInPersonEventIntention
          eventIntentionParams={eventIntentionParams}
          shouldRequestPermission={shouldRequestPermission}
        >
          {(eventIntentionProps) => (
            <Component {...eventIntentionProps} {...props} />
          )}
        </WithInPersonEventIntention>
      );
    }

    return <Component {...props} />;
  };

  WithEventIntention.displayName = `withEventIntention(${Component.displayName || Component.name})`;

  return WithEventIntention;
}

type ChildProps<T extends EventIntentionParams> = {
  eventIntentionParams: T;
  children: (props: EventIntentionProps) => React.ReactNode;
  shouldRequestPermission?: boolean;
};

function WithVirtualEventIntention({
  eventIntentionParams,
  shouldRequestPermission,
  children,
}: ChildProps<VirtualEventIntentionParams>) {
  const eventIntentionProps = useVirtualEventIntention(
    eventIntentionParams,
    shouldRequestPermission,
  );

  return <>{children(eventIntentionProps)}</>;
}

function WithInPersonEventIntention({
  eventIntentionParams,
  shouldRequestPermission,
  children,
}: ChildProps<InPersonEventIntentionParams>) {
  const eventIntentionProps = useInPersonEventIntention(
    eventIntentionParams,
    shouldRequestPermission,
  );

  return <>{children(eventIntentionProps)}</>;
}
