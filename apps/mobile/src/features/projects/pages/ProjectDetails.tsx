import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import ProjectImage from '../components/ProjectImage';
import ProjectSummary from '../components/ProjectSummary';
import ProjectInfoCard from '../components/ProjectInfoCard';
import { useThemedStyles } from '../../../hooks/useThemedStyles';
import { createProjectDetailsStyles } from '../../../styles/screens/ProjectDetails.styles';

const ProjectDetails = () => {
  const styles = useThemedStyles(createProjectDetailsStyles);

  const applicantInfo = [
    { label: 'Nombre del solicitante', value: 'Jose Joshua Rodriguez' },
    { label: 'Teléfono de contacto', value: '+52 314 166 9964' },
    { label: 'Correo de contacto', value: 'joseavila@ucol.mx' },
    { label: 'Empresa', value: 'Woodward S.A de C.V' },
  ];

  const projectInfo = [
    { label: 'Tipo de proyecto', value: 'Proyecto de Tesis' },
    { label: 'Facultad', value: 'Facultad de Ingeniería Electromecánica' },
    { label: 'Tipo de problemática', value: 'Tecnológica' },
    { label: 'Fecha límite', value: '15 de Abril del 2025' },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          Detalles del <Text style={styles.titleAccent}>proyecto</Text>
        </Text>
      </View>

      <View style={styles.content}>
        <ProjectImage source={require('../../../../../web/src/assets/project.webp')} />

        <ProjectSummary
          title="Aplicación móvil para cocina"
          description="Aplicación móvil de recetario para los estudiantes de la carrera de gastronomía. Aplicación móvil de recetario para los estudiantes de la carrera de gastronomía. Aplicación móvil de recetario para los estudiantes de la carrera de gastronomía."
        />

        <Text style={styles.sectionTitle}>
          Información del <Text style={styles.titleAccent}>solicitante</Text>
        </Text>
        <ProjectInfoCard items={applicantInfo} />

        <Text style={styles.sectionTitle}>
          Información del <Text style={styles.titleAccent}>proyecto</Text>
        </Text>
        <ProjectInfoCard items={projectInfo} />

        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.acceptButton}>
            <Text style={styles.acceptButtonText}>Aceptar proyecto</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.rejectButton}>
            <Text style={styles.rejectButtonText}>Rechazar proyecto</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactButton}>
            <Text style={styles.contactButtonText}>Ponerse en contacto</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default ProjectDetails;