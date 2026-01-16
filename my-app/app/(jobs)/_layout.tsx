import { Stack } from 'expo-router';

export default function JobsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="jobs" options={{ headerShown: false }} />
      <Stack.Screen name="job-detail" options={{ headerShown: false }} />
      <Stack.Screen name="job-application" options={{ headerShown: false }} />
      <Stack.Screen name="application-success" options={{ headerShown: false }} />
      <Stack.Screen name="applications" options={{ headerShown: false }} />
      <Stack.Screen name="application-status" options={{ headerShown: false }} />
      <Stack.Screen name="saved-jobs" options={{ headerShown: false }} />
    </Stack>
  );
}
