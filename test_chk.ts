import { createClient } from "@supabase/supabase-js";
const supabase = createClient("https://kyebanwdwcpufohvstxd.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5ZWJhbndkd2NwdWZvaHZzdHhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3ODE1NTcsImV4cCI6MjA5NDM1NzU1N30.J9nTR1OynTd6WU1yWPunqzy9j7oNKR4S0idwLwn2ffU");

async function run() {
  const { data } = await supabase.from("settings").select("watermark_img").single();
  console.log("Settings:", data);
  const { data: props} = await supabase.from("properties").select("image, gallery").limit(1);
  console.log("Props:", props);
}

run();
