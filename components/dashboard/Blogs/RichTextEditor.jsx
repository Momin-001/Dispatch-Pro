"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import Link from "@tiptap/extension-link";
import { FontFamily } from "@tiptap/extension-font-family";
import { useCallback, useEffect, useRef, useState } from "react";
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
  List,
  ListOrdered,
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

// All toolbar state in one object — snapshotted synchronously inside TipTap callbacks
const EMPTY_SNAPSHOT = {
  bold: false,
  italic: false,
  underline: false,
  bulletList: false,
  orderedList: false,
  subscript: false,
  superscript: false,
  link: false,
  alignLeft: false,
  alignCenter: false,
  alignRight: false,
  alignJustify: false,
  fontFamily: "",
  fontSize: "",
  color: "#000000",
  highlight: "#FFFF00",
  focused: false,
};

function snapshotFromEditor(ed) {
  return {
    bold: ed.isActive("bold"),
    italic: ed.isActive("italic"),
    underline: ed.isActive("underline"),
    bulletList: ed.isActive("bulletList"),
    orderedList: ed.isActive("orderedList"),
    subscript: ed.isActive("subscript"),
    superscript: ed.isActive("superscript"),
    link: ed.isActive("link"),
    alignLeft: ed.isActive({ textAlign: "left" }),
    alignCenter: ed.isActive({ textAlign: "center" }),
    alignRight: ed.isActive({ textAlign: "right" }),
    alignJustify: ed.isActive({ textAlign: "justify" }),
    fontFamily: ed.getAttributes("textStyle").fontFamily || "",
    fontSize: ed.getAttributes("textStyle").fontSize || "",
    color: ed.getAttributes("textStyle").color || "#000000",
    highlight: ed.getAttributes("highlight").color || "#FFFF00",
    focused: true,
  };
}

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

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Start writing your blog content...",
}) {
  const [mounted, setMounted] = useState(false);
  const [snap, setSnap] = useState(EMPTY_SNAPSHOT);

  // Stable ref so useEditor callbacks never go stale
  const snapRef = useRef(setSnap);
  snapRef.current = setSnap;

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
    // Single handler covers typing, formatting, AND cursor/selection moves
    onTransaction: ({ editor: ed }) => {
      snapRef.current(snapshotFromEditor(ed));
    },
    onFocus: ({ editor: ed }) => {
      snapRef.current(snapshotFromEditor(ed));
    },
    onBlur: () => {
      snapRef.current(EMPTY_SNAPSHOT);
    },
    onUpdate: ({ editor: ed }) => {
      onChange?.(ed.getHTML());
    },
  });

  useEffect(() => {
    setMounted(true);
  }, []);

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
    const url =
      typeof window !== "undefined"
        ? window.prompt("Enter URL", previousUrl || "https://")
        : null;
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

  return (
    <div className="tiptap-editor rounded-lg border border-border bg-background">
      <div className="flex flex-wrap items-center gap-1 border-b border-border bg-muted/30 px-2 py-2">

        {/* Font Family */}
        <div className="flex items-center gap-1">
          <Type className="size-4 text-foreground-light" />
          <select
            className="h-8 rounded-md border border-border bg-background px-2 text-xs"
            value={snap.fontFamily}
            onChange={(e) => {
              const v = e.target.value;
              if (!v) editor.chain().focus().unsetFontFamily().run();
              else editor.chain().focus().setFontFamily(v).run();
            }}
          >
            {FONT_FAMILIES.map((f) => (
              <option key={f.label} value={f.value}>{f.label}</option>
            ))}
          </select>
        </div>

        {/* Font Size */}
        <select
          className="h-8 rounded-md border border-border bg-background px-2 text-xs"
          value={snap.fontSize}
          onChange={(e) => {
            const v = e.target.value;
            if (!v) editor.chain().focus().unsetFontSize().run();
            else editor.chain().focus().setFontSize(v).run();
          }}
        >
          {FONT_SIZES.map((s) => (
            <option key={s.label} value={s.value}>{s.label}</option>
          ))}
        </select>

        <Divider />

        <ToolbarButton title="Bold" active={snap.bold}
          onClick={() => editor.chain().focus().toggleBold().run()}>
          <Bold className="size-4" />
        </ToolbarButton>
        <ToolbarButton title="Italic" active={snap.italic}
          onClick={() => editor.chain().focus().toggleItalic().run()}>
          <Italic className="size-4" />
        </ToolbarButton>
        <ToolbarButton title="Underline" active={snap.underline}
          onClick={() => editor.chain().focus().toggleUnderline().run()}>
          <UnderlineIcon className="size-4" />
        </ToolbarButton>

        <Divider />

        {/* Text Color */}
        <label title="Text color"
          className="relative inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-md hover:bg-muted text-foreground-light">
          <Palette className="size-4" />
          <span className="absolute bottom-1 left-1 right-1 h-1 rounded"
            style={{ backgroundColor: snap.color }} />
          <input type="color"
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            value={snap.color}
            onChange={(e) => editor.chain().focus().setColor(e.target.value).run()} />
        </label>

        {/* Highlight */}
        <label title="Highlight color"
          className="relative inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-md hover:bg-muted text-foreground-light">
          <Highlighter className="size-4" />
          <span className="absolute bottom-1 left-1 right-1 h-1 rounded"
            style={{ backgroundColor: snap.highlight }} />
          <input type="color"
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            value={snap.highlight}
            onChange={(e) =>
              editor.chain().focus().toggleHighlight({ color: e.target.value }).run()} />
        </label>

        <Divider />

        <ToolbarButton title="Align left" active={snap.alignLeft}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}>
          <AlignLeft className="size-4" />
        </ToolbarButton>
        <ToolbarButton title="Align center" active={snap.alignCenter}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}>
          <AlignCenter className="size-4" />
        </ToolbarButton>
        <ToolbarButton title="Align right" active={snap.alignRight}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}>
          <AlignRight className="size-4" />
        </ToolbarButton>
        <ToolbarButton title="Justify" active={snap.alignJustify}
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}>
          <AlignJustify className="size-4" />
        </ToolbarButton>

        <Divider />

        <ToolbarButton title="Bullet List" active={snap.bulletList}
          onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <List className="size-4" />
        </ToolbarButton>
        <ToolbarButton title="Ordered List" active={snap.orderedList}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          <ListOrdered className="size-4" />
        </ToolbarButton>

        <Divider />

        <ToolbarButton title="Subscript" active={snap.subscript}
          onClick={() => editor.chain().focus().toggleSubscript().run()}>
          <SubscriptIcon className="size-4" />
        </ToolbarButton>
        <ToolbarButton title="Superscript" active={snap.superscript}
          onClick={() => editor.chain().focus().toggleSuperscript().run()}>
          <SuperscriptIcon className="size-4" />
        </ToolbarButton>

        <Divider />

        <ToolbarButton title="Add / edit link" active={snap.link} onClick={setLink}>
          <Link2 className="size-4" />
        </ToolbarButton>
        <ToolbarButton title="Remove link" disabled={!snap.link}
          onClick={() => editor.chain().focus().unsetLink().run()}>
          <Link2Off className="size-4" />
        </ToolbarButton>

      </div>

      <EditorContent editor={editor} />
    </div>
  );
}