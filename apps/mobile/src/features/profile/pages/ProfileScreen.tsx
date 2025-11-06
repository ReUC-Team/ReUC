import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import ProfileHeader from '../components/ProfileHeader';
import ProfileTabs from '../components/ProfileTabs';
import ProfileInfo from '../components/ProfileInfo';
import { useThemedStyles } from '../../../hooks/useThemedStyles';
import { createProfileScreenStyles } from '../../../styles/screens/ProfileScreen.styles';

const ProfileScreen = () => {
  const styles = useThemedStyles(createProfileScreenStyles);
  const [activeTab, setActiveTab] = useState('overview');

  const handleEditPress = () => {
    console.log('Edit pressed');
    // Navegar a pantalla de edición
  };

  const handleContactPress = () => {
    console.log('Contact pressed');
    // Abrir opciones de contacto
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  const getContentForTab = () => {
    switch (activeTab) {
      case 'overview':
        return "Acme Inc. is a software company based in San Francisco. We specialize in building custom software for both consumer and enterprise clients. We have extensive experience working with leading-edge technologies such as AI, machine learning, and blockchain. Our team of world-class engineers is dedicated to delivering high-quality solutions that meet the unique needs of our clients.";
      case 'proyectos':
        return "Aquí se mostrarán los proyectos de la empresa...";
      case 'feedback':
        return "Aquí se mostrará el feedback de los clientes...";
      default:
        return "";
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <ProfileHeader
          name="Empresa Inc."
          location="Manzanillo, Colima"
          onEditPress={handleEditPress}
          onContactPress={handleContactPress}
        />
        
        <ProfileTabs onTabChange={handleTabChange} />
        
        <ProfileInfo
          title="Empresa Inc"
          description={getContentForTab()}
        />
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;