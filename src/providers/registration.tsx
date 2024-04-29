import { createContext, useContext, ReactElement } from "react";
import { useLocalStorage } from "@mantine/hooks";

export interface RegistrationData {
  appName: string;
  consumerApiUrl: string;
  subnet: any;
  validator: any;
  currentStep: number;
}

type ProviderValue = {
  registrationData: RegistrationData;
  updateData: (data: Partial<RegistrationData>) => void;
};

export const defaultContextValue: ProviderValue = {
  registrationData: {
    appName: "",
    consumerApiUrl: "",
    subnet: null,
    validator: null,
    currentStep: 0,
  },
  updateData: () => {},
};

const RegistrationContext = createContext<ProviderValue>(defaultContextValue);

export const useRegistration = () => {
  const context = useContext(RegistrationContext);
  if (!context) {
    throw new Error(
      "useRegistration must be used within a RegistrationProvider"
    );
  }
  return context;
};

export const RegistrationProvider = ({
  children,
}: {
  children: ReactElement;
}) => {
  const [registrationData, setRegistrationData] =
    useLocalStorage<RegistrationData>({
      key: "_reg_data",
      defaultValue: defaultContextValue.registrationData,
      getInitialValueInEffect: true,
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
