"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { useRouter, useParams } from "next/navigation";
import {
  MessageSquare,
  Trophy,
  BookOpen,
  FlaskConical,
  Vote,
  Copy,
  Users,
  Check,
} from "lucide-react";
import ChatWindow from "@/components/socials/ChatWindow";
import Leaderboard from "@/components/socials/Leaderboard";
import StudyRoom from "@/components/socials/StudyRoom";
import VotePanel from "@/components/socials/VotePanel";

const TABS = [
  { id: "chat", label: "Chat", icon: MessageSquare },
  { id: "leaderboard", label: "Leaderboard", icon: Trophy },
  { id: "study-room", label: "Study Room", icon: BookOpen },
  { id: "lab", label: "Lab", icon: FlaskConical },
  { id: "vote", label: "Vote", icon: Vote },
] as const;

type TabId = (typeof TABS)[number]["id"];

const MOCK_GROUP = {
  name: "Organic Chemistry Squad",
  memberCount: 12,
  inviteCode: "CHEM42",
};

const MOCK_LEADERBOARD = [
  { id: "u1", name: "Aria Chen", studyMinutes: 340, particlesEarned: 85 },
  { id: "current", name: "You", studyMinutes: 290, particlesEarned: 72 },
  { id: "u2", name: "Marcus Bell", studyMinutes: 265, particlesEarned: 66 },
  { id: "u3", name: "Priya Sharma", studyMinutes: 210, particlesEarned: 52 },
  { id: "u4", name: "James Wright", studyMinutes: 180, particlesEarned: 45 },
  { id: "u5", name: "Sofia Lopez", studyMinutes: 155, particlesEarned: 38 },
];

const MOCK_PARTICIPANTS = [
  { id: "u1", name: "Aria Chen", isActive: true, studyingMinutes: 42 },
  { id: "u2", name: "Marcus Bell", isActive: true, studyingMinutes: 18 },
  { id: "u3", name: "Priya Sharma", isActive: false, studyingMinutes: 0 },
  { id: "u4", name: "James Wright", isActive: true, studyingMinutes: 7 },
];

const MOCK_ELEMENTS = [
  { symbol: "H", name: "Hydrogen", atomicNumber: 1, protons: 1, neutrons: 0, electrons: 1 },
  { symbol: "He", name: "Helium", atomicNumber: 2, protons: 2, neutrons: 2, electrons: 2 },
  { symbol: "Li", name: "Lithium", atomicNumber: 3, protons: 3, neutrons: 4, electrons: 3 },
  { symbol: "C", name: "Carbon", atomicNumber: 6, protons: 6, neutrons: 6, electrons: 6 },
  { symbol: "N", name: "Nitrogen", atomicNumber: 7, protons: 7, neutrons: 7, electrons: 7 },
  { symbol: "O", name: "Oxygen", atomicNumber: 8, protons: 8, neutrons: 8, electrons: 8 },
];

export default function GroupHubPage() {
  const router = useRouter();
  const params = useParams();
  const groupId = params.groupId as string;

  const [activeTab, setActiveTab] = useState<TabId>("chat");
  const [isInRoom, setIsInRoom] = useState(false);
  const [copied, setCopied] = useState(false);

  function handleCopyCode() {
    navigator.clipboard.writeText(MOCK_GROUP.inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleTabClick(tabId: TabId) {
    if (tabId === "lab") {
      router.push(`/groups/${groupId}/lab`);
      return;
    }
    setActiveTab(tabId);
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-olive flex items-center justify-center text-white font-serif font-bold text-xl">
            {MOCK_GROUP.name.charAt(0)}
          </div>
          <div>
            <h1 className="font-serif font-bold text-xl text-charcoal">
              {MOCK_GROUP.name}
            </h1>
            <p className="flex items-center gap-3 text-sm text-muted">
              <span className="flex items-center gap-1">
                <Users size={14} /> {MOCK_GROUP.memberCount} members
              </span>
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1 hover:text-charcoal transition-colors"
              >
                {copied ? <Check size={13} /> : <Copy size={13} />}
                {copied ? "Copied!" : MOCK_GROUP.inviteCode}
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-parchment-dark rounded-xl p-1 mb-6 overflow-x-auto">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors",
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
      <div className="card">
        {activeTab === "chat" && (
          <ChatWindow groupId={groupId} currentUserId="current" />
        )}

        {activeTab === "leaderboard" && (
          <Leaderboard
            members={MOCK_LEADERBOARD}
            period="weekly"
            currentUserId="current"
          />
        )}

        {activeTab === "study-room" && (
          <StudyRoom
            participants={MOCK_PARTICIPANTS}
            onJoin={() => setIsInRoom(true)}
            onLeave={() => setIsInRoom(false)}
            isInRoom={isInRoom}
            compact
          />
        )}

        {activeTab === "vote" && (
          <VotePanel
            options={MOCK_ELEMENTS}
            currentVote={null}
            onVote={(symbol) => alert(`Voted for ${symbol}!`)}
          />
        )}
      </div>
    </div>
  );
}
