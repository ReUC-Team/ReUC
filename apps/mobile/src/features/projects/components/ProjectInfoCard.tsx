// apps/mobile/src/features/projects/components/ProjectInfoCard.tsx

import React from 'react';
import { View, Text } from 'react-native';
import { useThemedStyles } from '../../../hooks/useThemedStyles';
import { createProjectInfoCardStyles } from '../../../styles/components/projects/ProjectInfoCard.styles';

interface InfoItem {
  label: string;
  value: string;
}

interface ProjectInfoCardProps {
  title?: string;
  items: InfoItem[];
}

const ProjectInfoCard: React.FC<ProjectInfoCardProps> = ({ title, items }) => {
  const styles = useThemedStyles(createProjectInfoCardStyles);

  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      <View style={styles.itemsContainer}>
        {items.map((item, index) => (
          <View key={`${item.label}-${index}`} style={styles.item}> 
            <Text style={styles.label}>{item.label}:</Text>
            <Text style={styles.value}>{item.value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default ProjectInfoCard;