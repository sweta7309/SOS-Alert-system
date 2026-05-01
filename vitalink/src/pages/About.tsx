import { Card } from "@/components/ui/card";
import { Shield, Target, Users, Heart } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const About = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="py-20 bg-gradient-hero relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-secondary/90 to-primary/90" />
          <div className="container relative text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold text-white">
              About Our Mission
            </h1>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              Saving lives through instant emergency response technology.
            </p>
          </div>
        </section>

        {/* Story */}
        <section className="py-20">
          <div className="container max-w-4xl">
            <div className="space-y-8">
              <div className="text-center space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold">Our Story</h2>
                <p className="text-lg text-muted-foreground">
                  Born from a vision to utilize every second for resque.
                </p>
              </div>

              <Card className="p-8 md:p-12">
                <div className="prose prose-lg max-w-none">
                  <p className="text-muted-foreground">
                    Every year, millions of people are involved in accidents worldwide. 
                    The critical minutes following an accident can mean the difference between life and death. 
                    Our SOS Alert System was created to eliminate those crucial delays.
                  </p>
                  <br></br>
                  
                  <p className="text-muted-foreground">
                    We recognized that in emergency situations, victims may be unable to call for help themselves. 
                    Family members might not know where their loved ones are. By giving a voice command it can resolve the issues.
                  </p>
                  <br></br>
                  <p className="text-muted-foreground">
                    By combining cutting-edge for instant communication systems 
                    and GPS tracking, we've created a solution that automatically springs into action the 
                    moment an accident occurs. No manual intervention needed. No delays. Just immediate, 
                    coordinated emergency response.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 bg-muted/30">
          <div className="container">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold">Our Values</h2>
              <p className="text-lg text-muted-foreground">
                The principles that guide everything we do.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {[
                {
                  icon: Shield,
                  title: "Safety First",
                  description: "Every decision we make is guided by one question: Will this make people safer? We never compromise on safety or reliability.",
                },
                {
                  icon: Target,
                  title: "Innovation",
                  description: "We continuously improve our technology, integrating the latest advances in AI, sensors, and communications to save more lives.",
                },
                {
                  icon: Users,
                  title: "Accessibility",
                  description: "Emergency protection shouldn't be a luxury. We work to make our system affordable and accessible to everyone.",
                },
                {
                  icon: Heart,
                  title: "Empathy",
                  description: "We understand the fear and uncertainty of emergencies. Our system is designed with care, compassion, and respect for users.",
                },
              ].map((value, i) => (
                <Card key={i} className="p-8">
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-primary/10 w-fit">
                      <value.icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-2xl font-semibold">{value.title}</h3>
                    <p className="text-muted-foreground">{value.description}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Technology */}
        <section className="py-20">
          <div className="container max-w-4xl">
            <div className="text-center mb-12 space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold">The Technology</h2>
              <p className="text-lg text-muted-foreground">
                How our system detects accidents and saves lives.
              </p>
            </div>

            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-3">Accident Detection</h3>
                <p className="text-muted-foreground">
                  Our system uses multiple sensor inputs including accelerometers, gyroscopes, and impact sensors. 
                  Machine learning algorithms analyze these signals in real-time to detect genuine accidents while 
                  filtering out false positives like sudden braking or potholes.
                </p>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-3">Emergency Communication</h3>
                <p className="text-muted-foreground">
                  The moment an accident is confirmed, our system simultaneously sends alerts via multiple channels: 
                  voice calls to emergency services, SMS with location coordinates, and push notifications to designated 
                  contacts. Redundant communication paths ensure messages get through.
                </p>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-3">Location Intelligence</h3>
                <p className="text-muted-foreground">
                  High-accuracy GPS provides precise coordinates. Our system automatically identifies the nearest police 
                  stations and hospitals based on your location, ensuring the right emergency services are contacted 
                  immediately. Recipients receive Google Maps links for instant navigation.
                </p>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-3">Privacy & Security</h3>
                <p className="text-muted-foreground">
                  All data is encrypted end-to-end. Location information is only transmitted during emergencies. 
                  Contact details are stored securely and never shared with third parties. You maintain full control 
                  over your information at all times.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="py-12 bg-warning/10 border-y border-warning/20">
          <div className="container max-w-4xl text-center space-y-4">
            <h3 className="text-xl font-semibold">Important Notice</h3>
            <p className="text-muted-foreground">
              This is a demonstration system showcasing the technology and user experience. 
              Production deployment of emergency alert systems must comply with local telecommunications 
              regulations, use certified emergency service providers, and undergo rigorous safety testing. 
              Always ensure your vehicle's safety systems are properly maintained by qualified professionals.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
