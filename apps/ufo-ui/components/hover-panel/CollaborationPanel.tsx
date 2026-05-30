"use client"

import { useState } from "react"
import { Users, Share2, MessageCircle, Clock, Crown, Eye, Edit, Plus, Link } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Collaborator {
  id: string
  name: string
  email: string
  avatar: string
  role: "owner" | "editor" | "viewer"
  status: "online" | "offline"
  lastActive: Date
}

interface Activity {
  id: string
  user: string
  action: string
  timestamp: Date
  type: "edit" | "comment" | "share"
}

const COLLABORATORS: Collaborator[] = [
  {
    id: "1",
    name: "Sarah Chen",
    email: "sarah@company.com",
    avatar: "https://placehold.co/32x32",
    role: "owner",
    status: "online",
    lastActive: new Date(),
  },
  {
    id: "2",
    name: "Mike Johnson",
    email: "mike@company.com",
    avatar: "https://placehold.co/32x32",
    role: "editor",
    status: "online",
    lastActive: new Date(Date.now() - 300000),
  },
  {
    id: "3",
    name: "Emma Wilson",
    email: "emma@company.com",
    avatar: "https://placehold.co/32x32",
    role: "viewer",
    status: "offline",
    lastActive: new Date(Date.now() - 3600000),
  },
]

const RECENT_ACTIVITY: Activity[] = [
  {
    id: "1",
    user: "Mike Johnson",
    action: "edited the header section",
    timestamp: new Date(Date.now() - 120000),
    type: "edit",
  },
  {
    id: "2",
    user: "Emma Wilson",
    action: "left a comment on the CTA button",
    timestamp: new Date(Date.now() - 300000),
    type: "comment",
  },
  {
    id: "3",
    user: "Sarah Chen",
    action: "shared the project with the team",
    timestamp: new Date(Date.now() - 600000),
    type: "share",
  },
]

const ROLE_ICONS = {
  owner: <Crown size={12} className="text-yellow-400" strokeWidth={2} />,
  editor: <Edit size={12} className="text-blue-400" strokeWidth={2} />,
  viewer: <Eye size={12} className="text-gray-400" strokeWidth={2} />,
}

export function CollaborationPanel() {
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState("viewer")

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)

    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="w-[380px] h-auto flex flex-col bg-neutral-800/90 text-white shadow-lg backdrop-blur-md border border-white/5 rounded-2xl">
      <header className="border-b border-b-[#292f35] p-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-white flex items-center gap-2">
            <Users size={16} strokeWidth={2} />
            Collaboration
          </h3>
          <Button variant="ghost" size="icon" className="size-7 hover:bg-white/10">
            <Share2 size={14} strokeWidth={2} />
          </Button>
        </div>
      </header>

      <div className="p-3 space-y-4 overflow-y-auto max-h-96">
        {/* Invite Section */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Invite People</h4>
          <div className="flex gap-2">
            <Input
              placeholder="Enter email address"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="flex-1 h-8 bg-neutral-900 border-neutral-700 text-sm"
            />
            <Select value={inviteRole} onValueChange={setInviteRole}>
              <SelectTrigger className="w-24 h-8 bg-neutral-900 border-neutral-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-neutral-900 border-neutral-700">
                <SelectItem value="viewer">Viewer</SelectItem>
                <SelectItem value="editor">Editor</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button size="sm" className="w-full h-8">
            <Plus size={14} className="mr-1" strokeWidth={2} />
            Send Invite
          </Button>
        </div>

        {/* Collaborators List */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Team Members ({COLLABORATORS.length})</h4>
          <div className="space-y-2">
            {COLLABORATORS.map((collaborator) => (
              <div
                key={collaborator.id}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-700/30 transition-colors"
              >
                <div className="relative">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={collaborator.avatar || "/placeholder.svg"} alt={collaborator.name} />
                    <AvatarFallback className="bg-neutral-700 text-white text-xs">
                      {collaborator.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-neutral-800 ${
                      collaborator.status === "online" ? "bg-green-500" : "bg-gray-500"
                    }`}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium truncate">{collaborator.name}</p>
                    {ROLE_ICONS[collaborator.role]}
                  </div>
                  <p className="text-xs text-gray-400 truncate">{collaborator.email}</p>
                </div>

                <div className="text-right">
                  <Badge
                    className={`text-xs ${
                      collaborator.role === "owner"
                        ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                        : collaborator.role === "editor"
                          ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                          : "bg-gray-500/20 text-gray-400 border-gray-500/30"
                    }`}
                  >
                    {collaborator.role}
                  </Badge>
                  <p className="text-xs text-gray-500 mt-1">
                    {collaborator.status === "online" ? "Online" : formatTime(collaborator.lastActive)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <Clock size={14} strokeWidth={2} />
            Recent Activity
          </h4>
          <div className="space-y-2">
            {RECENT_ACTIVITY.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-2 p-2 rounded-lg hover:bg-neutral-700/30 transition-colors"
              >
                <div
                  className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === "edit"
                      ? "bg-blue-500"
                      : activity.type === "comment"
                        ? "bg-green-500"
                        : "bg-purple-500"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm">
                    <span className="font-medium">{activity.user}</span>{" "}
                    <span className="text-gray-300">{activity.action}</span>
                  </p>
                  <p className="text-xs text-gray-400">{formatTime(activity.timestamp)}</p>
                </div>
                {activity.type === "comment" && (
                  <MessageCircle size={14} className="text-green-400 mt-0.5" strokeWidth={2} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Share Link */}
        <div className="space-y-2 pt-2 border-t border-neutral-700">
          <h4 className="text-sm font-medium">Share Link</h4>
          <div className="flex gap-2">
            <Input
              value="https://app.example.com/project/abc123"
              readOnly
              className="flex-1 h-8 bg-neutral-900 border-neutral-700 text-sm"
            />
            <Button size="sm" variant="ghost" className="h-8 px-2">
              <Link size={14} strokeWidth={2} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
