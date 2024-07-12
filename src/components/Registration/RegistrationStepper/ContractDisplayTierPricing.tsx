import { useState, useEffect } from "react";
import { Box, Text, Badge, Tooltip, Table } from "@mantine/core";
import { ServiceType } from "@/db/types/service";
import CurrencyFormatter from "../../Formatters/CurrencyFormatter";
import FixedFormatter from "../../Formatters/FixedFormatter";

export default function ContractDisplayTierPricing({
  service,
}: {
  service: ServiceType;
}) {
  const [tiersWithCumulativePrices, setTiersWithCumulativePrices] = useState<
    {
      from: number;
      to: number;
      cumulativePrice: number;
      details: string;
    }[]
  >([]);

  useEffect(() => {
    if (service.tiers) {
      setTiersWithCumulativePrices(getCumulativePriceDetails(service.tiers));
    }
  }, [service.tiers]);

  const getCumulativePriceDetails = (tiers) => {
    let cumulativePrice = 0;
    return tiers.map((tier) => {
      const tierRange = tier.to - (tier.from - 1);
      const priceForTier = tierRange * tier.pricePerRequest;
      cumulativePrice += priceForTier;
      return {
        ...tier,
        cumulativePrice,
        details: `(${tierRange} * ${tier?.pricePerRequest?.toFixed(
          4
        )}) = $${priceForTier.toFixed(2)}`,
      };
    });
  };

  return (
    <Box>
      <Table highlightOnHover striped>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Request Range</Table.Th>
            <Table.Th>Price Breakdown</Table.Th>
            <Table.Th>Total Price</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {tiersWithCumulativePrices?.map?.((tier, index) => (
            <Table.Tr key={index}>
              <Table.Td>
                <FixedFormatter value={tier.from} /> to{" "}
                <FixedFormatter value={tier.to} /> requests
              </Table.Td>
              <Table.Td>
                <Text className="text-sm text-gray-500">{tier.details}</Text>
              </Table.Td>
              <Table.Td>
                <Tooltip label={tier.details} withArrow>
                  <Badge size="lg" variant="light">
                    <CurrencyFormatter
                      price={tier.cumulativePrice}
                      currencyType={service.currencyType}
                    />
                  </Badge>
                </Tooltip>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Box>
  );
}
