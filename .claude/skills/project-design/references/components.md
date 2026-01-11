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
<button className="inline-flex items-center justify-center gap-2 bg-primary text-white px-4 py-2 rounded-md font-medium hover:opacity-90 active:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed">
  Button
</button>
```

### Secondary

```tsx
<button className="inline-flex items-center justify-center gap-2 bg-surface text-foreground px-4 py-2 rounded-md font-medium border border-border hover:bg-border/50 transition-colors disabled:opacity-50">
  Button
</button>
```

### Ghost

```tsx
<button className="inline-flex items-center justify-center gap-2 text-foreground px-4 py-2 rounded-md hover:bg-surface transition-colors">
  Button
</button>
```

### Destructive

```tsx
<button className="bg-error text-white px-4 py-2 rounded-md hover:opacity-90">
  Delete
</button>
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
  className="w-full bg-background border border-border rounded-md px-3 py-2 text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
  placeholder="Enter text..."
/>
```

### Textarea

```tsx
<textarea className="w-full bg-background border border-border rounded-md px-3 py-2 text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 resize-y min-h-[100px]" />
```

### Select

```tsx
<select className="w-full bg-background border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none cursor-pointer">
  <option>Select...</option>
</select>
```

### Label

```tsx
<label className="block text-sm font-medium text-foreground mb-1.5">
  Label
</label>
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
<div className="bg-surface border border-border rounded-lg p-6">
  <h3 className="text-lg font-semibold text-foreground mb-2">Title</h3>
  <p className="text-muted">Content</p>
</div>
```

### Interactive

```tsx
<div className="bg-surface border border-border rounded-lg p-6 hover:border-primary/50 hover:shadow-md transition-all cursor-pointer">
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
<div className="animate-spin w-5 h-5 border-2 border-primary border-t-transparent rounded-full" />
```

### Skeleton

```tsx
<div className="animate-pulse bg-border rounded h-4 w-full" />
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
<div className="flex gap-3 p-4 rounded-lg bg-primary/10 border border-primary/20 text-primary">
  <InfoIcon className="w-5 h-5 flex-shrink-0" />
  <p className="text-sm">Message</p>
</div>
```
