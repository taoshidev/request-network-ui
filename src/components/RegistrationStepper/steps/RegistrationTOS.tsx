import { useRegistration } from "@/providers/registration";
import { Box, NavLink } from "@mantine/core";
import clsx from "clsx";

export default function RegistrationTOS() {
  const { registrationData } = useRegistration();

  return (
    <Box className={clsx("w-full h-full slide", registrationData.direction)}>
      <Box
        component="object"
        style={{ height: "calc(100vh - 320px)", marginBottom: "100px" }}
        className="h-full w-full"
        type="application/pdf"
        data="/request-network-terms-of-service.pdf#view=FitH&scrollbar=0&navpanes=0"
      >
        <Box>
          File can not be displayed in browser.{" "}
          <NavLink href="/request-network-terms-of-service.pdf">
            Request Network Terms of Service
          </NavLink>
        </Box>
      </Box>
    </Box>
  );
}
