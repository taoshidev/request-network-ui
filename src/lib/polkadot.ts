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
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";
import { ValidatorType } from "@/db/types/validator";

export type SignedDataType =
  | {
      message: string;
      signature: `0x${string}`;
      account: InjectedAccountWithMeta;
      error: string;
    }
  | null
  | undefined;

export type AccountType =
  | {
      error: string;
      data?: undefined;
    }
  | {
      data: any[];
      error?: undefined;
    }
  | undefined;

export const isValidSignature = async (
  signedMessage: string,
  signature: HexString,
  address: string,
  validator: ValidatorType
) => {
  const publicKey = decodeAddress(address);
  const hexPublicKey = u8aToHex(publicKey);

  if (address !== validator?.hotkey) {
    return {
      error:
        "Verification failed! Account address does not match with validator hotkey address.",
    };
  }
  //Some interfaces, such as using sr25519 however are only available via WASM
  await cryptoWaitReady();
  return signatureVerify(signedMessage, signature, hexPublicKey).isValid;
};

export async function getWeb3Accounts(): Promise<AccountType> {
  if (typeof window !== "undefined") {
    const extensions = await web3Enable("Taoshi Request Network");

    if (extensions.length === 0) {
      return { error: "No Polkadot extension installed" };
    }

    const accounts = await web3Accounts();
    return { data: accounts || [] };
  }
}

export async function sign(message: string, account) {
  if (typeof window !== "undefined") {
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
