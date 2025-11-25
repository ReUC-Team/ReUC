import React from 'react';


const benefits = [
  {
    title: 'Para empresas y organizaciones',
    icon: <svg className='text-4xl text-center w-full mb-3' xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 512 512"><path fill="#ffffff" d="M496 128v16a8 8 0 0 1-8 8h-24v12c0 6.627-5.373 12-12 12H60c-6.627 0-12-5.373-12-12v-12H24a8 8 0 0 1-8-8v-16a8 8 0 0 1 4.941-7.392l232-88a8 8 0 0 1 6.118 0l232 88A8 8 0 0 1 496 128m-24 304H40c-13.255 0-24 10.745-24 24v16a8 8 0 0 0 8 8h464a8 8 0 0 0 8-8v-16c0-13.255-10.745-24-24-24M96 192v192H60c-6.627 0-12 5.373-12 12v20h416v-20c0-6.627-5.373-12-12-12h-36V192h-64v192h-64V192h-64v192h-64V192z"/></svg>,
    descriptions: [
      'Obtén soluciones concretas sin costo',
      'Accede a talento universitario',
      'Contribuye al desarrollo local'
    ]
  },
  {
    title: 'Para estudiantes',
    icon: <svg className='text-3xl text-center w-full mb-3' xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 1024 768"><path fill="#ffffff" d="M1024 736q0 13-9.5 22.5T992 768t-22.5-9.5T960 736V315L607 492q-40 20-95 20t-95-20L39 303Q0 283 0 255.5T39 209L417 20q40-20 95-20t95 20l378 189q34 17 38 42q1 1 1 4zM639 556l193-97v141q0 43-93.5 73.5T512 704t-226.5-30.5T192 600V459l193 97q40 20 127 20t127-20"/></svg>,
    descriptions: [
      'Aplica tus conocimientos en un entorno real',
      'Desarrolla tu tesis, servicio social o residencia profesional con impacto',
      'Trabaja en equipo resolviendo problemas auténticos.'
    ]
  },
  {
    title: 'Para la universidad',
    icon: <svg className='text-4xl text-center w-full mb-3' xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="#ffffff" d="M4 21q-.825 0-1.412-.587T2 19V8q0-.825.588-1.412T4 6h4V4q0-.825.588-1.412T10 2h4q.825 0 1.413.588T16 4v2h4q.825 0 1.413.588T22 8v11q0 .825-.587 1.413T20 21zm6-15h4V4h-4zm2 9.5q.825 0 1.413-.587T14 13.5t-.587-1.412T12 11.5t-1.412.588T10 13.5t.588 1.413T12 15.5"/></svg>,
    descriptions: [
      'Vinculación efectiva con la sociedad',
      'Proyectos con enfoque social y académico',
      'Formación integral para los estudiantes'
    ]
  }
];

const BenefitsSection = () => {
  return (
    <section className="bg-lime-600 dark:bg-gray-900 py-12 sm:py-16 px-4 sm:px-6 md:px-8" id="benefits">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl sm:text-4xl text-stone-50 mb-8 sm:mb-10 text-center font-bold">Beneficios</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="bg-lime-700 p-4 rounded-xl shadow-xl">
              {benefit.icon}
              <h3 className="text-xl font-semibold text-stone-50 dark:text-white mb-3 text-center">{benefit.title}</h3>
              <ul className="list-disc list-outside text-stone-50 dark:text-gray-300 space-y-1 pl-5">
                {benefit.descriptions.map((desc, i) => (
                  <li key={i}>{desc}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
