import { LogoFull } from '@assets/images';
import SquareContainer from '@atoms/SquareContainer';
import Colors from '@constants/Colors';
import useImagePicker from '@hooks/useImagePicker';
import HeaderButton from '@molecules/HeaderButton';
import { useUpdateProfilePhoto } from '@queries/profiles';
import {
  Button,
  ButtonVariants,
  Header,
  HeaderTitle,
  Modal,
  PageHeader,
  useBanner,
  useDynamicStyles,
  useMediaQueries,
  type WithResponsive,
} from '@sunrise-ui/primitives';
import { type ImagePickerAsset } from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';

type Props = {
  visible: boolean;
  hideModal: () => void;
};

export default function UploadProfilePhotoModal({ visible, hideModal }: Props) {
  const { showBanner } = useBanner();
  const [squareSize, setSquareSize] = useState(0);
  const styles = useDynamicStyles(createStyles, { squareSize });
  const { isMobile } = useMediaQueries();

  const { mutateAsync: updateProfilePhoto } = useUpdateProfilePhoto();
  const [image, setImage] = useState<ImagePickerAsset | undefined>();
  const pickImage = useImagePicker();

  const handlePickImage = async () => {
    const img = await pickImage();
    setImage(img);
  };

  const handleSaveImage = async () => {
    if (!image) return;
    await updateProfilePhoto(image, {
      onSuccess() {
        hideModal();
        router.navigate('/');
        setTimeout(() => {
          showBanner({
            text: "All set! We'll email you a link to join the event. You can also join from here.",
            type: 'success',
          });
        }, 1000);
      },
    });
  };

  const handleCancel = () => {
    setImage(undefined);
    hideModal();
  };

  const header = isMobile ? (
    <Header
      headerLeft={<HeaderButton onPress={hideModal} />}
      headerTitle={<HeaderTitle logo={LogoFull} />}
    />
  ) : null;

  return (
    <Modal
      visible={visible}
      hide={hideModal}
      fullscreenOnBreakpoint={true}
      header={header}
      contentStyle={styles.modalContent}
    >
      <PageHeader
        header="Are you sure you want to skip?"
        subheader="You can't join events without an intro video, but you can upload a headshot and record your video later."
      />
      <SquareContainer
        onResize={(squareSize: number) => {
          setSquareSize(squareSize);
        }}
      >
        {image ? (
          <Image source={{ uri: image?.uri }} style={styles.photo} />
        ) : (
          <View style={[styles.profilePhoto, styles.photo]} />
        )}
      </SquareContainer>
      <View style={styles.buttons}>
        {!isMobile && (
          <Button
            variant={ButtonVariants.CLEAR}
            size="medium"
            onPress={handleCancel}
          >
            Cancel
          </Button>
        )}
        <Button
          variant={ButtonVariants.WHITE}
          size="medium"
          onPress={image ? handleSaveImage : handlePickImage}
        >
          {image ? 'Save' : 'Upload'}
        </Button>
      </View>
    </Modal>
  );
}

const createStyles = ({
  squareSize = 0,
  isMobile,
}: WithResponsive<{ squareSize: number }>) =>
  StyleSheet.create({
    profilePhoto: {
      backgroundColor: Colors.dark.opacity05,
    },
    photo: {
      width: squareSize,
      height: squareSize,
      borderRadius: squareSize / 2,
    },
    buttons: {
      display: 'flex',
      flexDirection: 'row',
      gap: 4,
      width: '100%',
      justifyContent: isMobile ? 'center' : 'flex-end',
    },
    modalContent: {
      gap: 32,
    },
  });
