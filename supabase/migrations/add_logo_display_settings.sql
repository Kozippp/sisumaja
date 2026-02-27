-- Add display settings columns to client_logos table
ALTER TABLE public.client_logos 
ADD COLUMN IF NOT EXISTS logo_scale NUMERIC DEFAULT 100,
ADD COLUMN IF NOT EXISTS logo_position_x NUMERIC DEFAULT 50,
ADD COLUMN IF NOT EXISTS logo_position_y NUMERIC DEFAULT 50;

COMMENT ON COLUMN public.client_logos.logo_scale IS 'Logo zoom level in percentage (50-200)';
COMMENT ON COLUMN public.client_logos.logo_position_x IS 'Horizontal position in percentage (0-100)';
COMMENT ON COLUMN public.client_logos.logo_position_y IS 'Vertical position in percentage (0-100)';
