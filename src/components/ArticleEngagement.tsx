import { useState, useEffect } from "react";
import { Heart, ThumbsDown, Bookmark, BookmarkCheck } from "lucide-react";
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
  const [disliked, setDisliked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showSad, setShowSad] = useState(false);
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarks();
  const saved = isBookmarked(postId);

  useEffect(() => {
    if (localStorage.getItem(`inkwell_like_${postId}`)) setLiked(true);
    if (localStorage.getItem(`inkwell_dislike_${postId}`)) setDisliked(true);

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
    if (disliked) {
      setDisliked(false);
      localStorage.removeItem(`inkwell_dislike_${postId}`);
    }
    setLiked(true);
    localStorage.setItem(`inkwell_like_${postId}`, "1");
    setLikesCount((c) => c + 1);
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 1500);
    await supabase.rpc("increment_post_likes", { p_post_id: postId });
  };

  const handleDislike = () => {
    if (liked) {
      toast.info("You already liked this post!", { duration: 2000 });
      return;
    }
    if (disliked) return;
    setDisliked(true);
    localStorage.setItem(`inkwell_dislike_${postId}`, "1");
    setShowSad(true);
    setTimeout(() => setShowSad(false), 1500);
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

  return (
    <div className="space-y-5">
      {/* Categories */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <span
              key={cat}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              {cat}
            </span>
          ))}
        </div>
      )}

      {/* Divider */}
      <div className="h-px bg-border" />

      {/* Engagement buttons */}
      <div className="flex items-center justify-between">
        {/* Left: Like + Unlike */}
        <div className="flex items-center gap-3">
          {/* Like */}
          <div className="relative">
            <button
              onClick={handleLike}
              disabled={liked}
              className={`group relative flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all duration-300 ${
                liked
                  ? "border-red-300 bg-red-50 text-red-500 dark:border-red-500/30 dark:bg-red-500/10"
                  : "border-border bg-card text-muted-foreground hover:border-red-300 hover:bg-red-50 hover:text-red-500 dark:hover:border-red-500/30 dark:hover:bg-red-500/10"
              }`}
            >
              <motion.div animate={liked ? { scale: [1, 1.5, 1] } : {}} transition={{ duration: 0.4 }}>
                <Heart className={`h-4 w-4 transition-all ${liked ? "fill-red-500 text-red-500" : "group-hover:scale-110"}`} />
              </motion.div>
              <span>Likes</span>
              {likesCount > 0 && (
                <span className="ml-0.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-100 px-1.5 text-[11px] font-bold text-red-600 dark:bg-red-500/20 dark:text-red-400">
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

          {/* Unlike */}
          <div className="relative">
            <button
              onClick={handleDislike}
              className={`group flex items-center justify-center rounded-xl border p-2.5 transition-all duration-300 ${
                disliked
                  ? "border-blue-300 bg-blue-50 text-blue-500 dark:border-blue-500/30 dark:bg-blue-500/10"
                  : "border-border bg-card text-muted-foreground hover:border-blue-300 hover:bg-blue-50 hover:text-blue-500 dark:hover:border-blue-500/30 dark:hover:bg-blue-500/10"
              }`}
            >
              <motion.div animate={disliked ? { scale: [1, 1.3, 1] } : {}} transition={{ duration: 0.3 }}>
                <ThumbsDown className={`h-4 w-4 transition-all ${disliked ? "fill-blue-500" : "group-hover:scale-110"}`} />
              </motion.div>
            </button>

            <AnimatePresence>
              {showSad && (
                <>
                  {[...Array(4)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
                      animate={{
                        opacity: 0,
                        scale: 1,
                        x: (Math.random() - 0.5) * 50,
                        y: -Math.random() * 40 - 15,
                      }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.7, delay: i * 0.06 }}
                      className="pointer-events-none absolute left-1/2 top-0"
                    >
                      <span className="text-base">{["😢", "💔", "😞", "👎"][i]}</span>
                    </motion.div>
                  ))}
                </>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right: Save */}
        <button
          onClick={handleBookmark}
          className={`group flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all duration-300 ${
            saved
              ? "border-primary/30 bg-primary/5 text-primary"
              : "border-border bg-card text-muted-foreground hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
          }`}
        >
          <motion.div animate={saved ? { scale: [1, 1.3, 1] } : {}} transition={{ duration: 0.3 }}>
            {saved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4 group-hover:scale-110 transition-transform" />}
          </motion.div>
          <span>{saved ? "Saved" : "Save"}</span>
        </button>
      </div>
    </div>
  );
}
