import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { UserNav } from "@/components/layout/user-nav";
import { useUser } from "@/hooks/use-user";

const mockPush = vi.fn();
const mockSignOut = vi.fn().mockResolvedValue({ error: null });

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: vi.fn(),
  }),
}));

// Mock hooks
vi.mock("@/hooks/use-user", () => ({
  useUser: vi.fn(),
}));

// Mock supabase client
vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    auth: {
      signOut: mockSignOut,
    },
  }),
}));

// Mock sonner
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("UserNav Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders nothing when user is not authenticated", () => {
    vi.mocked(useUser).mockReturnValue({
      user: null,
      isLoading: false,
      isAuthenticated: false,
      isAdmin: false,
      isPlayer: false,
    });

    const { container } = render(<UserNav />);
    expect(container.firstChild).toBeNull();
  });

  it("renders user avatar and admin controls when logged in as admin", async () => {
    vi.mocked(useUser).mockReturnValue({
      user: {
        id: "admin-1",
        email: "atharwapatil1@gmail.com",
        fullName: "Atharwa Patil",
        role: "admin",
        avatarUrl: null,
      },
      isLoading: false,
      isAuthenticated: true,
      isAdmin: true,
      isPlayer: false,
    });

    render(<UserNav showName={true} />);

    // Check button exists
    const trigger = screen.getByRole("button", { name: /User navigation menu/i });
    expect(trigger).toBeDefined();
    expect(screen.getByText("Atharwa Patil")).toBeDefined();
    expect(screen.getByText("AP")).toBeDefined();

    // Trigger dropdown to open
    fireEvent.pointerDown(trigger, { button: 0, ctrlKey: false });

    // Dropdown content should now be visible
    await waitFor(() => {
      expect(screen.getByText("atharwapatil1@gmail.com")).toBeDefined();
      expect(screen.getByText("Administrator")).toBeDefined();
      expect(screen.getByText("Governance Hub")).toBeDefined();
      expect(screen.getByText("Matches & Live Operations")).toBeDefined();
      expect(screen.getByText("Tournaments & Cups")).toBeDefined();
      expect(screen.getByText("Public Match Center")).toBeDefined();
      expect(screen.getByText("Log out")).toBeDefined();
    });
  });

  it("renders user avatar and athlete controls when logged in as player", async () => {
    vi.mocked(useUser).mockReturnValue({
      user: {
        id: "player-1",
        email: "rahul.sharma@kkwagh.edu.in",
        fullName: "Rahul Sharma",
        role: "player",
        avatarUrl: null,
      },
      isLoading: false,
      isAuthenticated: true,
      isAdmin: false,
      isPlayer: true,
    });

    render(<UserNav showName={true} />);

    // Check button exists
    const trigger = screen.getByRole("button", { name: /User navigation menu/i });
    expect(trigger).toBeDefined();
    expect(screen.getByText("Rahul Sharma")).toBeDefined();
    expect(screen.getByText("RS")).toBeDefined();

    // Trigger dropdown to open
    fireEvent.pointerDown(trigger, { button: 0, ctrlKey: false });

    // Dropdown content should now be visible
    await waitFor(() => {
      expect(screen.getByText("rahul.sharma@kkwagh.edu.in")).toBeDefined();
      expect(screen.getByText("Student Athlete")).toBeDefined();
      expect(screen.getByText("Athlete Dashboard")).toBeDefined();
      expect(screen.getByText("Profile & Sports Pass")).toBeDefined();
      expect(screen.getByText("My Team Roster")).toBeDefined();
      expect(screen.getByText("Log out")).toBeDefined();
    });
  });

  it("calls signOut when Log out is clicked", async () => {
    vi.mocked(useUser).mockReturnValue({
      user: {
        id: "admin-1",
        email: "atharwapatil1@gmail.com",
        fullName: "Atharwa Patil",
        role: "admin",
        avatarUrl: null,
      },
      isLoading: false,
      isAuthenticated: true,
      isAdmin: true,
      isPlayer: false,
    });

    render(<UserNav />);

    const trigger = screen.getByRole("button", { name: /User navigation menu/i });
    fireEvent.pointerDown(trigger, { button: 0, ctrlKey: false });

    await waitFor(() => {
      expect(screen.getByText("Log out")).toBeDefined();
    });

    const logoutBtn = screen.getByText("Log out");
    fireEvent.click(logoutBtn);

    // Verify it handles sign out and redirect
    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith("/login");
    });
  });
});

