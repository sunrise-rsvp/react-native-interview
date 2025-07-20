import React from 'react';
import { StyleSheet, View } from 'react-native';

import VideoPlayer from '@organisms/VideoPlayer';
import {
  Button,
  ButtonVariants,
  PageHeader,
  useDynamicStyles,
  useMediaQueries,
  useSearchParams,
  useUserAuth,
  type WithResponsive,
} from '@sunrise-ui/primitives';

type Props = {
  handleSave: () => Promise<void>;
  headerText?: string;
  isSaving: boolean;
};
export default function IntroPreviewView({
  handleSave,
  headerText = 'Preview your intro video.',
  isSaving,
}: Props) {
  const { isMobile } = useMediaQueries();
  const styles = useDynamicStyles(createStyles);

  const { uri } = useSearchParams<{ uri: string }>();
  const { currentUserId } = useUserAuth();

  return (
    <View style={styles.container}>
      <PageHeader
        header={headerText}
        subheader="Make sure you are being introduced exactly as you want."
      />
      <VideoPlayer url={uri} userId={currentUserId} isLooping />
      <Button
        size={isMobile ? 'medium' : 'large'}
        variant={ButtonVariants.PURPLE}
        onPress={handleSave}
        loading={isSaving}
      >
        Save
      </Button>
    </View>
  );
}

const createStyles = ({ isMobile, isTablet }: WithResponsive) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: isMobile ? 12 : isTablet ? 16 : 20,
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: isMobile ? 30 : 60,
    },
  });
