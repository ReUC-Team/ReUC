// apps/mobile/src/features/dashboards/faculty/hooks/useLinkedStudents.ts

import { useState } from 'react'
import { generateAvatarFromName } from '../../../../utils/generateAvatar'

export interface LinkedStudent {
  id: number
  name: string
  title: string
  progress: number
  status: string
  statusColor: string
  lastActivity: string
  avatar: string
}

// Generar avatar desde nombre completo
const generateStudentAvatar = (studentName: string): string => {
  if (!studentName) return ''
  
  const names = studentName.trim().split(' ')
  const firstName = names[0] || ''
  const lastName = names.length > 1 ? names[names.length - 1] : ''
  
  return generateAvatarFromName(firstName, undefined, lastName)
}

export const useLinkedStudents = () => {
  const [selectedStudent, setSelectedStudent] = useState<LinkedStudent | null>(null)
  const [comment, setComment] = useState('')
  const [showCommentModal, setShowCommentModal] = useState(false)
  const [loading, setLoading] = useState(false)

  // Datos ejemplo
  const studentsData: LinkedStudent[] = [
    {
      id: 1,
      name: 'Ana García',
      title: 'Sistema de Gestión',
      progress: 85,
      status: 'En progreso',
      statusColor: 'bg-blue-100 text-blue-800',
      lastActivity: 'Hace 2 días',
      avatar: ''
    },
    {
      id: 2,
      name: 'Carlos Mendoza',
      title: 'App Móvil',
      progress: 92,
      status: 'Por completar',
      statusColor: 'bg-red-100 text-red-800',
      lastActivity: 'Hace 1 día',
      avatar: ''
    },
    {
      id: 3,
      name: 'María López',
      title: 'Dashboard Analytics',
      progress: 65,
      status: 'En desarrollo',
      statusColor: 'bg-yellow-100 text-yellow-800',
      lastActivity: 'Hace 3 días',
      avatar: ''
    },
    {
      id: 4,
      name: 'Diego Ruiz',
      title: 'API REST',
      progress: 40,
      status: 'Iniciando',
      statusColor: 'bg-lime-100 text-green-800',
      lastActivity: 'Hace 1 semana',
      avatar: ''
    }
  ].map(student => ({
    ...student,
    avatar: generateStudentAvatar(student.name)
  }))

  const openCommentModal = (student: LinkedStudent) => {
    setSelectedStudent(student)
    setShowCommentModal(true)
  }

  const closeCommentModal = () => {
    setShowCommentModal(false)
    setSelectedStudent(null)
    setComment('')
  }

  const handleSendComment = async () => {
    if (!comment.trim() || !selectedStudent) return

    setLoading(true)
    
    try {
      // TODO: Reemplazar con llamada real al backend
      console.log(`Comentario para ${selectedStudent.name}: ${comment}`)
      
      await new Promise(resolve => setTimeout(resolve, 500))
      
      closeCommentModal()
      
    } catch (error) {
      console.error('Error sending comment:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStudents = async (): Promise<LinkedStudent[]> => {
    setLoading(true)
    try {
      // TODO: Reemplazar con llamada real al backend
      return studentsData.map(student => ({
        ...student,
        avatar: generateStudentAvatar(student.name)
      }))
    } catch (error) {
      console.error('Error fetching students:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  return {
    selectedStudent,
    comment,
    showCommentModal,
    loading,
    studentsData,
    setComment,
    openCommentModal,
    closeCommentModal,
    handleSendComment,
    fetchStudents
  }
}