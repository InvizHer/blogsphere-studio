import { Link } from "react-router-dom";
import { Calendar, Bookmark, BookmarkCheck } from "lucide-react";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { toast } from "sonner";

interface PostCardProps {
  id?: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  thumbnailUrl?: string | null;
  publishedAt?: string | null;
  categories?: string[];
  compact?: boolean;
}

export function PostCard({ id, title, slug, excerpt, thumbnailUrl, publishedAt, categories, compact }: PostCardProps) {
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarks();
  const postId = id || slug;
  const saved = isBookmarked(postId);

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (saved) {
      removeBookmark(postId);
      toast.info("Removed from bookmarks");
    } else {
      addBookmark({ id: postId, title, slug, thumbnailUrl, excerpt });
      toast.success("Added successfully to bookmarks", {
        action: {
          label: "View Bookmarks",
          onClick: () => {
            window.dispatchEvent(new CustomEvent("open-bookmarks"));
          },
        },
      });
    }
  };

  const formattedDate = publishedAt
    ? new Date(publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : null;

  if (compact) {
    return (
      <Link
        to={`/posts/${slug}.html`}
        className="group flex gap-3 rounded-xl border border-border bg-card p-3 transition-all hover:border-primary/30 hover:-translate-y-0.5"
      >
        {thumbnailUrl ? (
          <img src={thumbnailUrl} alt={title} className="h-16 w-20 shrink-0 rounded-lg object-cover" loading="lazy" />
        ) : (
          <div className="flex h-16 w-20 shrink-0 items-center justify-center rounded-lg bg-muted">
            <i className="fa-solid fa-newspaper text-sm text-muted-foreground/30"></i>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h4 className="mb-1 line-clamp-2 text-sm font-semibold leading-tight text-foreground transition-colors group-hover:text-primary">
            {title}
          </h4>
          {formattedDate && (
            <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>{formattedDate}</span>
            </div>
          )}
        </div>
      </Link>
    );
  }

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:border-primary/20 hover:-translate-y-1">
      <Link to={`/posts/${slug}.html`} className="flex flex-col h-full">
        {/* Thumbnail */}
        <div className="relative aspect-[16/9] overflow-hidden bg-muted">
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <i className="fa-solid fa-image text-3xl text-muted-foreground/15"></i>
            </div>
          )}
          {/* Bookmark button */}
          <button
            onClick={handleBookmark}
            className={`absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-sm transition-all duration-200 ${
              saved
                ? "bg-primary text-primary-foreground"
                : "bg-background/80 text-foreground hover:bg-primary hover:text-primary-foreground"
            }`}
          >
            {saved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-5">
          {categories && categories.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-1.5">
              {categories.slice(0, 3).map((cat) => (
                <span key={cat} className="rounded-full border border-primary/15 bg-primary/5 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-primary">
                  {cat}
                </span>
              ))}
            </div>
          )}

          <h3 className="mb-2 font-display text-base font-bold leading-snug text-foreground transition-colors group-hover:text-primary sm:text-lg line-clamp-2">
            {title}
          </h3>

          {excerpt && (
            <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{excerpt}</p>
          )}

          {/* Footer */}
          <div className="mt-auto flex items-center justify-between pt-3 border-t border-border/50">
            {formattedDate ? (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>{formattedDate}</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>Recently</span>
              </div>
            )}
            <span className="text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
              Read more →
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
