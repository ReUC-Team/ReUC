import React from 'react';
import { View, Text } from 'react-native';
import ProjectsList from '../components/ProjectsList';
import { styles } from '../../../styles/screens/MyProjects.styles';

const mockProjects = [
  {
    id: '1',
    title: 'Mi proyecto 1',
    description: 'Descripción de mi proyecto',
    image: require('../../../../../web/src/assets/project.webp'),
  },
];

const MyProjects = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          Mis <Text style={styles.titleAccent}>proyectos</Text>
        </Text>
      </View>

      <ProjectsList projects={mockProjects} />
    </View>
  );
};

export default MyProjects;