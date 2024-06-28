import { Box, Text, Group, Badge, Divider } from "@mantine/core";
import { ServiceType } from "@/db/types/service";
import CurrencyFormatter from "../../Formatters/CurrencyFormatter";
import FixedFormatter from "../../Formatters/FixedFormatter";

export default function ContractDisplayTierPricing({ service }: { service: ServiceType }) {
  return (
    <Box>
      {service.tiers.map((tier, index) => (
        <Box key={index}>
          <Group key={index} className="justify-between items-center m-2">
            <Text>
              From <FixedFormatter value={tier.from} /> to{" "}
              <FixedFormatter value={tier.to} /> requests
            </Text>
            <Badge size="lg" variant="light">
              <CurrencyFormatter
                price={tier.price}
                currencyType={service.currencyType}
              />
            </Badge>
          </Group>
          <Divider className="border-dashed" />
        </Box>
      ))}
    </Box>
  );
}
