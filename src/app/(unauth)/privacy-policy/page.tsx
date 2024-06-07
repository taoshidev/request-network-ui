import { HeaderHome } from "@/components/HeaderHome";
import * as classes from "../documentation/page.module.css";
import React from "react";
import { getAuthUser } from "@/actions/auth";
import Footer from "@/components/Footer";

export default async function TermsOfServicePage() {
  const user = await getAuthUser();
  const startLink = user ? "/dashboard" : "/login";

  return (
    <div className="bg-stone-100">
      <div className="bg-primary-500 mb-8">
        <div className="container max-w-5xl mx-auto mb-10">
          <HeaderHome startLink={startLink} />
        </div>
      </div>
      <div className="container mx-auto px-2 lg:px-20">
        <div className={classes["markdown-container"]}>
          <object
            style={{ height: "calc(100vh - 140px)", marginBottom: "25px" }}
            className="w-full"
            type="application/pdf"
            data="/request-network-privacy-policy.pdf#view=FitH&scrollbar=0&navpanes=0"
          >
            <p>
              File can not be displayed in browser.{" "}
              <a href="/request-network-privacy-policy.pdf">
                Request Network Privacy Policy
              </a>
            </p>
          </object>
        </div>
      </div>
      <div className="bg-white">
        <Footer />
      </div>
    </div>
  );
}
