// apps/mobile/src/components/MobileHeader.tsx

import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { MobileHeaderStyles as styles } from '@styles'

export default function MobileHeader() {
  const nav = useNavigation<any>()
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <TouchableOpacity onPress={() => nav.navigate('Landing')}>
          <Text style={styles.title}>ReUC</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.right}>
        <TouchableOpacity onPress={() => nav.navigate('About')}>
          <Text style={styles.link}>¿Qué es ReUC?</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => nav.navigate('Help')}>
          <Text style={styles.link}>Ayuda</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => nav.navigate('Contact')}>
          <Text style={styles.link}>Contacto</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}
