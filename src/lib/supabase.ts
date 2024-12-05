import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lxkaosgjtqonrnlivzev.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4a2Fvc2dqdHFvbnJubGl2emV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM0MTQ0NzAsImV4cCI6MjA0ODk5MDQ3MH0.-_aXtmVnMLTB-aX6hrjQniXCK5PfdHDcoYlUXEhaag4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);