# Async Test Patterns

## Testing Async Functions

```typescript
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

describe("fetchUser", () => {
  // ===========================================
  // 正常系 (Success Cases)
  // ===========================================
  describe("正常系 (Success Cases)", () => {
    it("should return user data on success", async () => {
      const user = await fetchUser("123");
      expect(user).toEqual({
        id: "123",
        name: "Test User",
        email: "test@example.com",
      });
    });

    it("should resolve with correct structure", async () => {
      const user = await fetchUser("123");
      expect(user).toMatchObject({
        id: expect.any(String),
        name: expect.any(String),
      });
    });
  });

  // ===========================================
  // 異常系 (Error Cases)
  // ===========================================
  describe("異常系 (Error Cases)", () => {
    it("should throw error for non-existent user", async () => {
      await expect(fetchUser("non-existent")).rejects.toThrow("User not found");
    });

    it("should throw network error on connection failure", async () => {
      vi.spyOn(global, "fetch").mockRejectedValueOnce(new Error("Network error"));
      await expect(fetchUser("123")).rejects.toThrow("Network error");
    });
  });
});
```

## Mocking API Calls

### Using vi.mock

```typescript
import { describe, expect, it, vi, beforeEach } from "vitest";
import { getUsers } from "./api";
import * as httpClient from "./http-client";

vi.mock("./http-client");

describe("getUsers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch users from API", async () => {
    const mockUsers = [{ id: "1", name: "User 1" }];
    vi.mocked(httpClient.get).mockResolvedValue({ data: mockUsers });

    const users = await getUsers();

    expect(httpClient.get).toHaveBeenCalledWith("/users");
    expect(users).toEqual(mockUsers);
  });

  it("should handle empty response", async () => {
    vi.mocked(httpClient.get).mockResolvedValue({ data: [] });

    const users = await getUsers();

    expect(users).toEqual([]);
  });
});
```

### Using MSW (Mock Service Worker)

```typescript
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { describe, expect, it, beforeAll, afterAll, afterEach } from "vitest";

const server = setupServer(
  http.get("/api/users/:id", ({ params }) => {
    if (params.id === "not-found") {
      return HttpResponse.json({ error: "Not found" }, { status: 404 });
    }
    return HttpResponse.json({ id: params.id, name: "Test User" });
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("API Integration", () => {
  it("should fetch user successfully", async () => {
    const response = await fetch("/api/users/123");
    const data = await response.json();

    expect(data).toEqual({ id: "123", name: "Test User" });
  });

  it("should handle 404 error", async () => {
    const response = await fetch("/api/users/not-found");

    expect(response.status).toBe(404);
  });
});
```

## Testing Loading States

```typescript
import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

describe("UserProfile", () => {
  describe("ローディング状態 (Loading State)", () => {
    it("should show loading spinner while fetching", async () => {
      // Create a promise that we can control
      let resolvePromise: (value: any) => void;
      const promise = new Promise((resolve) => {
        resolvePromise = resolve;
      });

      vi.mocked(fetchUser).mockReturnValue(promise);

      render(<UserProfile userId="123" />);

      // Loading state
      expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();

      // Resolve the promise
      resolvePromise!({ id: "123", name: "Test User" });

      // Wait for loading to complete
      await waitFor(() => {
        expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();
      });

      // Data is displayed
      expect(screen.getByText("Test User")).toBeInTheDocument();
    });
  });

  describe("エラー状態 (Error State)", () => {
    it("should show error message on fetch failure", async () => {
      vi.mocked(fetchUser).mockRejectedValue(new Error("Failed to fetch"));

      render(<UserProfile userId="123" />);

      await waitFor(() => {
        expect(screen.getByRole("alert")).toHaveTextContent("Failed to fetch");
      });
    });

    it("should provide retry option on error", async () => {
      vi.mocked(fetchUser).mockRejectedValueOnce(new Error("Failed"));

      render(<UserProfile userId="123" />);

      await waitFor(() => {
        expect(screen.getByRole("button", { name: /retry/i })).toBeInTheDocument();
      });
    });
  });
});
```

## Testing Debounced/Throttled Functions

```typescript
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { debounce } from "./utils";

describe("debounce", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should delay function execution", () => {
    const fn = vi.fn();
    const debouncedFn = debounce(fn, 300);

    debouncedFn();
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(300);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("should cancel previous call on rapid invocations", () => {
    const fn = vi.fn();
    const debouncedFn = debounce(fn, 300);

    debouncedFn("first");
    vi.advanceTimersByTime(100);

    debouncedFn("second");
    vi.advanceTimersByTime(100);

    debouncedFn("third");
    vi.advanceTimersByTime(300);

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith("third");
  });
});
```

## Testing with Suspense

```typescript
import { render, screen } from "@testing-library/react";
import { Suspense } from "react";
import { describe, expect, it } from "vitest";

describe("SuspenseComponent", () => {
  it("should show fallback while loading", async () => {
    render(
      <Suspense fallback={<div>Loading...</div>}>
        <AsyncComponent />
      </Suspense>
    );

    // Initially shows fallback
    expect(screen.getByText("Loading...")).toBeInTheDocument();

    // Wait for actual content
    expect(await screen.findByText("Loaded Content")).toBeInTheDocument();

    // Fallback is removed
    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
  });
});
```
