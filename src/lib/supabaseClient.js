// src/lib/supabaseClient.js
require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')

const SUPABASE_URL = process.env.SUPABASE_URL
// On the server we want the SERVICE_ROLE key, not the anon key:
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    throw new Error('Must set SUPABASE_URL and SUPABASE_SERVICE_KEY in env')
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    // you can disable realtime or adjust options here if you want
    auth: { persistSession: false }
})

module.exports = { supabase }
