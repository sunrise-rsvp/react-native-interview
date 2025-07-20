import ProfileResult from '@molecules/ProfileResult';
import PersonSearch from '@organisms/PersonSearch';
import { type Profile } from '@sunrise-ui/api/profile';
import {
  Button,
  TextReg,
  useDynamicStyles,
  type WithResponsive,
} from '@sunrise-ui/primitives';
import React from 'react';
import { StyleSheet, View } from 'react-native';

type Props = {
  requestor?: Profile;
  setRequestor: (value: Profile) => void;
  acceptor?: Profile;
  setAcceptor: (value?: Profile) => void;
  canSwitch: boolean;
};

export default function IntroPersonSelection({
  requestor,
  setRequestor,
  acceptor,
  setAcceptor,
  canSwitch,
}: Props) {
  const styles = useDynamicStyles(createStyles, { requestor });

  const handleSwitch = () => {
    if (acceptor) {
      setAcceptor(requestor);
      setRequestor(acceptor);
    }
  };

  return (
    <View style={styles.names}>
      <View style={styles.requestorContainer}>
        <View style={styles.requestor}>
          <TextReg>Introducing</TextReg>
          {requestor ? (
            <ProfileResult userId={requestor.user_id} />
          ) : (
            <PersonSearch
              onSelect={(profile) => {
                setRequestor(profile);
              }}
              maxHeight={300}
              hiddenIds={acceptor ? [acceptor.user_id] : undefined}
            />
          )}
        </View>
      </View>
      {requestor && canSwitch && (
        <View style={styles.buttonContainer}>
          <Button onPress={handleSwitch}>Switch</Button>
        </View>
      )}
      {requestor && (
        <View style={styles.acceptor}>
          <TextReg>To</TextReg>
          {acceptor ? (
            <ProfileResult userId={acceptor.user_id} />
          ) : (
            <PersonSearch
              onSelect={(profile) => {
                setAcceptor(profile);
              }}
              maxHeight={300}
              hiddenIds={requestor ? [requestor.user_id] : undefined}
            />
          )}
        </View>
      )}
    </View>
  );
}

const createStyles = ({
  isMobile,
  isTablet,
  requestor,
}: WithResponsive<Props>) =>
  StyleSheet.create({
    names: {
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      justifyContent: 'space-evenly',
      alignItems: 'flex-start',
      width: '100%',
      gap: 20,
    },
    requestorContainer: {
      minWidth: isMobile ? '100%' : isTablet ? '40%' : '30%',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: isMobile
        ? 'flex-start'
        : requestor
          ? 'flex-end'
          : 'center',
    },
    requestor: {
      width: isMobile || !requestor ? '100%' : undefined,
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
    },
    buttonContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: isMobile ? undefined : '100%',
    },
    acceptor: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      justifyContent: 'flex-start',
      minWidth: isMobile ? '100%' : isTablet ? '40%' : '30%',
    },
  });
