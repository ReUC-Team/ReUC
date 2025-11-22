import { useState, useEffect, useRef } from "react";
import { searchMembers } from "../teamsService.js";
import { Alerts } from "../../../shared/alerts.js";
import { getDisplayMessage } from "../../../utils/errorHandler.js";

/**
 * Hook para búsqueda de miembros en tiempo real
 * @returns {Object} { searchTerm, results, isSearching, isOpen, selectedIndex, ... }
 */
export default function useSearchMembers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef(null);
  const debounceTimer = useRef(null);

  // Búsqueda con debounce
  useEffect(() => {
    // Limpiar resultados si el término es muy corto
    if (!searchTerm || searchTerm.trim().length < 3) {
      setResults([]);
      setIsOpen(false);
      setIsSearching(false);
      return;
    }

    // Limpiar timer anterior
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Esperar 300ms antes de buscar
    debounceTimer.current = setTimeout(async () => {
      setIsSearching(true);
      
      try {
        const members = await searchMembers(searchTerm, 10);
        setResults(members);
        setIsOpen(members.length > 0);
        setSelectedIndex(-1);
      } catch (err) {
        console.error("Error searching members:", err);
        const errorMessage = getDisplayMessage(err);
        
        // No mostrar alerta si es error de validación (menos de 3 chars)
        if (!err.errorCode?.includes('VALIDATION')) {
          Alerts.error(errorMessage);
        }
        
        setResults([]);
        setIsOpen(false);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [searchTerm]);

  // Cerrar cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Navegación con teclado
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event) => {
      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          setSelectedIndex((prev) =>
            prev < results.length - 1 ? prev + 1 : prev
          );
          break;
        case "ArrowUp":
          event.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
          break;
        case "Escape":
          setIsOpen(false);
          setSelectedIndex(-1);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, results]);

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const handleSelect = (member) => {
    setSearchTerm("");
    setResults([]);
    setIsOpen(false);
    setSelectedIndex(-1);
    return member;
  };

  const handleFocus = () => {
    if (results.length > 0 && searchTerm.trim().length >= 3) {
      setIsOpen(true);
    }
  };

  const handleMouseEnter = (index) => {
    setSelectedIndex(index);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setResults([]);
    setIsOpen(false);
    setSelectedIndex(-1);
  };

  return {
    searchTerm,
    results,
    isSearching,
    isOpen,
    selectedIndex,
    searchRef,
    handleSearch,
    handleSelect,
    handleFocus,
    handleMouseEnter,
    clearSearch,
  };
}