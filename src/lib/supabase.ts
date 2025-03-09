
// Helper function to determine if network is offline
export function isOffline(): boolean {
  return typeof window !== 'undefined' && !window.navigator.onLine;
}

// Helper function to check connection
export async function checkConnection(): Promise<boolean> {
  if (isOffline()) {
    return false;
  }
  
  try {
    // A lightweight request to test the connection
    const response = await fetch('https://www.google.com/generate_204', { 
      method: 'HEAD',
      mode: 'no-cors',
      cache: 'no-store',
    });
    return true;
  } catch (error) {
    console.error('Connection check failed:', error);
    return false;
  }
}
