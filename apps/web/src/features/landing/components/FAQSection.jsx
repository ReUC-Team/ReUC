import React from 'react';
import faqIllustration from '@/assets/faq-illustration.png';

const faqs = [
  {
    question: '¿Quién puede solicitar un proyecto?',
    answer: 'Cualquier persona, empresa, dependencia pública o asociación civil con una necesidad concreta.',
  },
  {
    question: '¿Tiene algún costo participar?',
    answer: (
      <>
        No. Solicitar un proyecto a través de{' '}
        <span className="text-lime-700 font-semibold">ReUC</span>{' '}
        es totalmente gratuito. Solo debes registrar tu propuesta.
      </>
    ),
  },
  {
    question: '¿Qué tipo de proyectos puedo proponer?',
    answer:
      'Desde soluciones tecnológicas, procesos logísticos, campañas sociales, hasta estudios de impacto ambiental o propuestas educativas.',
  },
  {
    question: '¿Quién desarrollará el proyecto?',
    answer:
      'Estudiantes de la Universidad de Colima, guiados por docentes expertos en la temática del proyecto.',
  },
  {
    question: '¿Cuánto dura el desarrollo de un proyecto?',
    answer:
      'Varía entre 3 y 12 meses, dependiendo del tipo de proyecto académico (tesis, servicio social, prácticas, etc.).',
  },
];

const FAQSection = () => {
  return (
    <section className="bg-gray-100 dark:bg-slate-800 py-12 sm:py-16 px-4 sm:px-6 text-gray-800 dark:text-gray-200">
      <div className="mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 items-center">
        {/* Ilustración */}
        <div className="md:pr-8 flex flex-col items-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 sm:mb-6">
            Preguntas Frecuentes (<span className="text-lime-700">FAQ</span>)
          </h2>
          <img
            src={faqIllustration}
            alt="Persona mirando a través de un telescopio con engranajes"
            className="w-auto h-auto rounded-lg max-w-xs sm:max-w-sm md:max-w-full mx-auto"
          />
        </div>

        {/* Lista de preguntas */}
        <div className="space-y-8">
          {faqs.map((faq, index) => (
            <div key={index}>
              <h3 className="text-xl sm:text-2xl font-bold mb-2">
                <span className="text-lime-700 font-bold">{faq.question}</span>
              </h3>
              <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 font-semibold">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
