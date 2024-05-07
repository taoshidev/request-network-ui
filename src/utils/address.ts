import { decodeAddress, encodeAddress } from "@polkadot/keyring";
import { hexToU8a, isHex } from "@polkadot/util";

export const isAddress = ({ address }: { address: string }) => {
  try {
    encodeAddress(isHex(address) ? hexToU8a(address) : decodeAddress(address));

    return true;
  } catch (error) {
    return false;
  }
};

export const isValidEthereumAddress = (address: string): boolean => {
  const re = /^0x[a-fA-F0-9]{40}$/;
  return re.test(address);
};
