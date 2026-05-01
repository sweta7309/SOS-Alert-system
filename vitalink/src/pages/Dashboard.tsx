import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useGeolocation } from "@/hooks/useGeolocation";
import { MapPin, Phone, User, Car, AlertTriangle, CheckCircle, Heart, Shield } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { EmergencyContact } from "@/lib/types";

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const { location, error } = useGeolocation(false);

  if (!isAuthenticated || !user) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Card className="p-8 text-center space-y-4 max-w-md animate-fade-in">
            <AlertTriangle className="h-12 w-12 text-warning mx-auto" />
            <h2 className="text-2xl font-bold">No Account Found</h2>
            <p className="text-muted-foreground">Please login or register to access your dashboard.</p>
            <div className="flex gap-3 justify-center">
              <Link to="/login"><Button variant="outline">Sign In</Button></Link>
              <Link to="/register"><Button className="bg-primary text-primary-foreground hover:bg-primary/90">Register</Button></Link>
            </div>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-8">
        <div className="container">
          <div className="mb-8 space-y-2">
            <h1 className="text-3xl font-bold">Welcome back, {user.name}!</h1>
            <p className="text-muted-foreground">Your emergency alert system is active and monitoring.</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Status Cards */}
              <div className="grid sm:grid-cols-2 gap-4">

                <Card className="p-4 animate-scale-in">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Phone className="h-4 w-4" /> Emergency Contacts
                  </div>
                  <p className="text-2xl font-bold">{user.emergencyContacts.length}</p>
                  <Badge className="bg-success/10 text-success border-success/20 mt-2">Configured</Badge>
                </Card>

                <Card className="p-4 animate-scale-in">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <MapPin className="h-4 w-4" /> GPS Status
                  </div>
                  <p className="text-2xl font-bold">{location ? "Active" : error ? "Error" : "Loading..."}</p>
                  <Badge className={location ? "bg-success/10 text-success border-success/20 mt-2" : "bg-warning/10 text-warning border-warning/20 mt-2"}>
                    {location ? "Tracking" : "Pending"}
                  </Badge>
                </Card>

                <Card className="p-4 animate-scale-in">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <CheckCircle className="h-4 w-4" /> System Health
                  </div>
                  <p className="text-2xl font-bold text-success">Optimal</p>
                  <Badge className="bg-success/10 text-success border-success/20 mt-2">All Systems Go</Badge>
                </Card>
              </div>

              {/* Location */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Current Location</h2>
                {location ? (
                  <div className="space-y-4">
                    <div className="aspect-video rounded-lg bg-muted flex items-center justify-center">
                      <MapPin className="h-16 w-16 text-primary" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Coordinates</p>
                      <p className="font-mono text-sm">{location.lat.toFixed(6)}, {location.lng.toFixed(6)}</p>
                      <a href={`https://www.google.com/maps?q=${location.lat},${location.lng}`} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline inline-block">
                        View on Google Maps →
                      </a>
                    </div>
                  </div>
                ) : error ? (
                  <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                    <p className="text-sm text-destructive">{error}</p>
                  </div>
                ) : (
                  <div className="p-8 text-center animate-pulse">
                    <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Detecting location...</p>
                  </div>
                )}
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Profile */}
              <Card className="p-6 animate-fade-in">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Phone:</span>
                    <span className="font-medium">{user.phone}</span>
                  </div>
                  {user.address && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Address:</span>
                      <span className="font-medium text-right">{user.address}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Registered:</span>
                    <span className="font-medium">{new Date(user.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </Card>

              {/* Emergency Contacts */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Emergency Contacts</h3>
                <div className="space-y-3">
                  {user.emergencyContacts.map((contact: EmergencyContact) => (
                    <div key={contact.id} className="p-3 rounded-lg bg-muted/50 space-y-1">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className={contact.relation === "Police" ? "border-danger text-danger" : contact.relation === "Ambulance" ? "border-health text-health" : ""}>
                          {contact.relation}
                        </Badge>
                        <span className="text-xs text-muted-foreground">Priority {contact.priority}</span>
                      </div>
                      <p className="text-sm font-medium">{contact.name}</p>
                      <p className="text-xs text-muted-foreground font-mono">{contact.phone}</p>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Quick Actions */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <Link to="/sos">
                    <Button className="w-full bg-danger text-danger-foreground hover:bg-danger/90 gap-2">
                      <Shield className="h-4 w-4" /> Danger SOS
                    </Button>
                  </Link>
                  <Link to="/sos">
                    <Button className="w-full bg-health text-health-foreground hover:bg-health/90 gap-2 mt-2">
                      <Heart className="h-4 w-4" /> Health SOS
                    </Button>
                  </Link>
                  <Link to="/profile">
                    <Button variant="outline" className="w-full mt-2">Update Profile</Button>
                  </Link>
                  <Link to="/analytics">
                    <Button variant="outline" className="w-full mt-2">View Analytics</Button>
                  </Link>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
