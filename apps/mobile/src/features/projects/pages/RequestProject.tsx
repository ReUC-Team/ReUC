import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import RequestProjectForm from '../components/RequestProjectForm';
import useRequestProject from '../hooks/useRequestProject';
import { useThemedStyles } from '../../../hooks/useThemedStyles';
import { createRequestProjectStyles } from '../../../styles/screens/RequestProject.styles';

const RequestProject = () => {
  const styles = useThemedStyles(createRequestProjectStyles);
  const { form, error, handleChange, handleSubmit } = useRequestProject();
  const [showHelp, setShowHelp] = useState(false);

  const onSubmit = () => {
    handleSubmit();
    if (error) {
      Alert.alert('Error', error);
    }
  };

  return (
    <View style={styles.container}>
      <RequestProjectForm
        form={form}
        handleChange={handleChange}
        handleSubmit={onSubmit}
        showHelp={showHelp}
        setShowHelp={setShowHelp}
        error={error}
      />
    </View>
  );
};

export default RequestProject;