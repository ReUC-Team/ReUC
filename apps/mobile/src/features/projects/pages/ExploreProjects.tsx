import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import ProjectsList from '../components/ProjectsList';
import { styles } from '../../../styles/screens/ExploreProjects.styles';

const TAGS = ['FIE', 'FECAM', 'FACIMAR', 'EDUC'];

const mockProjects = [
  {
    id: '1',
    title: 'Aplicación móvil para cocina',
    description: 'Aplicación móvil de recetario para los estudiantes de la carrera de gastronomía',
    image: require('../../../../../web/src/assets/project.webp'),
  },
  {
    id: '2',
    title: 'Sistema de gestión universitaria',
    description: 'Plataforma para administrar procesos académicos',
    image: require('../../../../../web/src/assets/project2.webp'),
  },
  // Agrega más proyectos según necesites
];

const ExploreProjects = () => {
  const [selectedTag, setSelectedTag] = useState('');

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          Explorar <Text style={styles.titleAccent}>proyectos</Text>
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tagsContainer}
      >
        {TAGS.map((tag) => (
          <TouchableOpacity
            key={tag}
            style={[
              styles.tag,
              selectedTag === tag && styles.tagActive,
            ]}
            onPress={() => setSelectedTag(tag)}
          >
            <Text
              style={[
                styles.tagText,
                selectedTag === tag && styles.tagTextActive,
              ]}
            >
              {tag}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ProjectsList projects={mockProjects} />
    </ScrollView>
  );
};

export default ExploreProjects;