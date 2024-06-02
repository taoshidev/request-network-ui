import { HeaderHome } from "@/components/HeaderHome";
import ReactMarkdown from "react-markdown";
import { readFileSync } from "fs";
import { join } from "path";
import * as classes from "./page.module.css";
import React from "react";
import { generateSlug } from "@/utils/generate-slug";
import { getAuthUser } from "@/actions/auth";

export default async function DocumentationPage() {
  const filePath = join(process.cwd(), "public", "validator-instructions.md");
  const markdown = readFileSync(filePath, "utf8");
  const user = await getAuthUser();
  const startLink = user ? "/dashboard" : "/login";

  const MarkdownComponents: object = {
    h2: (props) => {
      const children = Array.isArray(props.children)
        ? props.children
        : [props.children];
      const heading = children
        .flatMap((element) =>
          typeof element === "string"
            ? element
            : element?.type !== undefined &&
              typeof element.props.children === "string"
            ? element.props.children
            : []
        )
        .join("");

      const slug = generateSlug(heading);

      return (
        <h2 id={slug}>
          <a href={`#${slug}`} {...props}></a>
        </h2>
      );
    },
    h3: (props) => {
      const children = Array.isArray(props.children)
        ? props.children
        : [props.children];
      const heading = children
        .flatMap((element) =>
          typeof element === "string"
            ? element
            : element?.type !== undefined &&
              typeof element.props.children === "string"
            ? element.props.children
            : []
        )
        .join("");

      const slug = generateSlug(heading);

      return (
        <h3 id={slug}>
          <a href={`#${slug}`} {...props}></a>
        </h3>
      );
    },
  };

  return (
    <div>
      <div className="bg-primary-500 mb-8">
        <div className="container max-w-5xl mx-auto mb-10">
          <HeaderHome startLink={startLink} />
        </div>
      </div>
      <div className="container mx-auto py-1 px-2 lg:px-20 pb-20">
        <div className={classes["markdown-container"]}>
          <ReactMarkdown components={MarkdownComponents}>
            {markdown}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
