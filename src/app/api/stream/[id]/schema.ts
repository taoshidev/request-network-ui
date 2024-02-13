import Ajv, { JSONSchemaType } from "ajv";
import addFormats from "ajv-formats";

interface Data {
  id: number;
  name: string;
  email: string;
}

export interface RequestQuery {
  message: number;
  data: Data;
}

export const schema: JSONSchemaType<RequestQuery> = {
  type: "object",
  properties: {
    message: { type: "number" },
    data: {
      type: "object",
      properties: {
        id: { type: "number" },
        name: { type: "string" },
        email: { type: "string" },
      },
      required: ["id", "name"],
    },
  },
  required: ["data", "message"],
  additionalProperties: true,
};

const ajv = new Ajv();

addFormats(ajv);

export const isValid = ajv.compile(schema);
