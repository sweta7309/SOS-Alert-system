import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Car, Zap, MapPin } from "lucide-react";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AlertModal from "@/components/AlertModal";

const AccidentSimulator = () => {
  const [alertActive, setAlertActive] = useState(false);
  const [vehicleConnected, setVehicleConnected] = useState(false);
  const { location, error } = useGeolocation(true);
  const { toast } = useToast();

  const connectVehicle = () => {
    setVehicleConnected(true);
    toast({
      title: "Vehicle Connected",
      description: "Simulated vehicle sensors are now active.",
    });
    
    // Update localStorage
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      user.vehicleConnected = true;
      localStorage.setItem("currentUser", JSON.stringify(user));
    }
  };

  const triggerAccident = () => {
    if (!location) {
      toast({
        title: "Location Required",
        description: "Please enable GPS location to trigger emergency alert.",
        variant: "destructive",
      });
      return;
    }

    setAlertActive(true);

    // Play alert sound (simulated)
    toast({
      title: "EMERGENCY ALERT ACTIVATED",
      description: "Notifying emergency services and contacts...",
      variant: "destructive",
    });

    // Simulate sending alerts
    console.log("🚨 EMERGENCY ALERT TRIGGERED");
    console.log("📍 Location:", location);
    console.log("📞 Calling nearest police station...");
    console.log("🚑 Calling ambulance services...");
    console.log("👨‍👩‍👧‍👦 Notifying emergency contacts...");
    console.log("📱 SMS sent with location link");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container max-w-4xl">
          <div className="mb-8 space-y-2">
            <h1 className="text-3xl font-bold">Accident Detection Simulator</h1>
            <p className="text-muted-foreground">
              Test the emergency alert system in demo mode. No real alerts will be sent.
            </p>
          </div>

          <div className="grid gap-6">
            {/* Vehicle Connection */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-secondary/10">
                    <Car className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">Vehicle Connection</h2>
                    <p className="text-sm text-muted-foreground">
                      {vehicleConnected ? "Sensors active and monitoring" : "Connect to enable detection"}
                    </p>
                  </div>
                </div>
                <Badge variant={vehicleConnected ? "default" : "secondary"}>
                  {vehicleConnected ? "Connected" : "Disconnected"}
                </Badge>
              </div>

              {!vehicleConnected ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground">
                      In a real deployment, this would connect to your vehicle's OBD-II port or 
                      integrate with the vehicle's built-in sensors (accelerometer, gyroscope, impact detection).
                    </p>
                  </div>
                  <Button onClick={connectVehicle} variant="secondary" size="lg" className="w-full">
                    Connect Simulated Vehicle
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg bg-success/10 border border-success/20">
                      <p className="text-xs text-muted-foreground mb-1">Accelerometer</p>
                      <p className="text-lg font-semibold text-success">Active</p>
                    </div>
                    <div className="p-4 rounded-lg bg-success/10 border border-success/20">
                      <p className="text-xs text-muted-foreground mb-1">Impact Sensor</p>
                      <p className="text-lg font-semibold text-success">Active</p>
                    </div>
                    <div className="p-4 rounded-lg bg-success/10 border border-success/20">
                      <p className="text-xs text-muted-foreground mb-1">GPS Module</p>
                      <p className="text-lg font-semibold text-success">
                        {location ? "Active" : "Waiting..."}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </Card>

            {/* Location Status */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">GPS Location</h2>
                  <p className="text-sm text-muted-foreground">
                    {location ? "Location acquired" : error ? "Permission required" : "Detecting..."}
                  </p>
                </div>
              </div>

              {location ? (
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground mb-1">Current Coordinates</p>
                  <p className="font-mono text-sm">{location.lat.toFixed(6)}, {location.lng.toFixed(6)}</p>
                </div>
              ) : error ? (
                <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              ) : (
                <div className="p-4 rounded-lg bg-muted/50 animate-pulse">
                  <p className="text-sm text-muted-foreground">Acquiring GPS signal...</p>
                </div>
              )}
            </Card>

            {/* Emergency Trigger */}
            <Card className="p-6 border-2 border-emergency/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-lg bg-emergency/10">
                  <AlertTriangle className="h-6 w-6 text-emergency" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Emergency Alert Trigger</h2>
                  <p className="text-sm text-muted-foreground">
                    Simulate an accident detection event
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
                  <p className="text-sm">
                    <strong>Demo Mode:</strong> This will display a simulated alert. 
                    No actual emergency calls or SMS will be sent. In production, this would:
                  </p>
                  <ul className="mt-2 space-y-1 text-sm list-disc list-inside text-muted-foreground">
                    <li>Call nearest police station based on GPS</li>
                    <li>Call ambulance services automatically</li>
                    <li>Send SMS to all emergency contacts with location</li>
                    <li>Trigger visual and audio alerts on the device</li>
                  </ul>
                </div>

                <Button
                  onClick={triggerAccident}
                  variant="emergency"
                  size="lg"
                  className="w-full"
                  disabled={!vehicleConnected || !location}
                >
                  <Zap className="h-5 w-5 mr-2" />
                  Trigger Emergency Alert
                </Button>

                {(!vehicleConnected || !location) && (
                  <p className="text-xs text-center text-muted-foreground">
                    {!vehicleConnected && "Connect vehicle first. "}
                    {!location && "Location permission required."}
                  </p>
                )}
              </div>
            </Card>

            {/* Sensor Data Simulation */}
            {vehicleConnected && (
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Simulated Sensor Data</h3>
                <div className="space-y-3 font-mono text-xs">
                  <div className="p-3 rounded bg-muted">
                    <span className="text-muted-foreground">accelerometer: </span>
                    <span>{`{ x: 0.02, y: -9.81, z: 0.05 }`}</span>
                  </div>
                  <div className="p-3 rounded bg-muted">
                    <span className="text-muted-foreground">gyroscope: </span>
                    <span>{`{ alpha: 12.5, beta: -3.2, gamma: 0.8 }`}</span>
                  </div>
                  <div className="p-3 rounded bg-muted">
                    <span className="text-muted-foreground">speed: </span>
                    <span>0 km/h</span>
                  </div>
                  <div className="p-3 rounded bg-muted">
                    <span className="text-muted-foreground">impact_force: </span>
                    <span>0 G</span>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </main>

      <Footer />
      <AlertModal
        open={alertActive}
        onOpenChange={setAlertActive}
        location={location || undefined}
      />
    </div>
  );
};

export default AccidentSimulator;
