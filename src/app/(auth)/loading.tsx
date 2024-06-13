import { Container, Loader, Center } from "@mantine/core";

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <Container my="xl" h={500} className="z-99">
      <Center h="100%">
        <Loader size="xl" />
      </Center>
    </Container>
  );
}
