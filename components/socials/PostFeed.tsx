"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Send } from "lucide-react";
import PostCard, { type Post } from "./PostCard";

interface PostFeedProps {
  groupId: string;
  currentUserId: string;
}

const MOCK_POSTS: Post[] = [
  {
    id: "p1",
    userId: "u1",
    userName: "Aria Chen",
    content:
      "Has anyone started the organic chemistry review? I finished chapter 4 last night and the alkene reactions are really tricky. Happy to share notes!",
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    comments: [
      {
        id: "c1",
        userId: "u2",
        userName: "Marcus Bell",
        content:
          "Yeah, the Markovnikov's rule section took me a while. Think of it as 'the rich get richer' - hydrogen goes to the carbon that already has more hydrogens.",
        createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
      },
      {
        id: "c2",
        userId: "u3",
        userName: "Priya Sharma",
        content: "That's a great mnemonic! I'll use that for the quiz.",
        createdAt: new Date(Date.now() - 3600000 * 2.5).toISOString(),
      },
    ],
  },
  {
    id: "p2",
    userId: "u3",
    userName: "Priya Sharma",
    content:
      "Let's do a group quiz tonight at 8pm! I've prepared 20 questions covering chapters 3-5.",
    createdAt: new Date(Date.now() - 1800000).toISOString(),
    comments: [
      {
        id: "c3",
        userId: "u2",
        userName: "Marcus Bell",
        content: "I'm in. 8pm works for me.",
        createdAt: new Date(Date.now() - 900000).toISOString(),
      },
    ],
  },
  {
    id: "p3",
    userId: "u4",
    userName: "James Wright",
    content:
      "Just uploaded my flashcard deck for thermodynamics to the study tools section. 45 cards covering all the key formulas.",
    createdAt: new Date(Date.now() - 600000).toISOString(),
    comments: [],
  },
];

export default function PostFeed({ groupId, currentUserId }: PostFeedProps) {
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [newPost, setNewPost] = useState("");

  function handleCreatePost() {
    const text = newPost.trim();
    if (!text) return;

    const post: Post = {
      id: crypto.randomUUID(),
      userId: currentUserId,
      userName: "You",
      content: text,
      createdAt: new Date().toISOString(),
      comments: [],
    };

    setPosts((prev) => [post, ...prev]);
    setNewPost("");
  }

  function handleAddComment(postId: string, content: string) {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              comments: [
                ...p.comments,
                {
                  id: crypto.randomUUID(),
                  userId: currentUserId,
                  userName: "You",
                  content,
                  createdAt: new Date().toISOString(),
                },
              ],
            }
          : p
      )
    );
  }

  return (
    <div className="space-y-4">
      {/* Compose box */}
      <div className="rounded-xl border border-border bg-white p-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-full bg-olive flex items-center justify-center text-white text-sm font-bold shrink-0 mt-0.5">
            Y
          </div>
          <div className="flex-1 min-w-0">
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="Share something with your group..."
              rows={2}
              className="w-full text-sm bg-transparent outline-none resize-none placeholder:text-muted text-charcoal leading-relaxed"
            />
            <div className="flex justify-end mt-2">
              <button
                onClick={handleCreatePost}
                disabled={!newPost.trim()}
                className={cn(
                  "flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium transition-all",
                  newPost.trim()
                    ? "bg-olive text-white hover:bg-olive-hover"
                    : "bg-parchment-dark text-muted cursor-not-allowed"
                )}
              >
                <Send size={14} />
                Post
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Posts */}
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          currentUserId={currentUserId}
          onAddComment={handleAddComment}
        />
      ))}
    </div>
  );
}
