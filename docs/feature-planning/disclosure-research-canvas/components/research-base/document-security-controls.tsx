"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Shield, Lock, Eye, Users, Clock, AlertTriangle, FileText, Key } from "lucide-react"

export default function DocumentSecurityControls() {
  const [encryptionEnabled, setEncryptionEnabled] = useState(true)
  const [watermarkEnabled, setWatermarkEnabled] = useState(true)
  const [auditLoggingEnabled, setAuditLoggingEnabled] = useState(true)
  const [accessExpiration, setAccessExpiration] = useState(true)
  const [classification, setClassification] = useState("top-secret")
  const [accessLevel, setAccessLevel] = useState("level-3")

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Document Security Controls
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Classification Level */}
            <div className="space-y-2">
              <Label htmlFor="classification">Classification Level</Label>
              <Select value={classification} onValueChange={setClassification}>
                <SelectTrigger id="classification">
                  <SelectValue placeholder="Select classification" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="top-secret">Top Secret</SelectItem>
                  <SelectItem value="secret">Secret</SelectItem>
                  <SelectItem value="confidential">Confidential</SelectItem>
                  <SelectItem value="restricted">Restricted</SelectItem>
                  <SelectItem value="unclassified">Unclassified</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Access Level */}
            <div className="space-y-2">
              <Label htmlFor="access-level">Required Access Level</Label>
              <Select value={accessLevel} onValueChange={setAccessLevel}>
                <SelectTrigger id="access-level">
                  <SelectValue placeholder="Select access level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="level-5">Level 5 (Highest)</SelectItem>
                  <SelectItem value="level-4">Level 4</SelectItem>
                  <SelectItem value="level-3">Level 3</SelectItem>
                  <SelectItem value="level-2">Level 2</SelectItem>
                  <SelectItem value="level-1">Level 1 (Lowest)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Security Features */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Lock className="h-4 w-4" />
                  <Label htmlFor="encryption" className="cursor-pointer">
                    End-to-end Encryption
                  </Label>
                </div>
                <Switch id="encryption" checked={encryptionEnabled} onCheckedChange={setEncryptionEnabled} />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <Label htmlFor="watermark" className="cursor-pointer">
                    Dynamic Watermarking
                  </Label>
                </div>
                <Switch id="watermark" checked={watermarkEnabled} onCheckedChange={setWatermarkEnabled} />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Eye className="h-4 w-4" />
                  <Label htmlFor="audit" className="cursor-pointer">
                    Audit Logging
                  </Label>
                </div>
                <Switch id="audit" checked={auditLoggingEnabled} onCheckedChange={setAuditLoggingEnabled} />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <Label htmlFor="expiration" className="cursor-pointer">
                    Access Expiration
                  </Label>
                </div>
                <Switch id="expiration" checked={accessExpiration} onCheckedChange={setAccessExpiration} />
              </div>
            </div>

            {/* Access Expiration Settings */}
            {accessExpiration && (
              <div className="pt-2 pl-6 space-y-2">
                <Label htmlFor="expiration-date">Access Expires</Label>
                <Input id="expiration-date" type="datetime-local" defaultValue="2023-12-31T23:59" />
              </div>
            )}

            {/* Access Control */}
            <div className="pt-2 space-y-2">
              <Label className="flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Access Control
              </Label>
              <div className="bg-muted p-3 rounded-md space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Advanced Materials Division</span>
                  <Button size="sm" variant="outline" className="h-7 text-xs">
                    Manage
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Quantum Physics Research Group</span>
                  <Button size="sm" variant="outline" className="h-7 text-xs">
                    Manage
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Special Access Program BLUESHIFT</span>
                  <Button size="sm" variant="outline" className="h-7 text-xs">
                    Manage
                  </Button>
                </div>
                <Button size="sm" variant="ghost" className="w-full mt-1">
                  + Add Group or User
                </Button>
              </div>
            </div>

            {/* Encryption Key Management */}
            <div className="pt-2 space-y-2">
              <Label className="flex items-center">
                <Key className="h-4 w-4 mr-2" />
                Encryption Key Management
              </Label>
              <div className="bg-muted p-3 rounded-md">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">Current Key ID</div>
                    <div className="text-xs text-muted-foreground">KEY-2023-04-15-ALPHA</div>
                  </div>
                  <Button size="sm" variant="outline" className="h-7 text-xs">
                    Rotate Key
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <Button variant="outline">Cancel</Button>
            <Button>Save Security Settings</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-yellow-500/50">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
            <div>
              <h3 className="font-medium">Security Notice</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Changes to document security settings are logged and may require additional authorization. All actions
                are subject to review by the security administrator.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
