import { useState } from 'react';
import headerLogo from '../assets/header-logo.png';

export default function ExternalHeader() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleScrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            const offset = 100;
            const elementPosition = element.offsetTop - offset;
            window.scrollTo({
                top: elementPosition,
                behavior: 'smooth'
            });
        }
        setIsMenuOpen(false);
    };

    const navLinks = [
        { name: '¿Qué es ReUC?', id: 'que-es' },
        { name: '¿Por qué ReUC?', id: 'porque' },
        { name: 'Beneficios', id: 'beneficios' },
        { name: 'Preguntas', id: 'faq' },
        { name: 'Ayuda', id: 'ayuda' },
        { name: 'Contacto', id: 'contacto' }
    ];

    return (
        <header className="w-full flex justify-between h-32 items-center">
            <div className="flex items-center gap-4 ml-20 mt-3">
                <img className='w-17' src={headerLogo} alt="" />
                <a href="/" className="text-4xl font-extrabold text-lime-600">ReUC</a>
            </div>

            {/* Desktop Navigation - mantiene el diseño original exacto */}
            <nav className="hidden lg:flex space-x-4 mr-15 text-xl font-bold gap-7">
                <button onClick={() => handleScrollToSection('que-es')} className="hover:text-gray-700 cursor-pointer">
                    ¿Qué es <span className='text-lime-700'>ReUC?</span>
                </button>
                <button onClick={() => handleScrollToSection('porque')} className="hover:text-gray-700 cursor-pointer">
                    ¿Por qué <span className='text-lime-700'>ReUC?</span>
                </button>
                <button onClick={() => handleScrollToSection('beneficios')} className="hover:text-gray-700 cursor-pointer">
                    Beneficios
                </button>
                <button onClick={() => handleScrollToSection('faq')} className="hover:text-gray-700 cursor-pointer">
                    Preguntas
                </button>
                <button onClick={() => handleScrollToSection('ayuda')} className="hover:text-gray-700 cursor-pointer">
                    Ayuda
                </button>
                <button onClick={() => handleScrollToSection('contacto')} className="hover:text-gray-700 cursor-pointer">
                    Contacto
                </button>
            </nav>

            {/* Mobile Hamburger Button */}
            <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden mr-8 p-2"
                aria-label="Toggle menu"
            >
                {isMenuOpen ? (
                    <svg className="w-7 h-7 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <svg className="w-7 h-7 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                )}
            </button>

            {/* Mobile Navigation Menu */}
            {isMenuOpen && (
                <nav className="lg:hidden absolute top-32 left-0 right-0 bg-white shadow-lg z-50 py-4">
                    {navLinks.map((link) => (
                        <button
                            key={link.id}
                            onClick={() => handleScrollToSection(link.id)}
                            className="block w-full text-left px-8 py-4 text-lg font-bold hover:bg-gray-100 hover:text-lime-700 transition-colors"
                        >
                            {link.name}
                        </button>
                    ))}
                </nav>
            )}
        </header>
    );
}
