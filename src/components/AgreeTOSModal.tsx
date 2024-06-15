import { updateUser } from "@/actions/auth";
import { UserType } from "@/db/types/user";
import { Box, Button, NavLink } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { MutableRefObject, Ref, useEffect, useState } from "react";

export default function AgreeTOSModal({ user, modalRef }: { user: UserType, modalRef: MutableRefObject<string | null> }) {
  const [loading, setLoading] = useState(false);
  const modals = useModals();

  useEffect(() => {
    if (!user) {
      setLoading(false);
      modals.closeAll();
    }
  }, [user]);

  const handleAgreeToTOS = async () => {
    setLoading(true);
    await updateUser({ data: { agreed_to_tos: true } });
    setLoading(false);
    console.log(modalRef);
    if (modalRef?.current) modals.closeModal(modalRef.current!);
  };

  return (
    <Box className="w-full h-full">
      <Box
        component="object"
        style={{ height: "calc(100vh - 220px)" }}
        className="h-full w-full mb-4"
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
      <Box className="flex justify-center gap-4 sticky bg-white border-t border-gray-200 p-4 bottom-0 -mb-4 -mx-4">
        <Button onClick={handleAgreeToTOS} loading={loading}>
          Agree to Term of Service
        </Button>
      </Box>
    </Box>
  );
}
