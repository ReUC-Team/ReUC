import React from 'react';
import { View, Image, Text, TouchableOpacity } from 'react-native';
import { useThemedStyles } from '../../../hooks/useThemedStyles';
import { createProfileHeaderStyles } from '../../../styles/components/profile/ProfileHeader.styles';

interface ProfileHeaderProps {
  imageUrl?: string;
  name: string;
  location: string;
  onEditPress?: () => void;
  onContactPress?: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  imageUrl,
  name,
  location,
  onEditPress,
  onContactPress,
}) => {
  const styles = useThemedStyles(createProfileHeaderStyles);

  return (
    <View style={styles.container}>
      <View style={styles.profileImageContainer}>
        <Image
          source={imageUrl ? { uri: imageUrl } : require('../../../assets/avatar.png')}
          style={styles.profileImage}
        />
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.location}>{location}</Text>
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.editButton]} 
          onPress={onEditPress}
        >
          <Text style={styles.editButtonText}>Editar Perfil</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.contactButton]} 
          onPress={onContactPress}
        >
          <Text style={styles.contactButtonText}>Contactar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProfileHeader;