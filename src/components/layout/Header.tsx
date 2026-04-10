import { useState } from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { BarChart3, CreditCard, Menu, X, Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

const navItems = [
  { to: "/", label: "Analytics", icon: BarChart3 },
  { to: "/payments", label: "Payments", icon: CreditCard },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <span className="text-xl font-bold text-primary">MONEI</span>
            {/* Desktop nav */}
            <nav className="hidden sm:flex sm:gap-1">
              {navItems.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )
                  }
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            {/* Dark mode toggle */}
            <button
              className="flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>

            {/* Mobile menu button */}
            <button
              className="flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent sm:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile nav dropdown */}
        {mobileMenuOpen && (
          <nav className="flex flex-col gap-1 border-t py-3 sm:hidden">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )
                }
              >
                <Icon className="h-4 w-4" />
                {label}
              </NavLink>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
