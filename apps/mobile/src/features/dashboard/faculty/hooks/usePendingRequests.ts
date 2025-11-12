// apps/mobile/src/features/dashboards/faculty/hooks/usePendingRequests.ts

import { useState } from 'react'

export type RequestStatus = 'pending-review' | 'in-review' | 'waiting-assignment'
export type RequestPriority = 'alta' | 'media' | 'baja'

export interface PendingRequest {
  id: number
  title: string
  company: string
  status: RequestStatus
  sendDate: string
  priority: RequestPriority
}

export interface StatusConfig {
  color: string
  text: string
  textColor: string
}

export interface PriorityConfig {
  color: string
  icon: string
}

export interface RequestStatistics {
  total: number
  byStatus: Record<string, number>
  byPriority: Record<string, number>
}

export const usePendingRequests = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedRequest, setSelectedRequest] = useState<PendingRequest | null>(null)

  // Datos ejemplo
  const requestsData: PendingRequest[] = [
    { 
      id: 1,
      title: 'Sistema de Inventario', 
      company: 'TechCorp S.A.', 
      status: 'pending-review',
      sendDate: '2024-05-20',
      priority: 'alta'
    },
    { 
      id: 2,
      title: 'App Móvil de Ventas', 
      company: 'Comercial XYZ', 
      status: 'in-review',
      sendDate: '2024-05-18',
      priority: 'media'
    },
    { 
      id: 3,
      title: 'Portal Web Corporativo', 
      company: 'Empresa ABC', 
      status: 'waiting-assignment',
      sendDate: '2024-05-15',
      priority: 'baja'
    },
    { 
      id: 4,
      title: 'Dashboard Analytics', 
      company: 'DataTech Ltd.', 
      status: 'pending-review',
      sendDate: '2024-05-22',
      priority: 'alta'
    },
    { 
      id: 5,
      title: 'E-commerce Platform', 
      company: 'ShopOnline Inc.', 
      status: 'in-review',
      sendDate: '2024-05-19',
      priority: 'media'
    }
  ]

  const statusConfig: Record<RequestStatus, StatusConfig> = {
    'pending-review': {
      color: '#F97316',
      text: 'Pendiente de revisión',
      textColor: '#C2410C'
    },
    'in-review': {
      color: '#3B82F6',
      text: 'En revisión',
      textColor: '#1D4ED8'
    },
    'waiting-assignment': {
      color: '#A855F7',
      text: 'Esperando asignación',
      textColor: '#7C3AED'
    }
  }

  const priorityConfig: Record<RequestPriority, PriorityConfig> = {
    'alta': {
      color: 'bg-red-100 text-red-800',
      icon: '🔴'
    },
    'media': {
      color: 'bg-yellow-100 text-yellow-800',
      icon: '🟡'
    },
    'baja': {
      color: 'bg-lime-100 text-lime-800',
      icon: '🟢'
    }
  }

  const formatDate = (date: string): string => {
    const newDate = new Date(date)
    return newDate.toLocaleDateString('es-ES', { 
      day: '2-digit', 
      month: 'short'
    })
  }

  const fetchRequests = async (): Promise<PendingRequest[]> => {
    setLoading(true)
    setError(null)
    
    try {
      // TODO: Reemplazar con llamada real al backend
      await new Promise(resolve => setTimeout(resolve, 500))
      return requestsData
    } catch (err) {
      console.error('Error fetching requests:', err)
      setError('Error al cargar las solicitudes')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateRequestStatus = async (
    requestId: number, 
    newStatus: RequestStatus
  ): Promise<void> => {
    setLoading(true)
    
    try {
      // TODO: Reemplazar con llamada real al backend
      console.log(`Actualizando solicitud ${requestId} a estado: ${newStatus}`)
      await new Promise(resolve => setTimeout(resolve, 300))
    } catch (err) {
      console.error('Error updating request status:', err)
      setError('Error al actualizar la solicitud')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const getStatistics = (): RequestStatistics => {
    const total = requestsData.length
    const byStatus: Record<string, number> = {}
    const byPriority: Record<string, number> = {}

    requestsData.forEach(request => {
      byStatus[request.status] = (byStatus[request.status] || 0) + 1
      byPriority[request.priority] = (byPriority[request.priority] || 0) + 1
    })

    return { total, byStatus, byPriority }
  }

  return {
    loading,
    error,
    selectedRequest,
    requestsData,
    statusConfig,
    priorityConfig,
    setSelectedRequest,
    setError,
    fetchRequests,
    updateRequestStatus,
    formatDate,
    getStatistics
  }
}