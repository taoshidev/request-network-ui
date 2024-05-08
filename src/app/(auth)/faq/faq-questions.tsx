export const validatorQuestions = [
  {
    title:
      "What do I do with the API key and secret after I register a new Validator?",
    content: (
      <>
        The key and secret should be copied to the request network server&apos;s
        environment variables.
        <br />
        <br />
        <div className="code">
          TAOSHI_API_KEY=api_CNeztLeOdKzT3PMogtygSoKFHC76
          <br />
          TAOSHI_VALIDATOR_API_SECRET=mKyMO438DuCGF7U03iwjQVgTeFLUKjBDOw1n7akXLGMwSlOLXQFXm2UqoXPcbtvi
          <br />
        </div>
      </>
    ),
  },
];

export const consumerQuestions = [
  {
    title:
      "How do I access data from a validator once I've successfully registered with the Request Network?",
    content: (
      <>
        Once you've successfully registered and make your first payment to the
        validator's erc-20 wallet received during registration, and the
        validator's endpoint is active you can start accessing your data.
        <br /> To test your endpoint use these shell commands: <br />
        <br />
        <div className="code">
          wget --quiet \<br />
          &emsp;--method GET \<br />
          &emsp;--header 'Accept: */*' \<br />
          &emsp;--header 'Content-Type: application/json' \<br />
          &emsp;--header 'x-taoshi-consumer-request-key:
          req_xxxxxxxxxxxxxxxxxxxxxxxx' \<br />
          &emsp;--header 'Authorization: Bearer xxxx' \<br />
          &emsp;--output-document \<br />
          &emsp;- https://testnet.taoshi.io/validator-checkpoint
        </div>
        <div className="code">
          curl -L -X GET "https://testnet.taoshi.io/validator-checkpoint" \
          <br />
          &emsp;-H "Content-Type: application/json" \<br />
          &emsp;-H "x-taoshi-consumer-request-key: req_xxxxxxxxxxxxxxxxxxxxxxxx"
          \<br />
          &emsp;-H "Authorization: Bearer xxxx"
        </div>
      </>
    ),
  },
];

export function questionsForRole(role) {
  return role === "validator" ? validatorQuestions : consumerQuestions;
}
