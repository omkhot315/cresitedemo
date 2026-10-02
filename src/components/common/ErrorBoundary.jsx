import React from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("[Cresite Error Boundary]", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  handleGoHome = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-screen items-center justify-center bg-[#F6F5F1] p-5 text-[#101014]">
          <div className="w-full max-w-md rounded-3xl border border-black/10 bg-white p-8 text-center shadow-xl sm:p-10">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-red-100 text-red-600">
              <AlertTriangle size={26} />
            </span>

            <h1 className="mt-5 font-display text-2xl font-bold">Something went wrong</h1>
            <p className="mt-2.5 text-[14px] leading-relaxed text-[#55555E]">
              An unexpected error occurred while rendering this page. You can try refreshing or returning to the home page.
            </p>

            {process.env.NODE_ENV !== "production" && this.state.error && (
              <div className="mt-4 max-h-32 overflow-auto rounded-xl bg-black/5 p-3 text-left font-mono text-[11px] text-red-700">
                {this.state.error.toString()}
              </div>
            )}

            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={this.handleReset}
                className="inline-flex items-center gap-2 rounded-full bg-[#5046E5] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 transition hover:bg-[#4338CA]"
              >
                <RefreshCw size={15} /> Reload page
              </button>
              <button
                type="button"
                onClick={this.handleGoHome}
                className="inline-flex items-center gap-2 rounded-full border border-black/15 bg-white px-6 py-3 text-sm font-bold transition hover:border-black/30"
              >
                <Home size={15} /> Go to home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
