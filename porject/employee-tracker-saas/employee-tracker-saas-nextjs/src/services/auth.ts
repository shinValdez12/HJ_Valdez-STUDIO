import { User, AuthSession } from "@/types";
import { mockDataStore } from "@/mock/store";

const DEMO_ACCOUNTS = {
  admin: {
    email: "admin@workforce.demo",
    password: "demo123",
  },
  manager: {
    email: "manager@workface.demo",
    password: "demo123",
  },
  employee: {
    email: "employee@workface.demo",
    password: "demo123",
  },
};

export class AuthService {
  private static instance: AuthService;
  private session: AuthSession | null = null;
  private sessionKey = "workforce_session";

  private constructor() {
    this.loadSession();
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async login(email: string, password: string): Promise<AuthSession | null> {
    // Simulate login delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const account = Object.values(DEMO_ACCOUNTS).find(
      (acc) => acc.email === email && acc.password === password
    );

    if (!account) {
      return null;
    }

    const user = mockDataStore.getEmployeeById(
      email.includes("admin@workforce")
        ? "admin-super"
        : email.includes("manager@workface")
          ? "admin-dept"
          : "emp-demo"
    );

    if (!user) {
      return null;
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const session: AuthSession = {
      user,
      token: `token-${Date.now()}`,
      expiresAt,
      lastActivityAt: new Date(),
    };

    this.session = session;
    this.saveSession(session);

    return session;
  }

  async register(
    email: string,
    password: string,
    name: string
  ): Promise<AuthSession | null> {
    // Simulate registration delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // In demo, we don't actually create new users
    // Just return null to show registration flow
    return null;
  }

  async logout(): Promise<void> {
    this.session = null;
    this.clearSession();
  }

  getSession(): AuthSession | null {
    if (this.session) {
      this.session.lastActivityAt = new Date();
    }
    return this.session;
  }

  setSession(session: AuthSession): void {
    this.session = session;
    this.saveSession(session);
  }

  private saveSession(session: AuthSession): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        this.sessionKey,
        JSON.stringify({
          user: session.user,
          token: session.token,
          expiresAt: session.expiresAt.toISOString(),
          lastActivityAt: session.lastActivityAt.toISOString(),
        })
      );
    }
  }

  private loadSession(): void {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(this.sessionKey);
      if (stored) {
        try {
          const data = JSON.parse(stored);
          const expiresAt = new Date(data.expiresAt);

          if (expiresAt > new Date()) {
            this.session = {
              user: data.user,
              token: data.token,
              expiresAt,
              lastActivityAt: new Date(data.lastActivityAt),
            };
          } else {
            this.clearSession();
          }
        } catch {
          this.clearSession();
        }
      }
    }
  }

  private clearSession(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(this.sessionKey);
    }
  }
}

export const authService = AuthService.getInstance();
