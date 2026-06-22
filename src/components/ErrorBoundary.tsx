import React, { ErrorInfo, ReactNode } from 'react';
import { ShieldAlert, RefreshCcw, Home, ShoppingBag } from 'lucide-react';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("EcoBazar Exception caught by boundary:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.hash = '#/'; // Go back to safety home view
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[70vh] flex items-center justify-center px-6 py-12 select-none text-left">
          <div className="max-w-md w-full bg-white border border-slate-150 rounded-[32px] p-8 md:p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#00B894_1px,transparent_1px)] [background-size:16px_16px]"></div>
            <div className="absolute -right-12 -top-12 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl pointer-events-none"></div>

            <div className="relative space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-100 text-rose-500 flex items-center justify-center animate-pulse">
                <ShieldAlert className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <span className="text-[10px] tracking-widest text-[#D4AF37] font-extrabold uppercase bg-[#D4AF37]/5 px-3 py-1 rounded-full">
                  System Guard Active
                </span>
                <h2 className="font-display font-extrabold text-2xl text-[#1E293B] tracking-tight leading-tight">
                  Component Interrupted
                </h2>
                <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                  We encountered an unexpected presentation exception while preparing this lifestyle experience. Rest assured, your secure checkout context remains protected.
                </p>
              </div>

              {this.state.error && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[10px] text-slate-500 overflow-x-auto max-h-24 whitespace-pre-wrap">
                  {this.state.error.toString()}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={this.handleReset}
                  className="py-3 px-4 bg-gradient-to-r from-[#00B894] to-[#008D7F] text-white text-xs font-extrabold uppercase tracking-wider rounded-xl hover:shadow-lg transition flex items-center justify-center gap-1.5"
                >
                  <RefreshCcw className="w-3.5 h-3.5" />
                  Reset View
                </button>
                <button
                  onClick={() => {
                    this.setState({ hasError: false, error: null });
                    window.location.hash = '#/shop';
                  }}
                  className="py-3 px-4 bg-slate-900 text-white text-xs font-extrabold uppercase tracking-wider rounded-xl hover:bg-slate-800 transition flex items-center justify-center gap-1.5"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  Go back Shop
                </button>
              </div>

              <div className="text-center pt-2">
                <a
                  href="#/"
                  onClick={() => this.setState({ hasError: false, error: null })}
                  className="inline-flex items-center gap-1.5 text-[10px] font-black text-slate-400 hover:text-[#00B894] uppercase tracking-widest transition"
                >
                  <Home className="w-3 h-3" />
                  Return Home
                </a>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
