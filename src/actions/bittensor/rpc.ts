export const rpc = {
  neuronInfo: {
    getNeuronsLite: {
      description: "Get neurons lite",
      params: [
        {
          name: "netuid",
          type: "u16",
        },
      ],
      type: "Vec<u8>",
    },
    getNeuronLite: {
      description: "Get neuron lite",
      params: [
        {
          name: "netuid",
          type: "u16",
        },
        {
          name: "uid",
          type: "u16",
        },
      ],
      type: "Vec<u8>",
    },
    getNeurons: {
      description: "Get neurons",
      params: [
        {
          name: "netuid",
          type: "u16",
        },
      ],
      type: "Vec<u8>",
    },
    getNeuron: {
      description: "Get neuron",
      params: [
        {
          name: "netuid",
          type: "u16",
        },
        {
          name: "uid",
          type: "u16",
        },
      ],
      type: "Vec<u8>",
    },
  },
  delegateInfo: {
    getDelegates: {
      description: "Get delegates info",
      params: [],
      type: "Vec<u8>",
    },
    getDelegate: {
      description: "Get delegate info", // FIXME:
      params: [
        {
          name: "delegate_account",
          type: "AccountId",
        },
      ],
      type: "Vec<u8>",
    },
    getDelegated: {
      description: "Get delegatee info", // FIXME:
      params: [
        {
          name: "delegatee_account",
          type: "AccountId",
        },
      ],
      type: "Vec<u8>",
    },
  },
  subnetInfo: {
    getSubnetsInfo: {
      description: "Get subnets info",
      params: [],
      type: "Vec<u16>",
    },
    getSubnetInfo: {
      description: "Get subnet info",
      params: [
        {
          name: "netuid",
          type: "u64",
        },
      ],
      type: "Vec<u16>",
    },
  },
};
