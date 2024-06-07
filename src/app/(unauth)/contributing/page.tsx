import { HeaderHome } from "@/components/HeaderHome";
import ReactMarkdown from "react-markdown";
import { readFileSync } from "fs";
import path, { join } from "path";
import * as classes from "../documentation/page.module.css";
import React from "react";
import { getAuthUser } from "@/actions/auth";
import Footer from "@/components/Footer";

export default async function ContributingPage() {
  const filePath = path.resolve('./public', 'contributing.md');
  const markdown = readFileSync(filePath, "utf8");
  const user = await getAuthUser();
  const startLink = user ? '/dashboard' : '/login';

  return (
    <div className="bg-stone-100">
      <div className="bg-primary-500 mb-8">
        <div className="container max-w-5xl mx-auto mb-10">
          <HeaderHome startLink={startLink} />
        </div>
      </div>
      <div className="container mx-auto py-1 px-2 lg:px-20 pb-20">
        <div className={classes["markdown-container"]}>
          <ReactMarkdown>{markdown}</ReactMarkdown>
        </div>
      </div>
      <div className="bg-white">
        <Footer />
      </div>
    </div>
  );
}
