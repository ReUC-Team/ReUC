import React, { useState } from 'react';
import { View, TextInput, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ProjectCard from './ProjectCard';
import { useThemedStyles, useThemedPalette } from '../../../hooks/useThemedStyles';
import { createProjectsListStyles } from '../../../styles/components/projects/ProjectsList.styles';

interface Project {
  id: string;
  title: string;
  description: string;
  image: any;
}

interface ProjectsListProps {
  projects: Project[];
  showSearch?: boolean;
}

const ProjectsList: React.FC<ProjectsListProps> = ({
  projects,
  showSearch = true,
}) => {
  const styles = useThemedStyles(createProjectsListStyles);
  const palette = useThemedPalette();
  const [search, setSearch] = useState('');

  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {showSearch && (
        <View style={styles.searchContainer}>
          <Ionicons
            name="search-outline"
            size={20}
            color={palette.textSecondary}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar proyectos..."
            placeholderTextColor={palette.textSecondary}
            value={search}
            onChangeText={setSearch}
          />
        </View>
      )}

      <FlatList
        data={filteredProjects}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProjectCard
            title={item.title}
            description={item.description}
            image={item.image}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default ProjectsList;