import React from "react";
import * as classes from "../documentation/page.module.css";

export default async function TermsOfServicePage() {
  return (
    <div className="bg-stone-100">
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
    </div>
  );
}
