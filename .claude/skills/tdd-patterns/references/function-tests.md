# Function Test Patterns

## Test File Location

```
src/lib/
├── utils.ts
├── utils.test.ts    ← Specification
└── ...
```

## Specification Template

```typescript
import { describe, expect, it } from "vitest";
import { functionName } from "./module";

/**
 * functionName Specification
 *
 * Purpose: [What does this function do]
 * Input: [What parameters does it accept]
 * Output: [What does it return]
 */
describe("functionName", () => {
  // ===========================================
  // 基本動作 (Basic Behavior)
  // ===========================================
  describe("基本動作 (Basic Behavior)", () => {
    it("should return expected output for typical input", () => {
      expect(functionName("input")).toBe("expected output");
    });

    it("should handle multiple arguments correctly", () => {
      expect(functionName("a", "b", "c")).toBe("abc");
    });
  });

  // ===========================================
  // 境界値 (Boundary Values)
  // ===========================================
  describe("境界値 (Boundary Values)", () => {
    it("should handle empty string", () => {
      expect(functionName("")).toBe("");
    });

    it("should handle minimum value", () => {
      expect(functionName(0)).toBe(0);
    });

    it("should handle maximum value", () => {
      expect(functionName(Number.MAX_SAFE_INTEGER)).toBeDefined();
    });
  });

  // ===========================================
  // エッジケース (Edge Cases)
  // ===========================================
  describe("エッジケース (Edge Cases)", () => {
    it("should handle null/undefined gracefully", () => {
      expect(functionName(null)).toBe(defaultValue);
      expect(functionName(undefined)).toBe(defaultValue);
    });

    it("should handle special characters", () => {
      expect(functionName("日本語")).toBe("日本語");
      expect(functionName("émoji 🎉")).toBe("émoji 🎉");
    });

    it("should handle whitespace", () => {
      expect(functionName("  trimmed  ")).toBe("trimmed");
    });
  });

  // ===========================================
  // エラーケース (Error Cases)
  // ===========================================
  describe("エラーケース (Error Cases)", () => {
    it("should throw error for invalid input", () => {
      expect(() => functionName(-1)).toThrow("Input must be positive");
    });

    it("should throw TypeError for wrong type", () => {
      expect(() => functionName({} as string)).toThrow(TypeError);
    });
  });

  // ===========================================
  // 型安全性 (Type Safety)
  // ===========================================
  describe("型安全性 (Type Safety)", () => {
    it("should return correct type", () => {
      const result = functionName("input");
      expect(typeof result).toBe("string");
    });

    it("should accept all valid union types", () => {
      expect(functionName("option1")).toBeDefined();
      expect(functionName("option2")).toBeDefined();
    });
  });
});
```

## Common Patterns

### Table-Driven Tests

```typescript
describe("capitalize", () => {
  it.each([
    ["hello", "Hello"],
    ["world", "World"],
    ["ALREADY", "ALREADY"],
    ["", ""],
    ["a", "A"],
  ])("capitalize(%s) should return %s", (input, expected) => {
    expect(capitalize(input)).toBe(expected);
  });
});
```

### Testing Pure Functions

```typescript
describe("add", () => {
  it("should be commutative: a + b = b + a", () => {
    expect(add(2, 3)).toBe(add(3, 2));
  });

  it("should be associative: (a + b) + c = a + (b + c)", () => {
    expect(add(add(1, 2), 3)).toBe(add(1, add(2, 3)));
  });

  it("should have identity element: a + 0 = a", () => {
    expect(add(5, 0)).toBe(5);
  });
});
```

### Testing Transformations

```typescript
describe("formatDate", () => {
  describe("入力形式 (Input Formats)", () => {
    it("should accept Date object", () => {
      const date = new Date("2024-01-15");
      expect(formatDate(date)).toBe("2024-01-15");
    });

    it("should accept ISO string", () => {
      expect(formatDate("2024-01-15T00:00:00Z")).toBe("2024-01-15");
    });

    it("should accept timestamp", () => {
      expect(formatDate(1705276800000)).toBe("2024-01-15");
    });
  });

  describe("出力形式 (Output Formats)", () => {
    it("should format as YYYY-MM-DD by default", () => {
      expect(formatDate(new Date("2024-01-15"))).toBe("2024-01-15");
    });

    it("should support custom format", () => {
      expect(formatDate(new Date("2024-01-15"), "MM/DD/YYYY")).toBe("01/15/2024");
    });
  });
});
```

### Testing Array/Object Operations

```typescript
describe("groupBy", () => {
  const users = [
    { name: "Alice", role: "admin" },
    { name: "Bob", role: "user" },
    { name: "Carol", role: "admin" },
  ];

  it("should group items by key", () => {
    const grouped = groupBy(users, "role");
    expect(grouped).toEqual({
      admin: [{ name: "Alice", role: "admin" }, { name: "Carol", role: "admin" }],
      user: [{ name: "Bob", role: "user" }],
    });
  });

  it("should return empty object for empty array", () => {
    expect(groupBy([], "key")).toEqual({});
  });

  it("should handle missing keys", () => {
    const items = [{ a: 1 }, { b: 2 }];
    const grouped = groupBy(items, "a");
    expect(grouped).toEqual({
      "1": [{ a: 1 }],
      undefined: [{ b: 2 }],
    });
  });
});
```
