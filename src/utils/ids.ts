import crypto from "crypto";

export const generateShortId = (userId: string, validatorId: string) => {
  const combinedString = `${userId}:${validatorId}`;

  const hash = crypto.createHash("sha256").update(combinedString).digest("hex");

  const shortId = hash.substring(0, 8);

  return shortId;
};

export const verifyShortId = (
  userId: string,
  validatorId: string,
  shortIdToVerify: string
) => {
  const regeneratedShortId = generateShortId(userId, validatorId);

  return regeneratedShortId === shortIdToVerify;
};
