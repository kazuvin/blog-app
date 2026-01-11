# Component Style Patterns

## Table of Contents

1. [Buttons](#buttons)
2. [Form Elements](#form-elements)
3. [Cards](#cards)
4. [Layout](#layout)
5. [Feedback](#feedback)

---

## Buttons

### Primary

```tsx
<button className="bg-primary inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 font-medium text-white transition-opacity hover:opacity-90 active:opacity-80 disabled:cursor-not-allowed disabled:opacity-50">
  Button
</button>
```

### Secondary

```tsx
<button className="bg-surface text-foreground border-border hover:bg-border/50 inline-flex items-center justify-center gap-2 rounded-md border px-4 py-2 font-medium transition-colors disabled:opacity-50">
  Button
</button>
```

### Ghost

```tsx
<button className="text-foreground hover:bg-surface inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 transition-colors">
  Button
</button>
```

### Destructive

```tsx
<button className="bg-error rounded-md px-4 py-2 text-white hover:opacity-90">Delete</button>
```

### Sizes

```tsx
// Small
"px-3 py-1.5 text-sm rounded";
// Medium (default)
"px-4 py-2 text-base rounded-md";
// Large
"px-6 py-3 text-lg rounded-lg";
```

---

## Form Elements

### Input

```tsx
<input
  className="bg-background border-border text-foreground placeholder:text-muted focus:ring-primary/50 focus:border-primary w-full rounded-md border px-3 py-2 transition-colors focus:ring-2 focus:outline-none"
  placeholder="Enter text..."
/>
```

### Textarea

```tsx
<textarea className="bg-background border-border text-foreground placeholder:text-muted focus:ring-primary/50 min-h-[100px] w-full resize-y rounded-md border px-3 py-2 focus:ring-2 focus:outline-none" />
```

### Select

```tsx
<select className="bg-background border-border text-foreground focus:ring-primary/50 w-full cursor-pointer appearance-none rounded-md border px-3 py-2 focus:ring-2 focus:outline-none">
  <option>Select...</option>
</select>
```

### Label

```tsx
<label className="text-foreground mb-1.5 block text-sm font-medium">Label</label>
```

### Error State

```tsx
// Input with error
className="... border-error focus:ring-error/50"
// Error message
<p className="mt-1 text-sm text-error">Error message</p>
```

---

## Cards

### Basic

```tsx
<div className="bg-surface border-border rounded-lg border p-6">
  <h3 className="text-foreground mb-2 text-lg font-semibold">Title</h3>
  <p className="text-muted">Content</p>
</div>
```

### Interactive

```tsx
<div className="bg-surface border-border hover:border-primary/50 cursor-pointer rounded-lg border p-6 transition-all hover:shadow-md">
  {/* content */}
</div>
```

---

## Layout

### Container

```tsx
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
```

### Flex Row

```tsx
<div className="flex items-center gap-4">
```

### Flex Column

```tsx
<div className="flex flex-col gap-4">
```

### Grid

```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
```

---

## Feedback

### Spinner

```tsx
<div className="border-primary h-5 w-5 animate-spin rounded-full border-2 border-t-transparent" />
```

### Skeleton

```tsx
<div className="bg-border h-4 w-full animate-pulse rounded" />
```

### Badge

```tsx
// Default
<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-surface text-foreground border border-border">
  Badge
</span>
// Success
<span className="... bg-success/10 text-success border-success/20">Success</span>
// Error
<span className="... bg-error/10 text-error border-error/20">Error</span>
```

### Alert

```tsx
<div className="bg-primary/10 border-primary/20 text-primary flex gap-3 rounded-lg border p-4">
  <InfoIcon className="h-5 w-5 flex-shrink-0" />
  <p className="text-sm">Message</p>
</div>
```
