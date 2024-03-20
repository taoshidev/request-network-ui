import { toPlainObject } from "@/utils/sanitize";

export interface DatabaseResponseType {
  message: string;
  code?: string;
  data?: any;
  error?: any;
}
// PostgreSQL Error Codes enum
export enum DatabaseErrorCode {
  UniqueViolation = "23505",
  // ...
}

// TODO: there's opportunity to refine this more
export const parseResult = (result: any): DatabaseResponseType => {
  return {
    message: result?.message || "Database action succeeded.",
    code: result?.code || 200,
    data: result,
  };
};

export const parseError = (error: any): DatabaseResponseType => {
  let errorMessage = "An unexpected error occurred.";

  const parsedError = toPlainObject(error);

  switch (parsedError.code) {
    case DatabaseErrorCode.UniqueViolation:
      errorMessage = prepareErrorMessage(parsedError);
      break;
    // ...
  }

  return {
    message: errorMessage,
    code: error.code,
    error: parsedError,
  };
};

const prepareErrorMessage = (error: any): string => {
  switch (error.constraint_name) {
    case "endpoints_validator_subnet_unique":
      return "An endpoint with this validator and subnet already exists.";
    default:
      return `Cannot process database action on table ${error?.table_name}`;
  }
};
