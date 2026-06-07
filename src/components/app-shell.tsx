import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  LogOut,
  Map,
  Menu,
  Sparkles,
  Target,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navItems = [
  { to: "/start", label: "Start", icon: Target, exact: true },
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: false },
  { to: "/roadmap", label: "Roadmap", icon: Map, exact: false },
] as const;

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-1">
      {navItems.map(({ to, label, icon: Icon, exact }) => (
        <Link
          key={to}
          to={to}
          onClick={onNavigate}
          activeOptions={{ exact }}
          activeProps={{
            className:
              "bg-primary/15 text-primary border border-primary/20 border-l-2 border-l-primary",
          }}
          className="flex items-center gap-3 rounded-lg border border-transparent px-3 py-2.5 text-sm font-medium text-muted-foreground transition hover:bg-secondary hover:text-foreground"
        >
          <Icon className="h-4 w-4 shrink-0" />
          {label}
        </Link>
      ))}
    </nav>
  );
}

function UserMenu({ email }: { email: string | null }) {
  const navigate = useNavigate();
  const initials = email
    ? email.slice(0, 2).toUpperCase()
    : "?";

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition hover:bg-secondary">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary/20 text-xs font-semibold text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{email ?? "Account"}</p>
            <p className="text-xs text-muted-foreground">Signed in</p>
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="truncate font-normal">{email}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data.user?.email ?? null);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user?.email ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <aside className="glass-strong hidden w-60 shrink-0 flex-col border-r border-border md:flex">
        <div className="flex h-14 items-center gap-2 border-b border-border px-4">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-primary to-accent text-primary-foreground">
            <Sparkles className="h-4 w-4" />
          </div>
          <Link to="/start" className="font-display text-lg font-bold">
            CareerMirror<span className="text-primary"> AI</span>
          </Link>
        </div>
        <div className="flex flex-1 flex-col p-3">
          <NavLinks />
          <div className="mt-auto pt-4">
            <UserMenu email={userEmail} />
          </div>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile header */}
        <header className="glass flex h-14 items-center justify-between border-b border-border px-4 md:hidden">
          <Link to="/start" className="font-display text-lg font-bold">
            CareerMirror<span className="text-primary"> AI</span>
          </Link>
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="glass-strong w-72 p-0">
              <div className="flex h-full flex-col p-4">
                <NavLinks onNavigate={() => setMobileOpen(false)} />
                <div className="mt-auto pt-4">
                  <UserMenu email={userEmail} />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </header>

        <main className={cn("flex-1 overflow-auto p-4 md:p-6 lg:p-8")}>
          <div className="min-h-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
