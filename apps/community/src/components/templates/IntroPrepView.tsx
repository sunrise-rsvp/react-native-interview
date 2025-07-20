import React, {
  useState,
  type PropsWithChildren,
  type ReactElement,
} from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import RecordActionButtons from '@molecules/RecordActionButtons';
import UploadProfilePhotoModal from '@molecules/UploadProfilePhotoModal';
import AvSettingsCard from '@organisms/AvSettingsCard';
import { useDynamicStyles, type WithResponsive } from '@sunrise-ui/primitives';

type Props = {
  page: 'profile' | 'onboarding' | 'intro';
  onPressRecord: () => void;
  pageHeader: ReactElement;
};

export default function IntroPrepView({
  page,
  pageHeader,
  onPressRecord,
  children,
}: PropsWithChildren<Props>) {
  const styles = useDynamicStyles(createStyles);
  const [modalVisible, setModalVisible] = useState(false);
  const isOnboardingPage = page === 'onboarding';

  const showModal = () => {
    setModalVisible(true);
  };

  const hideModal = () => {
    setModalVisible(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {pageHeader}
      <View style={styles.row}>
        <AvSettingsCard maxCameraSize={450} />
        {children}
      </View>
      <RecordActionButtons
        onPressRecord={onPressRecord}
        showModal={isOnboardingPage ? showModal : undefined}
      />
      {isOnboardingPage && (
        <UploadProfilePhotoModal visible={modalVisible} hideModal={hideModal} />
      )}
    </ScrollView>
  );
}

const createStyles = ({ isMobile, isTablet }: WithResponsive) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: isMobile ? 12 : isTablet ? 16 : 20,
      alignItems: 'center',
      gap: isMobile ? 30 : 60,
    },
    row: {
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      gap: isMobile ? 30 : 60,
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      flex: 1,
    },
  });
