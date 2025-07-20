import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';

import Card from '@atoms/Card';
import ProfileBasicInfo from '@atoms/ProfileBasicInfo';
import Colors from '@constants/Colors';
import usePushNotifications from '@contexts/usePushNotifications';
import type { EventIntentionProps } from '@hoc/withEventIntention';
import withEventIntention from '@hoc/withEventIntention';
import { yupResolver } from '@hookform/resolvers/yup';
import useImagePicker from '@hooks/useImagePicker';
import { UserCircleIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';
import {
  useGetProfile,
  useUpdateProfile,
  useUpdateProfilePhoto,
} from '@queries/profiles';
import type {
  GenderPronouns,
  UpdateProfileInput,
} from '@sunrise-ui/api/profile';
import {
  Button,
  ButtonVariants,
  Dropdown,
  InputError,
  Loader,
  PageHeader,
  TextInput,
  useDynamicStyles,
  useMediaQueries,
  useNavigateWithRedirectUrl,
  useSnackbar,
  useUserAuth,
  type WithResponsive,
} from '@sunrise-ui/primitives';
import type { ImagePickerAsset } from 'expo-image-picker';
import { Controller, useForm } from 'react-hook-form';
import { object, string, type InferType } from 'yup';

const schema = object().shape({
  firstName: string()
    .required('Required')
    .max(20, 'Must be 20 characters or less'),
  lastName: string()
    .required('Required')
    .max(20, 'Must be 20 characters or less'),
  pronouns: string(),
  headline: string()
    .required('Required')
    .max(40, 'Must be 40 characters or less'),
});

type ProfileFormValues = InferType<typeof schema>;

function WelcomeScreen({
  eventIntention,
  isRunning,
  isSettingUp,
}: EventIntentionProps) {
  const { isMobile } = useMediaQueries();
  const styles = useDynamicStyles(createStyles);
  const pickImage = useImagePicker();
  const { showSnackbar } = useSnackbar();
  const { requestPermission } = usePushNotifications();
  const { currentUserId } = useUserAuth();
  const { redirectUrl } = useNavigateWithRedirectUrl();

  const { data: existingProfile, isLoading: isLoadingExistingProfile } =
    useGetProfile(currentUserId);
  const [isFormReady, setIsFormReady] = useState(!isLoadingExistingProfile);
  const [existingProfileImageUri, setExistingProfileImageUri] =
    useState<string>();
  const [image, setImage] = useState<ImagePickerAsset>();

  useEffect(() => {
    void requestPermission();
  }, []);

  const { mutateAsync: updateProfile } = useUpdateProfile();
  const { mutateAsync: updateProfilePhoto } = useUpdateProfilePhoto();

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    watch,
    reset,
  } = useForm<ProfileFormValues>({
    defaultValues: {
      firstName: existingProfile?.first_name ?? '',
      lastName: existingProfile?.last_name ?? '',
      pronouns: existingProfile?.pronouns ?? '',
      headline: existingProfile?.headline ?? '',
    },
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (!isLoadingExistingProfile && existingProfile) {
      reset({
        firstName: existingProfile.first_name ?? '',
        lastName: existingProfile.last_name ?? '',
        pronouns: existingProfile.pronouns ?? '',
        headline: existingProfile.headline ?? '',
      });
      setExistingProfileImageUri(existingProfile?.photos?.small);
      setIsFormReady(true);
    }
  }, [isLoadingExistingProfile]);

  const handlePickImage = async () => {
    const img = await pickImage();
    setImage(img);
  };

  const saveProfile = async (data: ProfileFormValues) => {
    if (!data || !image) return;
    try {
      const { firstName, lastName, pronouns, headline } = data;
      const updateProfileInput: Omit<UpdateProfileInput, 'user_id'> = {
        first_name: firstName,
        last_name: lastName,
        headline: headline,
      };
      if (pronouns) updateProfileInput.pronouns = pronouns as GenderPronouns;

      if (image) {
        await Promise.all([
          updateProfile(updateProfileInput),
          updateProfilePhoto(image),
        ]);
      } else {
        await updateProfile(updateProfileInput);
      }

      if (eventIntention) {
        await eventIntention();
      } else {
        router.navigate(redirectUrl ? redirectUrl : '/events');
      }
    } catch (e) {
      showSnackbar({
        text: 'Profile failed to save. Please try again.',
        type: 'error',
      });
      throw e;
    }
  };

  const isSettingUpEventIntention = Boolean(eventIntention && isSettingUp);
  const isRunningEventIntention = Boolean(eventIntention && isRunning);
  const imageUri = image?.uri || existingProfileImageUri;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <PageHeader
        header="Fill out your profile."
        subheader="This is how other attendees will see you."
      />
      <View style={styles.infoPreview}>
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            aria-label="Your Profile Photo Preview"
            style={styles.circle}
          />
        ) : (
          <View style={styles.circle}>
            <HugeiconsIcon
              icon={UserCircleIcon}
              color={Colors.dark.text}
              size={isMobile ? 50 : 95}
              strokeWidth={1}
            />
          </View>
        )}
        <ProfileBasicInfo
          firstName={watch('firstName') || 'Satya'}
          lastName={watch('lastName') || 'Nadella'}
          pronouns={watch('pronouns')}
          headline={watch('headline') || 'CEO of Microsoft'}
          isLoading={!isFormReady}
        />
      </View>
      <Card style={styles.card} shadowColor={Colors.dark.purple1}>
        {!isFormReady && (
          <View style={styles.cardLoader}>
            <Loader />
          </View>
        )}
        {isFormReady && (
          <>
            <View style={styles.nameInputs}>
              <View style={styles.nameInput}>
                <Controller
                  control={control}
                  render={({ field }) => (
                    <TextInput label="First Name*" {...field} maxLength={20} />
                  )}
                  name="firstName"
                />
                <InputError fieldError={errors.firstName} />
              </View>
              <View style={styles.nameInput}>
                <Controller
                  control={control}
                  render={({ field }) => (
                    <TextInput label="Last Name*" {...field} maxLength={20} />
                  )}
                  name="lastName"
                />
                <InputError fieldError={errors.lastName} />
              </View>
              <View style={styles.pronouns}>
                <Controller
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <Dropdown
                      placeholder="Pronouns"
                      options={[
                        { label: 'he/him', value: 'he/him' },
                        { label: 'she/her', value: 'she/her' },
                        { label: 'they/them', value: 'they/them' },
                      ]}
                      value={value}
                      onChange={onChange}
                    />
                  )}
                  name="pronouns"
                />
                <InputError fieldError={errors.pronouns} />
              </View>
            </View>
            <View style={styles.headline}>
              <Controller
                control={control}
                render={({ field }) => (
                  <TextInput label="Headline*" maxLength={40} {...field} />
                )}
                name="headline"
              />
              <InputError fieldError={errors.headline} />
            </View>
            <Button
              variant={ButtonVariants.WHITE}
              size="medium"
              onPress={handlePickImage}
            >
              Upload Headshot
            </Button>
            <Button
              style={styles.saveButton}
              variant={ButtonVariants.PURPLE}
              size={isMobile ? 'medium' : 'large'}
              disabled={
                Object.keys(errors).length > 0 ||
                !image ||
                isSettingUpEventIntention ||
                isRunningEventIntention ||
                isSubmitting
              }
              loading={isSubmitting || isRunningEventIntention}
              onPress={handleSubmit(saveProfile)}
            >
              Save
            </Button>
          </>
        )}
      </Card>
    </ScrollView>
  );
}

const createStyles = ({ isMobile, isTablet }: WithResponsive) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      alignItems: 'center',
      gap: isMobile ? 30 : 60,
    },
    infoPreview: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      gap: 12,
    },
    circle: {
      width: isMobile ? 50 : 95,
      height: isMobile ? 50 : 95,
      borderRadius: 100,
    },
    samplePersonCircle: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      borderColor: '#fff',
      borderWidth: 1,
    },
    card: {
      width: isMobile ? '100%' : isTablet ? '80%' : '60%',
      gap: 0,
      padding: isMobile ? 20 : 24,
    },
    nameInputs: {
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      gap: isMobile ? 0 : isTablet ? 16 : 20,
      width: '100%',
    },
    nameInput: {
      flex: isMobile ? undefined : 1,
    },
    pronouns: {
      minWidth: 160,
    },
    headline: {
      width: '100%',
    },
    uploadImage: {
      alignSelf: 'flex-start',
    },
    saveButton: {
      width: isMobile ? 120 : 150,
      marginTop: 27,
    },
    cardLoader: {
      height: isMobile ? 447 : 293,
    },
  });

export default withEventIntention(WelcomeScreen);
