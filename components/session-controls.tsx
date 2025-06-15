"use client"

import { useState } from "react"
import { RepeatIcon as Record, Square, Users, Share, Settings, Download, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface SessionControlsProps {
  isRecording: boolean
  onToggleRecording: () => void
}

export function SessionControls({ isRecording, onToggleRecording }: SessionControlsProps) {
  const [participantCount, setParticipantCount] = useState(3)

  return (
    <div className="flex items-center space-x-3">
      {/* Recording Status */}
      <div className="flex items-center space-x-2">
        <Button
          variant={isRecording ? "destructive" : "outline"}
          size="sm"
          onClick={onToggleRecording}
          className="space-x-2"
        >
          {isRecording ? (
            <>
              <Square className="w-4 h-4" />
              <span>Stop Recording</span>
            </>
          ) : (
            <>
              <Record className="w-4 h-4" />
              <span>Start Recording</span>
            </>
          )}
        </Button>

        {isRecording && (
          <Badge variant="destructive" className="animate-pulse">
            REC
          </Badge>
        )}
      </div>

      {/* Participants */}
      <div className="flex items-center space-x-2">
        <Users className="w-4 h-4 text-slate-400" />
        <span className="text-sm text-slate-600 dark:text-slate-300">{participantCount}</span>
      </div>

      {/* Security Indicator */}
      <Badge variant="outline" className="space-x-1">
        <Shield className="w-3 h-3" />
        <span>Encrypted</span>
      </Badge>

      {/* Session Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Session
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <Share className="w-4 h-4 mr-2" />
            Share Session Link
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Download className="w-4 h-4 mr-2" />
            Export Transcript
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Users className="w-4 h-4 mr-2" />
            Manage Participants
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="w-4 h-4 mr-2" />
            Session Settings
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
