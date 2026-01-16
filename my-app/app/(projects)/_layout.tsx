import { Stack } from 'expo-router';

export default function ProjectsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="projects" options={{ headerShown: false }} />
      <Stack.Screen name="project-detail" options={{ headerShown: false }} />
    </Stack>
  );
}
