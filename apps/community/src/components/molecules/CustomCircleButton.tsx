import Colors from '@constants/Colors';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  Loader,
  TextInput,
  TextReg,
  isNative,
  useDynamicStyles,
  type WithResponsive,
} from '@sunrise-ui/primitives';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import { type ObjectSchema } from 'yup';

type FormValues = { amount: number };

type Props<C> = {
  onSubmit: (data: FormValues) => Promise<void> | void;
  schema: ObjectSchema<FormValues>;
  context: C;
  loading?: boolean;
  buttonLabel: string;
  disabled?: boolean;
};
export default function CustomCircleButton<C>({
  onSubmit,
  schema,
  context,
  loading,
  buttonLabel,
  disabled,
}: Props<C>) {
  const styles = useDynamicStyles(createStyles, { loading, disabled });
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormValues, C, FormValues>({
    defaultValues: {
      // @ts-expect-error -- use empty string to avoid react controlled/uncontrolled errors
      amount: '',
    },
    resolver: yupResolver(schema),
    context,
  });

  return (
    <View style={styles.container}>
      {loading || isSubmitting ? (
        <Loader />
      ) : (
        <>
          <Controller
            control={control}
            render={({ field: { value, ...otherProps } }) => (
              <TextInput
                label="Custom"
                value={value?.toString()}
                style={styles.amountInput}
                keyboardType="number-pad"
                disabled={isSubmitting || disabled}
                {...otherProps}
              />
            )}
            name="amount"
          />
          {errors.amount ? (
            <TextReg style={styles.errorText}>{errors.amount.message}</TextReg>
          ) : null}
          <Button
            onPress={handleSubmit(onSubmit)}
            style={styles.button}
            contentStyle={styles.buttonContent}
            labelStyle={styles.buttonLabel}
            disabled={isSubmitting || loading || disabled}
          >
            <TextReg style={styles.buttonText}>{buttonLabel}</TextReg>
          </Button>
        </>
      )}
    </View>
  );
}

const createStyles = ({
  isMobile,
  loading,
  disabled,
}: WithResponsive<{ loading?: boolean; disabled?: boolean }>) =>
  StyleSheet.create({
    container: {
      width: isMobile ? 120 : 144,
      height: isMobile ? 120 : 144,
      borderRadius: 72,
      shadowColor: loading || !disabled ? Colors.dark.yellow0 : 'transparent',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.8,
      shadowRadius: isNative ? 5 : 10,
      elevation: 10, // Needed for Android
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor:
        loading || !disabled
          ? Colors.dark.purple0
          : Colors.dark.disabled.purple0,
      padding: 20,
      gap: 12,
    },
    amountInput: {
      height: 30,
      width: '100%',
      paddingHorizontal: isMobile ? 8 : 16,
      fontSize: isMobile ? 12 : 16,
    },
    buttonText: {
      fontSize: isMobile ? 12 : 16,
    },
    buttonContent: {
      height: 30,
    },
    button: {
      width: '100%',
    },
    buttonLabel: {
      marginTop: 0,
      marginLeft: 0,
      marginBottom: 0,
      marginRight: 0,
    },
    errorText: {
      fontSize: isMobile ? 8 : 9,
      marginVertical: -6,
    },
  });
