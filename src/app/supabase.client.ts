import {createClient} from'@supabase/supabase-js'

const supabaseUrl = 'https://<TU_URL_DE_SUPABASE>.supabase.co'
const supabaseKey = '<TU_API_KEY>'

export const supabase = createClient(supabaseUrl, supabaseKey)