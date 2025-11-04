import React, { useState } from 'react';

const Settings = () => {
  const [activeSection, setActiveSection] = useState('general');
  const [notifications, setNotifications] = useState({
    push: true,
    email: false,
    reminders: true
  });
  const [privacy, setPrivacy] = useState({
    shareUsageData: true,
    analyticalCookies: true
  });
  const [language, setLanguage] = useState('Español');

  // SVG Icons
  const UserIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
    </svg>
  );

  const BellIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
    </svg>
  );

  const EyeIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
    </svg>
  );

  const FileTextIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
    </svg>
  );

  const ShieldIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.6 14.8,10V11C15.4,11 16,11.4 16,12V16C16,16.6 15.6,17 15,17H9C8.4,17 8,16.6 8,16V12C8,11.4 8.4,11 9,11V10C9,8.6 10.6,7 12,7M12,8.2C11.2,8.2 10.2,9 10.2,10V11H13.8V10C13.8,9 12.8,8.2 12,8.2Z"/>
    </svg>
  );

  const HelpCircleIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12,2C6.48,2 2,6.48 2,12s4.48,10 10,10 10-4.48 10-10S17.52,2 12,2zm1,17h-2v-2h2v2zm2.07-7.75l-0.9,0.92C13.45,12.9 13,13.5 13,15h-2v-0.5c0-1.1 0.45-2.1 1.17-2.83l1.24-1.26c0.37-0.36 0.59-0.86 0.59-1.41 0-1.1-0.9-2-2-2s-2,0.9-2,2H8c0-2.21 1.79-4 4-4s4,1.79 4,4c0,0.88-0.36,1.68-0.93,2.25z"/>
    </svg>
  );

  const ChevronRightIcon = () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
    </svg>
  );

  const settingsSections = [
    {
      id: 'general',
      title: 'General',
      icon: <UserIcon />,
      items: [
        { label: 'Idioma', type: 'select', value: language, onChange: setLanguage, options: ['Español', 'English'] }
      ]
    },
    {
      id: 'notifications',
      title: 'Notificaciones',
      icon: <BellIcon />,
      items: [
        { 
          label: 'Notificaciones Push', 
          type: 'toggle', 
          value: notifications.push, 
          onChange: (value) => setNotifications(prev => ({...prev, push: value}))
        },
        { 
          label: 'Notificaciones por Email', 
          type: 'toggle', 
          value: notifications.email,
          onChange: (value) => setNotifications(prev => ({...prev, email: value}))
        },
        { 
          label: 'Recordatorios', 
          type: 'toggle', 
          value: notifications.reminders,
          onChange: (value) => setNotifications(prev => ({...prev, reminders: value}))
        }
      ]
    },
    {
      id: 'privacy',
      title: 'Privacidad',
      icon: <EyeIcon />,
      items: [
        { 
          label: 'Compartir Datos de Uso', 
          type: 'toggle', 
          value: privacy.shareUsageData,
          onChange: (value) => setPrivacy(prev => ({...prev, shareUsageData: value}))
        },
        { 
          label: 'Cookies Analíticas', 
          type: 'toggle', 
          value: privacy.analyticalCookies,
          onChange: (value) => setPrivacy(prev => ({...prev, analyticalCookies: value}))
        }
      ]
    }
  ];

  const legalSections = [
    {
      id: 'terms',
      title: 'Términos y Condiciones',
      icon: <FileTextIcon />
    },
    {
      id: 'privacy-policy',
      title: 'Política de Privacidad',
      icon: <ShieldIcon />
    },
    {
      id: 'help',
      title: 'Ayuda y Soporte',
      icon: <HelpCircleIcon />
    }
  ];

  const ToggleSwitch = ({ value, onChange }) => (
    <button
      onClick={() => onChange(!value)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        value ? 'bg-lime-600' : 'bg-gray-300'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          value ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  const Select = ({ value, options, onChange }) => (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-lime-500"
    >
      {options.map(option => (
        <option key={option} value={option}>{option}</option>
      ))}
    </select>
  );

  const SettingItem = ({ item }) => (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
      <span className="text-gray-700 font-medium">{item.label}</span>
      {item.type === 'toggle' && (
        <ToggleSwitch value={item.value} onChange={item.onChange || (() => {})} />
      )}
      {item.type === 'select' && (
        <Select value={item.value} options={item.options} onChange={item.onChange || (() => {})} />
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Configuración</h1>
          <p className="text-gray-600">
            Personaliza tu experiencia y gestiona las preferencias de tu cuenta
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="rounded-lg shadow-sm border bg-white border-gray-200">
              <div className="p-4">
                <h3 className="font-semibold mb-4">Configuración</h3>
                <nav className="space-y-2">
                  {settingsSections.map(section => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-left transition-colors ${
                        activeSection === section.id
                          ? 'bg-lime-50 text-lime-700'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {section.icon}
                      <span>{section.title}</span>
                    </button>
                  ))}
                </nav>
              </div>
              
              <div className="border-t p-4 border-gray-200">
                <h3 className="font-semibold mb-4">Legal</h3>
                <nav className="space-y-2">
                  {legalSections.map(section => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-left transition-colors ${
                        activeSection === section.id
                          ? 'bg-lime-50 text-lime-700'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {section.icon}
                      <span>{section.title}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="rounded-lg shadow-sm border bg-white border-gray-200">
              {/* Settings Sections */}
              {settingsSections.map(section => (
                activeSection === section.id && (
                  <div key={section.id} className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                      {section.icon}
                      <h2 className="text-xl font-semibold">{section.title}</h2>
                    </div>
                    <div className="space-y-1">
                      {section.items.map((item, index) => (
                        <SettingItem key={index} item={item} />
                      ))}
                    </div>
                  </div>
                )
              ))}

              {/* Legal Sections */}
              {activeSection === 'terms' && <TermsOfService />}
              {activeSection === 'privacy-policy' && <PrivacyPolicy />}
              {activeSection === 'help' && <HelpSupport />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente de Términos y Condiciones
const TermsOfService = () => (
  <div className="p-6">
    <h2 className="text-xl font-semibold mb-6 flex items-center gap-3">
      Términos y Condiciones
    </h2>
    <div className="prose max-w-none">
      <p className="mb-4 text-gray-600">
      </p>
      
      <div className="space-y-6">
        <section>
          <h3 className="text-lg font-semibold mb-3">1. Aceptación de los Términos</h3>
          <p className="text-gray-600">
            Al acceder y utilizar este servicio, usted acepta cumplir con estos términos y condiciones. 
            Si no está de acuerdo con alguna parte de estos términos, no debe utilizar nuestro servicio.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-3">2. Uso del Servicio</h3>
          <p className="text-gray-600">
            Nuestro servicio está destinado para uso personal y comercial legítimo. Usted se compromete a:
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1 text-gray-600">
            <li>Utilizar el servicio de manera responsable</li>
            <li>No violar ninguna ley o regulación aplicable</li>
            <li>Respetar los derechos de otros usuarios</li>
            <li>No intentar acceder a áreas restringidas del sistema</li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-3">3. Cuenta de Usuario</h3>
          <p className="text-gray-600">
            Usted es responsable de mantener la confidencialidad de su cuenta y contraseña. 
            Debe notificarnos inmediatamente sobre cualquier uso no autorizado de su cuenta.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-3">4. Limitación de Responsabilidad</h3>
          <p className="text-gray-600">
            El servicio se proporciona "tal como está" sin garantías de ningún tipo. 
            No seremos responsables por daños indirectos, incidentales o consecuentes.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-3">5. Modificaciones</h3>
          <p className="text-gray-600">
            Nos reservamos el derecho de modificar estos términos en cualquier momento. 
            Los cambios entrarán en vigor inmediatamente después de su publicación.
          </p>
        </section>
      </div>
    </div>
  </div>
);

// Componente de Política de Privacidad
const PrivacyPolicy = ({ isDark }) => (
  <div className="p-6">
    <h2 className="text-xl font-semibold mb-6 flex items-center gap-3">
      Política de Privacidad
    </h2>
    <div className="prose max-w-none">
      <p className={`mb-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
        <strong>Última actualización:</strong> {new Date().toLocaleDateString('es-ES')}
      </p>
      
      <div className="space-y-6">
        <section>
          <h3 className="text-lg font-semibold mb-3">1. Información que Recopilamos</h3>
          <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
            Recopilamos información que usted nos proporciona directamente, incluyendo:
          </p>
          <ul className={`list-disc list-inside mt-2 space-y-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            <li>Información de cuenta (nombre, email, contraseña)</li>
            <li>Datos de perfil y preferencias</li>
            <li>Contenido que crea o comparte</li>
            <li>Comunicaciones con nuestro equipo de soporte</li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-3">2. Cómo Utilizamos su Información</h3>
          <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
            Utilizamos su información para:
          </p>
          <ul className={`list-disc list-inside mt-2 space-y-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            <li>Proporcionar y mejorar nuestros servicios</li>
            <li>Personalizar su experiencia</li>
            <li>Comunicarnos con usted sobre el servicio</li>
            <li>Garantizar la seguridad de la plataforma</li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-3">3. Compartir Información</h3>
          <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
            No vendemos, alquilamos ni compartimos su información personal con terceros, 
            excepto en las siguientes circunstancias:
          </p>
          <ul className={`list-disc list-inside mt-2 space-y-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            <li>Con su consentimiento explícito</li>
            <li>Para cumplir con obligaciones legales</li>
            <li>Con proveedores de servicios que nos ayudan a operar</li>
            <li>En caso de fusión o adquisición empresarial</li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-3">4. Seguridad de los Datos</h3>
          <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
            Implementamos medidas de seguridad técnicas y organizativas para proteger 
            su información personal contra acceso no autorizado, alteración, divulgación o destrucción.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-3">5. Sus Derechos</h3>
          <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
            Usted tiene derecho a:
          </p>
          <ul className={`list-disc list-inside mt-2 space-y-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            <li>Acceder a su información personal</li>
            <li>Corregir datos inexactos</li>
            <li>Solicitar la eliminación de sus datos</li>
            <li>Oponerse al procesamiento de sus datos</li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-3">6. Cookies</h3>
          <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
            Utilizamos cookies y tecnologías similares para mejorar su experiencia, 
            analizar el uso del sitio y personalizar el contenido. Puede gestionar 
            las preferencias de cookies en la configuración de su navegador.
          </p>
        </section>
      </div>
    </div>
  </div>
);

// Componente de Ayuda y Soporte
const HelpSupport = ({ isDark }) => (
  <div className="p-6">
    <h2 className="text-xl font-semibold mb-6 flex items-center gap-3">
      Ayuda y Soporte
    </h2>
    
    <div className="space-y-8">
      <section>
        <h3 className="text-lg font-semibold mb-4">Preguntas Frecuentes</h3>
        <div className="space-y-4">
          <details className={`border rounded-lg ${isDark ? 'border-gray-600' : 'border-gray-200'}`}>
            <summary className="cursor-pointer p-4 font-medium">
              ¿Cómo puedo cambiar mi contraseña?
            </summary>
            <div className={`p-4 border-t ${isDark ? 'border-gray-600 text-gray-300' : 'border-gray-200 text-gray-600'}`}>
              Puede cambiar su contraseña accediendo a la sección "General" en configuración y haciendo clic en "Cambiar contraseña".
            </div>
          </details>
          
          <details className={`border rounded-lg ${isDark ? 'border-gray-600' : 'border-gray-200'}`}>
            <summary className="cursor-pointer p-4 font-medium">
              ¿Cómo elimino mi cuenta?
            </summary>
            <div className={`p-4 border-t ${isDark ? 'border-gray-600 text-gray-300' : 'border-gray-200 text-gray-600'}`}>
              Para eliminar su cuenta, contacte con nuestro equipo de soporte. Esta acción es irreversible y eliminará todos sus datos.
            </div>
          </details>
          
          <details className={`border rounded-lg ${isDark ? 'border-gray-600' : 'border-gray-200'}`}>
            <summary className="cursor-pointer p-4 font-medium">
              ¿Puedo exportar mis datos?
            </summary>
            <div className={`p-4 border-t ${isDark ? 'border-gray-600 text-gray-300' : 'border-gray-200 text-gray-600'}`}>
              Sí, puede solicitar una exportación de sus datos contactando con soporte técnico.
            </div>
          </details>
        </div>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-4">Contacto</h3>
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-4`}>
          <div className={`p-4 rounded-lg border ${isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'}`}>
            <h4 className="font-semibold mb-2">Soporte Técnico</h4>
            <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
              Email: soporte@tuapp.com<br />
              Horario: Lun-Vie 9:00-18:00
            </p>
          </div>
          
          <div className={`p-4 rounded-lg border ${isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'}`}>
            <h4 className="font-semibold mb-2">Ventas y Consultas</h4>
            <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
              Email: ventas@tuapp.com<br />
              Teléfono: +52 (55) 1234-5678
            </p>
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-4">Recursos Adicionales</h3>
        <div className="space-y-3">
          <a 
            href="#" 
            className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
              isDark 
                ? 'border-gray-600 hover:bg-gray-700' 
                : 'border-gray-200 hover:bg-gray-50'
            }`}
          >
            <span>Guía de Usuario</span>
          </a>
          
          <a 
            href="#" 
            className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
              isDark 
                ? 'border-gray-600 hover:bg-gray-700' 
                : 'border-gray-200 hover:bg-gray-50'
            }`}
          >
            <span>Video Tutoriales</span>
          </a>
          
          <a 
            href="#" 
            className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
              isDark 
                ? 'border-gray-600 hover:bg-gray-700' 
                : 'border-gray-200 hover:bg-gray-50'
            }`}
          >
            <span>Foro de la Comunidad</span>
          </a>
        </div>
      </section>
    </div>
  </div>
);

export default Settings;