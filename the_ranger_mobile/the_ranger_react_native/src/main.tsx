  import React from "react";
  import { createRoot } from "react-dom/client";
  import App from "./app/App.tsx";
  import "./styles/index.css";

  class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: any }> {
    constructor(props: any) {
      super(props);
      this.state = { hasError: false, error: null };
    }
    static getDerivedStateFromError(error: any) {
      return { hasError: true, error };
    }
    render() {
      if (this.state.hasError) {
        return <div style={{ padding: 20, color: 'red' }}>
          <h2>Something went wrong.</h2>
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{this.state.error?.toString()}</pre>
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: 10 }}>{this.state.error?.stack}</pre>
        </div>;
      }
      return this.props.children;
    }
  }

  createRoot(document.getElementById("root")!).render(<ErrorBoundary><App /></ErrorBoundary>);