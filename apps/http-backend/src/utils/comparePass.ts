import bcrypt from "bcryptjs";
export default async function compare(
  plainpassword: string,
  hashedPassword: string,
) {
  return await bcrypt.compare(plainpassword, hashedPassword);
}
