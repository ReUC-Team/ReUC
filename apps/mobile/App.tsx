// apps/mobile/App.tsx
import 'react-native-gesture-handler'
import React, { useEffect, useState, useCallback } from 'react'
import { View } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import * as Font from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'
import { ThemeProvider } from './src/context/ThemeContext'
import AppNavigator from './src/routes/AppNavigator'
import Toast from 'react-native-toast-message'

// Mantener la splash screen visible mientras cargamos recursos
SplashScreen.preventAutoHideAsync()

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false)

  useEffect(() => {
    async function prepare() {
      try {
        // Cargar fuentes
        await Font.loadAsync({
          'OpenDyslexic-Regular': require('./src/assets/fonts/OpenDyslexic3-Regular.ttf'),
          'OpenDyslexic-Bold': require('./src/assets/fonts/OpenDyslexic3-Bold.ttf')
        })
      } catch (e) {
        console.warn(e)
      } finally {
        setAppIsReady(true)
      }
    }

    prepare()
  }, [])

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync()
    }
  }, [appIsReady])

  if (!appIsReady) {
    return null
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <ThemeProvider>
        <AppNavigator />
        <Toast />
      </ThemeProvider>
    </GestureHandlerRootView>
  )
}