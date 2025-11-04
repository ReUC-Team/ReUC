import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RequestProjectForm from '../components/RequestProjectForm';
import useRequestProject from '../hooks/useRequestProject';
import { styles } from '../../../styles/screens/RequestProject.styles';

const RequestProject = () => {
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
      <View style={styles.header}>
        <Text style={styles.title}>
          Solicitar un <Text style={styles.titleAccent}>proyecto</Text>
        </Text>
        <TouchableOpacity onPress={() => setShowHelp(!showHelp)}>
          <Ionicons name="information-circle-outline" size={28} color="#4E4E4E" />
        </TouchableOpacity>
      </View>

      {showHelp && (
        <View style={styles.helpBox}>
          <Text style={styles.helpTitle}>Recomendaciones para llenar el formulario:</Text>
          <Text style={styles.helpText}>
            • Proporciona información clara y detallada{'\n'}
            • Selecciona todas las opciones que apliquen{'\n'}
            • Asegúrate de incluir medios de contacto válidos
          </Text>
        </View>
      )}

      {error && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <RequestProjectForm
        form={form}
        handleChange={handleChange}
        handleSubmit={onSubmit}
      />
    </View>
  );
};

export default RequestProject;