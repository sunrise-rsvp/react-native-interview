import { yupResolver } from '@hookform/resolvers/yup';
import { useAcceptTerms } from '@sunrise-ui/api-client';
import {
  Button,
  ButtonVariants,
  Colors,
  InputError,
  PageHeader,
  TermsOfService,
  useDynamicStyles,
} from '@sunrise-ui/primitives';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import { Checkbox } from 'react-native-paper';
import type { InferType } from 'yup';
import { boolean, object } from 'yup';

const schema = object().shape({
  hasAcceptedTerms: boolean()
    .oneOf([true], 'You must accept our terms to continue')
    .required('You must accept our terms to continue'),
});

type FormValues = InferType<typeof schema>;

export function AcceptTermsView() {
  const styles = useDynamicStyles(createStyles);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: { hasAcceptedTerms: false },
    resolver: yupResolver(schema),
  });
  const { mutateAsync: acceptTerms } = useAcceptTerms();

  const onSubmit = async () => {
    await acceptTerms();
  };

  return (
    <View style={styles.container}>
      <PageHeader header="Please Review Our Terms" />
      <Controller
        control={control}
        name="hasAcceptedTerms"
        render={({ field: { value, onChange } }) => (
          <View>
            <View style={styles.termsSection}>
              <Checkbox
                status={value ? 'checked' : 'unchecked'}
                onPress={() => {
                  onChange(!value);
                }}
              />
              <TermsOfService />
            </View>
            <InputError fieldError={errors.hasAcceptedTerms} />
          </View>
        )}
      />
      <Button
        variant={ButtonVariants.PURPLE}
        size="medium"
        onPress={handleSubmit(onSubmit)}
        disabled={isSubmitting}
        loading={isSubmitting}
        style={styles.button}
      >
        Continue
      </Button>
    </View>
  );
}

const createStyles = () =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
      width: '100%',
      height: '100%',
      paddingVertical: 20,
      paddingHorizontal: 40,
      backgroundColor: Colors.purple0,
    },
    termsSection: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 8,
      marginTop: 40,
    },
    button: {
      marginTop: 30,
    },
  });
