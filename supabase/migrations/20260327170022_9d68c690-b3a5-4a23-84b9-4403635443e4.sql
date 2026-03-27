
ALTER TABLE public.apps ADD COLUMN IF NOT EXISTS version text DEFAULT '1.0.0';
ALTER TABLE public.apps ADD COLUMN IF NOT EXISTS download_count bigint NOT NULL DEFAULT 0;

CREATE OR REPLACE FUNCTION public.increment_app_downloads(p_app_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  UPDATE public.apps SET download_count = download_count + 1 WHERE id = p_app_id;
END;
$$;
