import { useState } from "react";

const getStudentAvatar = (link) => {
  if (!link?.name) return '';
  
  const names = link.name.split(' ');
  const firstName = names[0] || '';
  
  if (names.length === 1) {
    return firstName[0] ? firstName[0].toUpperCase() : '';
  }
  
  const lastName = names[names.length - 1] || '';
  return `${firstName[0]?.toUpperCase() || ''}${lastName[0]?.toUpperCase() || ''}`;
};

const getLinkIcon = (linkType) => {
  const icons = {
    GITHUB: <svg className="w-7 h-fit" xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24"><path fill="#333333" d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>,
    FIGMA: <svg className="w-7 h-fit" xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24"><path fill="#333333" d="M15.852 8.981h-4.588V0h4.588c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.491-4.49 4.491zM12.735 7.51h3.117c1.665 0 3.019-1.355 3.019-3.019s-1.354-3.019-3.019-3.019h-3.117V7.51zm0 1.471H8.148c-2.476 0-4.49-2.015-4.49-4.491S5.672 0 8.148 0h4.588v8.981zm-4.587-7.51c-1.665 0-3.019 1.355-3.019 3.019s1.354 3.02 3.019 3.02h3.117V1.471H8.148zm4.587 15.019H8.148c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h4.588v8.98zM8.148 8.981c-1.665 0-3.019 1.355-3.019 3.019s1.355 3.019 3.019 3.019h3.117V8.981H8.148zM8.172 24c-2.489 0-4.515-2.014-4.515-4.49s2.014-4.49 4.49-4.49h4.588v4.441c0 2.503-2.047 4.539-4.563 4.539zm-.024-7.51a3.023 3.023 0 0 0-3.019 3.019c0 1.665 1.365 3.019 3.044 3.019 1.705 0 3.093-1.376 3.093-3.068v-2.97H8.148z"/><path fill="#333333" d="M12.734 24c-2.489 0-4.515-2.014-4.515-4.49s2.026-4.49 4.515-4.49s4.515 2.014 4.515 4.49S15.223 24 12.734 24zm0-7.509c-1.665 0-3.019 1.355-3.019 3.019s1.354 3.019 3.019 3.019s3.019-1.355 3.019-3.019s-1.355-3.019-3.019-3.019z"/></svg>,
    DRIVE: <svg className="w-7 h-fit" xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24"><path fill="#333333" d="M7.71 3.5L1.15 15l4.55 7.5h9.3l4.55-7.5L12.85 3.5H7.71zM2 16l5.5-9.5h9L22 16l-5.5 4H7.5L2 16z"/></svg>,
    YOUTUBE: <svg className="w-7 h-fit" xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24"><path fill="#333333" d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>,
    WEBSITE: <svg className="w-7 h-fit" xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24"><path fill="#333333" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93c0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41c0 2.08-.8 3.97-2.1 5.39z"/></svg>,
    default: <svg className="w-7 h-fit" xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24"><path fill="#333333" d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H6.99C4.77 7 2.9 8.77 2.9 11c0 2.23 1.87 4 4.09 4h4v-1.9H6.99c-1.71 0-3.09-1.39-3.09-3.1zM8 13h8v-2H8v2zm9.01-6H13v1.9h4.01c1.71 0 3.09 1.39 3.09 3.1s-1.38 3.1-3.09 3.1H13V17h4.01c2.22 0 4.09-1.77 4.09-4s-1.87-4-4.09-4z"/></svg>
  };
  return icons[linkType] || icons.default;
};

export default function useUploadedLinks() {
  const [selectedLink, setSelectedLink] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewComment, setReviewComment] = useState("");

  // Datos ejemplo
  const linksData = [
    {
      id: 1,
      linkTitle: "Repositorio del Proyecto",
      url: "https://github.com/ReUC-Team/ReUC/tree/dev",
      name: "Ana García",
      title: "Sistema de Gestión",
      uploadDate: "2024-01-15",
      linkType: "GITHUB",
      status: "pending",
      statusText: "Pendiente",
      statusColor: "bg-yellow-100 text-yellow-800",
      uploadTime: "Hace 2 horas",
      description: "Código fuente completo del sistema de gestión con base de datos MySQL"
    },
    {
      id: 2,
      linkTitle: "Prototipo Interactivo",
      url: "https://github.com/ReUC-Team/ReUC/tree/dev",
      name: "Carlos Mendoza",
      title: "App Móvil",
      uploadDate: "2024-01-14",
      linkType: "FIGMA",
      status: "approved",
      statusText: "Aprobado",
      statusColor: "bg-lime-100 text-lime-800",
      uploadTime: "Hace 1 día",
      description: "Diseño completo de la aplicación móvil con todas las pantallas"
    },
    {
      id: 3,
      linkTitle: "Demo en Vivo",
      url: "https://github.com/ReUC-Team/ReUC/tree/dev",
      name: "María López",
      title: "Dashboard Analytics",
      uploadDate: "2024-01-13",
      linkType: "WEBSITE",
      status: "rejected",
      statusText: "Rechazado",
      statusColor: "bg-red-100 text-red-800",
      uploadTime: "Hace 2 días",
      description: "Aplicación web desplegada con funcionalidades de análisis de datos"
    },
    {
      id: 4,
      linkTitle: "Video Presentación",
      url: "https://github.com/ReUC-Team/ReUC/tree/dev",
      name: "Diego Ruiz",
      title: "API REST",
      uploadDate: "2024-01-12",
      linkType: "YOUTUBE",
      status: "reviewed",
      statusText: "En revisión",
      statusColor: "bg-blue-100 text-blue-800",
      uploadTime: "Hace 3 días",
      description: "Demostración completa del funcionamiento de la API REST"
    }
  ].map(link => ({
    ...link,
    studentAvatar: getStudentAvatar(link)
  }));

  const openReviewModal = (link) => {
    setSelectedLink(link);
    setShowReviewModal(true);
    setReviewComment("");
  };

  const closeReviewModal = () => {
    setShowReviewModal(false);
    setSelectedLink(null);
    setReviewComment("");
  };

  const handleReviewSubmit = async (action) => {
    if (!selectedLink) return;

    const reviewData = {
      linkId: selectedLink.id,
      comment: reviewComment,
      action: action
    };

    try {
      console.log(`${action} enlace:`, reviewData);
      closeReviewModal();
    } catch (error) {
      console.error('Error al revisar enlace:', error);
    }
  };

  const openLink = (link) => {
    try {
      window.open(link.url, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Error al abrir enlace:', error);
    }
  };

  const copyLink = async (link) => {
    try {
      await navigator.clipboard.writeText(link.url);
      console.log('Enlace copiado al portapapeles');
    } catch (error) {
      console.error('Error al copiar enlace:', error);
    }
  };

  const pendingCount = linksData.filter(link => link.status === 'pending').length;

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
    getLinkIcon,
  };
};