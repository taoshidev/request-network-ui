import { getAuthUser } from "@/actions/auth";
import AccordionList from "@/components/accordion-list";
import { redirect } from "next/navigation";
import { questionsForRole } from "./faq-questions";
import EmailService from "@/services/email.service";
import { randomBytes } from "crypto";

export default async function HelpPage() {
  const user = await getAuthUser();
  const email = new EmailService();
  const attachments = [
    {
      filename: "request-network.png",
      path: `${process.cwd()}/src/assets/request-network.png`,
      cid: `${randomBytes(10).toString("hex")}-request-network.png`, //same cid value as in the html img src
    },
  ];

  email.send({
    to: "tomalperin@me.com",
    from: "tomalperin@me.com",
    reply: "tomalperin@me.com",
    template: "test",
    subject: "Test",
    templateVariables: {
      user: "Tom Alperin",
    },
    attachments,
  });

  if (!user) {
    redirect("/login");
  }

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
