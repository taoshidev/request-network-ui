import {
  web3Enable,
  web3Accounts,
  web3FromSource,
} from "@polkadot/extension-dapp";
import {
  decodeAddress,
  signatureVerify,
  cryptoWaitReady,
} from "@polkadot/util-crypto";
import type { HexString } from "@polkadot/util/types";

import { stringToHex, u8aToHex } from "@polkadot/util";
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';

export type SignedDataType = {
  message: string;
  signature: `0x${string}`;
  account: InjectedAccountWithMeta;
} | null | undefined;


export const isValidSignature = async (
  signedMessage: string,
  signature: HexString,
  address: string
) => {
  const publicKey = decodeAddress(address);
  const hexPublicKey = u8aToHex(publicKey);

  //Some interfaces, such as using sr25519 however are only available via WASM
  await cryptoWaitReady();

  return signatureVerify(signedMessage, signature, hexPublicKey).isValid;
};

export async function sign(message: string) {
  if (typeof window !== "undefined") {
    const extensions = await web3Enable("Taoshi Request Network");

    if (extensions.length === 0) {
      throw new Error("No Polkadot extension installed");
    }

    const accounts = await web3Accounts();

    if (accounts.length === 0) {
      throw new Error("No Polkadot accounts available");
    }

    const account = accounts[0];
    const injector = await web3FromSource(account.meta.source);

    const signRaw = injector?.signer?.signRaw;

    if (!!signRaw) {
      const { signature } = await signRaw({
        address: account.address,
        data: stringToHex(message),
        type: "bytes",
      });

      return { message, signature, account };
    }

    return null;
  }
}
