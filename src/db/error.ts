import { toPlainObject } from "@/utils/sanitize";
import { filterData } from "@/utils/sanitize";
export interface DatabaseResponseType {
  message: string;
  code?: string;
  data?: any;
  error?: any;
}
// PostgreSQL Error Codes enum
export enum DatabaseErrorCode {
  UniqueViolation = "23505",
  ExecConstraints = "23502",
  // ...
}

export const parseResult = (
  result: any,
  props?: { filter: Array<string> }
): DatabaseResponseType => {
  const { filter = [] } = props || {};
  const data = filter.length > 0 ? filterData(result, filter) : result;
  return {
    message: result?.message || "Database action succeeded.",
    code: result?.code || 200,
    data,
  };
};

export const parseError = (error: any): DatabaseResponseType => {
  let errorMessage = "An unexpected error occurred.";

  const parsedError = toPlainObject(error);

  switch (parsedError.code) {
    case DatabaseErrorCode.UniqueViolation:
      errorMessage = prepareErrorMessage(parsedError);
      break;
    case DatabaseErrorCode.ExecConstraints:
      errorMessage = 'Failing row contains null values.';
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
    case "endpoints_validator_id_subnet_id_unique":
      return "An endpoint with this validator and subnet already exists.";
    case "endpoints_url_unique":
      return "The url endpoint already exists.";
    case "validators_base_api_url_unique":
      return "A validator with this base api url already exists. Try a different url";
    case "validators_name_unique":
      return "A validator with this name already exists. Try a different name."
    default:
      return `Cannot process database action on table ${error?.table_name}`;
  }
};
