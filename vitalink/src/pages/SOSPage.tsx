import AlertModal from "@/components/AlertModal";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useGeolocation } from "@/hooks/useGeolocation";
import { sosApi, SosResult } from "@/lib/api";
import { AlertTriangle, Heart, MapPin, Mic, Shield, Zap } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const getSpeechRecognition = () => {
  if (typeof window !== "undefined") {
    const win = window as any;
    return win.SpeechRecognition || win.webkitSpeechRecognition;
  }
  return null;
};


const SOSPage = () => {
  const { user } = useAuth();
  const { location, error } = useGeolocation(true);
  const [alertActive, setAlertActive] = useState(false);
  const [sosResult, setSosResult] = useState<SosResult | null>(null);
  const [voiceInput, setVoiceInput] = useState("");
  const [processing, setProcessing] = useState(false);
  const [activeType, setActiveType] = useState<"health" | "danger" | null>(null);

  const [editingContactId, setEditingContactId] = useState<string | null>(null);
  const [editedPhone, setEditedPhone] = useState("");

  const handleSave = async (id: string) => {
    try {
      await sosApi.updateContact(id, { phone: editedPhone });

      toast.success("Contact updated");
      setEditingContactId(null);

    } catch (err: any) {
      toast.error("Update failed", { description: err.message });
    }
  };

  const triggerSOS = async (type: "health" | "danger") => {
    setProcessing(true);
    setActiveType(type);

    try {
      const result = await sosApi.trigger(type, location || undefined);
      setSosResult(result);
      setAlertActive(true);

      if (result.sent > 0) {
        toast.success(
          `Emergency Alert Sent! SMS delivered to ${result.sent} contact${result.sent > 1 ? "s" : ""}.`,
          { description: result.failed > 0 ? `${result.failed} contact(s) could not be reached.` : undefined }
        );
      } else if (!result.twilioConfigured) {
        toast.warning("Alert logged (Twilio not configured — add credentials to .env)", {
          description: "In production, SMS would be dispatched to your emergency contacts.",
        });
      } else {
        toast.error("Alert sent but no SMS delivered. Check that contact numbers are Twilio-verified.");
      }
    } catch (err: any) {
      toast.error("SOS Failed", { description: err.message || "Could not reach the server." });
    } finally {
      setProcessing(false);
      setActiveType(null);
    }
  };
  const startListening = () => {
  const SpeechRecognition = getSpeechRecognition();

  if (!SpeechRecognition) {
    toast.error("Microphone not supported in this browser");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = "en-US"; // you can change to "en-IN"
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.start();

  recognition.onstart = () => {
    toast("🎤 Listening...");
  };

  recognition.onresult = (event: any) => {
    const transcript = event.results[0][0].transcript;

    setVoiceInput(transcript); // show in input box
    toast.success(`Heard: ${transcript}`);

    // auto process command
    setTimeout(() => {
      handleVoiceCommand(transcript);
    }, 300);
  };

  recognition.onerror = (event: any) => {
    toast.error("Mic error: " + event.error);
  };
};
  

  const handleVoiceCommand = (inputText?: string) => {
  const input = (inputText || voiceInput).toLowerCase().trim();

  if (!input) {
    toast.error("Please enter or speak a command");
    return;
  }

  setProcessing(true);

  if (
    input.includes("medical") ||
    input.includes("ambulance") ||
    input.includes("health") ||
    input.includes("hurt") ||
    input.includes("injury")
  ) {
    triggerSOS("health");
  } else if (
    input.includes("danger") ||
    input.includes("police") ||
    input.includes("help") ||
    input.includes("attack") ||
    input.includes("threat")
  ) {
    triggerSOS("danger");
  } else {
    setProcessing(false);
    toast.error("Command not recognized");
  }

  setVoiceInput("");
};

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-8">
        <div className="container max-w-4xl space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">Emergency SOS</h1>
            <p className="text-muted-foreground">Tap a button or use voice command to trigger an alert instantly.</p>
          </div>

          {/* SOS Buttons */}
          <div className="grid sm:grid-cols-2 gap-6">
            <Card className="p-6 border-2 border-health/30 hover:border-health/60 transition-colors">
              <div className="text-center space-y-4">
                <div className="inline-flex p-4 rounded-full bg-health/10">
                  <Heart className="h-10 w-10 text-health" />
                </div>
                <h2 className="text-xl font-bold">Health Emergency</h2>
                <p className="text-sm text-muted-foreground">Medical emergency, injury, or health crisis</p>
                <Button
                  onClick={() => triggerSOS("health")}
                  disabled={processing}
                  className="w-full bg-health text-health-foreground hover:bg-health/90 text-lg py-6"
                  size="lg"
                >
                  <Heart className="mr-2 h-5 w-5" />
                  {processing && activeType === "health" ? "Sending..." : "Health SOS"}
                </Button>
                <Badge className="bg-health/10 text-health border-health/20">Calls Ambulance</Badge>
              </div>
            </Card>

            <Card className="p-6 border-2 border-danger/30 hover:border-danger/60 transition-colors">
              <div className="text-center space-y-4">
                <div className="inline-flex p-4 rounded-full bg-danger/10">
                  <Shield className="h-10 w-10 text-danger" />
                </div>
                <h2 className="text-xl font-bold">Danger Emergency</h2>
                <p className="text-sm text-muted-foreground">Threat, attack, accident, or unsafe situation</p>
                <Button
                  onClick={() => triggerSOS("danger")}
                  disabled={processing}
                  className="w-full bg-danger text-danger-foreground hover:bg-danger/90 text-lg py-6"
                  size="lg"
                >
                  <AlertTriangle className="mr-2 h-5 w-5" />
                  {processing && activeType === "danger" ? "Sending..." : "Danger SOS"}
                </Button>
                <Badge className="bg-danger/10 text-danger border-danger/20">Calls Police</Badge>
              </div>
            </Card>
          </div>

          {/* Voice Command */}
          <Card className="p-6 animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Mic className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">AI Voice Command</h2>
                <p className="text-sm text-muted-foreground">Type a command like "medical emergency" or "I'm in danger"</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Input
                value={voiceInput}
                onChange={(e) => setVoiceInput(e.target.value)}
                placeholder="Try: medical emergency or I am in danger"
                onKeyDown={(e) => e.key === "Enter" && handleVoiceCommand()}
              />
              <Button onClick={startListening} disabled={processing} className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Zap className="h-4 w-4 mr-1" /> Speak
              </Button>
            </div>
          </Card>

          {/* GPS Status */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-lg bg-success/10">
                <MapPin className="h-6 w-6 text-success" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">GPS Location</h2>
                <p className="text-sm text-muted-foreground">
                  {location ? "Location acquired — will be included in SOS" : error ? "Permission required" : "Detecting..."}
                </p>
              </div>
            </div>
            {location ? (
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground mb-1">Current Coordinates</p>
                <p className="font-mono text-sm">{location.lat.toFixed(6)}, {location.lng.toFixed(6)}</p>
                <a
                  href={`https://www.google.com/maps?q=${location.lat},${location.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline mt-1 inline-block"
                >
                  View on Google Maps →
                </a>
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

          {/* Emergency Contacts Quick View */}
        {/* Emergency Contacts */}
{user && user.emergencyContacts.length > 0 && (
  <Card className="p-6">
    <h3 className="font-semibold mb-3">Your Emergency Contacts</h3>

    <div className="grid sm:grid-cols-2 gap-3">
      {user.emergencyContacts.map((c) => (
  <div
    key={c._id}
    className="p-3 rounded-lg bg-muted/50 flex items-center justify-between"
  >
    <div className="flex-1">
      <p className="text-sm font-medium">{c.name}</p>

      {editingContactId === c._id ? (
        <Input
          value={editedPhone}
          onChange={(e) => setEditedPhone(e.target.value)}
          className="mt-1"
        />
      ) : (
        <p className="text-xs text-muted-foreground">{c.phone}</p>
      )}
    </div>

    <div className="flex items-center gap-2">
      <Badge
        variant="outline"
        className={
          c.relation === "Police"
            ? "border-danger text-danger"
            : c.relation === "Ambulance"
            ? "border-health text-health"
            : ""
        }
      >
        {c.relation}
      </Badge>

      {editingContactId === c._id ? (
        <>
          <Button size="sm" onClick={() => handleSave(c._id)}>
            Save
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setEditingContactId(null)}
          >
            Cancel
          </Button>
        </>
      ) : (
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setEditingContactId(c._id);
            setEditedPhone(c.phone);
          }}
        >
          Edit
        </Button>
      )}
    </div>
  </div>
))}
     
    </div>
  </Card>
)}  
        </div>
      </main>
      <Footer />
      <AlertModal
        open={alertActive}
        onOpenChange={setAlertActive}
        location={location || undefined}
        sosResult={sosResult}
      />
    </div>
  );
};

export default SOSPage;
