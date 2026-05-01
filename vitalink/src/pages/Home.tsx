import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Shield, Phone, MapPin, Bell, Users, Zap, Heart, Mic } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-hero opacity-5" />
          <div className="container py-20 md:py-32 relative">
            <div className="max-w-3xl mx-auto text-center space-y-8 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emergency/10 text-emergency text-sm font-medium">
                <Shield className="h-4 w-4" />
                AI-Powered Emergency Response
              </div>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Instant Help When{" "}
                <span className="text-primary">Every Second</span>{" "}
                <span className="text-secondary">Counts</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Automatically alert police, ambulance, and your loved ones in case of emergency. 
                GPS location sharing, AI voice detection, and priority-based contact system.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register">
                  <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-lg">
                    Get Started Free
                  </Button>
                </Link>
                <Link to="/features">
                  <Button variant="outline" size="lg" className="px-8 py-6 text-lg">
                    Learn More
                  </Button>
                </Link>
              </div>
              <div className="flex items-center justify-center gap-8 pt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-success animate-pulse-emergency" />
                  <span className="text-sm text-muted-foreground">24/7 Active</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  <span className="text-sm text-muted-foreground">Secure & Private</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-secondary" />
                  <span className="text-sm text-muted-foreground">Instant Response</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: "<10s", label: "Response Time", color: "text-primary" },
                { value: "100%", label: "Uptime", color: "text-secondary" },
                { value: "24/7", label: "Monitoring", color: "text-primary" },
                { value: "4+", label: "Emergency Contacts", color: "text-secondary" },
              ].map((stat, i) => (
                <div key={i} className="text-center space-y-2">
                  <p className={`text-3xl md:text-4xl font-bold ${stat.color}`}>{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20">
          <div className="container">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
              <h2 className="text-3xl md:text-5xl font-bold">How It Works</h2>
              <p className="text-lg text-muted-foreground">Simple setup, powerful protection.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { icon: Users, title: "Register & Setup", description: "Create your account with 4 priority emergency contacts — police, ambulance, parents, and guardian.", color: "text-primary" },
                { icon: Shield, title: "Danger SOS", description: "One-tap danger alert sends notifications to police and all your emergency contacts instantly.", color: "text-danger" },
                { icon: Heart, title: "Health SOS", description: "Medical emergency button notifies ambulance services and family with your GPS location.", color: "text-health" },
                { icon: MapPin, title: "GPS Tracking", description: "Real-time location sharing with Google Maps integration for emergency services.", color: "text-success" },
                { icon: Mic, title: "Voice Commands", description: 'AI-powered voice detection — say "medical emergency" or "I\'m in danger" for instant alerts.', color: "text-warning" },
                { icon: Bell, title: "Instant Alerts", description: "Automatic SMS and calls to emergency contacts with your exact GPS coordinates.", color: "text-primary" },
              ].map((feature, i) => (
                <Card key={i} className="p-6 hover:shadow-elevated transition-all duration-300 hover:-translate-y-1">
                  <div className="space-y-4">
                    <div className="p-3 rounded-lg bg-muted/50 w-fit">
                      <feature.icon className={`h-6 w-6 ${feature.color}`} />
                    </div>
                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-90" />
          <div className="container relative text-center space-y-8">
            <h2 className="text-3xl md:text-5xl font-bold text-primary-foreground">Ready to Stay Protected?</h2>
            <p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto">
              Join thousands who trust Emergency Alert to keep them and their loved ones safe.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="bg-background text-foreground hover:bg-background/90 px-8">
                  Get Started Now
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" className="bg-background text-foreground hover:bg-background/90 px-8">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
