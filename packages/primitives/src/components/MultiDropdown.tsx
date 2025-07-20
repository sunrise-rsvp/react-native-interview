import {
  ArrowDown01Icon,
  CancelCircleIcon,
  CheckmarkCircle01Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';
import React, { useRef, useState } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { Portal } from 'react-native-paper';
import { Colors } from '../constants/Colors';
import { useDynamicStyles } from '../hooks/useDynamicStyles';
import { isIos, type WithResponsive } from '../utils/responsivity';
import { Button } from './Button';
import { Loader } from './Loader';
import { TextReg } from './StyledText';

type Props<T extends string | number> = {
  placeholder: string;
  options: Array<{ label: string; value: T }>;
  values?: T[];
  onChange: (values: T[]) => void;
  buttonStyle?: StyleProp<ViewStyle>;
  menuStyle?: StyleProp<ViewStyle>;
  notClearable?: boolean;
  variant?: 'slim' | 'normal';
  showLoadingState?: boolean;
};

export function MultiDropdown<T extends string | number>({
  placeholder,
  options,
  values = [],
  onChange,
  buttonStyle,
  notClearable,
  variant = 'normal',
  menuStyle,
  showLoadingState,
}: Props<T>) {
  const styles = useDynamicStyles(createStyles<T>, { variant });
  const dropdownRef = useRef<View>(null);
  const [menuPosition, setMenuPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });

  // Custom dropdown using Portal for more control
  const [customMenuVisible, setCustomMenuVisible] = useState(false);

  const openMenu = () => {
    if (dropdownRef.current) {
      dropdownRef.current.measureInWindow((x, y, width, height) => {
        setMenuPosition({
          top: y + height,
          left: x,
          width: width,
        });
        setCustomMenuVisible(true);
      });
    }
  };

  const closeMenu = () => {
    setCustomMenuVisible(false);
  };

  const toggleItem = (value: T) => {
    const newValues = values.includes(value)
      ? values.filter((v) => v !== value)
      : [...values, value];
    onChange(newValues);
    // Menu stays open because we're using our custom menu
  };

  const clearValues = () => {
    onChange([]);
    closeMenu();
  };

  const selectedLabels = options
    .filter((option) => values.includes(option.value))
    .map((option) => option.label);

  // Create display text based on selection count
  const getDisplayText = () => {
    if (selectedLabels.length === 0) {
      return placeholder;
    } else if (selectedLabels.length === 1) {
      return selectedLabels[0];
    } else {
      return `${selectedLabels.length} events`;
    }
  };

  const displayText = getDisplayText();

  const canClearSelection = selectedLabels.length > 0 && !notClearable;

  return (
    <View style={menuStyle} ref={dropdownRef}>
      <Button
        mode="contained"
        onPress={
          canClearSelection
            ? clearValues
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
        <TextReg style={styles.hiddenText}>{displayText}</TextReg>
      </Button>

      <View style={styles.absoluteContent}>
        {selectedLabels.length > 0 ? (
          <TextReg numberOfLines={1} style={styles.text}>
            {displayText}
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

      {/* Custom menu using Portal for more control */}
      {customMenuVisible && (
        <Portal>
          <TouchableOpacity style={styles.backdrop} onPress={closeMenu}>
            <View
              style={[
                styles.customMenuContainer,
                {
                  position: 'absolute',
                  top: menuPosition.top,
                  left: menuPosition.left,
                  width: menuPosition.width,
                },
              ]}
            >
              <View style={styles.customMenu}>
                {options.map((option) => {
                  const isSelected = values.includes(option.value);
                  return (
                    <TouchableOpacity
                      key={option.value.toString()}
                      onPress={() => toggleItem(option.value)}
                      style={styles.menuItem}
                    >
                      <View style={styles.menuItemContent}>
                        <TextReg>{option.label}</TextReg>
                        {isSelected && (
                          <HugeiconsIcon
                            icon={CheckmarkCircle01Icon}
                            color={Colors.purple1}
                            size={18}
                          />
                        )}
                      </View>
                    </TouchableOpacity>
                  );
                })}
                {values.length > 0 && (
                  <TouchableOpacity
                    style={styles.doneButton}
                    onPress={closeMenu}
                  >
                    <TextReg style={styles.doneButtonText}>Done</TextReg>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </TouchableOpacity>
        </Portal>
      )}
    </View>
  );
}

function createStyles<T extends string | number>({
  variant,
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
    backdrop: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'transparent',
      zIndex: 1000,
    },
    customMenuContainer: {
      backgroundColor: 'transparent',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      borderRadius: 4,
      maxHeight: 300,
      zIndex: 1001,
    },
    customMenu: {
      backgroundColor: Colors.purple0, // Fully opaque background color
      borderRadius: 4,
      borderWidth: 1,
      borderColor: Colors.opacity20,
      overflow: 'hidden',
    },
    menuItem: {
      padding: 10,
      paddingHorizontal: 16,
      minHeight: 48,
      justifyContent: 'center',
    },
    menuItemContent: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      cursor: 'pointer',
    },
    doneButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 10,
      paddingHorizontal: 16,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: Colors.opacity20,
      minHeight: 48,
    },
    doneButtonText: {
      color: Colors.purple1,
      fontWeight: '500',
    },
  });
}
