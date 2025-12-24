const bcrypt = require("bcryptjs")

async function generateHash() {
  const password = "admin"
  const hash = await bcrypt.hash(password, 10)
  console.log("Password:", password)
  console.log("Hash:", hash)
  console.log("\nCopy this hash to src/lib/auth.ts as ADMIN_PASSWORD_HASH")
}

generateHash().catch(console.error)
