import { describe, it, expect } from "vitest";
import { formatDate, formatTime, formatCurrency } from "@/lib/utils/format";
import { getInitials, truncate, generateQrValue } from "@/lib/utils/helpers";

describe("Formatting Utilities", () => {
  it("formatDate handles valid ISO dates", () => {
    const formatted = formatDate("2026-10-15T00:00:00Z");
    expect(formatted).toContain("2026");
    expect(formatted).toContain("Oct");
  });

  it("formatDate returns N/A for null or undefined", () => {
    expect(formatDate(null)).toBe("N/A");
    expect(formatDate(undefined)).toBe("N/A");
  });

  it("formatTime formats 24h string correctly", () => {
    expect(formatTime("14:30:00")).toBe("14:30");
    expect(formatTime("09:05:00")).toBe("09:05");
    expect(formatTime(null)).toBe("N/A");
  });

  it("formatCurrency formats amount with INR symbol", () => {
    const formatted = formatCurrency(500);
    expect(formatted).toContain("500");
  });
});

describe("Helper Utilities", () => {
  it("getInitials extracts two capital letters from a name", () => {
    expect(getInitials("Atharva Joshi")).toBe("AJ");
    expect(getInitials("Sachin Ramesh Tendulkar")).toBe("SR");
    expect(getInitials("Admin")).toBe("A");
    expect(getInitials("")).toBe("PO");
  });

  it("truncate trims string to specified length with ellipsis", () => {
    expect(truncate("Hello KK Wagh Sports", 10)).toBe("Hello KK W...");
    expect(truncate("Short", 10)).toBe("Short");
  });

  it("generateQrValue generates unique uppercase identifier without hyphens", () => {
    const uuid = "550e8400-e29b-41d4-a716-446655440000";
    const qr = generateQrValue(uuid);
    expect(qr).toBe("PLAYOPS-550E8400E29B41D4A716446655440000");
    expect(qr).not.toContain("-e29b");
  });
});
