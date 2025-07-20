import Colors from '@constants/Colors';
import useVirtualEventInformation from '@hooks/useVirtualEventInformation';
import useVirtualEventIntention from '@hooks/useVirtualEventIntention';
import { CheckmarkCircle01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';
import {
  Button,
  ButtonVariants,
  TextLight,
  TextReg,
  isNative,
  useDynamicStyles,
} from '@sunrise-ui/primitives';
import React from 'react';
import { StyleSheet, View } from 'react-native';

type Props = {
  eventId: string;
  dynamicIsPresent: boolean | undefined;
};
export default function RoomCardButton({ eventId, dynamicIsPresent }: Props) {
  const styles = useDynamicStyles(createStyles);
  const { hasTicket, waitingForHost, isLoadingEventInformation, isFuture } =
    useVirtualEventInformation(eventId);

  const {
    eventIntention: rsvpToEvent,
    isRunning: isRunningRsvp,
    isSettingUp: isSettingUpRsvp,
  } = useVirtualEventIntention({ eventId, intention: 'rsvp' });
  const {
    eventIntention: joinEvent,
    isRunning: isRunningJoin,
    isSettingUp: isSettingUpJoin,
  } = useVirtualEventIntention({ eventId, intention: 'join' });

  if (isLoadingEventInformation)
    return (
      <Button
        loading={true}
        size="small"
        disabled={true}
        labelStyle={styles.placeholderButtonLabel}
      >
        {''}
      </Button>
    );

  return (
    <>
      {dynamicIsPresent && (
        <View style={styles.joinButton}>
          <Button
            size="small"
            variant={ButtonVariants.PINK}
            style={styles.highlight}
            onPress={joinEvent}
            disabled={waitingForHost || isSettingUpJoin || isRunningJoin}
            loading={isRunningJoin}
          >
            <TextReg>Join</TextReg>
          </Button>
          {waitingForHost && <TextReg>Waiting for host</TextReg>}
        </View>
      )}
      {!dynamicIsPresent && isFuture && hasTicket && (
        <View style={styles.goingText}>
          <TextLight>Going</TextLight>
          <HugeiconsIcon
            icon={CheckmarkCircle01Icon}
            color={Colors.dark.text}
            size={16}
          />
        </View>
      )}
      {!dynamicIsPresent && isFuture && !hasTicket && (
        <Button
          size="small"
          variant={ButtonVariants.PURPLE}
          onPress={rsvpToEvent}
          disabled={isSettingUpRsvp || isRunningRsvp}
          loading={isSettingUpRsvp}
        >
          <TextReg>RSVP</TextReg>
        </Button>
      )}
    </>
  );
}

const createStyles = () =>
  StyleSheet.create({
    highlight: {
      shadowColor: Colors.dark.pink0opacity50,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 1,
      shadowRadius: isNative ? 8 : 15,
    },
    joinButton: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      alignItems: 'flex-end',
    },
    goingText: {
      display: 'flex',
      flexDirection: 'row',
      gap: 4,
      alignItems: 'center',
      justifyContent: 'flex-end',
      height: 30,
    },
    placeholderButtonLabel: {
      marginLeft: 16,
      marginRight: 16,
    },
  });
