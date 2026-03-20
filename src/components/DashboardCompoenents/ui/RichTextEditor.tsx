"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { useEffect } from "react"; // ១. បន្ថែម useEffect
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";

type Props = {
  value: string;
  onChange: (value: string) => void;
  onKeyDown?: (e: KeyboardEvent) => void;
};

export default function RichTextEditor({ value, onChange, onKeyDown }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: value,
    editorProps: {
      handleKeyDown: (view, event) => {
        if (onKeyDown) {
          onKeyDown(event);
        }
        return false;
      },
    },
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // ២. បន្ថែម useEffect នេះដើម្បីតាមដានការផ្លាស់ប្តូរ value ពីខាងក្រៅ
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (!editor) return null;

  return (
    <div className="rounded-lg border-gray-300 bg-slate-100/80 dark:border-gray-600 dark:bg-gray-700">
      {/* Toolbar - រក្សាដដែល */}
      <div className="flex flex-wrap items-center gap-1 border-b p-2 dark:border-gray-600">
         {/* ... (ប៊ូតុង Toolbar របស់អ្នក) ... */}
         <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className="editor-btn"><Bold size={16} /></button>
         <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className="editor-btn"><Italic size={16} /></button>
         <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className="editor-btn"><UnderlineIcon size={16} /></button>
         <div className="mx-1 h-5 w-px bg-gray-300 dark:bg-gray-500" />
         <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className="editor-btn"><List size={16} /></button>
         <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className="editor-btn"><ListOrdered size={16} /></button>
         <div className="mx-1 h-5 w-px bg-gray-300 dark:bg-gray-500" />
         <button type="button" onClick={() => editor.chain().focus().setTextAlign("left").run()} className="editor-btn"><AlignLeft size={16} /></button>
         <button type="button" onClick={() => editor.chain().focus().setTextAlign("center").run()} className="editor-btn"><AlignCenter size={16} /></button>
         <button type="button" onClick={() => editor.chain().focus().setTextAlign("right").run()} className="editor-btn"><AlignRight size={16} /></button>
      </div>

      <EditorContent
        editor={editor}
        className="prose prose-sm text-[16px] min-h-[100px] max-w-none p-4 text-gray-800 dark:prose-invert dark:text-gray-200 [&_li]:my-0 [&_ol]:my-0.5 [&_p]:my-0.5 [&_ul]:my-0.5"
      />
    </div>
  );
}