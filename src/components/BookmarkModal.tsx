import { Link } from "react-router-dom";
import { X, Bookmark, Trash2, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { useIsMobile } from "@/hooks/use-mobile";

interface BookmarkModalProps {
  open: boolean;
  onClose: () => void;
}

export function BookmarkModal({ open, onClose }: BookmarkModalProps) {
  const { bookmarks, removeBookmark } = useBookmarks();
  const isMobile = useIsMobile();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/30 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className={`fixed z-[61] w-[340px] max-h-[70vh] overflow-hidden rounded-2xl border border-border bg-card shadow-xl sm:w-[360px] ${
              isMobile
                ? "left-1/2 top-16 -translate-x-1/2"
                : "right-4 top-16 sm:right-8"
            }`}
          >
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-lg" style={{ background: "var(--gradient-primary)" }}>
                  <Bookmark className="h-3 w-3 text-primary-foreground" />
                </div>
                <h3 className="font-display text-sm font-bold text-foreground">
                  Bookmarks
                </h3>
                <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary/10 px-1.5 text-[11px] font-bold text-primary">
                  {bookmarks.length}
                </span>
              </div>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="overflow-y-auto max-h-[calc(70vh-60px)] p-3">
              {bookmarks.length === 0 ? (
                <div className="py-10 text-center">
                  <Bookmark className="mx-auto mb-3 h-8 w-8 text-muted-foreground/30" />
                  <p className="text-sm font-medium text-foreground">No bookmarks yet</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Click the bookmark icon on any post to save it here.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {bookmarks.map((bm) => (
                    <div
                      key={bm.id}
                      className="group flex gap-3 rounded-xl border border-border bg-background p-3 transition-all hover:border-primary/20"
                    >
                      <Link
                        to={`/posts/${bm.slug}.html`}
                        onClick={onClose}
                        className="flex flex-1 gap-3 min-w-0"
                      >
                        {bm.thumbnailUrl ? (
                          <img
                            src={bm.thumbnailUrl}
                            alt={bm.title}
                            className="h-14 w-18 shrink-0 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="flex h-14 w-18 shrink-0 items-center justify-center rounded-lg bg-muted">
                            <i className="fa-solid fa-newspaper text-xs text-muted-foreground/30" />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <h4 className="line-clamp-2 text-sm font-semibold leading-tight text-foreground">
                            {bm.title}
                          </h4>
                          <div className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {new Date(bm.bookmarkedAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </div>
                        </div>
                      </Link>
                      <button
                        onClick={() => removeBookmark(bm.id)}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground opacity-0 transition-all group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
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