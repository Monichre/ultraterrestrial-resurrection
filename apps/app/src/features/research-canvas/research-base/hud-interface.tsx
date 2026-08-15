"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { AlertTriangle, FileText, Search, Terminal, Wifi, Activity, Clock, Database } from "lucide-react"

interface SensorData {
  emField: number
  radiation: number
  temperature: number
  pressure: number
  humidity: number
  timestamp: string
}

interface AnomalyAlert {
  id: string
  type: "low" | "medium" | "high"
  message: string
  timestamp: string
  location?: {
    lat: number
    lng: number
  }
}

export default function HUDInterface() {
  const [currentLocation, setCurrentLocation] = useState({ lat: 37.7749, lng: -122.4194 })
  const [sensorData, setSensorData] = useState<SensorData>({
    emField: 0.12,
    radiation: 0.05,
    temperature: 22.4,
    pressure: 1013.2,
    humidity: 65,
    timestamp: new Date().toISOString(),
  })
  const [alerts, setAlerts] = useState<AnomalyAlert[]>([
    {
      id: "alert-1",
      type: "medium",
      message: "Unusual EM field fluctuation detected",
      timestamp: new Date().toISOString(),
      location: { lat: 37.8, lng: -122.5 },
    },
  ])
  const [securityStatus, setSecurityStatus] = useState("SECURE")
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString())
  const [searchQuery, setSearchQuery] = useState("")

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Simulate sensor data updates
  useEffect(() => {
    const sensorInterval = setInterval(() => {
      setSensorData((prev) => ({
        ...prev,
        emField: +(prev.emField + (Math.random() * 0.02 - 0.01)).toFixed(2),
        radiation: +(prev.radiation + (Math.random() * 0.01 - 0.005)).toFixed(3),
        temperature: +(prev.temperature + (Math.random() * 0.2 - 0.1)).toFixed(1),
        pressure: +(prev.pressure + (Math.random() * 0.5 - 0.25)).toFixed(1),
        humidity: Math.min(100, Math.max(0, +(prev.humidity + (Math.random() * 2 - 1)).toFixed(0))),
        timestamp: new Date().toISOString(),
      }))
    }, 3000)
    return () => clearInterval(sensorInterval)
  }, [])

  return (
    <div className="w-full h-full bg-black text-neutral-300 p-4 font-mono relative overflow-hidden">
      {/* Scanline effect */}
      <div className="absolute inset-0 pointer-events-none bg-scanline opacity-5 z-10"></div>

      {/* Top Bar with Security Status and Time */}
      <div className="flex justify-between items-center mb-4 border-b border-neutral-800 pb-2 text-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-[#adf0dd]">Δx → 0</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#adf0dd]">∫ dx</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#adf0dd]">Σ n→∞</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-neutral-400">
          <span>AUTHORIZED PERSONNEL ONLY</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Panel - Globe and Location */}
        <div className="lg:col-span-2">
          <Card className="border border-neutral-800 bg-black/70 overflow-hidden">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <div className="flex items-center">
                <span className="h-2 w-2 rounded-full bg-[#adf0dd] mr-2"></span>
                <CardTitle className="text-sm text-neutral-400">Geospatial Monitoring</CardTitle>
              </div>
              <Badge className="badge-classified">
                {currentLocation.lat.toFixed(4)}, {currentLocation.lng.toFixed(4)}
              </Badge>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[400px] w-full relative border-t border-neutral-800 overflow-hidden">
                <div className="absolute inset-0 bg-black">
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      backgroundImage: `radial-gradient(circle at 6px 6px, rgba(255, 255, 255, 0.15) 1px, transparent 0)`,
                      backgroundSize: `12px 12px`,
                    }}
                  />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-neutral-500 font-mono text-xs">
                    <div className="mb-2 text-[#adf0dd]">Geospatial System Initializing</div>
                    <div>
                      Coordinates: {currentLocation.lat.toFixed(4)}, {currentLocation.lng.toFixed(4)}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - Sensor Data and Alerts */}
        <div className="space-y-4">
          {/* Sensor Readings */}
          <Card className="border border-neutral-800 bg-black/70">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <div className="flex items-center">
                <span className="h-2 w-2 rounded-full bg-[#adf0dd] mr-2"></span>
                <CardTitle className="text-sm text-neutral-400">Sensor Array</CardTitle>
              </div>
              <Badge className="badge-classified">σ = {(Math.random() * 0.5 + 0.5).toFixed(2)}</Badge>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center border-b border-neutral-800 pb-2">
                  <div className="flex items-center">
                    <Wifi className="h-3 w-3 mr-2 text-[#adf0dd]" />
                    <span>EM Field</span>
                  </div>
                  <div className="font-bold font-mono">
                    {sensorData.emField} μT
                    <span className={`ml-2 ${sensorData.emField > 0.15 ? "text-[#27F1FF]" : "text-[#adf0dd]"}`}>
                      {sensorData.emField > 0.15 ? "▲" : "▼"}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center border-b border-neutral-800 pb-2">
                  <div className="flex items-center">
                    <Activity className="h-3 w-3 mr-2 text-[#27F1FF]" />
                    <span>Radiation</span>
                  </div>
                  <div className="font-bold font-mono">
                    {sensorData.radiation} μSv/h
                    <span className={`ml-2 ${sensorData.radiation > 0.06 ? "text-[#27F1FF]" : "text-[#adf0dd]"}`}>
                      {sensorData.radiation > 0.06 ? "▲" : "▼"}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center border-b border-neutral-800 pb-2">
                  <div className="flex items-center">
                    <Terminal className="h-3 w-3 mr-2 text-red-400" />
                    <span>Temperature</span>
                  </div>
                  <div className="font-bold font-mono">{sensorData.temperature}°C</div>
                </div>

                <div className="flex justify-between items-center border-b border-neutral-800 pb-2">
                  <div className="flex items-center">
                    <Terminal className="h-3 w-3 mr-2 text-[#27F1FF]" />
                    <span>Pressure</span>
                  </div>
                  <div className="font-bold font-mono">{sensorData.pressure} hPa</div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Terminal className="h-3 w-3 mr-2 text-[#27F1FF]" />
                    <span>Humidity</span>
                  </div>
                  <div className="font-bold font-mono">{sensorData.humidity}%</div>
                </div>
              </div>
              <div className="text-[10px] text-neutral-500 mt-2 flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {new Date(sensorData.timestamp).toLocaleTimeString()}
              </div>
            </CardContent>
          </Card>

          {/* Anomaly Alerts */}
          <Card className="border border-neutral-800 bg-black/70">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <div className="flex items-center">
                <span className="h-2 w-2 rounded-full bg-red-500 mr-2"></span>
                <CardTitle className="text-sm text-neutral-400">Anomaly Detection</CardTitle>
              </div>
              <Badge className="badge-verifying">Verifying</Badge>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="space-y-2 max-h-[200px] overflow-y-auto text-xs">
                {alerts.length === 0 ? (
                  <div className="text-neutral-500">No active alerts</div>
                ) : (
                  alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-2 border-l-2 ${
                        alert.type === "high"
                          ? "border-red-500 bg-red-950/10"
                          : alert.type === "medium"
                            ? "border-[#27F1FF] bg-[#27F1FF]/5"
                            : "border-[#adf0dd] bg-[#adf0dd]/5"
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <AlertTriangle
                          className={`h-3 w-3 mt-0.5 ${
                            alert.type === "high"
                              ? "text-red-500"
                              : alert.type === "medium"
                                ? "text-[#27F1FF]"
                                : "text-[#adf0dd]"
                          }`}
                        />
                        <div>
                          <div className="font-bold">{alert.message}</div>
                          <div className="text-[10px] text-neutral-500 flex justify-between mt-1">
                            <span>{new Date(alert.timestamp).toLocaleTimeString()}</span>
                            {alert.location && (
                              <span>
                                {alert.location.lat.toFixed(2)}, {alert.location.lng.toFixed(2)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Panel - Evidence Database Explorer */}
      <Card className="mt-4 border border-neutral-800 bg-black/70">
        <CardHeader className="pb-2 flex flex-row items-center">
          <Database className="h-4 w-4 mr-2 text-neutral-400" />
          <CardTitle className="text-sm text-neutral-400">Evidence Database Explorer</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="p-4 border-t border-neutral-800">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-neutral-500" />
              <Input
                placeholder="Search evidence files..."
                className="pl-8 bg-black border-neutral-800 text-xs"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="border-t border-neutral-800">
            <div className="p-3 flex items-center justify-between text-xs">
              <div className="flex items-center">
                <FileText className="h-4 w-4 mr-2 text-neutral-400" />
                <span>Surveillance Data</span>
              </div>
              <Badge className="badge-classified">CLASSIFIED</Badge>
            </div>

            <div className="pl-9 pr-3 space-y-2 text-xs border-t border-neutral-800/50">
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center">
                  <FileText className="h-3 w-3 mr-2 text-neutral-500" />
                  <span className="text-neutral-300">orbital-scan-sector7.qdt</span>
                </div>
                <span className="text-neutral-500">1.2 GB</span>
              </div>

              <div className="flex items-center justify-between py-2 border-t border-neutral-800/50">
                <div className="flex items-center">
                  <FileText className="h-3 w-3 mr-2 text-neutral-500" />
                  <span className="text-neutral-300">temporal-anomaly-report.enc</span>
                </div>
                <span className="text-neutral-500">842 KB</span>
              </div>

              <div className="flex items-center justify-between py-2 border-t border-neutral-800/50">
                <div className="flex items-center">
                  <FileText className="h-3 w-3 mr-2 text-neutral-500" />
                  <span className="text-neutral-300">radiation-signature.mtx</span>
                </div>
                <span className="text-neutral-500">2.8 GB</span>
              </div>
            </div>
          </div>

          <div className="border-t border-neutral-800">
            <div className="p-3 flex items-center justify-between text-xs">
              <div className="flex items-center">
                <FileText className="h-4 w-4 mr-2 text-neutral-400" />
                <span>Field Reports</span>
              </div>
            </div>
          </div>

          <div className="border-t border-neutral-800">
            <div className="p-3 flex items-center justify-between text-xs">
              <div className="flex items-center">
                <FileText className="h-4 w-4 mr-2 text-neutral-400" />
                <span>Mathematical Models</span>
              </div>
              <Badge className="badge-classified">CLASSIFIED</Badge>
            </div>
          </div>
        </CardContent>

        <div className="flex justify-between items-center p-2 border-t border-neutral-800 text-[10px] text-neutral-500">
          <div className="flex items-center">
            <span className="h-2 w-2 rounded-full bg-[#adf0dd] mr-2"></span>
            <span>System Ready</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            <span>Indexing</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
