import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { styles } from '../../../styles/components/profile/ProfileTabs.styles';

interface Tab {
  id: string;
  label: string;
}

interface ProfileTabsProps {
  tabs?: Tab[];
  onTabChange?: (tabId: string) => void;
}

const defaultTabs: Tab[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'proyectos', label: 'Proyectos' },
  { id: 'feedback', label: 'Feedback' },
];

const ProfileTabs: React.FC<ProfileTabsProps> = ({ 
  tabs = defaultTabs,
  onTabChange 
}) => {
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  const handleTabPress = (tabId: string) => {
    setActiveTab(tabId);
    onTabChange?.(tabId);
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tab,
              activeTab === tab.id && styles.activeTab,
            ]}
            onPress={() => handleTabPress(tab.id)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab.id && styles.activeTabText,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default ProfileTabs;