"use client";

import { useState } from "react";
import StudyRoom from "@/components/socials/StudyRoom";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

const MOCK_PARTICIPANTS = [
  { id: "u1", name: "Aria Chen", isActive: true, personalMinutes: 42 },
  { id: "u2", name: "Marcus Bell", isActive: true, personalMinutes: 18 },
  { id: "u3", name: "Priya Sharma", isActive: false, personalMinutes: 0 },
  { id: "u4", name: "James Wright", isActive: true, personalMinutes: 7 },
  { id: "u5", name: "Sofia Lopez", isActive: true, personalMinutes: 55 },
  { id: "u6", name: "Liam Nguyen", isActive: false, personalMinutes: 0 },
];

export default function StudyRoomPage() {
  const params = useParams();
  const groupId = params.groupId as string;
  const [isInRoom, setIsInRoom] = useState(false);

  return (
    <div className="max-w-4xl mx-auto">
      <Link
        href={`/groups/${groupId}`}
        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-charcoal transition-colors mb-6"
      >
        <ArrowLeft size={15} />
        Back to group
      </Link>

      <div className="card">
        <StudyRoom
          title="Study Session"
          participants={MOCK_PARTICIPANTS}
          roomCreatedAt={new Date(Date.now() - 30 * 60000).toISOString()}
          onJoin={() => setIsInRoom(true)}
          onLeave={() => setIsInRoom(false)}
          isInRoom={isInRoom}
        />
      </div>
    </div>
  );
}
