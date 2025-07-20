import Colors from '@constants/Colors';
import {
  CoinsDollarIcon,
  Home13Icon,
  Mail01Icon,
  Notification01Icon,
  UserCircleIcon,
} from '@hugeicons/core-free-icons';
import type { IconSvgElement } from '@hugeicons/react-native';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { useRoute } from '@react-navigation/native';
import { Link, type Href } from 'expo-router';
import React, { useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

type NavLinkProps = {
  href: Href;
  icon: IconSvgElement;
  size?: 'small' | 'medium' | 'large';
  isFirst?: boolean;
  isLast?: boolean;
};

function NavLink({
  href,
  icon: Icon,
  isFirst = false,
  isLast = false,
}: NavLinkProps) {
  const route = useRoute();

  return (
    <Link
      style={[
        styles.navLink,
        isFirst && styles.firstLink,
        isLast && styles.lastLink,
      ]}
      href={href}
    >
      <HugeiconsIcon
        icon={Icon}
        size={24}
        color={route.path === href ? Colors.dark.yellow0 : Colors.dark.text}
      />
    </Link>
  );
}

export default function WebNavbar() {
  const navbarSlideAnimation = useRef(new Animated.Value(-100)).current;
  const navbarOpacityAnimation = useRef(new Animated.Value(0)).current;

  // Animate the navbar
  const toggleNavbar = (visible: boolean) => {
    Animated.timing(navbarOpacityAnimation, {
      toValue: visible ? 1 : 0,
      duration: 600,
      useNativeDriver: true,
    }).start();
  };

  // Function to slide in/out the navbar
  const slideTo = (visible: boolean) => {
    Animated.timing(navbarSlideAnimation, {
      toValue: visible ? 0 : -100,
      duration: 350,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      useNativeDriver: true,
    }).start();
  };

  // Call this function when you detect cursor proximity
  const handleCursorProximity = (proximity: boolean) => {
    if (proximity) {
      toggleNavbar(true);
      slideTo(true);
    } else {
      // Delay hiding the navbar
      setTimeout(() => {
        toggleNavbar(false);
        slideTo(false);
      }, 650);
    }
  };

  return (
    <View
      style={styles.wrapper}
      // @ts-expect-error -- only used on web where it works
      onMouseEnter={() => {
        handleCursorProximity(true);
      }}
      onMouseLeave={() => {
        handleCursorProximity(false);
      }}
    >
      <Animated.View
        style={[
          styles.animatedView,
          { transform: [{ translateX: navbarSlideAnimation }] },
          { opacity: navbarOpacityAnimation },
        ]}
      >
        <nav style={styles.webNavbar}>
          <NavLink href="/events" icon={Home13Icon} isFirst />
          <NavLink href="/tokens" icon={CoinsDollarIcon} />
          <NavLink href="/inbox" icon={Mail01Icon} />
          <NavLink href="/notifications" icon={Notification01Icon} />
          <NavLink href="/profile" icon={UserCircleIcon} isLast />
        </nav>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  animatedView: {
    display: 'flex',
    height: '100%',
    justifyContent: 'center',
  },
  firstLink: {
    paddingTop: 24,
  },
  navLink: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  lastLink: {
    paddingBottom: 24,
  },
  webNavbar: {
    backgroundColor: Colors.dark.opacity20,
    borderTopRightRadius: 30,
    borderBottomRightRadius: 30,
    display: 'flex',
    flexDirection: 'column',
    width: 64,
    paddingVertical: 24,
  },
  wrapper: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    top: 0,
    width: 100,
    zIndex: 100,
  },
});
