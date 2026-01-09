-- Create mood_entries table for daily mood tracking
CREATE TABLE public.mood_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  mood TEXT NOT NULL CHECK (mood IN ('calm', 'okay', 'stressed', 'overwhelmed', 'sad', 'numb')),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  -- Allow anonymous entries for now (no auth required)
  session_id TEXT,
  -- Ensure one entry per day per session
  UNIQUE(date, session_id)
);

-- Enable Row Level Security
ALTER TABLE public.mood_entries ENABLE ROW LEVEL SECURITY;

-- Create policy for public read/write (since no auth is required for this feature)
CREATE POLICY "Anyone can read mood entries"
ON public.mood_entries
FOR SELECT
USING (true);

CREATE POLICY "Anyone can insert mood entries"
ON public.mood_entries
FOR INSERT
WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_mood_entries_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_mood_entries_updated_at
BEFORE UPDATE ON public.mood_entries
FOR EACH ROW
EXECUTE FUNCTION public.update_mood_entries_updated_at();