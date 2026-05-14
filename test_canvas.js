const fs = require('fs');

function decodeAndSave(dataurl, filename) {
  const arr = dataurl.split(',');
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
  }
  fs.writeFileSync(filename, Buffer.from(u8arr)); // Save it properly
}

console.log("decode ok");
