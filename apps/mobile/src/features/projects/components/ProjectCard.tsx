// apps/mobile/src/features/projects/components/ProjectCard.tsx

import React, { useState } from 'react'
import { View, Text, Image, TouchableOpacity, ImageSourcePropType } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useThemedStyles } from '../../../hooks/useThemedStyles'
import { createProjectCardStyles } from '../../../styles/components/projects/ProjectCard.styles'
import ProjectStatusBadge from './ProjectStatusBadge'
import type { StatusObject } from '../types/project.types'
import { palette } from '@styles'

interface ProjectCardProps {
  uuid?: string
  title: string
  description: string
  image: ImageSourcePropType | { uri: string }
  status?: StatusObject | string
  isFavorite?: boolean
  onFavoriteToggle?: (isFavorite: boolean, uuid?: string) => void
  onDetailsClick?: (uuid?: string) => void
  showTeamButton?: boolean 
  onTeamClick?: (uuid?: string) => void 
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  uuid,
  title,
  description,
  image,
  status,
  isFavorite = false,
  onFavoriteToggle,
  onDetailsClick,
  showTeamButton = false,  
  onTeamClick,  
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

  const handleViewTeam = () => {
    onTeamClick?.(uuid)
  }

  return (
    <View style={styles.container}>
      {/* Contenedor de imagen con overlays y badges */}
      <View style={styles.imageContainer}>
        <Image source={image} style={styles.image} />
        
        {/* Overlay oscuro sutil */}
        <View style={styles.imageOverlay} />
        
        {/* Badge de estado en la esquina superior derecha */}
        {status && (
          <View style={styles.statusBadgeContainer}>
            <ProjectStatusBadge status={status} />
          </View>
        )}
        
        {/* Botón de favorito */}
{/*         <TouchableOpacity style={styles.favoriteButton} onPress={handleFavoriteClick}>
          <Ionicons name={favorite ? 'star' : 'star-outline'} size={24} color={favorite ? '#FCD34D' : '#9CA3AF'} />
        </TouchableOpacity> */}
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        <Text style={styles.description} numberOfLines={3}>
          {description}
        </Text>
        
        {/* : Botones condicionales */}
        {showTeamButton ? (
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.buttonPrimary} onPress={handleViewDetails}>
              <Text style={styles.buttonText}>Detalles</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonSecondary} onPress={handleViewTeam}>
              <Ionicons name="people" size={16} color={palette.onPrimary} />
              <Text style={styles.buttonText}>Equipo</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleViewDetails}>
            <Text style={styles.buttonText}>Ver detalles</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

export default ProjectCard