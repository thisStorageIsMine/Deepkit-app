import { createClient } from '@supabase/supabase-js';
import { Database } from './types';
import { superSecret } from '../config';

export const supabase = createClient<Database>(
    'https://mllifwgowjoivrxplnbq.supabase.co',
    superSecret,
);
