"use client";

import { useEffect, useState } from "react";
import { Button, type ButtonState } from "@/components/ui/button";
import { AUTO_CYCLE_INTERVAL } from "./constants";

const STATES: ButtonState[] = ["idle", "loading", "success", "loading", "error"];

/**
 * Preview component for the stateful button showcase item.
 * A single button cycles through all states automatically.
 */
export function ButtonPreview() {
  const [stateIndex, setStateIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStateIndex((prev) => (prev + 1) % STATES.length);
    }, AUTO_CYCLE_INTERVAL);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center justify-center">
      <Button
        state={STATES[stateIndex]}
        size="md"
        idleText="ボタン"
        loadingText="読み込み中..."
        successText="送信が完了しました"
        errorText="送信に失敗しました"
      />
    </div>
  );
}

/**
 * Full demo component for the stateful button showcase.
 * Provides interactive buttons that cycle through states automatically.
 */
export function ButtonFullDemo() {
  const [successState, setSuccessState] = useState<ButtonState>("idle");
  const [errorState, setErrorState] = useState<ButtonState>("idle");

  // Handle success flow: idle -> loading (1.5s) -> success
  useEffect(() => {
    if (successState !== "loading") return;
    const timer = setTimeout(() => {
      setSuccessState("success");
    }, 1500);
    return () => clearTimeout(timer);
  }, [successState]);

  // Handle error flow: idle -> loading (1.5s) -> error
  useEffect(() => {
    if (errorState !== "loading") return;
    const timer = setTimeout(() => {
      setErrorState("error");
    }, 1500);
    return () => clearTimeout(timer);
  }, [errorState]);

  const handleSuccessClick = () => {
    if (successState === "idle") {
      setSuccessState("loading");
    }
  };

  const handleErrorClick = () => {
    if (errorState === "idle") {
      setErrorState("loading");
    }
  };

  const handleReset = () => {
    setSuccessState("idle");
    setErrorState("idle");
  };

  return (
    <div className="space-y-6">
      <div>
        <h4 className="mb-3 font-medium text-sm">All Button States</h4>
        <p className="mb-4 text-foreground/70 text-sm">
          The Button component supports four states: idle, loading, success, and error. Each state
          has distinct styling and icons.
        </p>
        <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border p-4">
          <Button state="idle" idleText="Idle" />
          <Button state="loading" loadingText="Loading..." />
          <Button state="success" successText="Success!" />
          <Button state="error" errorText="Error!" />
        </div>
      </div>

      <div>
        <h4 className="mb-3 font-medium text-sm">Interactive Demo</h4>
        <p className="mb-4 text-foreground/70 text-sm">
          Click the buttons below to see state transitions. Each button starts in idle state,
          transitions to loading for 1.5 seconds, then reaches its final state.
        </p>
        <div className="space-y-4 rounded-lg border border-border p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex flex-col items-start gap-2">
              <span className="text-foreground/60 text-xs">Success Flow</span>
              <Button
                state={successState}
                onClick={handleSuccessClick}
                idleText="Submit"
                loadingText="Submitting..."
                successText="Submitted!"
              />
            </div>
            <div className="flex flex-col items-start gap-2">
              <span className="text-foreground/60 text-xs">Error Flow</span>
              <Button
                state={errorState}
                onClick={handleErrorClick}
                idleText="Try Again"
                loadingText="Processing..."
                errorText="Failed!"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="rounded-md border border-border px-3 py-1.5 text-sm transition-colors hover:bg-surface-hover"
          >
            Reset
          </button>
        </div>
      </div>

      <div>
        <h4 className="mb-3 font-medium text-sm">Button Variants</h4>
        <p className="mb-4 text-foreground/70 text-sm">
          The component supports three variants: primary (default), secondary, and ghost.
        </p>
        <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border p-4">
          <Button variant="primary" idleText="Primary" />
          <Button variant="secondary" idleText="Secondary" />
          <Button variant="ghost" idleText="Ghost" />
        </div>
      </div>

      <div>
        <h4 className="mb-3 font-medium text-sm">Button Sizes</h4>
        <p className="mb-4 text-foreground/70 text-sm">
          Three sizes are available: small, medium (default), and large.
        </p>
        <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border p-4">
          <Button size="sm" idleText="Small" />
          <Button size="md" idleText="Medium" />
          <Button size="lg" idleText="Large" />
        </div>
      </div>

      <div>
        <h4 className="mb-3 font-medium text-sm">Implementation Details</h4>
        <ul className="list-inside list-disc space-y-1 text-foreground/70 text-sm">
          <li>State transitions use CSS opacity for smooth crossfade effects</li>
          <li>Loading state includes an animated spinner with spin animation</li>
          <li>Success state displays a checkmark icon with green background</li>
          <li>Error state displays an X icon with red background</li>
          <li>Button is automatically disabled during loading state</li>
          <li>All transitions use 300ms duration with ease-in-out timing</li>
        </ul>
      </div>
    </div>
  );
}
