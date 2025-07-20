import Alert from '@atoms/Alert';
import Colors from '@constants/Colors';
import useCurrentEventInfo from '@contexts/useCurrentEventInfo';
import useGetExtensionInfo from '@hooks/useGetExtensionInfo';
import { Clock01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';
import ExtensionProgressBar from '@molecules/ExtensionProgressBar';
import TokenCountDisplay from '@molecules/TokenCountDisplay';
import ExtensionCommitmentDisplay from '@organisms/ExtensionCommitmentDisplay';
import { useGetRoom } from '@queries/rooms';
import {
  Loader,
  PageHeader,
  TextLight,
  TextMono,
  TextReg,
  useDynamicStyles,
  type WithResponsive,
} from '@sunrise-ui/primitives';
import { getRoomTimeLeft } from '@utils/timing';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

export default function TokenExtensionSideBar() {
  const { currentRoomId } = useCurrentEventInfo();
  const { data: room } = useGetRoom(currentRoomId);
  const { isAlmostFinished, millisecondsLeft } = getRoomTimeLeft(room);
  const [showAlert, setShowAlert] = useState(isAlmostFinished);
  const { isExtensionOpen, isLoading, hasExtensionExisted } =
    useGetExtensionInfo();
  const styles = useDynamicStyles(createStyles);

  useEffect(() => {
    setShowAlert(isAlmostFinished);
    if (millisecondsLeft && millisecondsLeft > 10000) {
      const timeout = setTimeout(() => {
        setShowAlert(true);
      }, millisecondsLeft - 10000);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [millisecondsLeft, isAlmostFinished]);

  const extensionFinishedDisplay = (
    <>
      <PageHeader
        header="Hooray!"
        subheader="This room has been extended. The next extension round will open when there is 1 minute left"
      />
      <TextReg style={styles.emoji}>&#x1F389;</TextReg>
    </>
  );

  const extensionOpenDisplay = (
    <>
      <View style={styles.timeContainer}>
        <View style={styles.clockIcon}>
          <HugeiconsIcon
            icon={Clock01Icon}
            color={Colors.dark.text}
            strokeWidth={2.5}
            size={24}
          />
        </View>
        <TextMono style={styles.clockText}>+1:00</TextMono>
      </View>
      <TextLight style={styles.contributeText}>
        Contribute tokens to add time to the clock!
      </TextLight>
      <ExtensionCommitmentDisplay />
      <TokenCountDisplay />
    </>
  );

  if (isLoading)
    return (
      <View style={styles.container}>
        <Loader />
      </View>
    );

  if (!isExtensionOpen && !hasExtensionExisted)
    return (
      <View style={styles.container}>
        <PageHeader
          header=""
          subheader="An extension round will open when there is 1 minute left"
        />
      </View>
    );

  return (
    <View style={styles.container}>
      {isExtensionOpen && showAlert && (
        <Alert text="Extend now or this event will end!" />
      )}
      <ExtensionProgressBar />
      {isExtensionOpen ? extensionOpenDisplay : extensionFinishedDisplay}
    </View>
  );
}

const createStyles = ({ isMobile }: WithResponsive) =>
  StyleSheet.create({
    container: {
      width: '100%',
      paddingTop: 16,
      padding: isMobile ? 16 : 20,
      alignItems: 'center',
      justifyContent: 'flex-start',
      gap: isMobile ? 16 : 20,
    },
    timeContainer: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 22,
      height: 44,
      backgroundColor: Colors.dark.purple1opacity50,
    },
    clockIcon: {
      left: 0,
      right: 0,
      backgroundColor: Colors.dark.purple1,
      borderRadius: 22,
      width: 44,
      height: 44,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    clockText: {
      paddingLeft: 10,
      paddingRight: 14,
      fontSize: 24,
    },
    contributeText: {
      textAlign: 'center',
    },
    emoji: {
      fontSize: 140,
    },
  });
