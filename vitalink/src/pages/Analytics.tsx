import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { TrendingUp, MapPin, AlertTriangle, Activity } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const monthlyData = [
  { month: "Jan", accidents: 12, health: 8, danger: 4 },
  { month: "Feb", accidents: 19, health: 11, danger: 8 },
  { month: "Mar", accidents: 15, health: 9, danger: 6 },
  { month: "Apr", accidents: 22, health: 14, danger: 8 },
  { month: "May", accidents: 18, health: 10, danger: 8 },
  { month: "Jun", accidents: 25, health: 16, danger: 9 },
];

const zoneData = [
  { name: "Highway Zone A", value: 35, color: "hsl(0, 72%, 51%)" },
  { name: "City Center", value: 25, color: "hsl(38, 92%, 50%)" },
  { name: "Residential", value: 20, color: "hsl(142, 71%, 45%)" },
  { name: "Rural Roads", value: 20, color: "hsl(215, 16%, 47%)" },
];

const responseTimeData = [
  { month: "Jan", time: 8.2 },
  { month: "Feb", time: 7.5 },
  { month: "Mar", time: 6.8 },
  { month: "Apr", time: 6.2 },
  { month: "May", time: 5.5 },
  { month: "Jun", time: 4.8 },
];

const Analytics = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-8">
        <div className="container space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Emergency Analytics</h1>
            <p className="text-muted-foreground">Data insights for emergency response trends (demo data)</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: AlertTriangle, label: "Total Alerts", value: "111", color: "text-danger" },
              { icon: Activity, label: "Health Alerts", value: "68", color: "text-health" },
              { icon: MapPin, label: "High-Risk Zones", value: "4", color: "text-warning" },
              { icon: TrendingUp, label: "Avg Response", value: "4.8s", color: "text-success" },
            ].map((stat, i) => (
              <Card key={i} className="p-4 animate-scale-in">
                <stat.icon className={`h-5 w-5 ${stat.color} mb-2`} />
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </Card>
            ))}
          </div>

          {/* Charts */}
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Monthly Emergency Trends</h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="health" fill="hsl(142, 71%, 45%)" radius={[4, 4, 0, 0]} name="Health" />
                  <Bar dataKey="danger" fill="hsl(0, 72%, 51%)" radius={[4, 4, 0, 0]} name="Danger" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-4">High-Risk Zone Distribution</h3>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={zoneData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                    {zoneData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6 lg:col-span-2">
              <h3 className="font-semibold mb-4">Average Response Time (seconds)</h3>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={responseTimeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="time" stroke="hsl(142, 71%, 45%)" strokeWidth={3} dot={{ fill: "hsl(142, 71%, 45%)", r: 5 }} name="Response Time (s)" />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Analytics;
