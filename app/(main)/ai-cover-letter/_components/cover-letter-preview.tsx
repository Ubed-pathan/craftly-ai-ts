"use client";

import React from "react";
import MDEditor from "@uiw/react-md-editor";

export default function CoverLetterPreview({ content }: { content?: string | null }) {
  return (
    <div className="py-4">
      <MDEditor value={content ?? ""} preview="preview" height={700} />
    </div>
  );
}
