import { LogoIcon } from '@assets/images';
import SquareContainer from '@atoms/SquareContainer';
import Colors from '@constants/Colors';
import useInPersonEventIntention from '@hooks/useInPersonEventIntention';
import { Cancel01Icon } from '@hugeicons/core-free-icons';
import { QueryKeys } from '@sunrise-ui/api-client';
import type { WithResponsive } from '@sunrise-ui/primitives';
import {
  Button,
  ButtonVariants,
  IconButton,
  Modal,
  TextReg,
  useDynamicStyles,
  useUserAuth,
} from '@sunrise-ui/primitives';
import { useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { Image, StyleSheet } from 'react-native';
import { QrCodeSvg, plainRenderer } from 'react-native-qr-svg';

const { ticketsKey, byEventIdKey } = QueryKeys.tickets;

type Props = {
  eventId: string;
  token?: string;
};

export default function CheckinButton({ eventId, token }: Props) {
  const { currentUserId } = useUserAuth();
  const [isQrOpen, setIsQrOpen] = useState(false);
  const queryClient = useQueryClient();
  const [squareSize, setSquareSize] = useState(0);
  const styles = useDynamicStyles(createStyles);
  const {
    eventIntention: checkNotificationsEligibility,
    isRunning: isRunninCheckIn,
    isSettingUp: isSettingUpCheckIn,
  } = useInPersonEventIntention({
    eventId,
    intention: 'checkin',
    eventType: 'inPerson',
  });

  const hideQrCode = () => {
    setIsQrOpen(false);
    void queryClient.invalidateQueries({
      queryKey: [ticketsKey, byEventIdKey, eventId],
    });
  };

  return (
    <>
      <Modal
        visible={isQrOpen}
        hide={hideQrCode}
        contentStyle={styles.modalContent}
      >
        <SquareContainer onResize={setSquareSize}>
          <QrCodeSvg
            value={JSON.stringify({
              userId: currentUserId,
              token,
            })}
            frameSize={squareSize}
            content={<Image source={LogoIcon} style={styles.icon} />}
            contentStyle={styles.qrContent}
            renderer={{ ...plainRenderer, options: { padding: 0 } }}
            backgroundColor={Colors.dark.purple0}
            dotColor="#fff"
          />
        </SquareContainer>
        <IconButton
          icon={Cancel01Icon}
          onPress={hideQrCode}
          backgroundColor={Colors.dark.purple0opacity50}
          style={styles.closeButton}
          size="medium"
        />
      </Modal>
      <Button
        size="small"
        variant={ButtonVariants.PINK}
        onPress={async () => {
          const isEligible = await checkNotificationsEligibility?.();
          if (isEligible) setIsQrOpen(true);
        }}
        loading={isSettingUpCheckIn || isRunninCheckIn}
        disabled={isRunninCheckIn}
        labelStyle={styles.buttonLabel}
      >
        <TextReg>Check In</TextReg>
      </Button>
    </>
  );
}

const createStyles = ({ isMobile, isTablet }: WithResponsive) =>
  StyleSheet.create({
    container: {
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
      padding: 20,
    },
    closeButton: { position: 'absolute', top: 16, right: 16 },
    icon: {
      width: '100%',
      height: '100%',
    },
    qrContent: {
      justifyContent: 'center',
      alignItems: 'center',
      padding: isMobile ? 8 : isTablet ? 16 : 20,
    },
    modalContent: { padding: isMobile ? 36 : 72 },
    buttonLabel: { marginHorizontal: 12 },
  });
