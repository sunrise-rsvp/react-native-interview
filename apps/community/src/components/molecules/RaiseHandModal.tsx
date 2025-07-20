import { LogoFull } from '@assets/images';
import useMediaDeviceReadiness from '@hooks/useMediaDeviceReadiness';
import { Cancel01Icon } from '@hugeicons/core-free-icons';
import HeaderButton from '@molecules/HeaderButton';
import AvSettingsCard from '@organisms/AvSettingsCard';
import {
  Button,
  ButtonVariants,
  Header,
  HeaderTitle,
  IconButton,
  Modal,
  PageHeader,
  TextReg,
  useDynamicStyles,
  useMediaQueries,
  type WithResponsive,
} from '@sunrise-ui/primitives';
import React from 'react';
import { StyleSheet } from 'react-native';

type Props = {
  showModal: boolean;
  isPending: boolean;
  closeModal: () => void;
  onReadyPress: () => Promise<void>;
};

export default function RaiseHandModal({
  showModal,
  closeModal,
  onReadyPress,
  isPending,
}: Props) {
  const { isMobile } = useMediaQueries();
  const { isReadyToRecord } = useMediaDeviceReadiness();
  const styles = useDynamicStyles(createStyles);

  const modalHeader = (
    <Header
      headerLeft={<HeaderButton icon={Cancel01Icon} onPress={closeModal} />}
      headerTitle={<HeaderTitle logo={LogoFull} />}
    />
  );

  return (
    <Modal
      visible={showModal}
      hide={closeModal}
      contentStyle={styles.modal}
      fullscreenOnBreakpoint={true}
      header={isMobile ? modalHeader : null}
    >
      {!isMobile && (
        <IconButton
          onPress={closeModal}
          icon={Cancel01Icon}
          style={styles.closeButton}
          size={isMobile ? 'small' : 'medium'}
        />
      )}
      <PageHeader
        header="Big hype! You're raising your hand."
        subheader="This is how you will look if the host calls on you."
        headerStyle={styles.modalHeading}
      />
      <AvSettingsCard withExample={false} />
      <Button
        onPress={onReadyPress}
        variant={ButtonVariants.PURPLE}
        disabled={!isReadyToRecord}
        loading={isPending}
      >
        <TextReg>Ready</TextReg>
      </Button>
    </Modal>
  );
}

const createStyles = ({ isMobile, isTablet }: WithResponsive) =>
  StyleSheet.create({
    closeButton: {
      position: 'absolute',
      top: isMobile ? 15 : 20,
      right: isMobile ? undefined : 20,
      left: isMobile ? 15 : undefined,
      zIndex: 1,
    },
    modalHeading: {
      marginRight: isMobile ? 36 : isTablet ? 32 : 24,
      marginLeft: isMobile ? 36 : isTablet ? 32 : 24,
    },
    modal: {
      display: 'flex',
      gap: 20,
    },
  });
