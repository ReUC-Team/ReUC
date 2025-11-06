import React from 'react';
import { View, Image } from 'react-native';
import { useThemedStyles } from '../../../hooks/useThemedStyles';
import { createProjectImageStyles } from '../../../styles/components/projects/ProjectImage.styles';

interface ProjectImageProps {
  source: any;
  alt?: string;
}

const ProjectImage: React.FC<ProjectImageProps> = ({ source, alt }) => {
  const styles = useThemedStyles(createProjectImageStyles);

  return (
    <View style={styles.container}>
      <Image
        source={source}
        style={styles.image}
        resizeMode="cover"
      />
    </View>
  );
};

export default ProjectImage;