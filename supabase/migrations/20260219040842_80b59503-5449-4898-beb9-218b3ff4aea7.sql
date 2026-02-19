
-- Remove likes-related database objects

-- Drop the increment_post_likes RPC function
DROP FUNCTION IF EXISTS public.increment_post_likes(uuid);

-- Drop the post_likes table (and its RLS policies will be dropped automatically)
DROP TABLE IF EXISTS public.post_likes;

-- Remove likes_count column from posts table
ALTER TABLE public.posts DROP COLUMN IF EXISTS likes_count;
