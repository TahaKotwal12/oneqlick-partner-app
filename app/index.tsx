import { useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    // Small delay to ensure Root Layout is mounted before navigation
    const timer = setTimeout(() => {
      router.replace('/(auth)/login');
    }, 100);

    return () => clearTimeout(timer);
  }, [router]);

  return null;
} 