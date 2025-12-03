import React, { useEffect, useRef } from "react";

const SummernoteEditor = ({ content, setContent, className }) => {
  const editorRef = useRef(null);

  useEffect(() => {
    $(editorRef.current).summernote({
      height: 200,
      callbacks: {
        onChange: function (contents) {
          if (contents !== content) {
            setContent(contents);
          }
        },
      },
    });

    $(editorRef.current).summernote("code", content);

    return () => {
      $(editorRef.current).summernote("destroy");
    };
  }, []); 

  // Update summernote content when `content` prop changes
  useEffect(() => {
    if (editorRef.current && $(editorRef.current).summernote("code") !== content) {
      $(editorRef.current).summernote("code", content);
    }
  }, [content]);

  return <textarea ref={editorRef} className={className} />;
};

export default SummernoteEditor;
