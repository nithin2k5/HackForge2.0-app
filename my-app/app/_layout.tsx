import { useState, useEffect } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as Linking from 'expo-linking';
import 'react-native-reanimated';
import '../global.css';
import { TamaguiProvider } from '@tamagui/core';
import config from '../tamagui.config';
import FullScreenLoader from '@/components/common/FullScreenLoader';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider } from '@/contexts/AuthContext';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const subscription = Linking.addEventListener('url', (event) => {
      const { url } = event;
      const parsed = Linking.parse(url);
      
      if (parsed.path === 'verify-email' && parsed.queryParams?.token) {
        router.replace({
          pathname: '/(auth)/verify-email',
          params: { token: parsed.queryParams.token as string }
        });
      } else if (parsed.path === 'reset-password' && parsed.queryParams?.token) {
        router.replace({
          pathname: '/(auth)/reset-password',
          params: { token: parsed.queryParams.token as string }
        });
      }
    });

    Linking.getInitialURL().then((url) => {
      if (url) {
        const parsed = Linking.parse(url);
        if (parsed.path === 'verify-email' && parsed.queryParams?.token) {
          router.replace({
            pathname: '/(auth)/verify-email',
            params: { token: parsed.queryParams.token as string }
          });
        } else if (parsed.path === 'reset-password' && parsed.queryParams?.token) {
          router.replace({
            pathname: '/(auth)/reset-password',
            params: { token: parsed.queryParams.token as string }
          });
        }
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  if (isLoading) {
    return <FullScreenLoader message="Loading GROEI..." />;
  }

  return (
    <TamaguiProvider config={config} defaultTheme="light">
      <AuthProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack
            screenOptions={{
              headerShown: false,
            }}
            initialRouteName="(tabs)"
          >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(jobs)" options={{ headerShown: false }} />
            <Stack.Screen name="(companies)" options={{ headerShown: false }} />
            <Stack.Screen name="(projects)" options={{ headerShown: false }} />
            <Stack.Screen name="settings" options={{ headerShown: false }} />
            <Stack.Screen name="dashboard" options={{ headerShown: false }} />
            <Stack.Screen name="notifications" options={{ headerShown: false }} />
            <Stack.Screen name="interviews" options={{ headerShown: false }} />
            <Stack.Screen name="suggestions" options={{ headerShown: false }} />
            <Stack.Screen name="chatbot" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </AuthProvider>
    </TamaguiProvider>
  );
}
