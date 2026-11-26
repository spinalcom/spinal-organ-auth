export const PASSWORD_POLICY_MESSAGE =
  "Le mot de passe doit contenir au moins 12 caractères (72 octets maximum), avec au moins une minuscule, une majuscule, un chiffre et un caractère spécial, sans espace ni nom d'utilisateur.";

function utf8ByteLength(value) {
  return new Blob([value]).size;
}

export function isPasswordValid(password, userName) {
  if (typeof password !== "string" || password.length < 12) return false;
  if (utf8ByteLength(password) > 72 || /\s/.test(password)) return false;
  if (!/[a-z]/.test(password) || !/[A-Z]/.test(password)) return false;
  if (!/[0-9]/.test(password) || !/[^A-Za-z0-9\s]/.test(password)) return false;

  const normalizedUserName = (userName || "").trim().toLocaleLowerCase();
  return !(
    normalizedUserName.length >= 3 &&
    password.toLocaleLowerCase().includes(normalizedUserName)
  );
}

function secureRandomIndex(maxExclusive) {
  const cryptoApi = window.crypto || window.msCrypto;
  if (!cryptoApi || !cryptoApi.getRandomValues) {
    throw new Error("SECURE_RANDOM_GENERATOR_UNAVAILABLE");
  }

  const upperBound = 256 - (256 % maxExclusive);
  const randomByte = new Uint8Array(1);
  do {
    cryptoApi.getRandomValues(randomByte);
  } while (randomByte[0] >= upperBound);

  return randomByte[0] % maxExclusive;
}

export function generateCompliantPassword(length = 16, userName) {
  const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const lower = "abcdefghijkmnopqrstuvwxyz";
  const numbers = "23456789";
  const symbols = "!@#$%*_-";
  const allChars = upper + lower + numbers + symbols;
  const pick = (chars) => chars[secureRandomIndex(chars.length)];
  let generatedPassword;

  do {
    const passwordChars = [pick(upper), pick(lower), pick(numbers), pick(symbols)];

    while (passwordChars.length < length) passwordChars.push(pick(allChars));

    for (let i = passwordChars.length - 1; i > 0; i -= 1) {
      const j = secureRandomIndex(i + 1);
      [passwordChars[i], passwordChars[j]] = [passwordChars[j], passwordChars[i]];
    }

    generatedPassword = passwordChars.join("");
  } while (!isPasswordValid(generatedPassword, userName));

  return generatedPassword;
}
