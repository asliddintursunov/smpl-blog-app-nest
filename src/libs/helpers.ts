import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;
export const hashPassword = async (plainPassword: string) => {
  try {
    const hash = await bcrypt.hash(plainPassword, SALT_ROUNDS);
    return hash;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const verifyPassword = async (
  plainPassword: string,
  storedHash: string,
) => {
  try {
    const match = await bcrypt.compare(plainPassword, storedHash);
    if (match) return true;
    return false;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
