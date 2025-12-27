-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Detox sessions
CREATE TABLE public.detox_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  started_at TIMESTAMPTZ NOT NULL,
  ended_at TIMESTAMPTZ,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User's "why" statements and motivations
CREATE TABLE public.motivations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  type TEXT DEFAULT 'why' CHECK (type IN ('why', 'goal', 'reminder')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Milestones (predefined + user achievements)
CREATE TABLE public.milestones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  hour_threshold INTEGER NOT NULL,
  icon TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User milestone achievements
CREATE TABLE public.user_milestones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  session_id UUID REFERENCES public.detox_sessions(id) ON DELETE CASCADE NOT NULL,
  milestone_id UUID REFERENCES public.milestones(id) ON DELETE CASCADE NOT NULL,
  achieved_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(session_id, milestone_id)
);

-- Chat messages
CREATE TABLE public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  session_id UUID REFERENCES public.detox_sessions(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- SMS check-ins sent via n8n
CREATE TABLE public.check_ins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  session_id UUID REFERENCES public.detox_sessions(id) ON DELETE CASCADE NOT NULL,
  hour_number INTEGER NOT NULL,
  message_sent TEXT NOT NULL,
  sent_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed default milestones
INSERT INTO public.milestones (name, description, hour_threshold, icon) VALUES
  ('First 6 Hours', 'You''ve made it through the first stretch.', 6, '🌅'),
  ('First 12 Hours', 'Halfway through Day 1. Keep going.', 12, '⏰'),
  ('Survived Day 1', 'You did it. The hardest day is behind you.', 24, '🏆'),
  ('Hour 36', 'Deep in it now. You''re stronger than this.', 36, '💪'),
  ('Hour 48', 'Two days. The peak is near.', 48, '⛰️'),
  ('Hour 72 - The Peak', 'This is the summit. It only gets easier from here.', 72, '🎯'),
  ('Day 4', 'The worst is behind you.', 96, '🌤️'),
  ('Day 5', 'Physical symptoms fading. You''re doing it.', 120, '🌈'),
  ('One Week Clean', 'Seven days. A new beginning.', 168, '⭐');

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.detox_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.motivations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.check_ins ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own data
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own sessions" ON public.detox_sessions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own motivations" ON public.motivations
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own milestones" ON public.user_milestones
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own messages" ON public.messages
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own check-ins" ON public.check_ins
  FOR SELECT USING (auth.uid() = user_id);

-- Milestones are public/readable by all
CREATE POLICY "Milestones are viewable by all" ON public.milestones
  FOR SELECT USING (true);

-- Function to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for auto-creating profile
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

