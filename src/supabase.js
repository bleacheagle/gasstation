// src/supabase.js
const SUPABASE_URL = "https://umgpzjdfpfnogggzecmj.supabase.co";
// ⚠️ 這裡先放你原本這把鑰匙，如果登入跳錯誤，再回後台換成 eyJ 開頭的 anon public 金鑰即可
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVtZ3B6amRmcGZub2dnZ3plY21qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEyNzQwNDUsImV4cCI6MjA5Njg1MDA0NX0.RTVss_RIcMCLAMf8XrUiyBab07kgloG2mTEQ7gL10rA"; 

const supabaseTarget = window.supabase ? window.supabase : supabase;
export const client = supabaseTarget.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);