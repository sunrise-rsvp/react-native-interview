import Colors from '@constants/Colors';
import useInPersonEventInformation from '@hooks/useInPersonEventInformation';
import useInPersonEventIntention from '@hooks/useInPersonEventIntention';
import { CheckmarkCircle01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';
import CheckinButton from '@molecules/CheckinButton';
import {
  Button,
  ButtonVariants,
  isNative,
  TextLight,
  TextReg,
  useDynamicStyles,
} from '@sunrise-ui/primitives';
import React from 'react';
import { StyleSheet, View } from 'react-native';

type Props = {
  eventId: string;
};

export default function InPersonEventButton({ eventId }: Props) {
  const styles = useDynamicStyles(createStyles);
  const { ticket, isToday, isLoading, isPast } =
    useInPersonEventInformation(eventId);
  const {
    eventIntention: buyTicket,
    isRunning: isRunningBuyTicket,
    isSettingUp: isSettingUpBuyTicket,
  } = useInPersonEventIntention({
    eventId,
    intention: 'buyTicket',
    eventType: 'inPerson',
  });

  if (isLoading)
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

  if (!ticket) {
    if (!isPast)
      return (
        <Button
          size="small"
          variant={ButtonVariants.PURPLE}
          onPress={buyTicket}
          disabled={isSettingUpBuyTicket || isRunningBuyTicket}
          loading={isRunningBuyTicket}
          labelStyle={styles.buttonLabel}
        >
          <TextReg>Buy Ticket</TextReg>
        </Button>
      );
  }

  if (ticket) {
    if (isToday)
      return <CheckinButton eventId={eventId} token={ticket.token} />;

    if (!isPast)
      return (
        <View style={styles.goingText}>
          <TextLight>{ticket.is_checked_in ? 'Checked In' : 'Going'}</TextLight>
          <HugeiconsIcon
            icon={CheckmarkCircle01Icon}
            color={Colors.dark.text}
            size={16}
          />
        </View>
      );
  }

  return null;
}

const createStyles = () =>
  StyleSheet.create({
    highlight: {
      shadowColor: Colors.dark.pink0opacity50,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 1,
      shadowRadius: isNative ? 8 : 15,
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
    buttonLabel: { marginHorizontal: 12 },
  });
