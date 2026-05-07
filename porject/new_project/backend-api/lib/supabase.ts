"use client"

import { SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = "https://vfafjilidhaljpqogfni.supabase.co";
const supabaseKey = "sb_publishable_jegCFLJnHw-YFixfHBjqSQ_Z4yH-SPc";

export const supabase = new SupabaseClient(supabaseUrl, supabaseKey);