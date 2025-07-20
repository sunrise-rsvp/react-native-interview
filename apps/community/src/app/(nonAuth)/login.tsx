import Colors from '@constants/Colors';
import { EmailPasswordLoginForm } from '@sunrise-ui/composites';
import {
  PageHeader,
  useDynamicStyles,
  useNavigateWithRedirectUrl,
  type WithResponsive,
} from '@sunrise-ui/primitives';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function LoginLongScreen() {
  const styles = useDynamicStyles(createStyles);
  const { redirectUrl } = useNavigateWithRedirectUrl();

  return (
    <View style={styles.container}>
      <PageHeader
        header="Log In"
        subheader="You're one step closer to your next big thing"
      />
      <EmailPasswordLoginForm
        redirectUrlOnLogin={redirectUrl ? redirectUrl : '/events'}
      />
    </View>
  );
}

const createStyles = ({ isMobile, isTablet }: WithResponsive) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      gap: isMobile ? 60 : 100,
      padding: isMobile ? 12 : isTablet ? 16 : 20,
    },
    form: {
      width: isMobile ? '100%' : isTablet ? '50%' : '30%',
      display: 'flex',
      flexDirection: 'column',
    },
    button: {
      width: '50%',
      alignSelf: 'center',
    },
    signupLink: {
      color: Colors.dark.purple1,
    },
  });
