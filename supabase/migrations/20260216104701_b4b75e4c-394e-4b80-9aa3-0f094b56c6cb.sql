
-- Create post_likes table for tracking likes per post per visitor
CREATE TABLE public.post_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  visitor_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Unique constraint: one like per visitor per post
CREATE UNIQUE INDEX idx_post_likes_unique ON public.post_likes(post_id, visitor_id);
CREATE INDEX idx_post_likes_post_id ON public.post_likes(post_id);

-- Add likes_count column to posts table
ALTER TABLE public.posts ADD COLUMN likes_count BIGINT NOT NULL DEFAULT 0;

-- Enable RLS
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Anyone can read post_likes" ON public.post_likes FOR SELECT USING (true);
CREATE POLICY "Anyone can insert post_likes" ON public.post_likes FOR INSERT WITH CHECK (true);
-- No delete/update - likes are permanent

-- Enable realtime for post_likes
ALTER PUBLICATION supabase_realtime ADD TABLE public.post_likes;
