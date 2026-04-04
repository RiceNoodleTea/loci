"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { useRouter, useParams } from "next/navigation";
import {
  MessageSquare,
  Trophy,
  FlaskConical,
  ArrowLeft,
  Users,
} from "lucide-react";
import PostFeed from "@/components/socials/PostFeed";
import VoteBar from "@/components/socials/VoteBar";
import StudyRoom, {
  CreateStudyRoomButton,
  type StudyRoomParticipant,
} from "@/components/socials/StudyRoom";
import Leaderboard, {
  type LeaderboardMember,
} from "@/components/socials/Leaderboard";
import LabInline from "@/components/socials/LabInline";

const TABS = [
  { id: "chat", label: "Chat", icon: MessageSquare },
  { id: "leaderboard", label: "Leaderboard", icon: Trophy },
  { id: "lab", label: "Lab", icon: FlaskConical },
] as const;

type TabId = (typeof TABS)[number]["id"];

const MOCK_GROUP = {
  name: "Organic Chemistry Squad",
  memberCount: 6,
  inviteCode: "CHEM42",
};

const MOCK_LEADERBOARD: LeaderboardMember[] = [
  {
    id: "u1",
    name: "Aria Chen",
    avatar: "flask",
    weeklyStudyMinutes: 340,
    isStudying: true,
    currentSessionStart: new Date(Date.now() - 42 * 60000).toISOString(),
  },
  {
    id: "current",
    name: "You",
    avatar: "rocket",
    weeklyStudyMinutes: 290,
    isStudying: true,
    currentSessionStart: new Date(Date.now() - 18 * 60000).toISOString(),
  },
  {
    id: "u2",
    name: "Marcus Bell",
    avatar: "atom",
    weeklyStudyMinutes: 265,
    isStudying: false,
  },
  {
    id: "u3",
    name: "Priya Sharma",
    avatar: "microscope",
    weeklyStudyMinutes: 210,
    isStudying: false,
  },
  {
    id: "u4",
    name: "James Wright",
    avatar: "dna",
    weeklyStudyMinutes: 180,
    isStudying: true,
    currentSessionStart: new Date(Date.now() - 7 * 60000).toISOString(),
  },
  {
    id: "u5",
    name: "Sofia Lopez",
    avatar: "telescope",
    weeklyStudyMinutes: 155,
    isStudying: false,
  },
];

const MOCK_ROOM_PARTICIPANTS: StudyRoomParticipant[] = [
  { id: "u1", name: "Aria Chen", isActive: true, personalMinutes: 42 },
  { id: "current", name: "You", isActive: true, personalMinutes: 18 },
  { id: "u4", name: "James Wright", isActive: true, personalMinutes: 7 },
];

export default function GroupHubPage() {
  const router = useRouter();
  const params = useParams();
  const groupId = params.groupId as string;

  const [activeTab, setActiveTab] = useState<TabId>("chat");
  const [currentVote, setCurrentVote] = useState<string | null>(null);
  const [isInRoom, setIsInRoom] = useState(false);
  const [activeRoom, setActiveRoom] = useState<{
    title: string;
    createdAt: string;
  } | null>({
    title: "Organic Chemistry Review",
    createdAt: new Date(Date.now() - 45 * 60000).toISOString(),
  });

  function handleCreateRoom(title: string) {
    setActiveRoom({ title, createdAt: new Date().toISOString() });
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-80px)]">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 shrink-0">
        <button
          onClick={() => router.push("/groups")}
          className="p-2 rounded-lg hover:bg-parchment transition-colors text-muted hover:text-charcoal"
        >
          <ArrowLeft size={18} />
        </button>

        <div className="w-10 h-10 rounded-full bg-olive flex items-center justify-center text-white font-serif font-bold text-lg">
          {MOCK_GROUP.name.charAt(0)}
        </div>

        <div className="flex-1 min-w-0">
          <button
            onClick={() => router.push(`/groups/${groupId}/info`)}
            className="font-serif font-bold text-lg text-charcoal hover:text-olive transition-colors text-left"
          >
            {MOCK_GROUP.name}
          </button>
          <p className="flex items-center gap-1 text-xs text-muted">
            <Users size={12} /> {MOCK_GROUP.memberCount} members
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-parchment-dark rounded-xl p-1 mb-4 shrink-0">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex-1 justify-center",
                isActive
                  ? "bg-white text-charcoal shadow-card"
                  : "text-muted hover:text-charcoal"
              )}
            >
              <Icon size={15} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="flex-1 min-h-0 overflow-hidden">
        {activeTab === "chat" && (
          <div className="h-full overflow-y-auto space-y-3 pb-4">
            {/* Vote bar */}
            <VoteBar
              currentVote={currentVote}
              onVote={(sym) => setCurrentVote(sym)}
            />

            {/* Active study room (pinned) */}
            {activeRoom && (
              <StudyRoom
                title={activeRoom.title}
                participants={MOCK_ROOM_PARTICIPANTS}
                roomCreatedAt={activeRoom.createdAt}
                onJoin={() => setIsInRoom(true)}
                onLeave={() => setIsInRoom(false)}
                onClose={() => setActiveRoom(null)}
                isInRoom={isInRoom}
              />
            )}

            {/* Create study room button (shown if no active room) */}
            {!activeRoom && (
              <CreateStudyRoomButton onCreate={handleCreateRoom} />
            )}

            {/* Post feed */}
            <PostFeed groupId={groupId} currentUserId="current" />
          </div>
        )}

        {activeTab === "leaderboard" && (
          <div className="h-full overflow-y-auto pb-4">
            <Leaderboard
              members={MOCK_LEADERBOARD}
              currentUserId="current"
            />
          </div>
        )}

        {activeTab === "lab" && (
          <div className="h-full">
            <LabInline />
          </div>
        )}
      </div>
    </div>
  );
}
