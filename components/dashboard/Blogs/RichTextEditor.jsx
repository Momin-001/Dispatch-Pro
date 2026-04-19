"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import {TextStyle} from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import Link from "@tiptap/extension-link";
import { FontFamily } from "@tiptap/extension-font-family";
import { useCallback, useEffect, useState } from "react";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link2,
  Link2Off,
  Subscript as SubscriptIcon,
  Superscript as SuperscriptIcon,
  Type,
  Palette,
  Highlighter,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { FontSize } from "./extensions/font-size";

const FONT_FAMILIES = [
  { label: "Default", value: "" },
  { label: "Inter", value: "Inter, sans-serif" },
  { label: "Arial", value: "Arial, sans-serif" },
  { label: "Georgia", value: "Georgia, serif" },
  { label: "Times New Roman", value: "'Times New Roman', serif" },
  { label: "Courier New", value: "'Courier New', monospace" },
  { label: "Verdana", value: "Verdana, sans-serif" },
];

const FONT_SIZES = [
  { label: "Default", value: "" },
  { label: "12px", value: "12px" },
  { label: "14px", value: "14px" },
  { label: "16px", value: "16px" },
  { label: "18px", value: "18px" },
  { label: "20px", value: "20px" },
  { label: "24px", value: "24px" },
  { label: "30px", value: "30px" },
  { label: "36px", value: "36px" },
];

function ToolbarButton({ active, disabled, onClick, title, children }) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex h-8 w-8 items-center justify-center rounded-md text-sm transition-colors",
        "hover:bg-muted text-foreground-light",
        active && "bg-primary-dark text-background hover:bg-primary-dark/80",
        disabled && "opacity-40 cursor-not-allowed"
      )}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span className="mx-1 h-6 w-px bg-border" />;
}

export function RichTextEditor({ value, onChange, placeholder = "Start writing your blog content..." }) {
  const [mounted, setMounted] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ link: false, underline: false }),
      Underline,
      TextStyle.configure({ types: ["heading", "paragraph", "textStyle"] }),
      FontFamily,
      FontSize,
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Subscript,
      Superscript,
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
      }),
    ],
    content: value || "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "tiptap-prose",
        "data-placeholder": placeholder,
      },
    },
    onUpdate: ({ editor: ed }) => {
      onChange?.(ed.getHTML());
    },
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync external value updates (e.g., when editing an existing blog and data loads later)
  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (value && value !== current) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [editor, value]);

  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href;
    const url = typeof window !== "undefined" ? window.prompt("Enter URL", previousUrl || "https://") : null;
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  if (!mounted || !editor) {
    return (
      <div className="rounded-lg border border-border bg-background">
        <div className="h-12 border-b border-border bg-muted/30" />
        <div className="h-[300px]" />
      </div>
    );
  }

  const currentFontFamily =
    editor.getAttributes("textStyle").fontFamily || "";
  const currentFontSize =
    editor.getAttributes("textStyle").fontSize || "";
  const currentColor = editor.getAttributes("textStyle").color || "#000000";
  const currentHighlight = editor.getAttributes("highlight").color || "#FFFF00";

  return (
    <div className="tiptap-editor rounded-lg border border-border bg-background">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 border-b border-border bg-muted/30 px-2 py-2">
        {/* Font Family */}
        <div className="flex items-center gap-1">
          <Type className="size-4 text-foreground-light" />
          <select
            className="h-8 rounded-md border border-border bg-background px-2 text-xs"
            value={currentFontFamily}
            onChange={(e) => {
              const v = e.target.value;
              if (!v) editor.chain().focus().unsetFontFamily().run();
              else editor.chain().focus().setFontFamily(v).run();
            }}
          >
            {FONT_FAMILIES.map((f) => (
              <option key={f.label} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </div>

        {/* Font Size */}
        <select
          className="h-8 rounded-md border border-border bg-background px-2 text-xs"
          value={currentFontSize}
          onChange={(e) => {
            const v = e.target.value;
            if (!v) editor.chain().focus().unsetFontSize().run();
            else editor.chain().focus().setFontSize(v).run();
          }}
        >
          {FONT_SIZES.map((s) => (
            <option key={s.label} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>

        <Divider />

        {/* Bold / Italic / Underline */}
        <ToolbarButton
          title="Bold"
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Italic"
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Underline"
          active={editor.isActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <UnderlineIcon className="size-4" />
        </ToolbarButton>

        <Divider />

        {/* Text Color */}
        <label
          title="Text color"
          className="relative inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-md hover:bg-muted text-foreground-light"
        >
          <Palette className="size-4" />
          <span
            className="absolute bottom-1 left-1 right-1 h-1 rounded"
            style={{ backgroundColor: currentColor }}
          />
          <input
            type="color"
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            value={currentColor}
            onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
          />
        </label>

        {/* Background / Highlight */}
        <label
          title="Highlight color"
          className="relative inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-md hover:bg-muted text-foreground-light"
        >
          <Highlighter className="size-4" />
          <span
            className="absolute bottom-1 left-1 right-1 h-1 rounded"
            style={{ backgroundColor: currentHighlight }}
          />
          <input
            type="color"
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            value={currentHighlight}
            onChange={(e) =>
              editor.chain().focus().toggleHighlight({ color: e.target.value }).run()
            }
          />
        </label>

        <Divider />

        {/* Alignment */}
        <ToolbarButton
          title="Align left"
          active={editor.isActive({ textAlign: "left" })}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
        >
          <AlignLeft className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Align center"
          active={editor.isActive({ textAlign: "center" })}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
        >
          <AlignCenter className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Align right"
          active={editor.isActive({ textAlign: "right" })}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
        >
          <AlignRight className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Justify"
          active={editor.isActive({ textAlign: "justify" })}
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
        >
          <AlignJustify className="size-4" />
        </ToolbarButton>

        <Divider />

        {/* Subscript / Superscript */}
        <ToolbarButton
          title="Subscript"
          active={editor.isActive("subscript")}
          onClick={() => editor.chain().focus().toggleSubscript().run()}
        >
          <SubscriptIcon className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Superscript"
          active={editor.isActive("superscript")}
          onClick={() => editor.chain().focus().toggleSuperscript().run()}
        >
          <SuperscriptIcon className="size-4" />
        </ToolbarButton>

        <Divider />

        {/* Link */}
        <ToolbarButton
          title="Add / edit link"
          active={editor.isActive("link")}
          onClick={setLink}
        >
          <Link2 className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Remove link"
          disabled={!editor.isActive("link")}
          onClick={() => editor.chain().focus().unsetLink().run()}
        >
          <Link2Off className="size-4" />
        </ToolbarButton>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}
