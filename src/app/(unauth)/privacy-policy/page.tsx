import { HeaderHome } from "@/components/HeaderHome";
import * as classes from "../documentation/page.module.css";
import React from "react";
import { getAuthUser } from "@/actions/auth";

export default async function TermsOfServicePage() {
  const user = await getAuthUser();
  const startLink = user ? "/dashboard" : "/login";

  return (
    <div>
      <div className="bg-primary-500 mb-8">
        <div className="container max-w-5xl mx-auto mb-10">
          <HeaderHome startLink={startLink} />
        </div>
      </div>
      <div className="container mx-auto px-2 lg:px-20 pb-20">
        <div className={classes["markdown-container"]}>
          <iframe
            className="w-full"
            style={{ height: "calc(100vh - 140px)", marginBottom: "15px" }}
            src="/request-network-privacy-policy.pdf#view=FitH&navpanes=0"
          />
        </div>
      </div>
    </div>
  );
}
