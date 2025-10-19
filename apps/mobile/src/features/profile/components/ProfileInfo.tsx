import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../../../styles/components/profile/ProfileInfo.styles';

interface ProfileInfoProps {
  title?: string;
  description: string;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({ 
  title = 'Empresa Inc',
  description 
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
};

export default ProfileInfo;