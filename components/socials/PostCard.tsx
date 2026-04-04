"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { MessageCircle, Send } from "lucide-react";

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
}

export interface Post {
  id: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
  comments: Comment[];
}

interface PostCardProps {
  post: Post;
  currentUserId: string;
  onAddComment: (postId: string, content: string) => void;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function PostCard({
  post,
  currentUserId,
  onAddComment,
}: PostCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");

  function handleSubmitComment() {
    const text = commentText.trim();
    if (!text) return;
    onAddComment(post.id, text);
    setCommentText("");
  }

  return (
    <div className="rounded-xl border border-border bg-white">
      {/* Post header */}
      <div className="flex items-start gap-3 p-4 pb-2">
        <div className="w-9 h-9 rounded-full bg-olive flex items-center justify-center text-white text-sm font-bold shrink-0">
          {post.userName.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-semibold text-charcoal">
              {post.userId === currentUserId ? "You" : post.userName}
            </span>
            <span className="text-[11px] text-muted">{timeAgo(post.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* Post content */}
      <div className="px-4 pb-3">
        <p className="text-sm text-charcoal leading-relaxed whitespace-pre-wrap">
          {post.content}
        </p>
      </div>

      {/* Actions bar */}
      <div className="border-t border-border px-4 py-2 flex items-center gap-4">
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-1.5 text-xs text-muted hover:text-charcoal transition-colors"
        >
          <MessageCircle size={14} />
          {post.comments.length > 0
            ? `${post.comments.length} comment${post.comments.length !== 1 ? "s" : ""}`
            : "Add a comment"}
        </button>
      </div>

      {/* Comments section */}
      {showComments && (
        <div className="border-t border-border bg-parchment/50">
          {post.comments.map((comment) => (
            <div key={comment.id} className="flex items-start gap-2.5 px-4 py-2.5">
              <div className="w-7 h-7 rounded-full bg-parchment-dark flex items-center justify-center text-[10px] font-bold text-charcoal shrink-0">
                {comment.userName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="text-xs font-semibold text-charcoal">
                    {comment.userId === currentUserId ? "You" : comment.userName}
                  </span>
                  <span className="text-[10px] text-muted">
                    {timeAgo(comment.createdAt)}
                  </span>
                </div>
                <p className="text-xs text-charcoal/80 leading-relaxed mt-0.5">
                  {comment.content}
                </p>
              </div>
            </div>
          ))}

          {/* Add comment input */}
          <div className="flex items-center gap-2 px-4 py-2.5 border-t border-border/50">
            <div className="w-7 h-7 rounded-full bg-olive flex items-center justify-center text-[10px] font-bold text-white shrink-0">
              Y
            </div>
            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && !e.shiftKey && handleSubmitComment()
              }
              placeholder="Add a comment..."
              className="flex-1 text-xs bg-transparent outline-none placeholder:text-muted text-charcoal py-1"
            />
            <button
              onClick={handleSubmitComment}
              disabled={!commentText.trim()}
              className={cn(
                "p-1.5 rounded-md text-olive hover:bg-olive/10 transition-colors",
                !commentText.trim() && "opacity-30 cursor-not-allowed"
              )}
            >
              <Send size={12} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
