import React from 'react';
import { Text as DefaultText, type TextProps } from 'react-native';
import { Colors } from '../constants/Colors';

function Text(props: TextProps) {
  const { style, ...otherProps } = props;

  return (
    <DefaultText style={[{ color: Colors.text }, style]} {...otherProps} />
  );
}

export function TextMono(props: TextProps) {
  return (
    <Text {...props} style={[props.style, { fontFamily: 'CourierPrime' }]} />
  );
}

export function TextMonoBold(props: TextProps) {
  return (
    <Text
      {...props}
      style={[props.style, { fontFamily: 'CourierPrimeBold' }]}
    />
  );
}

export function TextReg(props: TextProps & { weight?: 'bold' | 'light' }) {
  return (
    <Text
      {...props}
      style={[
        props.style,
        {
          fontFamily:
            props.weight === 'bold'
              ? 'PoppinsBold'
              : props.weight === 'light'
                ? 'PoppinsLight'
                : 'Poppins',
        },
      ]}
    />
  );
}

export function TextLight(props: TextProps) {
  return (
    <Text {...props} style={[props.style, { fontFamily: 'PoppinsLight' }]} />
  );
}

export function TextBold(props: TextProps) {
  return (
    <Text {...props} style={[props.style, { fontFamily: 'PoppinsBold' }]} />
  );
}
