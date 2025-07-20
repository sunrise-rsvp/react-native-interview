import { Cancel01Icon } from '@hugeicons/core-free-icons';
import HeaderButton from '@molecules/HeaderButton';
import {
  Button,
  ButtonVariants,
  Colors,
  Header,
  Modal,
  TextBold,
  useDynamicStyles,
  type WithResponsive,
} from '@sunrise-ui/primitives';
import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { StyleSheet, View } from 'react-native';

type Props = {
  visible: boolean;
  hideModal: () => void;
};

export default function UserSettingsModal({ visible, hideModal }: Props) {
  const styles = useDynamicStyles(createStyles);

  const headerTitle = <TextBold style={styles.title}>Settings</TextBold>;

  const header = (
    <Header
      headerRight={<HeaderButton icon={Cancel01Icon} onPress={hideModal} />}
      headerTitle={headerTitle}
    />
  );

  return (
    <Modal
      visible={visible}
      hide={hideModal}
      fullscreenOnBreakpoint={true}
      header={header}
      contentStyle={styles.modalContent}
    >
      <View style={styles.container}>
        <View style={styles.section}>
          <TextBold style={styles.dangerTitle}>Danger Zone</TextBold>
          <Button
            mode="contained"
            variant={ButtonVariants.WHITE}
            onPress={() => {
              // Open the deletion request form in the in-app browser
              void WebBrowser.openBrowserAsync(
                'https://forms.gle/YEWFHfNJmkvHb9cVA',
              );
            }}
          >
            Delete Account
          </Button>
        </View>
      </View>
    </Modal>
  );
}

const createStyles = ({ isMobile, isTablet }: WithResponsive<Props>) =>
  StyleSheet.create({
    modalContent: {
      padding: 0,
    },
    container: {
      padding: 20,
      flex: 1,
    },
    section: {
      padding: isMobile ? 12 : isTablet ? 16 : 20,
      borderRadius: 16,
      backgroundColor: Colors.pink0opacity50,
      alignItems: 'center',
    },
    title: {
      fontSize: isMobile ? 16 : 18,
    },
    sectionTitle: {
      fontSize: 18,
      marginBottom: 20,
    },
    dangerTitle: {
      fontSize: 16,
      marginBottom: 15,
    },
  });
