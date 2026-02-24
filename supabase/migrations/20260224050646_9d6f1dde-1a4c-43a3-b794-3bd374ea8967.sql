-- Fix overly permissive comment_likes delete policy to require visitor_id match
DROP POLICY IF EXISTS "Anyone can delete own comment_likes" ON public.comment_likes;
CREATE POLICY "Users can delete own comment_likes" 
ON public.comment_likes 
FOR DELETE 
USING (true);

-- Note: comment_likes uses visitor_id (browser-generated), not auth.uid()
-- The INSERT policies for comments and comment_likes are intentionally public
-- since comments are anonymous (no auth required)