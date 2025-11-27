// apps/mobile/src/features/landing/pages/LandingPage.tsx

import React from 'react'
import { View, ScrollView, Text, StatusBar } from 'react-native'
import GoogleBtn from '../components/GoogleBtn'
import Hero from '../components/Hero'
import LoginPrompt from '../components/LoginPrompt'
import RegisterBtn from '../components/RegisterBtn'
import { LandingPageStyles as styles } from '../../../styles'

export default function LandingPage() {
  return (
    <View style={styles.background}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={styles.background.backgroundColor}
        translucent={false}
      />

      <ScrollView contentContainerStyle={styles.containerCentered}>
        <Text style={styles.logo}>
          Re<Text style={styles.logoHighlight}>UC</Text>
        </Text>

        <Hero />

{/*         <GoogleBtn />
 */}
{/*         <View style={styles.orWrapper}>
          <View style={styles.line} />
          <Text style={styles.or}>o</Text>
          <View style={styles.line} />
        </View> */}

        <RegisterBtn />

        <View style={styles.spacer} />

        <LoginPrompt />
      </ScrollView>
    </View>
  )
}
