import { useCallback, useMemo } from "react";
import { Box, Text } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { RichTextEditor, Link } from "@mantine/tiptap";
import { useEditor, BubbleMenu } from "@tiptap/react";
import Highlight from "@tiptap/extension-highlight";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Superscript from "@tiptap/extension-superscript";
import SubScript from "@tiptap/extension-subscript";
import { debounce } from "lodash";
import clsx from "clsx";

export function TextEditor<T>({
  onChange,
  editable = true,
  type = "RichTextEditor",
  prop = "",
  form,
  label,
  html,
}: {
  editable?: boolean;
  onChange?: (content: string) => void;
  type?: "RichTextEditor" | "BubbleEditor";
  prop?: string;
  form?: UseFormReturnType<Partial<T>>;
  label?: { text: string; required: boolean };
  html?: string;
}) {
  const editor = useEditor({
    editable,
    extensions: [
      StarterKit,
      Underline,
      Link,
      Superscript,
      SubScript,
      Highlight,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: form?.values?.[prop] || html || "Enter a description",
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      handleEditorChange(html);
      onChange?.(html);
    },
  });

  const handleEditorChangeDebounced = useMemo(() => {
    return debounce((html) => {
      form?.setFieldValue(prop, html);
    }, 300);
  }, [form, prop]);

  const handleEditorChange = useCallback(
    (html) => {
      handleEditorChangeDebounced(html);
    },
    [handleEditorChangeDebounced]
  );

  return (
    <Box>
      {label?.text && (
        <Text size="sm" className="mb-1">
          {label.text}
          {label.required && <span className="text-[#fa5252]"> *</span>}
        </Text>
      )}
      {type === "RichTextEditor" ? (
        <RichTextEditor editor={editor}>
          <RichTextEditor.Toolbar sticky stickyOffset={60}>
            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Bold />
              <RichTextEditor.Italic />
              <RichTextEditor.Underline />
              <RichTextEditor.Strikethrough />
              <RichTextEditor.ClearFormatting />
              <RichTextEditor.Highlight />
              <RichTextEditor.Code />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.H1 />
              <RichTextEditor.H2 />
              <RichTextEditor.H3 />
              <RichTextEditor.H4 />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Blockquote />
              <RichTextEditor.Hr />
              <RichTextEditor.BulletList />
              <RichTextEditor.OrderedList />
              <RichTextEditor.Subscript />
              <RichTextEditor.Superscript />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Link />
              <RichTextEditor.Unlink />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.AlignLeft />
              <RichTextEditor.AlignCenter />
              <RichTextEditor.AlignJustify />
              <RichTextEditor.AlignRight />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Undo />
              <RichTextEditor.Redo />
            </RichTextEditor.ControlsGroup>
          </RichTextEditor.Toolbar>
          <RichTextEditor.Content className="min-h-96" />
        </RichTextEditor>
      ) : (
        <RichTextEditor
          editor={editor}
          className={clsx(
            " text-sm",
            !editable ? "!border-none" : "!border-dashed !border-black"
          )}
        >
          {editor && (
            <BubbleMenu editor={editor}>
              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Bold />
                <RichTextEditor.Italic />
                <RichTextEditor.Link />
              </RichTextEditor.ControlsGroup>
            </BubbleMenu>
          )}
          <RichTextEditor.Content />
        </RichTextEditor>
      )}
      {form?.errors?.[prop] && (
        <Box className="pt-1 text-xs text-[#fa5252] mantine-TextInput-error">
          {form?.errors?.[prop]}
        </Box>
      )}
    </Box>
  );
}
