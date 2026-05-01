import { CheckCircle, AlertTriangle, MapPin, Phone, Clock, XCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SosResult } from "@/lib/api";

interface AlertModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  location?: { lat: number; lng: number };
  sosResult?: SosResult | null;
}

const AlertModal = ({ open, onOpenChange, location, sosResult }: AlertModalProps) => {
  const formatLocation = () => {
    if (!location) return "Not available";
    return `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`;
  };

  const getMapLink = () => {
    if (!location) return "#";
    return `https://www.google.com/maps?q=${location.lat},${location.lng}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-full bg-emergency/10 relative">
              <AlertTriangle className="h-6 w-6 text-emergency animate-pulse-emergency" />
              <div className="absolute inset-0 rounded-full bg-emergency/20 animate-beacon" />
            </div>
            <DialogTitle className="text-2xl text-emergency">Emergency Alert Triggered</DialogTitle>
          </div>

          <DialogDescription className="text-base space-y-4 pt-4">
            {/* SMS Dispatch Summary */}
            <div className="p-4 rounded-lg bg-gradient-alert border border-emergency/20">
              <p className="font-semibold text-foreground mb-3">
                SMS Notifications
                {sosResult && (
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    ({sosResult.sent}/{sosResult.totalContacts} sent)
                  </span>
                )}
              </p>

              {sosResult?.details.sent.map((s, i) => (
                <div key={i} className="flex items-center gap-2 text-sm mb-1">
                  <CheckCircle className="h-4 w-4 text-success shrink-0" />
                  <span className="text-foreground">
                    {s.contact} <span className="text-muted-foreground">({s.to})</span>
                    {s.status === "demo" && (
                      <span className="ml-1 text-xs text-warning">[demo — Twilio not configured]</span>
                    )}
                  </span>
                </div>
              ))}

              {sosResult?.details.failed.map((f, i) => (
                <div key={i} className="flex items-center gap-2 text-sm mb-1">
                  <XCircle className="h-4 w-4 text-destructive shrink-0" />
                  <span className="text-muted-foreground">
                    {f.contact} — {f.error}
                  </span>
                </div>
              ))}

              {!sosResult && (
                <p className="text-sm text-muted-foreground">Dispatching notifications...</p>
              )}
            </div>

            {/* Location */}
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">Location Shared</p>
                <p className="text-xs font-mono">{formatLocation()}</p>
                {location && (
                  <a
                    href={getMapLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline inline-block"
                  >
                    View on Google Maps →
                  </a>
                )}
              </div>
            </div>

            {/* Time */}
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <Clock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">Alert Time</p>
                <p className="text-xs">{new Date().toLocaleString()}</p>
              </div>
            </div>

            {/* Status */}
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <Phone className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">Emergency Status</p>
                <p className="text-xs text-success">
                  {sosResult
                    ? sosResult.sent > 0
                      ? `Help alerted — ${sosResult.sent} contact(s) notified via SMS`
                      : "Alert logged — check Twilio credentials"
                    : "Processing..."}
                </p>
              </div>
            </div>

            {/* Twilio trial note */}
            {sosResult && !sosResult.twilioConfigured && (
              <div className="p-3 rounded-lg bg-warning/10 border border-warning/20">
                <p className="text-xs text-center">
                  <strong>Twilio not configured.</strong> Add credentials to{" "}
                  <code className="font-mono">backend/.env</code> to enable real SMS.
                </p>
              </div>
            )}

            {sosResult?.twilioConfigured && sosResult.failed > 0 && (
              <div className="p-3 rounded-lg bg-warning/10 border border-warning/20">
                <p className="text-xs text-center">
                  <strong>Note:</strong> Twilio trial accounts can only SMS{" "}
                  <strong>verified numbers</strong>. Verify contacts at twilio.com/console.
                </p>
              </div>
            )}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default AlertModal;
