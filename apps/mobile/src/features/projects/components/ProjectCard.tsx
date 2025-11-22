// apps/mobile/src/features/projects/components/ProjectCard.tsx

import React, { useState } from 'react'
import { View, Text, Image, TouchableOpacity, ImageSourcePropType } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useThemedStyles } from '../../../hooks/useThemedStyles'
import { createProjectCardStyles } from '../../../styles/components/projects/ProjectCard.styles'

interface ProjectCardProps {
  uuid?: string
  title: string
  description: string
  image: ImageSourcePropType | { uri: string }
  isFavorite?: boolean
  onFavoriteToggle?: (isFavorite: boolean, uuid?: string) => void
  onDetailsClick?: (uuid?: string) => void
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  uuid,
  title,
  description,
  image,
  isFavorite = false,
  onFavoriteToggle,
  onDetailsClick,
}) => {
  const styles = useThemedStyles(createProjectCardStyles)
  const [favorite, setFavorite] = useState(isFavorite)

  const handleFavoriteClick = () => {
    const newFavoriteState = !favorite
    setFavorite(newFavoriteState)
    onFavoriteToggle?.(newFavoriteState, uuid)
  }

  const handleViewDetails = () => {
    onDetailsClick?.(uuid)
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.favoriteButton} onPress={handleFavoriteClick}>
        <Ionicons name={favorite ? 'star' : 'star-outline'} size={24} color={favorite ? '#FCD34D' : '#9CA3AF'} />
      </TouchableOpacity>

      <Image source={image} style={styles.image} />

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        <Text style={styles.description} numberOfLines={3}>
          {description}
        </Text>
        <TouchableOpacity style={styles.button} onPress={handleViewDetails}>
          <Text style={styles.buttonText}>Ver detalles</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default ProjectCard