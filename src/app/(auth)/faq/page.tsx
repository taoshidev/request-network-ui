import { getAuthUser } from "@/actions/auth";
import AccordionList from "@/components/accordion-list";
import { questionsForRole } from "./faq-questions";
import ClientRedirect from "@/components/ClientRedirect";

export default async function HelpPage() {
  const user = await getAuthUser();

  if (!user) return <ClientRedirect href="/login" message="Session expired..."/>;

  return (
    <div className="container max-w-5xl mx-auto mb-32">
      <div className="max-w-2xl mx-auto text-center mb-16">
        <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
        <p>
          Answers for
          {user?.user_metadata?.role === "validator"
            ? " Validators"
            : " Consumers"}
          .
        </p>
      </div>
      <AccordionList items={questionsForRole(user?.user_metadata?.role)} />
    </div>
// import HelpPageComponent from "@components/HelpPageComponent";

// export default async function HelpPage() {
//   const user = await getAuthUser();
//   // if (!user) {
//   //   redirect("/login");
//   // }
//   const questions = questionsForRole(user?.user_metadata?.role);

//   return (
//     <HelpPageComponent questionsForRole={questions} user={user} />
//     // <div className="container max-w-5xl mx-auto mb-32">
//     //   <div className="max-w-2xl mx-auto text-center mb-16">
//     //     <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
//     //     <p>
//     //       Answers for
//     //       {user.user_metadata?.role === "validator"
//     //         ? " Validators"
//     //         : " Consumers"}
//     //       .
//     //     </p>
//     //   </div>
//     //   <AccordionList items={questionsForRole(user?.user_metadata?.role)} />
//     // </div>
  );
}
