import React from "react";
import { Editor } from "@tinymce/tinymce-react";
import { EventHandler } from "@tinymce/tinymce-react/lib/cjs/main/ts/Events";

interface IRichTextEditorProps {
  onChange: EventHandler<unknown>;
  initialValue: string | null;
}

const RichTextEditor: React.FC<IRichTextEditorProps> = ({
  onChange,
  initialValue,
}) => {
  return (
    <Editor
      apiKey={process.env.NEXT_PUBLIC_TINY_MCE_API_KEY}
      init={{
        height: 600,
        plugins:
          "tinycomments mentions anchor autolink charmap image link lists media searchreplace table visualblocks wordcount mediaembed casechange export formatpainter permanentpen footnotes advtemplate advtable editimage tableofcontents mergetags powerpaste tinymcespellchecker autocorrect typography",
        toolbar:
          "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | align lineheight | tinycomments | checklist numlist bullist indent outdent | emoticons charmap | removeformat",
        tinycomments_mode: "embedded",
        tinycomments_author: "Author name",
        content_langs: [{ title: "French", code: "fr" }],
        language: "fr_FR",
        language_url: "/locales/fr/fr_FR.js",
        spellchecker_language: "fr_FR",
      }}
      initialValue={initialValue || ""}
      onChange={onChange}
    />
  );
};

export default RichTextEditor;
