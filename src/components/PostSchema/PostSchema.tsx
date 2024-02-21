"use client";

import { Title, Box, Text, Group } from "@mantine/core";

import { CodeHighlightTabs } from "@mantine/code-highlight";

import styles from "./post-schema.module.css";

export function PostSchema() {
  const _schema = {
    message: "Welcome to the API",
    data: {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
    },
  };

  const code = `${JSON.stringify(_schema, null, 2)}`;

  return (
    <Box>
      <Title order={3} mb="sm">
        Required Schema
      </Title>
      <Group justify="space-between" grow>
        <Box>
          <Text size="sm" mb="sm">
            In our app, submissions to our API must strictly adhere to the
            defined data schema. Incorrect submissions will incur penalties,
            such as rate limiting or temporary suspension, to ensure data
            integrity and service quality.
          </Text>
          <Text size="sm" mb="xl">
            Please review the schema requirements carefully before posting to
            avoid these consequences.
          </Text>
        </Box>

        <Box>
          <CodeHighlightTabs
            withHeader={false}
            className={styles.code}
            code={[
              {
                fileName: "index.ts",
                code,
                language: "ts",
              },
            ]}
          />
        </Box>
      </Group>
    </Box>
  );
}
