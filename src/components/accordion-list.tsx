"use client";

import { Accordion } from "@mantine/core";

export default function AccordionList({ items }) {
  const children = items.map((item) => (
    <Accordion.Item className="bg-gray-200" key={item.title} value={item.title}>
      <Accordion.Control>{item.title}</Accordion.Control>
      <Accordion.Panel>{item.content}</Accordion.Panel>
    </Accordion.Item>
  ));

  return (
    <Accordion radius={0} variant="separated" defaultValue="Apples">
      {children}
    </Accordion>
  );
}
