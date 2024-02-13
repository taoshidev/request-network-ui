import { ApiPromise, WsProvider } from "@polkadot/api";
import { rpc } from "./rpc";
import { types } from "./types";

export async function bittensor() {
  const wsProvider = new WsProvider(
    "wss://entrypoint-finney.opentensor.ai:443"
  );

  const api = await ApiPromise.create({
    provider: wsProvider,
    rpc,
    types,
  });

  const result_bytes = await api.rpc.neuronInfo.getNeuronsLite("8");
  const result = api.createType("Vec<NeuronInfoLite>", result_bytes);
  const neurons_info = result.toJSON();
}
