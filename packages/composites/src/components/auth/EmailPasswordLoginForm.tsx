import { yupResolver } from '@hookform/resolvers/yup';
import { useLogin } from '@sunrise-ui/api-client';
import {
  Button,
  ButtonVariants,
  InputError,
  TextInput,
  useDynamicStyles,
  useSnackbar,
  useUserAuth,
  type WithResponsive,
} from '@sunrise-ui/primitives';
import type { Href } from 'expo-router';
import { router } from 'expo-router';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import { object, string, type InferType } from 'yup';

const schema = object().shape({
  email: string().email('Must be a valid email address').required('Required'),
  password: string().required('Required'),
});

type LoginFormValues = InferType<typeof schema>;

type Props = {
  redirectUrlOnLogin: Href;
};

export function EmailPasswordLoginForm({ redirectUrlOnLogin }: Props) {
  const styles = useDynamicStyles(createStyles);
  const { mutateAsync: logIn } = useLogin();
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    defaultValues: { email: '', password: '' },
    resolver: yupResolver(schema),
  });
  const { showSnackbar } = useSnackbar();
  const {
    setCurrentUserId,
    setCurrentRefreshToken,
    setHasAuthenticated,
  } = useUserAuth();

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const response = await logIn(data);
      setCurrentUserId(response.user_id);
      setCurrentRefreshToken(response.refresh_token);
      setHasAuthenticated(true);
      router.navigate(redirectUrlOnLogin);
    } catch {
      showSnackbar({ text: 'Login failed. Please try again.', type: 'error' });
    }
  };

  return (
    <View style={styles.form}>
      <Controller
        control={control}
        render={({ field }) => (
          <TextInput
            label="Email"
            autoCapitalize="none"
            autoComplete="email"
            inputMode="email"
            {...field}
          />
        )}
        name="email"
      />
      <InputError fieldError={errors.email} />
      <Controller
        control={control}
        render={({ field }) => (
          <TextInput
            label="Password"
            autoCapitalize="none"
            secureTextEntry
            autoComplete="current-password"
            {...field}
          />
        )}
        name="password"
      />
      <InputError fieldError={errors.password} />
      <View>
        <Button
          variant={ButtonVariants.PURPLE}
          onPress={handleSubmit(onSubmit)}
          loading={isSubmitting}
          style={styles.button}
        >
          Log In
        </Button>
      </View>
    </View>
  );
}

const createStyles = ({ isMobile, isTablet }: WithResponsive) =>
  StyleSheet.create({
    form: {
      width: isMobile ? '100%' : isTablet ? '50%' : '30%',
      display: 'flex',
      flexDirection: 'column',
    },
    button: {
      width: '50%',
      alignSelf: 'center',
    },
  });
