import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AdminSidebar } from "@/components/AdminSidebar";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import { Upload, X, Image as ImageIcon, Plus, Package } from "lucide-react";

function slugify(text: string) {
  return text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();
}

export default function AdminAppEditor() {
  const { id } = useParams();
  const isEditing = !!id && id !== "new";
  const navigate = useNavigate();
  const { user } = useAuth();
  const iconInputRef = useRef<HTMLInputElement>(null);
  const previewInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [iconUrl, setIconUrl] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [status, setStatus] = useState("draft");
  const [version, setVersion] = useState("1.0.0");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEditing);
  const [uploadingIcon, setUploadingIcon] = useState(false);
  const [uploadingPreview, setUploadingPreview] = useState(false);

  useEffect(() => {
    if (!isEditing) return;
    const fetchApp = async () => {
      const { data: app } = await supabase.from("apps").select("*").eq("id", id).single();
      if (app) {
        setName(app.name);
        setSlug(app.slug);
        setDescription(app.description || "");
        setIconUrl(app.icon_url || "");
        setDownloadUrl(app.download_url || "");
        setPreviewImages((app.preview_images as string[]) || []);
        setVersion((app as any).version || "1.0.0");
        setStatus(app.status);
      }
      setLoading(false);
    };
    fetchApp();
  }, [id, isEditing]);

  useEffect(() => {
    if (!isEditing) setSlug(slugify(name));
  }, [name, isEditing]);

  const uploadImage = async (file: File, type: "icon" | "preview") => {
    const setter = type === "icon" ? setUploadingIcon : setUploadingPreview;
    setter(true);
    const ext = file.name.split(".").pop();
    const path = `apps/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from("thumbnails").upload(path, file);
    if (error) {
      toast.error("Upload failed");
      setter(false);
      return null;
    }
    const { data: urlData } = supabase.storage.from("thumbnails").getPublicUrl(path);
    setter(false);
    return urlData.publicUrl;
  };

  const handleIconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadImage(file, "icon");
    if (url) setIconUrl(url);
  };

  const handlePreviewUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    for (const file of Array.from(files)) {
      const url = await uploadImage(file, "preview");
      if (url) setPreviewImages((prev) => [...prev, url]);
    }
  };

  const removePreviewImage = (index: number) => {
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async (saveStatus: string) => {
    if (!name.trim() || !slug.trim()) {
      toast.error("App name and slug are required");
      return;
    }
    setSaving(true);
    const payload = {
      name: name.trim(),
      slug: slug.trim(),
      description: description.trim(),
      icon_url: iconUrl || null,
      download_url: downloadUrl.trim() || null,
      preview_images: previewImages,
      version: version.trim() || "1.0.0",
      status: saveStatus,
      author_id: user?.id || null,
    } as any;

    let error;
    if (isEditing) {
      ({ error } = await supabase.from("apps").update(payload).eq("id", id));
    } else {
      ({ error } = await supabase.from("apps").insert(payload));
    }

    if (error) {
      toast.error(error.message);
    } else {
      toast.success(saveStatus === "published" ? "App published!" : "App saved as draft");
      navigate("/inz/apps");
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <AdminSidebar />
        <div className="flex flex-1 items-center justify-center bg-background">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 overflow-auto bg-background">
        <div className="border-b border-border bg-card px-4 py-5 sm:px-8 sm:py-6 lg:pl-8 pl-16">
          <h1 className="font-display text-xl font-bold text-foreground sm:text-2xl">
            {isEditing ? "Edit App" : "Add New App"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isEditing ? "Update app details" : "Add a new app to the store"}
          </p>
        </div>

        <div className="p-4 sm:p-8">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main content */}
            <div className="space-y-5 lg:col-span-2">
              {/* App Name */}
              <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
                <label className="mb-2 block text-sm font-semibold text-card-foreground">App Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. CapCut"
                  className="h-11 w-full rounded-xl border border-input bg-background px-4 text-sm outline-none focus:border-primary/30 focus:ring-2 focus:ring-ring/20"
                />
              </div>

              {/* Slug */}
              <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
                <label className="mb-2 block text-sm font-semibold text-card-foreground">Slug</label>
                <div className="flex items-center gap-2 rounded-xl border border-input bg-background px-4">
                  <span className="text-sm text-muted-foreground">/app/</span>
                  <input
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="h-11 flex-1 bg-transparent text-sm outline-none"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
                <label className="mb-2 block text-sm font-semibold text-card-foreground">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  placeholder="Describe the app features, usage, etc."
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary/30 focus:ring-2 focus:ring-ring/20 resize-none"
                />
              </div>

              {/* Download URL */}
              <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
                <label className="mb-2 block text-sm font-semibold text-card-foreground">Download Link</label>
                <input
                  value={downloadUrl}
                  onChange={(e) => setDownloadUrl(e.target.value)}
                  placeholder="https://play.google.com/store/apps/details?id=..."
                  className="h-11 w-full rounded-xl border border-input bg-background px-4 text-sm outline-none focus:border-primary/30 focus:ring-2 focus:ring-ring/20"
                />
              </div>

              {/* Preview Images */}
              <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
                <label className="mb-3 block text-sm font-semibold text-card-foreground">Preview Screenshots</label>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {previewImages.map((url, i) => (
                    <div key={i} className="group relative aspect-video overflow-hidden rounded-xl border border-border">
                      <img src={url} alt={`Preview ${i + 1}`} className="h-full w-full object-cover" />
                      <button
                        onClick={() => removePreviewImage(i)}
                        className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-destructive-foreground opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => previewInputRef.current?.click()}
                    disabled={uploadingPreview}
                    className="flex aspect-video flex-col items-center justify-center rounded-xl border-2 border-dashed border-border text-muted-foreground transition-colors hover:border-primary/30 hover:text-primary"
                  >
                    {uploadingPreview ? (
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    ) : (
                      <>
                        <Plus className="mb-1 h-5 w-5" />
                        <span className="text-xs">Add Image</span>
                      </>
                    )}
                  </button>
                </div>
                <input ref={previewInputRef} type="file" accept="image/*" multiple onChange={handlePreviewUpload} className="hidden" />
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-5">
              {/* Icon */}
              <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
                <label className="mb-3 block text-sm font-semibold text-card-foreground">App Icon</label>
                {iconUrl ? (
                  <div className="group relative mb-3 mx-auto w-24">
                    <img src={iconUrl} alt="Icon" className="h-24 w-24 rounded-2xl object-cover border border-border" />
                    <button
                      onClick={() => setIconUrl("")}
                      className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-destructive-foreground opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="mb-3 mx-auto flex h-24 w-24 items-center justify-center rounded-2xl border-2 border-dashed border-border">
                    <Package className="h-8 w-8 text-muted-foreground/30" />
                  </div>
                )}
                <button
                  onClick={() => iconInputRef.current?.click()}
                  disabled={uploadingIcon}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-border py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  {uploadingIcon ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                  {iconUrl ? "Change Icon" : "Upload Icon"}
                </button>
                <input ref={iconInputRef} type="file" accept="image/*" onChange={handleIconUpload} className="hidden" />
              </div>

              {/* Publish Actions */}
              <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
                <label className="mb-3 block text-sm font-semibold text-card-foreground">Publish</label>
                <div className="space-y-2">
                  <button
                    onClick={() => handleSave("published")}
                    disabled={saving}
                    className="flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
                    style={{ background: "var(--gradient-primary)" }}
                  >
                    {saving ? "Saving..." : isEditing ? "Update & Publish" : "Publish App"}
                  </button>
                  <button
                    onClick={() => handleSave("draft")}
                    disabled={saving}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-border py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
                  >
                    Save as Draft
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
