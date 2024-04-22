import { createContext, useContext, useState, ReactElement } from "react";

export interface RegistrationData {
  keyName: string;
  appName: string;
  consumerApiUrl: string;
  subnet: any;
  validator: any;
  currentStep: number;
}

type ProviderValue = {
  registrationData: RegistrationData | null;
  updateData: (data: RegistrationData) => void;
};

const RegistrationContext = createContext<ProviderValue>({
  registrationData: null,
  updateData: () => {},
});

export const useRegistration = () => useContext(RegistrationContext);

export const RegistrationProvider = ({
  children,
}: {
  children: ReactElement;
}) => {
  const [registrationData, setRegistrationData] = useState<RegistrationData>({
    keyName: "",
    appName: "",
    consumerApiUrl: "",
    subnet: null,
    validator: null,
    currentStep: 0,
  });

  const updateData = (data: Partial<RegistrationData>) => {
    setRegistrationData((prev) => ({ ...prev, ...data }));
  };

  return (
    <RegistrationContext.Provider value={{ registrationData, updateData }}>
      {children}
    </RegistrationContext.Provider>
  );
};
