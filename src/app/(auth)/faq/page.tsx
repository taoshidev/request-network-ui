import { getAuthUser } from "@/actions/auth";
import AccordionList from "@/components/accordion-list";
import { redirect } from "next/navigation";
import { questionsForRole } from "./faq-questions";

export default async function HelpPage() {
  const user = await getAuthUser();

  if (!user) {
    redirect("/login");
  }

  const questions =
    user.user_metadata?.role === "validator"
      ? // validator questions
        [
          {
            title:
              "What do I do with the API key and secret after I register a new Validator?",
            content: (
              <>
                The key and secret should be copied to the request network
                server's environment variables.
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
        ]
      : // consumer questions
        [
          {
            title:
              "How do I access data from a validator once I've successfully registered with the Request Network?",
            content: (
              <>
                Once you've successfully registered and make your first payment
                to the validator's erc-20 wallet received during registration,
                and the validator's endpoint is active you can start accessing
                your data.
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
                  curl -L -X GET
                  "https://testnet.taoshi.io/validator-checkpoint" \<br />
                  &emsp;-H "Content-Type: application/json" \<br />
                  &emsp;-H "x-taoshi-consumer-request-key:
                  req_xxxxxxxxxxxxxxxxxxxxxxxx" \<br />
                  &emsp;-H "Authorization: Bearer xxxx"
                </div>
              </>
            ),
          },
        ];

  return (
    <div className="container max-w-5xl mx-auto mb-32">
      <div className="max-w-2xl mx-auto text-center mb-16">
        <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
        <p>
          Answers for
          {user.user_metadata?.role === "validator"
            ? " Validators"
            : " Consumers"}
          .
        </p>
      </div>
      <AccordionList items={questionsForRole(user?.user_metadata?.role)} />
    </div>
  );
}
