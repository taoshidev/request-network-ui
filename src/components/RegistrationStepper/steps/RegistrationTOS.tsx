import { useRegistration } from "@/providers/registration";
import clsx from "clsx";

export default function RegistrationTOS() {
  const { registrationData } = useRegistration();

  return (
    <object
      style={{ height: "100%", marginBottom: "100px" }}
      className={clsx("w-full slide", registrationData.direction)}
      type="application/pdf"
      data="/request-network-terms-of-service.pdf#view=FitH&scrollbar=0&navpanes=0"
    >
      <p>
        File can not be displayed in browser.{" "}
        <a href="/request-network-terms-of-service.pdf">
          Request Network Terms of Service
        </a>
      </p>
    </object>
  );
}
