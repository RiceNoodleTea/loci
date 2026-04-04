"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  Copy,
  Check,
  Crown,
  UserMinus,
  UserPlus,
  Users,
  BookOpen,
} from "lucide-react";
import AvatarSelector from "@/components/socials/AvatarSelector";
import { getAvatarIcon } from "@/lib/avatar-icons";

interface GroupMember {
  id: string;
  name: string;
  avatar: string;
  isAdmin: boolean;
}

const MOCK_GROUP = {
  id: "g1",
  name: "Organic Chemistry Squad",
  description:
    "A study group focused on mastering organic chemistry concepts through collaborative learning, weekly quizzes, and building molecules in the particle lab.",
  subject: "Organic Chemistry",
  memberCount: 6,
  inviteCode: "CHEM42",
  adminId: "u1",
  picture: null as string | null,
  members: [
    { id: "u1", name: "Aria Chen", avatar: "flask", isAdmin: true },
    { id: "current", name: "You", avatar: "rocket", isAdmin: false },
    { id: "u2", name: "Marcus Bell", avatar: "atom", isAdmin: false },
    { id: "u3", name: "Priya Sharma", avatar: "microscope", isAdmin: false },
    { id: "u4", name: "James Wright", avatar: "dna", isAdmin: false },
    { id: "u5", name: "Sofia Lopez", avatar: "telescope", isAdmin: false },
  ] as GroupMember[],
};

const CURRENT_USER_ID = "current";
const isAdmin = MOCK_GROUP.adminId === CURRENT_USER_ID;

export default function GroupInfoPage() {
  const router = useRouter();
  const params = useParams();
  const groupId = params.groupId as string;

  const [copied, setCopied] = useState(false);
  const [members, setMembers] = useState<GroupMember[]>(MOCK_GROUP.members);
  const [myAvatar, setMyAvatar] = useState<string>(
    MOCK_GROUP.members.find((m) => m.id === CURRENT_USER_ID)?.avatar ?? ""
  );
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  function handleCopyCode() {
    navigator.clipboard.writeText(MOCK_GROUP.inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleRemoveMember(memberId: string) {
    setMembers((prev) => prev.filter((m) => m.id !== memberId));
  }

  function handleAvatarChange(key: string) {
    setMyAvatar(key);
    setMembers((prev) =>
      prev.map((m) =>
        m.id === CURRENT_USER_ID ? { ...m, avatar: key } : m
      )
    );
  }

  return (
    <div className="max-w-2xl mx-auto pb-10">
      {/* Back button */}
      <button
        onClick={() => router.push(`/groups/${groupId}`)}
        className="flex items-center gap-1.5 text-sm text-muted hover:text-charcoal transition-colors mb-6"
      >
        <ArrowLeft size={16} />
        Back to group
      </button>

      {/* Group header card */}
      <div className="card mb-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-16 h-16 rounded-2xl bg-olive flex items-center justify-center text-white font-serif font-bold text-3xl shrink-0">
            {MOCK_GROUP.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="font-serif font-bold text-2xl text-charcoal mb-1">
              {MOCK_GROUP.name}
            </h1>
            <div className="flex items-center gap-3 text-sm text-muted">
              <span className="flex items-center gap-1">
                <Users size={14} />
                {members.length} members
              </span>
              <span className="flex items-center gap-1">
                <BookOpen size={14} />
                {MOCK_GROUP.subject}
              </span>
            </div>
          </div>
        </div>

        <p className="text-sm text-charcoal/70 leading-relaxed mb-4">
          {MOCK_GROUP.description}
        </p>

        {/* Invite code */}
        <div className="flex items-center gap-2 p-3 rounded-xl bg-parchment border border-border">
          <span className="text-xs text-muted">Invite code:</span>
          <span className="font-mono font-bold text-charcoal text-sm">
            {MOCK_GROUP.inviteCode}
          </span>
          <button
            onClick={handleCopyCode}
            className="ml-auto flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-olive hover:bg-olive/10 transition-colors"
          >
            {copied ? (
              <>
                <Check size={12} /> Copied
              </>
            ) : (
              <>
                <Copy size={12} /> Copy
              </>
            )}
          </button>
        </div>
      </div>

      {/* Your avatar */}
      <div className="card mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-serif font-bold text-base text-charcoal">
            Your Avatar
          </h2>
          <button
            onClick={() => setShowAvatarPicker(!showAvatarPicker)}
            className="text-xs text-olive hover:underline"
          >
            {showAvatarPicker ? "Done" : "Change"}
          </button>
        </div>

        {showAvatarPicker ? (
          <AvatarSelector
            selected={myAvatar}
            onSelect={handleAvatarChange}
          />
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-olive flex items-center justify-center text-white">
              {(() => {
                const Icon = getAvatarIcon(myAvatar);
                return Icon ? (
                  <Icon size={22} />
                ) : (
                  <span className="font-serif font-bold text-lg">Y</span>
                );
              })()}
            </div>
            <span className="text-sm text-muted">
              {myAvatar || "No avatar selected"}
            </span>
          </div>
        )}
      </div>

      {/* Members list */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif font-bold text-base text-charcoal">
            Members
          </h2>
          {isAdmin && (
            <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-olive border border-olive/20 hover:bg-olive/10 transition-colors">
              <UserPlus size={13} />
              Add Member
            </button>
          )}
        </div>

        <div className="space-y-2">
          {members.map((member) => {
            const Icon = getAvatarIcon(member.avatar);
            const isCurrentUser = member.id === CURRENT_USER_ID;

            return (
              <div
                key={member.id}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-xl transition-colors",
                  isCurrentUser ? "bg-olive/5" : "hover:bg-parchment"
                )}
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                    member.isAdmin
                      ? "bg-amber-500 text-white"
                      : "bg-olive text-white"
                  )}
                >
                  {Icon ? (
                    <Icon size={18} />
                  ) : (
                    <span className="font-serif font-bold">
                      {member.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-charcoal truncate">
                      {isCurrentUser ? "You" : member.name}
                    </p>
                    {member.isAdmin && (
                      <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-700 text-[10px] font-medium">
                        <Crown size={9} />
                        Admin
                      </span>
                    )}
                  </div>
                </div>

                {isAdmin && !member.isAdmin && !isCurrentUser && (
                  <button
                    onClick={() => handleRemoveMember(member.id)}
                    className="p-1.5 rounded-lg text-muted hover:text-red-500 hover:bg-red-50 transition-colors"
                    title="Remove member"
                  >
                    <UserMinus size={15} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
