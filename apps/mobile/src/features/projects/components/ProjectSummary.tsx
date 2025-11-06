import React from 'react';
import { View, Text } from 'react-native';
import { useThemedStyles } from '../../../hooks/useThemedStyles';
import { createProjectSummaryStyles } from '../../../styles/components/projects/ProjectSummary.styles';

interface ProjectSummaryProps {
  title: string;
  description: string;
}

const ProjectSummary: React.FC<ProjectSummaryProps> = ({ title, description }) => {
  const styles = useThemedStyles(createProjectSummaryStyles);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
};

export default ProjectSummary;