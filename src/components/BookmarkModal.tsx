import { Link } from "react-router-dom";
import { Bookmark, Trash2, Calendar, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useBookmarks } from "@/hooks/use-bookmarks";

interface BookmarkModalProps {
  open: boolean;
  onClose: () => void;
}

export function BookmarkModal({ open, onClose }: BookmarkModalProps) {
  const { bookmarks, removeBookmark } = useBookmarks();

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed inset-x-4 top-20 z-[61] mx-auto max-w-md overflow-hidden rounded-2xl border border-border bg-card shadow-2xl sm:inset-x-auto sm:right-6 sm:left-auto sm:w-[400px]"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div className="flex items-center gap-2.5">
                <div
                  className="flex h-7 w-7 items-center justify-center rounded-lg"
                  style={{ background: "var(--gradient-primary)" }}
                >
                  <Bookmark className="h-3.5 w-3.5 text-primary-foreground" />
                </div>
                <h3 className="font-display text-base font-bold text-foreground">Bookmarks</h3>
                {bookmarks.length > 0 && (
                  <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary/10 px-1.5 text-[11px] font-bold text-primary">
                    {bookmarks.length}
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Body */}
            <div className="max-h-[60vh] overflow-y-auto px-5 py-4">
              {bookmarks.length === 0 ? (
                <div className="py-10 text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
                    <Bookmark className="h-5 w-5 text-muted-foreground/40" />
                  </div>
                  <p className="text-sm font-medium text-foreground">No bookmarks yet</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Save articles by clicking the bookmark icon
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {bookmarks.map((b, i) => (
                    <motion.div
                      key={b.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="group flex gap-3 rounded-xl border border-border bg-background p-3 transition-all hover:border-primary/20"
                    >
                      {b.thumbnailUrl && (
                        <Link to={`/posts/${b.slug}.html`} onClick={onClose} className="shrink-0">
                          <img src={b.thumbnailUrl} alt="" className="h-14 w-18 rounded-lg object-cover" />
                        </Link>
                      )}
                      <div className="flex-1 min-w-0">
                        <Link to={`/posts/${b.slug}.html`} onClick={onClose} className="block">
                          <h4 className="text-sm font-semibold text-foreground line-clamp-2 transition-colors group-hover:text-primary">
                            {b.title}
                          </h4>
                        </Link>
                        <div className="mt-1.5 flex items-center justify-between">
                          <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {new Date(b.bookmarkedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </span>
                          <button
                            onClick={() => removeBookmark(b.id)}
                            className="rounded-lg p-1 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                            title="Remove"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
