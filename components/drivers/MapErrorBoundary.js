'use client';
import { Component } from 'react';
export default class MapErrorBoundary extends Component {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch() {}
  render() {
    if (this.state.hasError) {
      return (
        <div
          className="flex items-center justify-center w-full h-full min-h-[280px] rounded-xl text-sm text-center p-6"
          style={{ background: '#f8fafc', border: '1px solid #DBEAFE', color: '#64748b' }}
        >
          Map unavailable. Refresh the page to try again.
        </div>
      );
    }
    return this.props.children;
  }
}