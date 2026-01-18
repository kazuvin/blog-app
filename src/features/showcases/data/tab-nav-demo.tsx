"use client";

import { useEffect, useState } from "react";
import { TabNav, TabNavItem } from "@/components/ui/tab-nav";
import { AUTO_CYCLE_INTERVAL } from "./constants";

const PREVIEW_OPTIONS = ["Option 1", "Option 2", "Option 3"];

/**
 * Preview component for the TabNav showcase item.
 * A simple 3-tab nav with auto-cycling selection.
 */
export function TabNavPreview() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSelectedIndex((prev) => (prev + 1) % PREVIEW_OPTIONS.length);
    }, AUTO_CYCLE_INTERVAL);
    return () => clearInterval(timer);
  }, []);

  return (
    <TabNav value={PREVIEW_OPTIONS[selectedIndex]} onValueChange={() => {}} size="md">
      {PREVIEW_OPTIONS.map((option) => (
        <TabNavItem key={option} value={option}>
          {option}
        </TabNavItem>
      ))}
    </TabNav>
  );
}

/**
 * Full demo component for the TabNav showcase.
 * Provides interactive demos with all variants and sizes.
 */
export function TabNavFullDemo() {
  const [primaryValue, setPrimaryValue] = useState("home");
  const [secondaryValue, setSecondaryValue] = useState("home");
  const [ghostValue, setGhostValue] = useState("home");
  const [smValue, setSmValue] = useState("tab1");
  const [mdValue, setMdValue] = useState("tab1");
  const [lgValue, setLgValue] = useState("tab1");
  const [interactiveValue, setInteractiveValue] = useState("dashboard");

  const navItems = [
    { value: "home", label: "Home" },
    { value: "about", label: "About" },
    { value: "contact", label: "Contact" },
  ];

  const tabItems = [
    { value: "tab1", label: "Tab 1" },
    { value: "tab2", label: "Tab 2" },
    { value: "tab3", label: "Tab 3" },
  ];

  const interactiveItems = [
    { value: "dashboard", label: "Dashboard" },
    { value: "analytics", label: "Analytics" },
    { value: "settings", label: "Settings" },
    { value: "help", label: "Help" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h4 className="mb-3 font-medium text-sm">All Variants</h4>
        <p className="mb-4 text-foreground/70 text-sm">
          The TabNav component supports three variants: primary (default), secondary, and ghost.
          Each variant has distinct indicator styling.
        </p>
        <div className="space-y-4 rounded-lg border border-stone-200 p-4">
          <div className="flex flex-col gap-1">
            <span className="text-foreground/60 text-xs">Primary</span>
            <TabNav value={primaryValue} onValueChange={setPrimaryValue} variant="primary">
              {navItems.map((item) => (
                <TabNavItem key={item.value} value={item.value}>
                  {item.label}
                </TabNavItem>
              ))}
            </TabNav>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-foreground/60 text-xs">Secondary</span>
            <TabNav value={secondaryValue} onValueChange={setSecondaryValue} variant="secondary">
              {navItems.map((item) => (
                <TabNavItem key={item.value} value={item.value}>
                  {item.label}
                </TabNavItem>
              ))}
            </TabNav>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-foreground/60 text-xs">Ghost</span>
            <TabNav value={ghostValue} onValueChange={setGhostValue} variant="ghost">
              {navItems.map((item) => (
                <TabNavItem key={item.value} value={item.value}>
                  {item.label}
                </TabNavItem>
              ))}
            </TabNav>
          </div>
        </div>
      </div>

      <div>
        <h4 className="mb-3 font-medium text-sm">All Sizes</h4>
        <p className="mb-4 text-foreground/70 text-sm">
          Three sizes are available: small, medium (default), and large.
        </p>
        <div className="space-y-4 rounded-lg border border-stone-200 p-4">
          <div className="flex flex-col gap-1">
            <span className="text-foreground/60 text-xs">Small</span>
            <TabNav value={smValue} onValueChange={setSmValue} size="sm">
              {tabItems.map((item) => (
                <TabNavItem key={item.value} value={item.value}>
                  {item.label}
                </TabNavItem>
              ))}
            </TabNav>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-foreground/60 text-xs">Medium</span>
            <TabNav value={mdValue} onValueChange={setMdValue} size="md">
              {tabItems.map((item) => (
                <TabNavItem key={item.value} value={item.value}>
                  {item.label}
                </TabNavItem>
              ))}
            </TabNav>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-foreground/60 text-xs">Large</span>
            <TabNav value={lgValue} onValueChange={setLgValue} size="lg">
              {tabItems.map((item) => (
                <TabNavItem key={item.value} value={item.value}>
                  {item.label}
                </TabNavItem>
              ))}
            </TabNav>
          </div>
        </div>
      </div>

      <div>
        <h4 className="mb-3 font-medium text-sm">Interactive Demo</h4>
        <p className="mb-4 text-foreground/70 text-sm">
          Click the tabs below to see the animated sliding indicator transition smoothly between
          selections.
        </p>
        <div className="space-y-4 rounded-lg border border-stone-200 p-4">
          <TabNav value={interactiveValue} onValueChange={setInteractiveValue}>
            {interactiveItems.map((item) => (
              <TabNavItem key={item.value} value={item.value}>
                {item.label}
              </TabNavItem>
            ))}
          </TabNav>
          <p className="text-foreground/60 text-sm">
            Selected: <span className="font-medium text-foreground">{interactiveValue}</span>
          </p>
        </div>
      </div>

      <div>
        <h4 className="mb-3 font-medium text-sm">Implementation Details</h4>
        <ul className="list-inside list-disc space-y-1 text-foreground/70 text-sm">
          <li>TabNav and TabNavItem components work together via Context API</li>
          <li>Sliding indicator animates with CSS transitions (200ms ease-in-out)</li>
          <li>Indicator position calculated dynamically based on selected item</li>
          <li>Supports keyboard navigation with proper ARIA attributes (role="tablist")</li>
          <li>Responsive to window resize with automatic indicator recalculation</li>
        </ul>
      </div>
    </div>
  );
}
