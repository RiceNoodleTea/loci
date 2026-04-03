"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { generateInviteCode } from "@/lib/utils";
import { Plus, LogIn, X } from "lucide-react";
import GroupCard from "@/components/socials/GroupCard";
import { useRouter } from "next/navigation";

interface Group {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  isActive: boolean;
  inviteCode: string;
}

const MOCK_GROUPS: Group[] = [
  {
    id: "g1",
    name: "Organic Chemistry Squad",
    description:
      "Weekly study sessions focused on organic chemistry. We cover reaction mechanisms, synthesis, and spectroscopy.",
    memberCount: 12,
    isActive: true,
    inviteCode: "CHEM42",
  },
  {
    id: "g2",
    name: "AP Physics Crew",
    description:
      "Preparing for the AP Physics exam together. Practice problems, concept reviews, and group discussions.",
    memberCount: 8,
    isActive: true,
    inviteCode: "PHYS99",
  },
  {
    id: "g3",
    name: "Molecular Biology Lab",
    description:
      "Exploring molecular biology concepts with hands-on virtual labs and collaborative note-taking.",
    memberCount: 15,
    isActive: false,
    inviteCode: "BIO123",
  },
  {
    id: "g4",
    name: "Calculus Wizards",
    description:
      "From limits to integrals — we tackle calculus problems and share study strategies.",
    memberCount: 6,
    isActive: false,
    inviteCode: "CALC07",
  },
  {
    id: "g5",
    name: "History Buffs",
    description:
      "Deep dives into world history topics, essay reviews, and source analysis for AP History.",
    memberCount: 9,
    isActive: true,
    inviteCode: "HIST55",
  },
  {
    id: "g6",
    name: "Computer Science Study Hall",
    description:
      "Data structures, algorithms, and coding challenges. Building projects and reviewing each other's code.",
    memberCount: 20,
    isActive: false,
    inviteCode: "CS2025",
  },
];

export default function GroupsPage() {
  const router = useRouter();
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [createName, setCreateName] = useState("");
  const [createDesc, setCreateDesc] = useState("");
  const [joinCode, setJoinCode] = useState("");

  function handleCreate() {
    if (!createName.trim()) return;
    const code = generateInviteCode();
    alert(`Group "${createName}" created! Invite code: ${code}`);
    setShowCreate(false);
    setCreateName("");
    setCreateDesc("");
  }

  function handleJoin() {
    if (!joinCode.trim()) return;
    alert(`Joining group with code: ${joinCode.toUpperCase()}`);
    setShowJoin(false);
    setJoinCode("");
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif font-bold text-2xl text-charcoal">
          Study Groups
        </h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCreate(true)}
            className="btn-primary flex items-center gap-1.5"
          >
            <Plus size={16} /> Create Group
          </button>
          <button
            onClick={() => setShowJoin(true)}
            className="btn-secondary flex items-center gap-1.5"
          >
            <LogIn size={16} /> Join Group
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {MOCK_GROUPS.map((group) => (
          <GroupCard
            key={group.id}
            {...group}
            onClick={() => router.push(`/groups/${group.id}`)}
          />
        ))}
      </div>

      {/* Create Group Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-charcoal/30 backdrop-blur-sm"
            onClick={() => setShowCreate(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-card-hover w-full max-w-md p-6">
            <button
              onClick={() => setShowCreate(false)}
              className="absolute top-4 right-4 text-muted hover:text-charcoal"
            >
              <X size={18} />
            </button>

            <h2 className="font-serif font-bold text-lg text-charcoal mb-1">
              Create a Study Group
            </h2>
            <p className="text-sm text-muted mb-5">
              Minimum 3 members to start activities.
            </p>

            <div className="space-y-4">
              <div>
                <label className="label-caps mb-1.5 block">Group Name</label>
                <input
                  value={createName}
                  onChange={(e) => setCreateName(e.target.value)}
                  placeholder="e.g. Organic Chemistry Squad"
                  className="input-base"
                />
              </div>
              <div>
                <label className="label-caps mb-1.5 block">Description</label>
                <textarea
                  value={createDesc}
                  onChange={(e) => setCreateDesc(e.target.value)}
                  placeholder="What will your group study?"
                  rows={3}
                  className="input-base resize-none"
                />
              </div>
              <button
                onClick={handleCreate}
                disabled={!createName.trim()}
                className={cn(
                  "btn-primary w-full",
                  !createName.trim() && "opacity-40 cursor-not-allowed"
                )}
              >
                Create Group
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Join Group Modal */}
      {showJoin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-charcoal/30 backdrop-blur-sm"
            onClick={() => setShowJoin(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-card-hover w-full max-w-sm p-6">
            <button
              onClick={() => setShowJoin(false)}
              className="absolute top-4 right-4 text-muted hover:text-charcoal"
            >
              <X size={18} />
            </button>

            <h2 className="font-serif font-bold text-lg text-charcoal mb-1">
              Join a Group
            </h2>
            <p className="text-sm text-muted mb-5">
              Enter the invite code shared by a group member.
            </p>

            <div className="space-y-4">
              <div>
                <label className="label-caps mb-1.5 block">Invite Code</label>
                <input
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  placeholder="e.g. CHEM42"
                  maxLength={8}
                  className="input-base font-mono tracking-widest text-center text-lg"
                />
              </div>
              <button
                onClick={handleJoin}
                disabled={!joinCode.trim()}
                className={cn(
                  "btn-primary w-full",
                  !joinCode.trim() && "opacity-40 cursor-not-allowed"
                )}
              >
                Join Group
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
