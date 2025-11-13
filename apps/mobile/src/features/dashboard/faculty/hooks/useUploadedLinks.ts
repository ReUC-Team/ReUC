// apps/mobile/src/features/dashboards/faculty/hooks/useUploadedLinks.ts

import { useState } from 'react'
import { Linking } from 'react-native'
import * as Clipboard from 'expo-clipboard'
import { generateAvatarFromName } from '../../../../utils/generateAvatar'

export type LinkType = 'GITHUB' | 'FIGMA' | 'DRIVE' | 'YOUTUBE' | 'WEBSITE'
export type LinkStatus = 'pending' | 'approved' | 'rejected' | 'reviewed'
export type ReviewAction = 'approve' | 'reject' | 'request-changes'

export interface UploadedLink {
  id: number
  linkTitle: string
  url: string
  name: string
  title: string
  uploadDate: string
  linkType: LinkType
  status: LinkStatus
  statusText: string
  statusColor: string
  uploadTime: string
  description?: string
  studentAvatar: string
}

// Generar avatar desde nombre completo
const getStudentAvatar = (studentName: string): string => {
  if (!studentName) return ''
  
  const names = studentName.trim().split(' ')
  const firstName = names[0] || ''
  const lastName = names.length > 1 ? names[names.length - 1] : ''
  
  return generateAvatarFromName(firstName, undefined, lastName)
}

// Obtener ícono según tipo de link
export const getLinkIcon = (linkType: LinkType): string => {
  const iconMap: Record<LinkType, string> = {
    GITHUB: 'github',
    FIGMA: 'vector-square',
    DRIVE: 'google-drive',
    YOUTUBE: 'youtube',
    WEBSITE: 'web'
  }
  return iconMap[linkType] || 'link'
}

export const useUploadedLinks = () => {
  const [selectedLink, setSelectedLink] = useState<UploadedLink | null>(null)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [reviewComment, setReviewComment] = useState('')

  // Datos ejemplo
  const linksData: UploadedLink[] = [
    {
      id: 1,
      linkTitle: 'Repositorio del Proyecto',
      url: 'https://github.com/ReUC-Team/ReUC/tree/dev',
      name: 'Ana García',
      title: 'Sistema de Gestión',
      uploadDate: '2024-01-15',
      linkType: 'GITHUB',
      status: 'pending',
      statusText: 'Pendiente',
      statusColor: 'bg-yellow-100 text-yellow-800',
      uploadTime: 'Hace 2 horas',
      description: 'Código fuente completo del sistema de gestión con base de datos MySQL',
      studentAvatar: ''
    },
    {
      id: 2,
      linkTitle: 'Prototipo Interactivo',
      url: 'https://www.figma.com/design/example',
      name: 'Carlos Mendoza',
      title: 'App Móvil',
      uploadDate: '2024-01-14',
      linkType: 'FIGMA',
      status: 'approved',
      statusText: 'Aprobado',
      statusColor: 'bg-lime-100 text-lime-800',
      uploadTime: 'Hace 1 día',
      description: 'Diseño completo de la aplicación móvil con todas las pantallas',
      studentAvatar: ''
    },
    {
      id: 3,
      linkTitle: 'Demo en Vivo',
      url: 'https://demo-dashboard.example.com',
      name: 'María López',
      title: 'Dashboard Analytics',
      uploadDate: '2024-01-13',
      linkType: 'WEBSITE',
      status: 'rejected',
      statusText: 'Rechazado',
      statusColor: 'bg-red-100 text-red-800',
      uploadTime: 'Hace 2 días',
      description: 'Aplicación web desplegada con funcionalidades de análisis de datos',
      studentAvatar: ''
    },
    {
      id: 4,
      linkTitle: 'Video Presentación',
      url: 'https://www.youtube.com/watch?v=example',
      name: 'Diego Ruiz',
      title: 'API REST',
      uploadDate: '2024-01-12',
      linkType: 'YOUTUBE',
      status: 'reviewed',
      statusText: 'En revisión',
      statusColor: 'bg-blue-100 text-blue-800',
      uploadTime: 'Hace 3 días',
      description: 'Demostración completa del funcionamiento de la API REST',
      studentAvatar: ''
    }
  ].map(link => ({
    ...link,
    studentAvatar: getStudentAvatar(link.name)
  }))

  const openReviewModal = (link: UploadedLink) => {
    setSelectedLink(link)
    setShowReviewModal(true)
    setReviewComment('')
  }

  const closeReviewModal = () => {
    setShowReviewModal(false)
    setSelectedLink(null)
    setReviewComment('')
  }

  const handleReviewSubmit = async (action: ReviewAction) => {
    if (!selectedLink) return

    const reviewData = {
      linkId: selectedLink.id,
      comment: reviewComment,
      action: action
    }

    try {
      // TODO: Reemplazar con llamada real al backend
      console.log(`${action} enlace:`, reviewData)
      closeReviewModal()
    } catch (error) {
      console.error('Error al revisar enlace:', error)
    }
  }

  const openLink = async (link: UploadedLink) => {
    try {
      const supported = await Linking.canOpenURL(link.url)
      if (supported) {
        await Linking.openURL(link.url)
      } else {
        console.error('No se puede abrir el URL:', link.url)
      }
    } catch (error) {
      console.error('Error al abrir enlace:', error)
    }
  }

  const copyLink = async (link: UploadedLink) => {
    try {
      await Clipboard.setStringAsync(link.url)
      console.log('Enlace copiado al portapapeles')
      // TODO: Mostrar toast de éxito
    } catch (error) {
      console.error('Error al copiar enlace:', error)
    }
  }

  const pendingCount = linksData.filter(link => link.status === 'pending').length

  return {
    linksData,
    selectedLink,
    showReviewModal,
    reviewComment,
    pendingCount,
    setReviewComment,
    openReviewModal,
    closeReviewModal,
    handleReviewSubmit,
    openLink,
    copyLink,
    getLinkIcon
  }
}