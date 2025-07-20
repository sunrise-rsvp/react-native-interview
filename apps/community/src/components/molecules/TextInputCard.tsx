import Card from '@atoms/Card';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  ButtonVariants,
  InputError,
  TextInput,
  TextReg,
  useDynamicStyles,
  type WithResponsive,
} from '@sunrise-ui/primitives';
import React, { type ReactNode } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import { object, string, type InferType } from 'yup';

const schema = object().shape({
  message: string().required('Required'),
});

type Props = {
  header: ReactNode;
  label: string;
  buttonText: string;
  buttonOnPress: (values: { message: string }) => void;
  disabled?: boolean;
};

type MessageFormValues = InferType<typeof schema>;

export default function TextInputCard({
  header,
  label,
  buttonText,
  buttonOnPress,
  disabled,
}: Props) {
  const styles = useDynamicStyles(createStyles);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<MessageFormValues>({
    defaultValues: { message: '' },
    resolver: yupResolver(schema),
  });

  const handleButtonPress = () => {
    void handleSubmit(buttonOnPress)();
  };

  return (
    <Card style={styles.card} disabled={disabled}>
      <TextReg style={styles.header}>{header}</TextReg>
      <View style={styles.content}>
        <View style={styles.inputContainer}>
          <Controller
            control={control}
            render={({ field }) => (
              <TextInput
                label={label}
                style={styles.input}
                disabled={disabled}
                {...field}
              />
            )}
            name="message"
          />
          <InputError fieldError={errors.message} />
        </View>
        <Button
          variant={ButtonVariants.PURPLE}
          onPress={handleButtonPress}
          disabled={disabled}
        >
          {buttonText}
        </Button>
      </View>
    </Card>
  );
}

const createStyles = ({ isMobile, isTablet }: WithResponsive) =>
  StyleSheet.create({
    card: {
      width: isMobile ? '100%' : isTablet ? '60%' : '40%',
    },
    header: {
      width: '100%',
      textAlign: 'center',
    },
    content: {
      alignItems: 'center',
      width: '100%',
    },
    inputContainer: {
      width: '100%',
    },
    input: {
      width: '100%',
    },
  });
