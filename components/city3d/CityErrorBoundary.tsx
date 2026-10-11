"use client";
import { Component, type ReactNode } from "react";

export class CityErrorBoundary extends Component<{ children: ReactNode; onFailure: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFailure(); }
  render() { return this.state.failed ? <div className="city-scene-loading"><span>Cambiando a la vista ligera…</span></div> : this.props.children; }
}
