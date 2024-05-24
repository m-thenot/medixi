import React from "react";
import { Editor } from "@tinymce/tinymce-react";
import { EventHandler } from "@tinymce/tinymce-react/lib/cjs/main/ts/Events";

interface IRichTextEditorProps {
  onChange?: EventHandler<unknown>;
  report: string;
  isReadOnly?: boolean;
}

const RichTextEditor: React.FC<IRichTextEditorProps> = ({
  onChange = () => null,
  report,
  isReadOnly = false
}) => {
  return (
    <Editor
      apiKey={process.env.NEXT_PUBLIC_TINY_MCE_API_KEY}
      init={{
        ...(isReadOnly
          ? {
              max_width: 600,
              menubar: false,
              statusbar: false,
              readonly: true,
              init_instance_callback: (editor) => editor.mode.set("readonly")
            }
          : {
              width: 780
            }),
        height: 600,
        plugins: isReadOnly
          ? ""
          : "anchor autolink charmap image link lists media searchreplace table visualblocks wordcount",
        toolbar: isReadOnly
          ? ""
          : "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | align lineheight | tinycomments | checklist numlist bullist indent outdent | emoticons charmap | removeformat",
        tinycomments_mode: "embedded",
        tinycomments_author: "Author name",
        content_langs: [{ title: "French", code: "fr" }],
        language: "fr_FR",
        language_url: "/locales/fr/fr_FR.js",
        spellchecker_language: "fr_FR",
        content_style: "body { font-family: Arial; }"
      }}
      initialValue={report || ""}
      onChange={onChange}
    />
  );
};

export default RichTextEditor;
