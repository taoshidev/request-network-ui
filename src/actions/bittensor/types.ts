export const types = {
  Balance: "u64",
  PrometheusInfo: {
    block: "u64", // --- Prometheus serving block.
    version: "u32", // --- Prometheus version.
    ip: "u128", // --- Prometheus u128 encoded ip address of type v6 or v4. serialized to string.
    port: "u16", // --- Prometheus u16 encoded port.
    ip_type: "u8", // --- Prometheus ip type, 4 for ipv4 and 6 for ipv6.
  },
  AxonInfo: {
    block: "u64", // --- Axon serving block.
    version: "u32", // --- Axon version
    ip: "u128", // --- Axon u128 encoded ip address of type v6 or v4. serialized to string.
    port: "u16", // --- Axon u16 encoded port.
    ip_type: "u8", // --- Axon ip type, 4 for ipv4 and 6 for ipv6.
    protocol: "u8", // --- Axon protocol. TCP, UDP, other.
    placeholder1: "u8", // --- Axon proto placeholder 1.
    placeholder2: "u8", // --- Axon proto placeholder 1.
  },
  NeuronInfo: {
    hotkey: "AccountId",
    coldkey: "AccountId",
    uid: "Compact<u16>",
    netuid: "Compact<u16>",
    active: "bool",
    axon_info: "AxonInfo",
    prometheus_info: "PrometheusInfo",
    stake: "Vec<(AccountId, Compact<u64>)>", // map of coldkey to stake on this neuron/hotkey (includes delegations)
    rank: "Compact<u16>",
    emission: "Compact<u64>",
    incentive: "Compact<u16>",
    consensus: "Compact<u16>",
    trust: "Compact<u16>",
    validator_trust: "Compact<u16>",
    dividends: "Compact<u16>",
    last_update: "Compact<u64>",
    validator_permit: "bool",
    weights: "Vec<(Compact<u16>, Compact<u16>)>", // Vec of (uid, weight)
    bonds: "Vec<(Compact<u16>, Compact<u16>)>", // Vec of (uid, bond)
    pruning_score: "Compact<u16>",
  },
  NeuronInfoLite: {
    hotkey: "AccountId",
    coldkey: "AccountId",
    uid: "Compact<u16>",
    netuid: "Compact<u16>",
    active: "bool",
    axon_info: "AxonInfo",
    prometheus_info: "PrometheusInfo",
    stake: "Vec<(AccountId, Compact<u64>)>", // map of coldkey to stake on this neuron/hotkey (includes delegations)
    rank: "Compact<u16>",
    emission: "Compact<u64>",
    incentive: "Compact<u16>",
    consensus: "Compact<u16>",
    trust: "Compact<u16>",
    validator_trust: "Compact<u16>",
    dividends: "Compact<u16>",
    last_update: "Compact<u64>",
    validator_permit: "bool",
    pruning_score: "Compact<u16>",
  },
  DelegateInfo: {
    delegate_ss58: "AccountId",
    take: "Compact<u16>",
    nominators: "Vec<(AccountId, Compact<u64>)>", // map of nominator_ss58 to stake amount
    owner_ss58: "AccountId",
    registrations: "Vec<Compact<u16>>", // Vec of netuid this delegate is registered on
    validator_permits: "Vec<Compact<u16>>", // Vec of netuid this delegate has validator permit on
    return_per_1000: "Compact<u64>", // Delegators current daily return per 1000 TAO staked minus take fee
    total_daily_return: "Compact<u64>", // Delegators current daily return
  },
  SubnetInfo: {
    netuid: "Compact<u16>",
    rho: "Compact<u16>",
    kappa: "Compact<u16>",
    difficulty: "Compact<u64>",
    immunity_period: "Compact<u16>",
    validator_batch_size: "Compact<u16>",
    validator_sequence_length: "Compact<u16>",
    validator_epochs_per_reset: "Compact<u16>",
    validator_epoch_length: "Compact<u16>",
    max_allowed_validators: "Compact<u16>",
    min_allowed_weights: "Compact<u16>",
    max_weights_limit: "Compact<u16>",
    scaling_law_power: "Compact<u16>",
    synergy_scaling_law_power: "Compact<u16>",
    subnetwork_n: "Compact<u16>",
    max_allowed_uids: "Compact<u16>",
    blocks_since_last_step: "Compact<u64>",
    tempo: "Compact<u16>",
    network_modality: "Compact<u16>",
    network_connect: "Vec<[u16; 2]>",
    emission_values: "Compact<u64>",
    burn: "Compact<u64>",
  },
};
