import React from 'react';
import { View, Text } from 'react-native';
import { useThemedStyles } from '../../../hooks/useThemedStyles';
import { createProfileInfoStyles } from '../../../styles/components/profile/ProfileInfo.styles';

interface ProfileInfoProps {
  title?: string;
  description: string;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({ 
  title = 'Empresa Inc',
  description 
}) => {
  const styles = useThemedStyles(createProfileInfoStyles);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
};

export default ProfileInfo;