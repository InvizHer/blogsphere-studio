import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2, Eye, ExternalLink, Package } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AdminSidebar } from "@/components/AdminSidebar";
import { toast } from "sonner";

export default function AdminApps() {
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchApps = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("apps")
      .select("*")
      .order("created_at", { ascending: false });
    setApps(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchApps(); }, []);

  const deleteApp = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    const { error } = await supabase.from("apps").delete().eq("id", id);
    if (error) toast.error("Failed to delete app");
    else {
      toast.success("App deleted");
      fetchApps();
    }
  };

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 overflow-auto bg-background">
        <div className="flex flex-col gap-3 border-b border-border bg-card px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-6 lg:pl-8 pl-16">
          <div>
            <h1 className="font-display text-xl font-bold text-foreground sm:text-2xl">App Store</h1>
            <p className="text-sm text-muted-foreground">Manage your apps</p>
          </div>
          <Link
            to="/inz/apps/new"
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
            style={{ background: "var(--gradient-primary)" }}
          >
            <Plus className="h-4 w-4" /> New App
          </Link>
        </div>

        <div className="p-4 sm:p-8">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : apps.length === 0 ? (
            <div className="py-20 text-center">
              <Package className="mx-auto mb-4 h-12 w-12 text-muted-foreground/30" />
              <p className="mb-4 text-muted-foreground">No apps yet.</p>
              <Link to="/inz/apps/new" className="text-primary hover:underline">Add your first app →</Link>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-card)] md:block">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">App</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Views</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Date</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {apps.map((app) => (
                      <tr key={app.id} className="hover:bg-muted/30">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {app.icon_url ? (
                              <img src={app.icon_url} alt={app.name} className="h-10 w-10 rounded-xl object-cover" />
                            ) : (
                              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                                <Package className="h-5 w-5 text-primary" />
                              </div>
                            )}
                            <div>
                              <p className="text-sm font-medium text-card-foreground">{app.name}</p>
                              <p className="text-xs text-muted-foreground">/{app.slug}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            app.status === "published"
                              ? "bg-green-500/10 text-green-600"
                              : "bg-yellow-500/10 text-yellow-600"
                          }`}>
                            {app.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Eye className="h-3.5 w-3.5" /> {app.view_count}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">
                          {new Date(app.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-1">
                            <Link to={`/app/${app.slug}`} target="_blank" className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground" title="View Live">
                              <ExternalLink className="h-4 w-4" />
                            </Link>
                            <Link to={`/inz/apps/${app.id}/edit`} className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground" title="Edit">
                              <Pencil className="h-4 w-4" />
                            </Link>
                            <button onClick={() => deleteApp(app.id, app.name)} className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive" title="Delete">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="space-y-3 md:hidden">
                {apps.map((app) => (
                  <div key={app.id} className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
                    <div className="mb-3 flex items-center gap-3">
                      {app.icon_url ? (
                        <img src={app.icon_url} alt={app.name} className="h-12 w-12 rounded-xl object-cover" />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                          <Package className="h-6 w-6 text-primary" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-card-foreground">{app.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${
                            app.status === "published" ? "bg-green-500/10 text-green-600" : "bg-yellow-500/10 text-yellow-600"
                          }`}>{app.status}</span>
                          <span className="flex items-center gap-1 text-xs text-muted-foreground"><Eye className="h-3 w-3" /> {app.view_count}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">{new Date(app.created_at).toLocaleDateString()}</p>
                      <div className="flex gap-1">
                        <Link to={`/app/${app.slug}`} target="_blank" className="rounded-lg p-2 text-muted-foreground hover:bg-muted"><ExternalLink className="h-4 w-4" /></Link>
                        <Link to={`/inz/apps/${app.id}/edit`} className="rounded-lg p-2 text-muted-foreground hover:bg-muted"><Pencil className="h-4 w-4" /></Link>
                        <button onClick={() => deleteApp(app.id, app.name)} className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
