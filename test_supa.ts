import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://kyebanwdwcpufohvstxd.supabase.co/";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5ZWJhbndkd2NwdWZvaHZzdHhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3ODE1NTcsImV4cCI6MjA5NDM1NzU1N30.J9nTR1OynTd6WU1yWPunqzy9j7oNKR4S0idwLwn2ffU";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  const file = new Blob(["hello"], { type: "text/plain" });
  console.log("Uploading...");
  const { data, error } = await supabase.storage.from("images").upload("img_123.jpg", file);
  console.log("Data:", data);
  console.log("Error:", error);
}

run();
