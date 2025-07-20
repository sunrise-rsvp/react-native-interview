import { ArrowDown01Icon, CancelCircleIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';
import React, { useState } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { Menu } from 'react-native-paper';
import { Colors } from '../constants/Colors';
import { useDynamicStyles } from '../hooks/useDynamicStyles';
import { isIos, type WithResponsive } from '../utils/responsivity';
import { Button } from './Button';
import { Loader } from './Loader';
import { TextReg } from './StyledText';

type Props<T extends string | number> = {
  placeholder: string;
  options: Array<{ label: string; value: T }>;
  value?: T;
  onChange: (value?: T) => void;
  buttonStyle?: StyleProp<ViewStyle>;
  menuStyle?: StyleProp<ViewStyle>;
  notClearable?: boolean;
  variant?: 'slim' | 'normal';
  todo?: boolean;
  done?: boolean;
  showLoadingState?: boolean;
};

export function Dropdown<T extends string | number>({
  placeholder,
  options,
  value,
  onChange,
  buttonStyle,
  notClearable,
  variant = 'normal',
  todo,
  done,
  menuStyle,
  showLoadingState,
}: Props<T>) {
  const [visible, setVisible] = useState(false);
  const styles = useDynamicStyles(createStyles<T>, { variant, done });

  const openMenu = () => {
    setVisible(true);
  };

  const closeMenu = () => {
    setVisible(false);
  };

  const selectItem = (value?: T) => {
    onChange(value);
    closeMenu();
  };

  const clearValue = () => {
    selectItem();
  };

  const selectedLabel = options.find((option) => option.value === value)?.label;
  const canClearSelection = selectedLabel && !notClearable;

  return (
    <View style={menuStyle}>
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchor={
          <Button
            mode="contained"
            onPress={
              canClearSelection
                ? clearValue
                : options.length
                  ? openMenu
                  : undefined
            }
            style={[buttonStyle]}
            labelStyle={styles.buttonLabel}
            buttonColor={isIos ? Colors.opacity025 : Colors.opacity05}
            size={variant === 'slim' ? 'medium' : 'large'}
            disabled={options.length == 0 && showLoadingState}
          >
            <TextReg style={styles.hiddenText}>
              {selectedLabel ?? placeholder}
            </TextReg>
          </Button>
        }
        anchorPosition="bottom"
      >
        {options.map((option) => (
          <Menu.Item
            onPress={() => {
              selectItem(option.value);
            }}
            title={option.label}
            key={option.value.toString()}
            // @ts-expect-error -- style works for web
            titleStyle={{ whiteSpace: 'wrap' }}
          />
        ))}
      </Menu>
      <View style={styles.absoluteContent}>
        {todo && <View style={styles.todo} />}
        {selectedLabel ? (
          <TextReg numberOfLines={1} style={styles.text}>
            {selectedLabel}
          </TextReg>
        ) : (
          <TextReg numberOfLines={1} style={styles.placeholder}>
            {placeholder}
          </TextReg>
        )}
        {options.length ? (
          canClearSelection ? (
            <HugeiconsIcon icon={CancelCircleIcon} color={Colors.text} />
          ) : (
            <HugeiconsIcon icon={ArrowDown01Icon} color={Colors.text} />
          )
        ) : (
          showLoadingState && <Loader style={{ alignItems: 'flex-end' }} />
        )}
      </View>
    </View>
  );
}

function createStyles<T extends string | number>({
  variant,
  done,
}: WithResponsive<Props<T>>) {
  return StyleSheet.create({
    buttonLabel: {
      paddingRight: 16,
    },
    absoluteContent: {
      position: 'absolute',
      backgroundColor: 'transparent',
      pointerEvents: 'none',
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingLeft: 16,
      paddingRight: 16,
      height: variant === 'slim' ? 44 : 56,
      width: '100%',
      gap: 10,
    },
    content: {
      height: variant === 'slim' ? 44 : 56,
    },
    label: {
      width: '100%',
      marginLeft: 16,
      marginRight: 16,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      fontSize: 16,
    },
    text: {
      fontSize: 16,
    },
    placeholder: {
      fontSize: 16,
      color: Colors.placeholderText,
    },
    hiddenText: {
      fontSize: 16,
      color: 'transparent',
    },
    todo: {
      borderRadius: 6,
      width: 12,
      height: 12,
      backgroundColor: done ? Colors.green0 : Colors.opacity20,
    },
  });
}
