import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, Menu, X, LogOut, User } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/features", label: "Features" },
    { path: "/about", label: "About" },
    { path: "/contact", label: "Contact" },
  ];

  const authLinks = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/sos", label: "SOS" },
    { path: "/analytics", label: "Analytics" },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate("/");
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
          <div className="p-2 rounded-lg bg-gradient-emergency">
            <Shield className="h-6 w-6 text-emergency-foreground" />
          </div>
          <span className="hidden sm:inline">Accident Alert</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-5">
          {navLinks.map((link) => (
            <Link key={link.path} to={link.path} className={`text-sm font-medium transition-colors hover:text-primary ${isActive(link.path) ? "text-primary" : "text-muted-foreground"}`}>
              {link.label}
            </Link>
          ))}
          {isAuthenticated && authLinks.map((link) => (
            <Link key={link.path} to={link.path} className={`text-sm font-medium transition-colors hover:text-primary ${isActive(link.path) ? "text-primary" : "text-muted-foreground"}`}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="hidden md:flex items-center gap-3">
              <Link to="/profile">
                <Button variant="ghost" size="sm" className="gap-2">
                  <User className="h-4 w-4" />
                  <span className="max-w-[100px] truncate">{user?.name}</span>
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link to="/register">
                <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">Get Started</Button>
              </Link>
            </div>
          )}

          <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background animate-slide-up">
          <nav className="container py-4 flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path} onClick={() => setMobileMenuOpen(false)} className={`text-sm font-medium py-2 transition-colors hover:text-primary ${isActive(link.path) ? "text-primary" : "text-muted-foreground"}`}>
                {link.label}
              </Link>
            ))}
            {isAuthenticated && (
              <>
                {authLinks.map((link) => (
                  <Link key={link.path} to={link.path} onClick={() => setMobileMenuOpen(false)} className={`text-sm font-medium py-2 transition-colors hover:text-primary ${isActive(link.path) ? "text-primary" : "text-muted-foreground"}`}>
                    {link.label}
                  </Link>
                ))}
                <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium py-2 text-muted-foreground hover:text-primary">
                  Profile
                </Link>
                <Button variant="outline" size="sm" onClick={handleLogout} className="w-full mt-2">
                  <LogOut className="h-4 w-4 mr-2" /> Sign Out
                </Button>
              </>
            )}
            {!isAuthenticated && (
              <div className="flex flex-col gap-2 mt-2">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full">Sign In</Button>
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button size="sm" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">Get Started</Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
