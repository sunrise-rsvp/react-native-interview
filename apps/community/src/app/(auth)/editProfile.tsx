import ProfileImg from '@atoms/ProfileImg';
import Colors from '@constants/Colors';
import { yupResolver } from '@hookform/resolvers/yup';
import useImagePicker from '@hooks/useImagePicker';
import { Tick01Icon } from '@hugeicons/core-free-icons';
import HeaderButton from '@molecules/HeaderButton';
import ProfileSiteButtons from '@molecules/ProfileSiteButtons';
import {
  useGetProfile,
  useUpdateProfile,
  useUpdateProfileLinks,
  useUpdateProfilePhoto
} from '@queries/profiles';
import {
  type GenderPronouns,
  type ProfileLinks,
  type UpdateProfileLinksInput
} from '@sunrise-ui/api/profile';
import {
  Button,
  Dropdown,
  Header,
  InputError,
  Loader,
  TextInput,
  useDynamicStyles,
  useMediaQueries,
  useSetHeader,
  useUserAuth,
  type WithResponsive
} from '@sunrise-ui/primitives';
import { type ImagePickerAsset } from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions
} from 'react-native';
import { object, string, type InferType } from 'yup';
import { router } from 'expo-router';

export type AdditionalProfileInfo = {
  siteLinks?: ProfileLinks;
  profilePhoto?: ImagePickerAsset;
};

// the possible sites from ProfileLinks
export type ProfileSite = keyof UpdateProfileLinksInput;

type SiteOption = {
  label: string;
  value: ProfileSite;
};

const siteOptions: SiteOption[] = [
  { label: 'LinkedIn', value: 'linkedin' },
  { label: 'GitHub', value: 'github' },
  { label: 'X', value: 'x' },
  { label: 'Website', value: 'website' }
];

const schema = object({
  profilePhoto: object(),
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
  siteLinks: object({
    linkedin: string()
      .matches(
        /^https:\/\/(www\.)?linkedin\.com\/in\/[\w-]+$/,
        'Must be a valid LinkedIn URL like https://www.linkedin.com/in/communiful'
      )
      .notRequired()
      .nullable(),
    github: string()
      .matches(
        /^https:\/\/(www\.)?github\.com\/[\w-]+$/,
        'Must be a valid GitHub URL like https://github.com/communiful'
      )
      .notRequired()
      .nullable(),
    x: string()
      .matches(
        /^https:\/\/(www\.)?x\.com\/[\w-]+$/,
        'Must be a valid X URL like https://x.com/communiful'
      )
      .notRequired()
      .nullable(),
    website: string()
      .url('Must be a valid URL like https://www.joincommuniful.com')
      .notRequired()
      .nullable()
  }).notRequired()
});

type ProfileFormValues = InferType<typeof schema> & AdditionalProfileInfo;

export default function EditProfileScreen() {
  const { isMobile, isTablet } = useMediaQueries();
  const { width: screenWidth } = useWindowDimensions();
  const styles = useDynamicStyles(createStyles, { screenWidth });

  const { currentUserId } = useUserAuth();
  const pickImage = useImagePicker();
  const { isLoading, data: profile } = useGetProfile(currentUserId);
  const { mutateAsync: updateProfile } = useUpdateProfile();
  const { mutateAsync: updateProfileLinks } = useUpdateProfileLinks();
  const { mutateAsync: updateProfilePhoto } = useUpdateProfilePhoto();

  const defaultValues = {
    firstName: profile?.first_name ?? '',
    lastName: profile?.last_name ?? '',
    pronouns: profile?.pronouns ?? '',
    headline: profile?.headline ?? '',
    siteLinks: profile?.links,
    profilePhoto: {}
  };

  const {
    handleSubmit,
    getValues,
    setValue,
    trigger,
    control,
    formState: { errors, isValid, isSubmitting },
    reset
  } = useForm<ProfileFormValues, unknown, ProfileFormValues>({
    defaultValues,
    // @ts-expect-error - type doesn't like the nullable possibility
    resolver: yupResolver(schema)
  });
  const [editingSite, setEditingSite] = useState<ProfileSite>();

  const handleBack = () => router.navigate('/profile');

  useSetHeader({
    header: () => (
      <Header
        headerLeft={<HeaderButton onPress={handleBack} />}
        headerRight={
          <HeaderButton
            icon={Tick01Icon}
            onPress={async () => {
              await handleSubmit(saveProfile)();
            }}
            loading={isSubmitting}
          />
        }
      />
    )
  });

  useEffect(() => {
    if (!isLoading) reset(defaultValues);
  }, [isLoading]);

  const handlePickImage = async () => {
    const img = await pickImage();
    if (img) setValue('profilePhoto', img);
  };

  const saveProfile = async (data: ProfileFormValues) => {
    if (data) {
      if (data.siteLinks !== profile?.links) {
        await updateProfileLinks({
          linkedin: data.siteLinks?.linkedin,
          github: data.siteLinks?.github,
          x: data.siteLinks?.x,
          website: data.siteLinks?.website
        });
      }

      if (data.profilePhoto.uri) await updateProfilePhoto(data.profilePhoto);

      await updateProfile(
        {
          first_name: data.firstName,
          last_name: data.lastName,
          pronouns: (data.pronouns as GenderPronouns) || undefined,
          headline: data.headline
        },
        {
          onSuccess() {
            handleBack();
          }
        }
      );
    }
  };

  const availableSiteOptions = siteOptions.filter(
    (so) => !getValues(`siteLinks.${so.value}`) || so.value === editingSite
  );
  const hasAvailableSiteOptions = editingSite
    ? availableSiteOptions.length > 1
    : availableSiteOptions.length > 0;

  const addSiteLink = () => {
    setEditingSite(availableSiteOptions[0].value);
  };

  if (isLoading) return <Loader />;

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        <Controller
          control={control}
          render={() => (
            <ProfileImg
              userId={currentUserId}
              imgSize="large"
              styleSize={isMobile ? 150 : isTablet ? 225 : 300}
              tempUrl={getValues('profilePhoto')?.uri}
            />
          )}
          name="profilePhoto"
        />
        <View style={styles.buttons}>
          <Button onPress={handlePickImage}>Replace Photo</Button>
        </View>

        <View style={styles.inputSection}>
          <View>
            <Controller
              control={control}
              render={({ field }) => (
                <TextInput label="First Name" {...field} />
              )}
              name="firstName"
            />
            <InputError fieldError={errors.firstName} />
            <Controller
              control={control}
              render={({ field }) => <TextInput label="Last Name" {...field} />}
              name="lastName"
            />
            <InputError fieldError={errors.lastName} />
            <Controller
              control={control}
              render={({ field: { value, onChange } }) => (
                <Dropdown
                  placeholder="Pronouns"
                  options={[
                    { label: 'he/him', value: 'he/him' },
                    { label: 'she/her', value: 'she/her' },
                    { label: 'they/them', value: 'they/them' }
                  ]}
                  value={value}
                  onChange={(value?: string) => {
                    onChange(value ?? '');
                  }}
                />
              )}
              name="pronouns"
            />
            <InputError fieldError={errors.pronouns} />
            <Controller
              control={control}
              render={({ field }) => <TextInput label="Headline" {...field} />}
              name="headline"
            />
            <InputError fieldError={errors.headline} />
          </View>
          <Controller
            control={control}
            render={({ field: { value, onChange } }) => (
              <View style={styles.siteLinkSection}>
                <ProfileSiteButtons
                  userId={currentUserId}
                  siteLinks={value}
                  onButtonPress={(siteLink: ProfileSite) => {
                    setEditingSite(siteLink);
                  }}
                  onAddPress={hasAvailableSiteOptions ? addSiteLink : undefined}
                />
                {editingSite && (
                  <View style={styles.linkInputSection}>
                    <Dropdown
                      menuStyle={styles.dropdown}
                      notClearable
                      placeholder="Website"
                      options={availableSiteOptions}
                      value={editingSite}
                      onChange={(site) => {
                        setEditingSite(site);
                      }}
                    />
                    <View>
                      <TextInput
                        label="URL"
                        value={value?.[editingSite] ?? ''}
                        onChange={(val) => {
                          onChange({ ...value, [editingSite]: val });
                        }}
                      />
                      <InputError
                        fieldError={errors.siteLinks?.[editingSite]}
                      />
                    </View>
                    <View style={styles.siteLinkButtons}>
                      <Button
                        onPress={() => {
                          onChange({ ...value, [editingSite]: undefined });
                          setEditingSite(undefined);
                        }}
                      >
                        Delete
                      </Button>
                      <Button
                        onPress={async () => {
                          await trigger(`siteLinks.${editingSite}`);
                          if (isValid) setEditingSite(undefined);
                        }}
                      >
                        Save
                      </Button>
                    </View>
                  </View>
                )}
              </View>
            )}
            name="siteLinks"
          />
        </View>
      </ScrollView>
    </>
  );
}

const createStyles = ({
                        isMobile,
                        isTablet,
                        screenWidth
                      }: WithResponsive<{ screenWidth: number }>) =>
  StyleSheet.create({
    container: {
      backgroundColor: Colors.dark.purple0,
      padding: isMobile ? 12 : isTablet ? 16 : 20,
      paddingTop: 0,
      width: screenWidth,
      alignItems: 'center',
      gap: 20
    },
    buttons: {
      display: 'flex',
      flexDirection: 'column',
      gap: 20
    },
    inputSection: {
      width: isMobile ? '100%' : isTablet ? '70%' : '50%'
    },
    siteLinkSection: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 27
    },
    linkInputSection: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%'
    },
    dropdown: {
      marginBottom: 27
    },
    siteLinkButtons: {
      justifyContent: 'center',
      display: 'flex',
      flexDirection: 'row',
      gap: 12
    }
  });
