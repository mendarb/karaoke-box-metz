// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = "https://lxkaosgjtqonrnlivzev.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4a2Fvc2dqdHFvbnJubGl2emV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM0MTQ0NzAsImV4cCI6MjA0ODk5MDQ3MH0.-_aXtmVnMLTB-aX6hrjQniXCK5PfdHDcoYlUXEhaag4";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);