import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FileText, FolderOpen, Eye, Plus, CheckCircle, Clock, MessageSquare, Package } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AdminSidebar } from "@/components/AdminSidebar";

interface RecentComment {
  id: string;
  author_name: string;
  content: string;
  created_at: string;
  post_id: string;
  post_title?: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalPosts: 0, published: 0, drafts: 0, totalViews: 0, totalComments: 0, totalApps: 0 });
  const [recentPosts, setRecentPosts] = useState<any[]>([]);
  const [recentComments, setRecentComments] = useState<RecentComment[]>([]);

  useEffect(() => {
    const fetchAll = async () => {
      const [postsRes, recentRes, commentsCountRes, recentCommentsRes, appsCountRes] = await Promise.all([
        supabase.from("posts").select("id, view_count, status"),
        supabase.from("posts").select("id, title, slug, status, created_at, view_count").order("created_at", { ascending: false }).limit(5),
        supabase.from("comments").select("id", { count: "exact", head: true }),
        supabase.from("comments").select("id, author_name, content, created_at, post_id").order("created_at", { ascending: false }).limit(5),
        supabase.from("apps").select("id", { count: "exact", head: true }),
      ]);

      const posts = postsRes.data || [];
      const totalViews = posts.reduce((sum, p) => sum + (p.view_count || 0), 0);
      setStats({
        totalPosts: posts.length,
        published: posts.filter((p) => p.status === "published").length,
        drafts: posts.filter((p) => p.status === "draft").length,
        totalViews,
        totalComments: commentsCountRes.count || 0,
      });
      setRecentPosts(recentRes.data || []);

      const comments = recentCommentsRes.data || [];
      if (comments.length > 0) {
        const postIds = [...new Set(comments.map((c) => c.post_id))];
        const { data: postTitles } = await supabase.from("posts").select("id, title").in("id", postIds);
        const titleMap = new Map(postTitles?.map((p) => [p.id, p.title]) || []);
        setRecentComments(comments.map((c) => ({ ...c, post_title: titleMap.get(c.post_id) || "Unknown" })));
      }
    };
    fetchAll();
  }, []);

  const statCards = [
    { label: "Total Posts", value: stats.totalPosts, icon: FileText, gradient: "from-primary to-accent" },
    { label: "Published", value: stats.published, icon: CheckCircle, gradient: "from-primary to-accent" },
    { label: "Drafts", value: stats.drafts, icon: Clock, gradient: "from-accent to-primary" },
    { label: "Total Views", value: stats.totalViews, icon: Eye, gradient: "from-primary to-primary" },
    { label: "Comments", value: stats.totalComments, icon: MessageSquare, gradient: "from-primary to-accent" },
  ];

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 overflow-auto bg-background">
        <div className="border-b border-border bg-card px-4 py-5 sm:px-8 sm:py-6 lg:pl-8 pl-16">
          <h1 className="font-display text-xl font-bold text-foreground sm:text-2xl">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Welcome back! Here's an overview of your blog.</p>
        </div>

        <div className="p-4 sm:p-8">
          <Link
            to="/inz/posts/new"
            className="mb-6 flex items-center gap-3 rounded-2xl border border-dashed border-primary/30 p-4 text-sm font-medium text-primary transition-all hover:bg-primary/5"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: "var(--gradient-primary)" }}>
              <Plus className="h-5 w-5 text-primary-foreground" />
            </div>
            <span>Create a new post</span>
          </Link>

          <div className="mb-8 grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
            {statCards.map((s) => (
              <div key={s.label} className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-[var(--shadow-card)]">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-[11px] sm:text-xs font-medium text-muted-foreground">{s.label}</span>
                  <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-xl" style={{ background: "var(--gradient-primary)" }}>
                    <s.icon className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-primary-foreground" />
                  </div>
                </div>
                <p className="font-display text-xl sm:text-2xl font-bold text-card-foreground">{s.value.toLocaleString()}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card shadow-[var(--shadow-card)]">
              <div className="flex items-center justify-between border-b border-border px-4 py-3 sm:px-6 sm:py-4">
                <h2 className="font-display text-sm sm:text-base font-semibold text-card-foreground">Recent Posts</h2>
                <Link to="/inz/posts" className="text-xs sm:text-sm font-medium text-primary hover:underline">View all</Link>
              </div>
              <div className="divide-y divide-border">
                {recentPosts.length === 0 ? (
                  <p className="px-4 sm:px-6 py-8 text-center text-muted-foreground text-sm">No posts yet.</p>
                ) : (
                  recentPosts.map((post) => (
                    <div key={post.id} className="flex items-start sm:items-center justify-between gap-3 px-4 py-3 sm:px-6">
                      <div className="min-w-0 flex-1">
                        <Link to={`/inz/posts/${post.id}`} className="block text-sm font-medium text-card-foreground hover:text-primary line-clamp-2 sm:line-clamp-1">
                          {post.title}
                        </Link>
                        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                          <p className="text-[11px] text-muted-foreground">{new Date(post.created_at).toLocaleDateString()}</p>
                          <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                            <Eye className="h-3 w-3" /> {post.view_count}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card shadow-[var(--shadow-card)]">
              <div className="flex items-center justify-between border-b border-border px-4 py-3 sm:px-6 sm:py-4">
                <h2 className="font-display text-sm sm:text-base font-semibold text-card-foreground">Recent Comments</h2>
                <Link to="/inz/comments" className="text-xs sm:text-sm font-medium text-primary hover:underline">View all</Link>
              </div>
              <div className="divide-y divide-border">
                {recentComments.length === 0 ? (
                  <p className="px-4 sm:px-6 py-8 text-center text-muted-foreground text-sm">No comments yet.</p>
                ) : (
                  recentComments.map((comment) => (
                    <div key={comment.id} className="px-4 py-3 sm:px-6">
                      <div className="flex items-start gap-3">
                        <div
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-primary-foreground"
                          style={{ background: `hsl(${(comment.author_name.charCodeAt(0) * 47) % 360}, 50%, 50%)` }}
                        >
                          {comment.author_name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                            <span className="text-sm font-semibold text-card-foreground">{comment.author_name}</span>
                            <span className="text-[11px] text-muted-foreground">
                              {new Date(comment.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{comment.content}</p>
                          <p className="mt-1 text-[11px] text-primary line-clamp-1">
                            on: {comment.post_title}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
