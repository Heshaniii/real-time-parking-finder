// This is a simplified version of password hashing for demo purposes
// In a real application, use a proper hashing library like bcrypt

export async function hashPassword(password: string): Promise<string> {
  // In a real app, we would use bcrypt or similar
  // For this demo, we'll just prefix with "hashed_"
  return `hashed_${password}`
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  // In a real app, we would use bcrypt.compare or similar
  // For this demo, we'll just check if hash is "hashed_" + password
  return hash === `hashed_${password}`
}
