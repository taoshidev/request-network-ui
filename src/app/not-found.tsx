import Link from "next/link";
import NextImage from "next/image";
import {
  Stack,
  Container,
  Title,
  Center,
  Anchor,
  Text,
  Image,
} from "@mantine/core";

import NotFoundImage from "../../public/404.gif";

export default function NotFound() {
  return (
    <Container className="h-full">
      <Center className="h-full">
        <Stack>
          <Image
            alt="Taoshi"
            width={200}
            component={NextImage}
            src={NotFoundImage}
          />
          <Title>Not Found</Title>
          <Text>Could not find requested resource</Text>
          <Anchor component={Link} href="/">
            Return Home
          </Anchor>
        </Stack>
      </Center>
    </Container>
  );
}
