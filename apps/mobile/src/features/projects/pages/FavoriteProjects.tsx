import React from 'react';
import { View, Text } from 'react-native';
import ProjectsList from '../components/ProjectsList';
import { styles } from '../../../styles/screens/FavoriteProjects.styles';

const mockProjects = [
  {
    id: '1',
    title: 'Proyecto favorito 1',
    description: 'Descripción del proyecto favorito',
    image: require('../../../../../web/src/assets/project.webp'),
  },
];

const FavoriteProjects = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          Mis <Text style={styles.titleAccent}>favoritos</Text>
        </Text>
      </View>

      <ProjectsList projects={mockProjects} />
    </View>
  );
};

export default FavoriteProjects;