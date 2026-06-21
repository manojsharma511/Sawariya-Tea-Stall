import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in boundary:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-cream flex items-center justify-center p-6 text-center select-none">
          <div className="bg-white rounded-3xl p-8 md:p-12 max-w-md w-full border border-orange-100 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-saffron to-accent" />
            
            <div className="w-16 h-16 bg-orange-50 text-saffron rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md shadow-saffron/10">
              <AlertTriangle size={32} />
            </div>

            <span className="inline-block px-3 py-1 bg-saffron/10 text-saffron rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
              System Error
            </span>

            <h2 className="font-heading text-2xl font-bold text-secondary mb-2">
              Something Went Wrong
            </h2>
            <p className="font-hindi text-base text-primary-dark mb-4">
              क्षमा करें, कुछ तकनीकी समस्या आई है। 🙏
            </p>

            <p className="text-gray-400 text-xs mb-6 leading-relaxed">
              We encountered a runtime problem. Don't worry, you can reload the page or click below to return to the home screen.
            </p>

            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full py-3.5 bg-saffron hover:bg-accent text-white font-bold rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-1.5"
              >
                <RefreshCw size={14} />
                <span>Reload Page</span>
              </button>
              <button
                onClick={this.handleReset}
                className="w-full py-3 bg-gray-50 hover:bg-gray-100 text-secondary font-bold rounded-xl text-xs transition-all border border-gray-100"
              >
                Go to Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
