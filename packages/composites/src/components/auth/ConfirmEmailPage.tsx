import { yupResolver } from '@hookform/resolvers/yup';
import { Mail01Icon, SentIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';
import {
  useSingleFactorSignIn,
  useSingleFactorValidateCode,
} from '@sunrise-ui/api-client';
import type {
  TokenOutput,
  VerificationCodeInput,
} from '@sunrise-ui/api/cerebro/api';
import {
  Button,
  Colors,
  PageHeader,
  TextInput,
  TextReg,
  useDynamicStyles,
  useSearchParams,
  useSnackbar,
  type WithResponsive,
} from '@sunrise-ui/primitives';
import { router } from 'expo-router';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import { TextInput as PaperTextInput } from 'react-native-paper';
import { object, string, type InferType } from 'yup';

const schema = object().shape({
  code: string()
    .required('Code is required')
    .length(6, 'Must be 6 digits long'),
});

type FormValues = InferType<typeof schema>;

type Props = {
  onSuccess: (data: TokenOutput, input: VerificationCodeInput) => void;
};

export function ConfirmEmailPage({ onSuccess }: Props) {
  const { email: encodedEmail } = useSearchParams<{ email?: string }>();
  const email = decodeURIComponent(encodedEmail ?? '');
  const { showSnackbar } = useSnackbar();
  const styles = useDynamicStyles(createStyles);
  const { mutateAsync: signIn, isPending: isSendingEmail } =
    useSingleFactorSignIn();
  const { mutateAsync: validateCode } = useSingleFactorValidateCode();

  const handleMissingEmail = () => {
    router.navigate('/login');
    showSnackbar({
      text: 'Something went wrong. Please try again',
      type: 'error',
    });
  };

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: { code: '' },
    resolver: yupResolver(schema),
  });

  const onSubmit = async ({ code }: FormValues) => {
    if (email) void validateCode({ code, email }, { onSuccess });
    else handleMissingEmail();
  };

  return (
    <View style={styles.container}>
      <PageHeader
        header="Confirm your email."
        subheader="We just sent you a 6 digit code via email. You know the drill."
      />
      <View style={styles.controllerContainer}>
        <Controller
          control={control}
          render={({ field }) => (
            <View style={styles.inputContainer}>
              <TextInput
                label="Code"
                keyboardType="numeric"
                maxLength={6}
                disabled={isSubmitting}
                right={
                  <PaperTextInput.Icon
                    icon={() => (
                      <HugeiconsIcon icon={SentIcon} color={Colors.text} />
                    )}
                    onPress={() => {
                      void handleSubmit(onSubmit)();
                    }}
                    loading={isSubmitting}
                  />
                }
                style={{ minWidth: 300 }}
                {...field}
              />
              <TextReg style={styles.errorText}>{errors.code?.message}</TextReg>
            </View>
          )}
          name="code"
        />
      </View>
      <View style={styles.resendContainer}>
        <HugeiconsIcon
          icon={Mail01Icon}
          size={100}
          color={Colors.text}
          strokeWidth={0.5}
        />
        <Button
          size="small"
          onPress={async () => {
            if (email) {
              await signIn(
                { email },
                {
                  onSuccess: () => {
                    showSnackbar({
                      type: 'info',
                      text: 'New email sent!',
                    });
                  },
                },
              );
            } else {
              handleMissingEmail();
            }
          }}
          loading={isSendingEmail}
        >
          Resend
        </Button>
      </View>
    </View>
  );
}

const createStyles = ({ isMobile, isTablet }: WithResponsive) =>
  StyleSheet.create({
    container: {
      backgroundColor: Colors.purple0,
      gap: isMobile ? 60 : 80,
      padding: isMobile ? 12 : isTablet ? 16 : 20,
    },
    resendContainer: {
      gap: 20,
      alignItems: 'center',
    },
    errorText: {
      position: 'absolute',
      bottom: -30,
      paddingLeft: 16,
    },
    controllerContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
    },
    inputContainer: {
      position: 'relative',
    },
  });
