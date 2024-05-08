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
      "How do I access data from a validator once I&apos;ve successfully registered with the Request Network?",
    content: (
      <>
        Once you&apos;ve successfully registered and make your first payment to
        the validator&apos;s erc-20 wallet received during registration, and the
        validator&apos;s endpoint is active you can start accessing your data.
        <br /> To test your endpoint use these shell commands: <br />
        <br />
        <div className="code">
          wget --quiet \<br />
          &emsp;--method GET \<br />
          &emsp;--header &apos;Accept: */*&apos; \<br />
          &emsp;--header &apos;Content-Type: application/json&apos; \<br />
          &emsp;--header &apos;x-taoshi-consumer-request-key:
          req_xxxxxxxxxxxxxxxxxxxxxxxx&apos; \<br />
          &emsp;--header &apos;Authorization: Bearer xxxx&apos; \<br />
          &emsp;--output-document \<br />
          &emsp;- https://testnet.taoshi.io/validator-checkpoint
        </div>
        <div className="code">
          curl -L -X GET &quot;https://testnet.taoshi.io/validator-checkpoint&quot; \
          <br />
          &emsp;-H &quot;Content-Type: application/json&quot; \<br />
          &emsp;-H &quot;x-taoshi-consumer-request-key: req_xxxxxxxxxxxxxxxxxxxxxxxx&quot;
          \<br />
          &emsp;-H &quot;Authorization: Bearer xxxx&quot;
        </div>
      </>
    ),
  },
];

export function questionsForRole(role) {
  return role === "validator" ? validatorQuestions : consumerQuestions;
}
