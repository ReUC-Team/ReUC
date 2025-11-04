import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../../../styles/components/projects/ProjectCard.styles';

interface ProjectCardProps {
  title: string;
  description: string;
  image: any;
  isFavorite?: boolean;
  onFavoriteToggle?: (isFavorite: boolean) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  description,
  image,
  isFavorite = false,
  onFavoriteToggle,
}) => {
  const [favorite, setFavorite] = useState(isFavorite);
  const navigation = useNavigation<any>();

  const handleFavoriteClick = () => {
    const newFavoriteState = !favorite;
    setFavorite(newFavoriteState);
    onFavoriteToggle?.(newFavoriteState);
  };

  const handleViewDetails = () => {
    navigation.navigate('ProjectDetails');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={handleFavoriteClick}
      >
        <Ionicons
          name={favorite ? 'star' : 'star-outline'}
          size={24}
          color={favorite ? '#FCD34D' : '#9CA3AF'}
        />
      </TouchableOpacity>

      <Image source={image} style={styles.image} />

      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {description}
        </Text>
        <TouchableOpacity style={styles.button} onPress={handleViewDetails}>
          <Text style={styles.buttonText}>Ver detalles</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProjectCard;