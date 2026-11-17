import bcrypt from "bcrypt";

// PHP's password_hash() writes "$2y$…" hashes. Node's bcrypt only recognises "$2b$…" — the two are the
// same algorithm with a different label, so we relabel before comparing. This lets people created in
// the old PHP version keep signing in with the same password.
const normalize = (hash) => String(hash ?? "").replace(/^\$2y\$/, "$2b$");

export const verifyPassword = (plain, hash) => bcrypt.compare(String(plain ?? ""), normalize(hash));
export const hashPassword = (plain) => bcrypt.hash(String(plain), 10);
