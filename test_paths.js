const urls = [
  "https://kyebanwdwcpufohvstxd.supabase.co/storage/v1/object/images//test.txt",
  "https://kyebanwdwcpufohvstxd.supabase.co/storage/v1/object/images/?",
  "https://kyebanwdwcpufohvstxd.supabase.co/storage/v1/object//",
  "https://kyebanwdwcpufohvstxd.supabase.co/storage/v1/object/images/a%0A%0D.txt",
  "https://kyebanwdwcpufohvstxd.supabase.co/storage/v1/object/images",
  "https://kyebanwdwcpufohvstxd.supabase.co/storage/v1/object/images/",
  "https://kyebanwdwcpufohvstxd.supabase.co/storage/v1/object/",
  "https://kyebanwdwcpufohvstxd.supabase.co/storage/v1/object"
];

async function run() {
  for (const url of urls) {
    const res = await fetch(url, { method: "POST", headers: { "Authorization": "Bearer ...", "x-client-info": "supabase-js" }});
    const text = await res.text();
    console.log("URL:", url, "TEXT:", text);
  }
}
run();
