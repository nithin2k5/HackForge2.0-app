import { Stack } from 'expo-router';

export default function CompaniesLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="companies" options={{ headerShown: false }} />
      <Stack.Screen name="company-detail" options={{ headerShown: false }} />
    </Stack>
  );
}
