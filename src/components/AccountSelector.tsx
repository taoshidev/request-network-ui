"use client";

import { useState } from "react";
import {
  Group,
  Box,
  Button,
  Text,
  Space,
  Select,
  Divider,
} from "@mantine/core";

export default function AccountSelector({ accounts, onSelect, onClose }) {
  const [selectedAccountIndex, setSelectedAccountIndex] = useState<
    number | null
  >(null);

  const handleSelect = () => {
    if (selectedAccountIndex !== null) {
      const selectedAccount = accounts[selectedAccountIndex];
      onSelect?.(selectedAccount);
    }
  };

  return (
    <Box>
      <Text>
        Select the account associated with your validator. Hotkey must match
        address specified during validator registration.
      </Text>
      <Select
        className="mt-7"
        data={accounts.map((account, index) => ({
          value: index.toString(),
          label: `${account.meta.name} (${account.address})`,
        }))}
        placeholder="Select an account"
        value={selectedAccountIndex?.toString() || ""}
        onChange={(value) => setSelectedAccountIndex(+value!)}
      />
      <Space h="sm" />
      <Divider className="mt-4" />
      <Group className="flex justify-end mt-4">
        <Button variant="default" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSelect}>Select</Button>
      </Group>
    </Box>
  );
}
