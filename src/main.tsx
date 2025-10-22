import { createRoot } from 'react-dom/client'
import AppSimplified from './AppSimplified.tsx'
import './index.css'
import { ErrorBoundary } from './components/ErrorBoundary'
// import { runDeploymentDiagnostics } from './utils/deploymentDiagnostics'

// Simple test to see if React is working
console.log('🚀 Main.tsx loaded successfully');

// Ensure favicon loads immediately
const updateFavicon = () => {
  const favicon = document.querySelector('link[rel="shortcut icon"]') as HTMLLinkElement;
  if (favicon) {
    favicon.href = '/favicon.ico?v=' + Date.now();
  }
  
  // Also update other favicon links
  const faviconPng = document.querySelector('link[rel="icon"][type="image/png"]') as HTMLLinkElement;
  if (faviconPng) {
    faviconPng.href = '/favicon-96x96.png?v=' + Date.now();
  }
  
  const faviconSvg = document.querySelector('link[rel="icon"][type="image/svg+xml"]') as HTMLLinkElement;
  if (faviconSvg) {
    faviconSvg.href = '/favicon.svg?v=' + Date.now();
  }
};

// Update favicon immediately when the app loads
updateFavicon();

// Initialize PWA features only in production to avoid dev caching/blank screens
if (import.meta.env.PROD) {
  import('./utils/pwaUtils').then(({ registerServiceWorker, setupOfflineDetection }) => {
    registerServiceWorker();
    setupOfflineDetection();
  }).catch((error) => {
    console.warn('PWA utils not available:', error);
  });
} else {
  // In development, proactively unregister any existing service workers
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((registration) => registration.unregister());
    }).catch(() => {});
  }
}

// Run deployment diagnostics
// runDeploymentDiagnostics();

// Simple and robust app rendering with better error handling
console.log('🎯 Attempting to render App component...');
const rootElement = document.getElementById("root");

if (!rootElement) {
  console.error('❌ Root element not found');
  document.body.innerHTML = '<div style="padding: 20px; font-family: Arial, sans-serif;"><h1>App Loading Error</h1><p>Root element not found. Please refresh the page.</p><button onclick="window.location.reload()">Reload Page</button></div>';
} else {
  try {
    const root = createRoot(rootElement);
    
    // Add a simple loading state first
    root.render(
      <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; font-family: Arial, sans-serif;">
        <div style="text-align: center;">
          <div style="width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #3498db; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 20px;"></div>
          <p>Loading TourCompanion...</p>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
    
    // Then render the actual app after a short delay
    setTimeout(() => {
      try {
        root.render(
          <ErrorBoundary>
            <AppSimplified />
          </ErrorBoundary>
        );
        console.log('✅ App rendered successfully');
      } catch (error) {
        console.error('❌ Failed to render app:', error);
        root.render(
          <div style="padding: 20px; font-family: Arial, sans-serif; text-align: center;">
            <h1>App Loading Error</h1>
            <p>There was an error loading the application.</p>
            <p>Error: {error instanceof Error ? error.message : 'Unknown error'}</p>
            <button onClick={() => window.location.reload()} style="padding: 10px 20px; background: #3498db; color: white; border: none; border-radius: 5px; cursor: pointer;">
              Reload Page
            </button>
          </div>
        );
      }
    }, 100);
    
  } catch (error) {
    console.error('❌ Failed to create root:', error);
    rootElement.innerHTML = `
      <div style="padding: 20px; font-family: Arial, sans-serif; text-align: center;">
        <h1>App Loading Error</h1>
        <p>There was an error loading the application.</p>
        <p>Error: ${error instanceof Error ? error.message : 'Unknown error'}</p>
        <button onclick="window.location.reload()" style="padding: 10px 20px; background: #3498db; color: white; border: none; border-radius: 5px; cursor: pointer;">
          Reload Page
        </button>
      </div>
    `;
  }
}
