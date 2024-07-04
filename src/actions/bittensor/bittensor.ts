const { ApiPromise, WsProvider } = require("@polkadot/api");
import { ApiOptions } from "@polkadot/api/types";
import { rpc } from "./rpc";
import { types } from "./types";

const PROVIDER_URL = ["development", "testing", "staging"].includes(
  process.env.NEXT_PUBLIC_NODE_ENV as string
)
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

export const fetchValidatorInfo = async (
  netUid: number,
  hotkey?: string,
  uId?: number
) => {
  try {
    if (!uId) {
      return [];
      // const result = await fetchNeuronsLite(netUid);
      // return (
      //   (result || []).filter((v: ValidatorType) => v.hotkey === hotkey)?.[0] ||
      //   null
      // );
    }
    return await fetchNeuronLite(netUid, uId);
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

export const fetchNeuronLite = async (netUid: number, uId: number) => {
  const api = await createBittensorApi();
  const result_bytes = await api.rpc.neuronInfo.getNeuronLite(netUid, uId);
  try {
    const result = api.createType("NeuronInfoLite", result_bytes);
    return result.toJSON();
  } catch (error) {
    throw error;
  }
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
