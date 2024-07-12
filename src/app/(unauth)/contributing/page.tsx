import React from "react";
import ReactMarkdown from "react-markdown";
import { readFileSync } from "fs";
import path, { join } from "path";
import * as classes from "../documentation/page.module.css";

export default async function ContributingPage() {
  const filePath = path.resolve("./public", "contributing.md");
  const markdown = readFileSync(filePath, "utf8");

  return (
    <div className="bg-stone-100">
      <div className="container mx-auto py-1 px-2 lg:px-20 pb-20">
        <div className={classes["markdown-container"]}>
          <ReactMarkdown>{markdown}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
