import { useState } from "react";
import { Box, Button, Modal } from "@mantine/core";
import { TextEditor } from "@/components/TextEditor";
import { useNotification } from "@/hooks/use-notification";
import { ContractType } from "@/db/types/contract";
import { useRegistration } from "@/providers/registration";

export function ContractDisplayModal({
  html,
  opened,
  close,
  onTermsAccepted,
  review = false,
}: {
  html: string;
  opened: boolean;
  review?: boolean;
  close: () => void;
  onTermsAccepted?: ({ termsAccepted }: { termsAccepted: boolean }) => void;
}) {
  const { notifySuccess } = useNotification();
  const { registrationData } = useRegistration();
  const [termsAccepted, setTermsAccepted] = useState<boolean>(
    registrationData?.endpoint?.termsAccepted || false
  );

  const handleAcceptTerms = async (termsAccepted: boolean) => {
    notifySuccess(`Terms ${termsAccepted ? "Accepted" : "Declined"}!`);
    setTermsAccepted(termsAccepted);
    onTermsAccepted?.({ termsAccepted });
    close();
  };

  return (
    <Modal size="xl" opened={opened} onClose={close} title="Terms of Service">
      <Box className="!p-0 flex flex-col h-[80vh]">
        <Box className="flex-1 overflow-y-auto p-4">
          <TextEditor<ContractType>
            type="BubbleEditor"
            editable={false}
            html={html}
          />
        </Box>
        {!review && (
          <Box className="flex justify-between p-4 bg-white border-t border-gray-200">
            <Button
              size="sm"
              variant={termsAccepted ? "outline" : "filled"}
              className="flex-1 mr-2"
              onClick={() => handleAcceptTerms(false)}
            >
              {termsAccepted ? "Decline" : "Decline Terms"}
            </Button>
            <Button
              size="sm"
              variant={termsAccepted ? "filled" : "outline"}
              className="flex-1 ml-2"
              onClick={() => handleAcceptTerms(true)}
            >
              {termsAccepted ? "Terms Accepted" : "Accept Terms"}
            </Button>
          </Box>
        )}
      </Box>
    </Modal>
  );
}
