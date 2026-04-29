import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);

    // Si es un error de módulo dinámico (cache viejo tras deploy), recargar automáticamente
    const isDynamicImportError =
      error.message?.includes('Failed to fetch dynamically imported module') ||
      error.message?.includes('Importing a module script failed') ||
      error.message?.includes('error loading dynamically imported module');

    if (isDynamicImportError) {
      // Marcar en sessionStorage para evitar bucle infinito
      const reloadCount = parseInt(sessionStorage.getItem('reload_count') || '0');
      if (reloadCount < 2) {
        sessionStorage.setItem('reload_count', String(reloadCount + 1));
        window.location.reload();
      } else {
        sessionStorage.removeItem('reload_count');
      }
    }
  }

  public render() {
    if (this.state.hasError) {
      const isDynamicImportError =
        this.state.error?.message?.includes('Failed to fetch dynamically imported module') ||
        this.state.error?.message?.includes('Importing a module script failed') ||
        this.state.error?.message?.includes('error loading dynamically imported module');

      // Para errores de caché, mostrar spinner mientras recarga
      if (isDynamicImportError) {
        return (
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-green-700 border-t-transparent mx-auto mb-4"></div>
              <p className="text-green-700 font-bold text-sm uppercase tracking-widest">Actualizando...</p>
            </div>
          </div>
        );
      }

      let errorMessage = "Ocurrió un error inesperado.";

      try {
        const firestoreError = JSON.parse(this.state.error?.message || "");
        if (firestoreError.error) {
          errorMessage = `Error de base de datos: ${firestoreError.error}`;
        }
      } catch (e) {
        if (this.state.error?.message) {
          errorMessage = this.state.error.message;
        }
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="max-w-md w-full bg-white shadow-lg rounded-2xl p-8 text-center">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">¡Ups! Algo salió mal</h1>
            <p className="text-gray-600 mb-6">{errorMessage}</p>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-hungers-green-900 text-white font-bold py-3 rounded-xl hover:bg-hungers-green-800 transition-colors"
            >
              Recargar aplicación
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;