import clockimage from "@/assets/247-service.jpg";
import emergencyContactsImage from "@/assets/emergency-contacts.jpg";
import gpsTrackingImage from "@/assets/gps-tracking.jpg";
import smsCallingimage from "@/assets/Instant-call-msg.jpg";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Bell, Check, Clock, Lock, MapPin, Phone } from "lucide-react";

const Features = () => {
  const features = [
    {
      title: "Priority Emergency Contacts",
      description: "Configure up to 4 prioritized contacts: Police, Ambulance, Parents, and Other family members. Alerts sent in sequence automatically.",
      icon: Phone,
      image: emergencyContactsImage,
    },
    {
      title: "Real-Time GPS Location",
      description: "Share your exact coordinates with emergency services. Google Maps integration provides instant directions to your location.",
      icon: MapPin,
      image: gpsTrackingImage,
    },
    {
      title: "Instant SMS & Calling",
      description: "Automatic SMS and voice calls to all emergency contacts within seconds. Pre-formatted messages with location and status.",
      icon: Bell,
      image: smsCallingimage,
    },
    {
      title: "24/7 Monitoring",
      description: "Continuous system uptime with redundant servers. Your safety net never sleeps, always ready when you need it.",
      icon: Clock,
      image: clockimage,
    },
  ];

  const securityFeatures = [
    "End-to-end encrypted contact data",
    "GDPR compliant privacy protection",
    "Secure GPS location transmission",
    "Two-factor authentication",
    "Regular security audits",
    "No data sold to third parties",
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="py-20 bg-gradient-hero relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-secondary/90 to-primary/90" />
          <div className="container relative text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold text-white">
              Powerful Features for Your Safety
            </h1>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              Everything you need to stay protected on the road, all in one comprehensive system.
            </p>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20">
          <div className="container">
            <div className="space-y-16">
              {features.map((feature, i) => (
                <div
                  key={i}
                  className={`grid md:grid-cols-2 gap-12 items-center ${
                    i % 2 === 1 ? "md:flex-row-reverse" : ""
                  }`}
                >
                  <div className={`space-y-6 ${i % 2 === 1 ? "md:order-2" : ""}`}>
                    <div className="p-3 rounded-lg bg-primary/10 w-fit">
                      <feature.icon className="h-8 w-8 text-primary" />
                    </div>
                    <h2 className="text-3xl font-bold">{feature.title}</h2>
                    <p className="text-lg text-muted-foreground">{feature.description}</p>
                  </div>
                  <div className={i % 2 === 1 ? "md:order-1" : ""}>
                    {feature.image ? (
                      <img
                        src={feature.image}
                        alt={feature.title}
                        className="rounded-2xl shadow-elevated w-full"
                      />
                    ) : (
                      <Card className="p-12 bg-gradient-alert flex items-center justify-center min-h-[300px]">
                        <feature.icon className="h-32 w-32 text-primary/20" />
                      </Card>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Security Section */}
        <section className="py-20 bg-muted/30">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12 space-y-4">
                <div className="inline-block p-4 rounded-full bg-success/10">
                  <Lock className="h-8 w-8 text-success" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold">
                  Enterprise-Grade Security
                </h2>
                <p className="text-lg text-muted-foreground">
                  Your safety and privacy are our top priorities. We implement industry-leading security measures.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {securityFeatures.map((feature, i) => (
                  <Card key={i} className="p-4 flex items-start gap-3">
                    <div className="p-1 rounded-full bg-success/10 shrink-0">
                      <Check className="h-4 w-4 text-success" />
                    </div>
                    <span className="text-sm">{feature}</span>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Demo Note */}
        <section className="py-12 bg-warning/10 border-y border-warning/20">
          <div className="container text-center space-y-4">
            <h3 className="text-xl font-semibold">Demo Mode Information</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
             This demonstration uses simulated alerts and test notifications. In production deployment, 
             the SOS system connects with real-time location services and verified emergency contacts, 
             ensuring quick response during critical situations in compliance with local safety regulations.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Features;
