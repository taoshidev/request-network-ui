import { updateUser } from "@/actions/auth";
import { UserType } from "@/db/types/user";
import { Box, Button, NavLink } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { MutableRefObject, Ref, useEffect, useState } from "react";

export default function AgreeTOSModal({
  user,
  modalRef,
  mode = "agree",
}: {
  mode?: "agree" | "view";
  user: UserType;
  modalRef: MutableRefObject<string | null>;
}) {
  const [loading, setLoading] = useState(false);
  const modals = useModals();

  const close = () => {
    if (modalRef?.current) modals.closeModal(modalRef.current!);
  };

  useEffect(() => {
    if (!user && modalRef?.current) {
      setLoading(false);
      modals.closeModal(modalRef.current!);
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleAgreeToTOS = async () => {
    setLoading(true);
    await updateUser({ data: { agreed_to_tos: true } });
    setLoading(false);
    close();
  };

  return (
    <Box className="w-full h-full">
      <Box
        component="object"
        style={{ height: "calc(100vh - 245px)" }}
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
      <Box className="flex justify-end gap-4 sticky bg-white border-t border-gray-200 p-4 bottom-0 -mb-4 -mx-4">
        {mode === "agree" && (
          <Button onClick={handleAgreeToTOS} loading={loading}>
            Agree to Term of Service
          </Button>
        )}
        {mode === "view" && (
          <Button onClick={close} loading={loading}>
            Done
          </Button>
        )}
      </Box>
    </Box>
  );
}
