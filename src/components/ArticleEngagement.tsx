import { useState, useEffect } from "react";
import { Heart, Bookmark, BookmarkCheck, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { toast } from "sonner";

interface ArticleEngagementProps {
  postId: string;
  postTitle: string;
  postSlug: string;
  postThumbnailUrl?: string | null;
  postExcerpt?: string | null;
  categories: string[];
}

export function ArticleEngagement({ postId, postTitle, postSlug, postThumbnailUrl, postExcerpt, categories }: ArticleEngagementProps) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarks();
  const saved = isBookmarked(postId);

  useEffect(() => {
    if (localStorage.getItem(`inkwell_like_${postId}`)) setLiked(true);

    supabase
      .from("posts")
      .select("likes_count")
      .eq("id", postId)
      .single()
      .then(({ data }) => {
        if (data) setLikesCount(data.likes_count || 0);
      });
  }, [postId]);

  const handleLike = async () => {
    if (liked) return;
    setLiked(true);
    localStorage.setItem(`inkwell_like_${postId}`, "1");
    setLikesCount((c) => c + 1);
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 1500);
    await supabase.rpc("increment_post_likes", { p_post_id: postId });
  };

  const handleBookmark = () => {
    if (saved) {
      removeBookmark(postId);
      toast.info("Removed from bookmarks");
    } else {
      addBookmark({ id: postId, title: postTitle, slug: postSlug, thumbnailUrl: postThumbnailUrl, excerpt: postExcerpt });
      toast.success("Added to bookmarks", {
        action: { label: "View", onClick: () => window.dispatchEvent(new CustomEvent("open-bookmarks")) },
      });
    }
  };

  const handleScrollToComments = () => {
    const commentSection = document.querySelector('[data-comment-section]');
    if (commentSection) {
      commentSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="flex items-center gap-3">
      {/* Left: Like + Comment */}
      <div className="flex items-center gap-2">
        {/* Like button */}
        <div className="relative">
          <button
            onClick={handleLike}
            disabled={liked}
            className={`group relative flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300 ${
              liked
                ? "border-red-300 bg-red-50 text-red-500 dark:border-red-500/30 dark:bg-red-500/10"
                : "border-border bg-background text-muted-foreground hover:border-red-300 hover:bg-red-50 hover:text-red-500 dark:hover:border-red-500/30 dark:hover:bg-red-500/10"
            }`}
          >
            <motion.div animate={liked ? { scale: [1, 1.5, 1] } : {}} transition={{ duration: 0.4 }}>
              <Heart className={`h-4 w-4 shrink-0 transition-all ${liked ? "fill-red-500 text-red-500" : "group-hover:scale-110"}`} />
            </motion.div>
            <span className="whitespace-nowrap">Likes</span>
            {likesCount > 0 && (
              <span className="flex h-5 min-w-[20px] shrink-0 items-center justify-center rounded-full bg-red-100 px-1.5 text-[11px] font-bold text-red-600 dark:bg-red-500/20 dark:text-red-400">
                {likesCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {showCelebration && (
              <>
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
                    animate={{
                      opacity: 0,
                      scale: 1,
                      x: (Math.random() - 0.5) * 80,
                      y: -Math.random() * 60 - 20,
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, delay: i * 0.05 }}
                    className="pointer-events-none absolute left-1/2 top-0"
                  >
                    <span className="text-lg">
                      {["❤️", "🎉", "✨", "💖", "🌟", "💕", "⭐", "🔥"][i]}
                    </span>
                  </motion.div>
                ))}
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Comment button */}
        <button
          onClick={handleScrollToComments}
          className="group flex shrink-0 items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-muted-foreground transition-all duration-300 hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
        >
          <MessageCircle className="h-4 w-4 shrink-0 transition-transform group-hover:scale-110" />
          <span className="whitespace-nowrap">Comment</span>
        </button>
      </div>

      {/* Right: Save button */}
      <button
        onClick={handleBookmark}
        className={`group flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300 ${
          saved
            ? "border-primary/30 bg-primary/5 text-primary"
            : "border-border bg-background text-muted-foreground hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
        }`}
      >
        <motion.div animate={saved ? { scale: [1, 1.3, 1] } : {}} transition={{ duration: 0.3 }}>
          {saved
            ? <BookmarkCheck className="h-4 w-4 shrink-0" />
            : <Bookmark className="h-4 w-4 shrink-0 transition-transform group-hover:scale-110" />
          }
        </motion.div>
        <span className="whitespace-nowrap">{saved ? "Saved" : "Save"}</span>
      </button>
    </div>
  );
}
