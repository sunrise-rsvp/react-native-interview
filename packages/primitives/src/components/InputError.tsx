import React from 'react';
import { type FieldError } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import { TextReg } from './StyledText';

type Props = {
  fieldError: FieldError | undefined;
};

export function InputError({ fieldError }: Props) {
  return fieldError ? (
    <TextReg style={styles.errorText}>{fieldError.message}</TextReg>
  ) : (
    <View style={styles.validationSpacer} />
  );
}

const styles = StyleSheet.create({
  errorText: {
    fontSize: 10,
    paddingTop: 4,
    paddingLeft: 16,
    paddingBottom: 8,
  },
  validationSpacer: {
    height: 26.42,
  },
});
