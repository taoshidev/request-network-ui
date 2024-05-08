import { HeaderHome } from "@/components/HeaderHome";
import ReactMarkdown from "react-markdown";
import { readFileSync } from "fs";
import { join } from "path";
import * as classes from "../documentation/page.module.css";
import React from "react";

export default function ContributingPage() {
  const filePath = join(process.cwd(), "public", "contributing.md");
  const markdown = readFileSync(filePath, "utf8");

  return (
    <div>
      <div className="bg-primary-500 mb-8">
        <div className="container max-w-5xl mx-auto mb-10">
          <HeaderHome />
        </div>
      </div>
      <div className="container mx-auto py-1 px-2 lg:px-20 pb-20">
        <div className={classes["markdown-container"]}>
          <ReactMarkdown children={markdown} />
        </div>
      </div>
    </div>
  );
}
