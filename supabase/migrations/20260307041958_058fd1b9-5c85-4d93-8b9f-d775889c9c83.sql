
-- Create storage bucket for PDFs
INSERT INTO storage.buckets (id, name, public) VALUES ('study-files', 'study-files', false);

-- Allow authenticated users to upload to their own folder
CREATE POLICY "Users can upload own files" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'study-files' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Allow users to read their own files
CREATE POLICY "Users can read own files" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'study-files' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Allow users to delete their own files
CREATE POLICY "Users can delete own files" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'study-files' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Add file_url column to study_sessions
ALTER TABLE public.study_sessions ADD COLUMN IF NOT EXISTS file_url text DEFAULT '';
