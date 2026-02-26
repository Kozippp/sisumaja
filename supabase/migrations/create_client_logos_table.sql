-- Create client_logos table
CREATE TABLE IF NOT EXISTS public.client_logos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    logo_url TEXT,
    is_mock BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security
ALTER TABLE public.client_logos ENABLE ROW LEVEL SECURITY;

-- Create policy to allow everyone to read client logos
CREATE POLICY "Allow public read access to client logos" 
ON public.client_logos 
FOR SELECT 
TO public 
USING (true);

-- Create policy to allow authenticated users to insert
CREATE POLICY "Allow authenticated users to insert client logos" 
ON public.client_logos 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Create policy to allow authenticated users to update
CREATE POLICY "Allow authenticated users to update client logos" 
ON public.client_logos 
FOR UPDATE 
TO authenticated 
USING (true)
WITH CHECK (true);

-- Create policy to allow authenticated users to delete
CREATE POLICY "Allow authenticated users to delete client logos" 
ON public.client_logos 
FOR DELETE 
TO authenticated 
USING (true);

-- Create index for display order
CREATE INDEX client_logos_display_order_idx ON public.client_logos (display_order);

-- Insert some mock data
INSERT INTO public.client_logos (name, is_mock, display_order) VALUES
('Swedbank', true, 1),
('Elisa', true, 2),
('Bolt', true, 3),
('Telia', true, 4),
('LHV', true, 5),
('Sportland', true, 6),
('Nike', true, 7),
('Adidas', true, 8);
