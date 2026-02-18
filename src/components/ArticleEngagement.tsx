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
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="flex flex-wrap items-center justify-center gap-2 p-4 sm:gap-3 sm:p-5">
        {/* Like */}
        <div className="relative">
          <button
            onClick={handleLike}
            disabled={liked}
            className={`group relative flex items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-medium transition-all duration-300 sm:gap-2 sm:px-4 sm:py-2.5 sm:text-sm ${
              liked
                ? "border-red-300 bg-red-50 text-red-500 dark:border-red-500/30 dark:bg-red-500/10"
                : "border-border bg-background text-muted-foreground hover:border-red-300 hover:bg-red-50 hover:text-red-500 dark:hover:border-red-500/30 dark:hover:bg-red-500/10"
            }`}
          >
            <motion.div animate={liked ? { scale: [1, 1.5, 1] } : {}} transition={{ duration: 0.4 }}>
              <Heart className={`h-3.5 w-3.5 sm:h-4 sm:w-4 transition-all ${liked ? "fill-red-500 text-red-500" : "group-hover:scale-110"}`} />
            </motion.div>
            <span>Likes</span>
            {likesCount > 0 && (
              <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-100 px-1 text-[10px] font-bold text-red-600 sm:h-5 sm:min-w-[20px] sm:px-1.5 sm:text-[11px] dark:bg-red-500/20 dark:text-red-400">
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

        {/* Comment */}
        <button
          onClick={handleScrollToComments}
          className="group flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-2 text-xs font-medium text-muted-foreground transition-all duration-300 hover:border-primary/30 hover:bg-primary/5 hover:text-primary sm:gap-2 sm:px-4 sm:py-2.5 sm:text-sm"
        >
          <MessageCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform group-hover:scale-110" />
          <span>Comment</span>
        </button>

        {/* Save */}
        <button
          onClick={handleBookmark}
          className={`group flex items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-medium transition-all duration-300 sm:gap-2 sm:px-4 sm:py-2.5 sm:text-sm ${
            saved
              ? "border-primary/30 bg-primary/5 text-primary"
              : "border-border bg-background text-muted-foreground hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
          }`}
        >
          <motion.div animate={saved ? { scale: [1, 1.3, 1] } : {}} transition={{ duration: 0.3 }}>
            {saved ? <BookmarkCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> : <Bookmark className="h-3.5 w-3.5 sm:h-4 sm:w-4 group-hover:scale-110 transition-transform" />}
          </motion.div>
          <span>{saved ? "Saved" : "Save"}</span>
        </button>
      </div>
    </div>
  );
}
