import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { getSidebarItemsByRole } from '@/config/sidebarConfig';
import { filterRoutes } from '../utils/searchHelpers.jsx';

export const useSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1); // índice seleccionado
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const { role } = useAuth();

  // Obtener las rutas disponibles según el rol
  const availableRoutes = getSidebarItemsByRole(role);

  // Buscar cuando cambia el término
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setResults([]);
      setIsOpen(false);
      setSelectedIndex(-1); // Reset del índice
      return;
    }

    const filtered = filterRoutes(availableRoutes, searchTerm);
    setResults(filtered);
    setIsOpen(true);
    setSelectedIndex(-1); // Reset del índice al buscar
  }, [searchTerm, availableRoutes]);

  // Cerrar cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Manejar navegación con teclado
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Solo manejar teclas si el dropdown está abierto
      if (!isOpen) {
        // Si está cerrado y presionan Escape, limpiar búsqueda
        if (event.key === 'Escape') {
          setSearchTerm('');
          setSelectedIndex(-1);
        }
        return;
      }

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          setSelectedIndex((prev) => 
            prev < results.length - 1 ? prev + 1 : prev
          );
          break;

        case 'ArrowUp':
          event.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
          break;

        case 'Enter':
          event.preventDefault();
          if (results.length === 1) {
            // Si solo hay un resultado, navegar a él
            navigateToResult(results[0]);
          } else if (selectedIndex >= 0 && selectedIndex < results.length) {
            // Si hay un resultado seleccionado, navegar a él
            navigateToResult(results[selectedIndex]);
          } else if (results.length > 0 && selectedIndex === -1) {
            // Si no hay selección pero hay resultados, seleccionar el primero
            navigateToResult(results[0]);
          }
          break;

        case 'Escape':
          event.preventDefault();
          setIsOpen(false);
          setSearchTerm('');
          setSelectedIndex(-1);
          break;

        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex]);

  // Función para navegar a un resultado
  const navigateToResult = (route) => {
    setSearchTerm('');
    setResults([]);
    setIsOpen(false);
    setSelectedIndex(-1);
    navigate(route.path);
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const handleSelect = (index) => {
    if (index >= 0 && index < results.length) {
      navigateToResult(results[index]);
    }
  };

  const handleFocus = () => {
    if (searchTerm.trim() !== '' && results.length > 0) {
      setIsOpen(true);
    }
  };

  // Manejar hover del mouse sobre un resultado
  const handleMouseEnter = (index) => {
    setSelectedIndex(index);
  };

  return {
    searchTerm,
    results,
    isOpen,
    selectedIndex, // exponer el índice seleccionado
    searchRef,
    handleSearch,
    handleSelect,
    handleFocus,
    handleMouseEnter, // exponer handler de hover
  };
};