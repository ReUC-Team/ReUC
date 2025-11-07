// apps/mobile/src/components/Avatar.tsx

import React from 'react';
import { View, Text } from 'react-native';
import { useThemedStyles } from '../hooks/useThemedStyles';
import { StyleSheet } from 'react-native';
import { generateAvatarFromName } from '../utils/generateAvatar';

interface AvatarProps {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  style?: any;
}

const Avatar: React.FC<AvatarProps> = ({
  firstName,
  middleName,
  lastName,
  size = 'medium',
  style,
}) => {
  const initials = generateAvatarFromName(firstName, middleName, lastName);

  const sizeStyles = {
    small: {
      container: { width: 32, height: 32 },
      text: { fontSize: 14 },
    },
    medium: {
      container: { width: 48, height: 48 },
      text: { fontSize: 18 },
    },
    large: {
      container: { width: 80, height: 80 },
      text: { fontSize: 32 },
    },
    xlarge: {
      container: { width: 120, height: 120 },
      text: { fontSize: 48 },
    },
  };

  const currentSize = sizeStyles[size];

  return (
    <View
      style={[
        styles.container,
        currentSize.container,
        style,
      ]}
    >
      <Text style={[styles.text, currentSize.text]}>
        {initials}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 9999, 
    backgroundColor: '#84CC16', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default Avatar;