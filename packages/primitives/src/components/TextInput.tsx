import React, { forwardRef, type ReactNode } from 'react';
import { StyleSheet, type TextInput as RNTextInput } from 'react-native';
import {
  TextInput as PaperTextInput,
  type TextInputProps as PaperTextInputProps,
} from 'react-native-paper';
import { Colors } from '../constants/Colors';

type Props = {
  label: string;
  icon?: ReactNode;
  onIconPress?: () => void;
  onChange?: (value: string) => void | Promise<void>;
} & Omit<PaperTextInputProps, 'onChangeText' | 'onChange'>;

export const TextInput = forwardRef<RNTextInput, Props>(
  (
    {
      label,
      value,
      onChange,
      icon,
      style,
      disabled,
      autoCapitalize,
      secureTextEntry,
      multiline,
      onIconPress,
      ...otherProps
    }: Props,
    ref,
  ) => {
    return (
      <PaperTextInput
        multiline={multiline}
        ref={ref}
        placeholder={label}
        value={value}
        onChangeText={onChange}
        disabled={disabled}
        autoCapitalize={autoCapitalize}
        secureTextEntry={secureTextEntry}
        style={[styles.textInput, style]}
        theme={{ colors: { primary: Colors.text }, roundness: 30 }}
        underlineColor="transparent"
        activeUnderlineColor="transparent"
        underlineStyle={{ backgroundColor: 'transparent' }}
        cursorColor={Colors.text}
        textColor={Colors.text}
        selectionColor={Colors.text}
        left={
          icon && (
            <PaperTextInput.Icon icon={() => icon} onPress={onIconPress} />
          )
        }
        {...otherProps}
      />
    );
  },
);
TextInput.displayName = 'TextInput';

const styles = StyleSheet.create({
  textInput: {
    borderRadius: 30,
    backgroundColor: Colors.opacity05,
  },
});
