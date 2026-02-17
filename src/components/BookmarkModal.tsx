import { Link } from "react-router-dom";
import { Bookmark, Trash2, Calendar } from "lucide-react";
import { useBookmarks } from "@/hooks/use-bookmarks";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface BookmarkModalProps {
  open: boolean;
  onClose: () => void;
}

export function BookmarkModal({ open, onClose }: BookmarkModalProps) {
  const { bookmarks, removeBookmark } = useBookmarks();

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-hidden flex flex-col gap-0 p-0">
        <DialogHeader className="px-5 pt-5 pb-3 border-b border-border">
          <DialogTitle className="flex items-center gap-2.5 font-display text-base font-bold">
            <div
              className="flex h-7 w-7 items-center justify-center rounded-lg"
              style={{ background: "var(--gradient-primary)" }}
            >
              <Bookmark className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            Bookmarks
            {bookmarks.length > 0 && (
              <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary/10 px-1.5 text-[11px] font-bold text-primary">
                {bookmarks.length}
              </span>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {bookmarks.length === 0 ? (
            <div className="py-12 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
                <Bookmark className="h-6 w-6 text-muted-foreground/40" />
              </div>
              <p className="text-sm font-medium text-foreground">No bookmarks yet</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Save articles to read later by clicking the bookmark icon
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {bookmarks.map((b) => (
                <div
                  key={b.id}
                  className="group flex gap-3 rounded-xl border border-border bg-card p-3 transition-all hover:border-primary/20"
                >
                  {b.thumbnailUrl && (
                    <Link
                      to={`/posts/${b.slug}.html`}
                      onClick={onClose}
                      className="shrink-0"
                    >
                      <img
                        src={b.thumbnailUrl}
                        alt=""
                        className="h-16 w-20 rounded-lg object-cover"
                      />
                    </Link>
                  )}
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/posts/${b.slug}.html`}
                      onClick={onClose}
                      className="block"
                    >
                      <h4 className="text-sm font-semibold text-foreground line-clamp-2 transition-colors group-hover:text-primary">
                        {b.title}
                      </h4>
                      {b.excerpt && (
                        <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
                          {b.excerpt}
                        </p>
                      )}
                    </Link>
                    <div className="mt-1.5 flex items-center justify-between">
                      <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {new Date(b.bookmarkedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      <button
                        onClick={() => removeBookmark(b.id)}
                        className="rounded-lg p-1 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                        title="Remove bookmark"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
