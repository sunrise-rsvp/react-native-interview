import { yupResolver } from '@hookform/resolvers/yup';
import { useSingleFactorSignIn } from '@sunrise-ui/api-client';
import type { WithResponsive } from '@sunrise-ui/primitives';
import {
  Button,
  ButtonVariants,
  InputError,
  TermsOfService,
  TextInput,
  useDynamicStyles,
  useNavigateWithRedirectUrl,
} from '@sunrise-ui/primitives';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import { Checkbox } from 'react-native-paper';
import { boolean, object, string, type InferType } from 'yup';

const schema = object().shape({
  email: string().email('Must be a valid email address').required('Required'),
  hasAcceptedTerms: boolean().when('$isSignUp', {
    is: true,
    then: (schema) =>
      schema
        .oneOf([true], 'You must accept our terms to continue')
        .required('You must accept our terms to continue'),
  }),
});

type SignInFormValues = InferType<typeof schema>;

export function EmailLoginForm({ isSignUp }: { isSignUp?: boolean }) {
  const styles = useDynamicStyles(createStyles);
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormValues>({
    defaultValues: { email: '' },
    resolver: yupResolver(schema),
    context: { isSignUp },
  });
  const { mutateAsync: signIn } = useSingleFactorSignIn();
  const { navigate } = useNavigateWithRedirectUrl();

  const onSubmit = async ({ email, hasAcceptedTerms }: SignInFormValues) => {
    await signIn({ email, terms_accepted: hasAcceptedTerms });
    navigate('/confirm', { email: encodeURIComponent(email) });
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
      {isSignUp && (
        <>
          <Controller
            control={control}
            render={({ field: { value, onChange } }) => (
              <View style={styles.termsSection}>
                <Checkbox
                  status={value ? 'checked' : 'unchecked'}
                  onPress={() => {
                    onChange(!value);
                  }}
                />
                <TermsOfService />
              </View>
            )}
            name="hasAcceptedTerms"
          />
          <InputError fieldError={errors.hasAcceptedTerms} />
        </>
      )}

      <Button
        variant={ButtonVariants.PURPLE}
        size="medium"
        onPress={handleSubmit(onSubmit)}
        disabled={isSubmitting}
        loading={isSubmitting}
        style={styles.button}
      >
        {isSignUp ? 'Sign Up' : 'Log In'}
      </Button>
    </View>
  );
}

const createStyles = ({ isMobile, isTablet }: WithResponsive) =>
  StyleSheet.create({
    form: {
      width: isMobile ? '100%' : isTablet ? '50%' : '35%',
    },
    button: {
      width: '50%',
      alignSelf: 'center',
      marginTop: 16,
    },
    termsSection: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
  });
