import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://mhtqvuglujodpffpmmhe.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1odHF2dWdsdWpvZHBmZnBtbWhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAyOTg0NzAsImV4cCI6MjA5NTg3NDQ3MH0.01DA51ogwf1lHlkl_0cjoRzZZRquCoHEB2mlttoXeRk';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const COLORS = {
  gold: '#C9A84C',
  goldLight: '#E8C97A',
  goldDim: 'rgba(201,168,76,0.25)',
  black: '#080808',
  surface: '#0E0E0E',
  surface2: '#161616',
  surface3: '#1E1E1E',
  border: '#2A2A2A',
  borderGold: 'rgba(201,168,76,0.2)',
  text: '#F0EDE6',
  textMuted: '#8A8880',
  textDim: '#4A4845',
  green: '#2D9E6B',
  greenBg: 'rgba(45,158,107,0.12)',
  red: '#E05A5A',
  blue: '#5A9BE0',
  blueBg: 'rgba(90,155,224,0.12)',
};

export const TIER_LABELS = {
  starter: 'Starter',
  presence: 'Presence',
  full_front_office: 'Full Front Office',
};

export const TIER_COLORS = {
  starter: { bg: 'rgba(90,155,224,0.15)', text: '#5A9BE0' },
  presence: { bg: 'rgba(45,158,107,0.15)', text: '#2D9E6B' },
  full_front_office: { bg: 'rgba(201,168,76,0.15)', text: '#C9A84C' },
};

export const STRIPE_LINKS = {
  starter: 'https://buy.stripe.com/test_fZu5kF9kH391gTV3Xb1wY00',
  presence: 'https://buy.stripe.com/test_bJe7sNdAXaBtavx8dr1wY01',
  full_front_office: 'https://buy.stripe.com/test_00w28teF1bFxdHJ65j1wY02',
};
