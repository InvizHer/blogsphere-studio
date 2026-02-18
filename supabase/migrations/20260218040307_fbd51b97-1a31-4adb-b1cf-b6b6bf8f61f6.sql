-- Create a function to increment post likes (similar to view count increment)
CREATE OR REPLACE FUNCTION public.increment_post_likes(p_post_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.posts SET likes_count = likes_count + 1 WHERE id = p_post_id;
END;
$$;

-- Also create a function for view count increment for consistency
CREATE OR REPLACE FUNCTION public.increment_post_views(p_post_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.posts SET view_count = view_count + 1 WHERE id = p_post_id;
END;
$$;