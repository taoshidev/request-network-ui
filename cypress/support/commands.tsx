/// <reference types="cypress" />

import { theme } from "@/theme";
import { MantineProvider } from "@mantine/core";
import { mount } from "cypress/react18";
import { ReactNode } from "react";

Cypress.Commands.add("mount" as any, (component, options) => {
  return mount(
    <MantineProvider theme={theme}>{component as ReactNode}</MantineProvider>,
    options as any
  );
});
