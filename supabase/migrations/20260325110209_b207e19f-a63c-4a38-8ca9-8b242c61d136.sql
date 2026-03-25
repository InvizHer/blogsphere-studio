
-- Create apps table for app store
CREATE TABLE public.apps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  icon_url text,
  description text,
  download_url text,
  preview_images text[] DEFAULT '{}',
  view_count bigint NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'draft',
  author_id uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.apps ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Anyone can read published apps" ON public.apps
  FOR SELECT TO public
  USING (status = 'published' OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert apps" ON public.apps
  FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update apps" ON public.apps
  FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete apps" ON public.apps
  FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'admin'));

-- View count increment function
CREATE OR REPLACE FUNCTION public.increment_app_views(p_app_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.apps SET view_count = view_count + 1 WHERE id = p_app_id;
END;
$$;

-- Updated_at trigger
CREATE TRIGGER update_apps_updated_at
  BEFORE UPDATE ON public.apps
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Validate status trigger
CREATE OR REPLACE FUNCTION public.validate_app_status()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.status NOT IN ('draft', 'published') THEN
    RAISE EXCEPTION 'Invalid app status: %', NEW.status;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER validate_app_status_trigger
  BEFORE INSERT OR UPDATE ON public.apps
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_app_status();
