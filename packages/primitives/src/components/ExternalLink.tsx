import { Link } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';

export function ExternalLink(props: React.ComponentProps<typeof Link>) {
  return (
    <Link
      target="_blank"
      {...props}
      href={props.href}
      style={[styles.link, props.style]}
      onPress={(e) => {
        if (Platform.OS !== 'web') {
          // Prevent the default behavior of linking to the default browser on native.
          e.preventDefault();
          // Open the link in an in-app browser.
          void WebBrowser.openBrowserAsync(props.href as string);
        }
      }}
    />
  );
}

const styles = StyleSheet.create({
  link: {
    color: Colors.purple1,
    textDecorationLine: 'underline',
  },
});
