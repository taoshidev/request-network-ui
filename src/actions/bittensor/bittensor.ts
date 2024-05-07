const { ApiPromise, WsProvider } = require("@polkadot/api");
import { ApiOptions } from "@polkadot/api/types";
import { rpc } from "./rpc";
import { types } from "./types";
import { ValidatorType } from "@/db/types/validator";

const PROVIDER_URL =
  process.env.NEXT_PUBLIC_NODE_ENV === "development"
    ? "wss://test.finney.opentensor.ai:443"
    : "wss://entrypoint-finney.opentensor.ai:443";

let api: typeof ApiPromise;

export const createBittensorApi = async () => {
  if (!api) {
    const provider = new WsProvider(PROVIDER_URL);
    api = await ApiPromise.create(<ApiOptions>{ provider, types, rpc });

    await api.isReadyOrError;

    const [chain, nodeName, nodeVersion] = await Promise.all([
      api.rpc.system.chain(),
      api.rpc.system.name(),
      api.rpc.system.version(),
    ]);

    // api.on("error", (error: Error) => console.error("API error:", error));
    
    // console.log(
    //   `Connected to chain ${chain} using ${nodeName} v${nodeVersion}`
    // );
  }
  await api.isReadyOrError;
  return api;
};

export const checkMetadata = async () => {
  const provider = new WsProvider(PROVIDER_URL);
  const api = await ApiPromise.create({ provider });

  // Accessing metadata safely
  const metadata = api.runtimeMetadata.toJSON();
  return JSON.stringify(metadata, null, 2);
};

export const fetchValidatorInfo = async (netUid: number, hotkey?: string) => {
  try {
    const api = await createBittensorApi();
    const result = await fetchNeuronsLite(netUid);
    return (
      (await (result || []).filter((v: ValidatorType) => v.hotkey === hotkey)?.[0]) || null
    );
    // TODO: fetch by uid integer
    // const result = api.createType("NeuronInfo", validatorInfo);
    // return result.toJSON();
  } catch (error) {
    console.error("Error fetching validator info:", error);
    return null;
  }
};

export const fetchNeuronsLite = async (netUid: number) => {
  const api = await createBittensorApi();
  const result_bytes = await api.rpc.neuronInfo.getNeuronsLite(netUid);
  const result = api.createType("Vec<NeuronInfoLite>", result_bytes);
  return result.toJSON();
};

export const fetchSubnetsInfo = async () => {
  const api = await createBittensorApi();
  const result_bytes = await api.rpc.subnetInfo.getSubnetsInfo();
  const result = api.createType("Vec<SubnetInfo>", result_bytes);
  return result.toJSON();
};

export const fetchSubnetInfo = async () => {
  const api = await createBittensorApi();
  try {
    const result_bytes = await api.rpc.subnetInfo.getSubnetInfo("8");
    const result = api.createType("Vec<SubnetInfo>", result_bytes);
    return result.toJSON();
  } catch (error) {
    console.error("Failed to decode SubnetInfo:", error);
    return null;
  }
};
