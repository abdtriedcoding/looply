import { useEffect, useState } from "react"

import { Editor } from "@tiptap/react"
import {
  Bold,
  Code,
  Heading1,
  Heading2,
  Italic,
  LinkIcon,
  List,
  ListOrdered,
  Paperclip,
  Quote,
  Redo,
  Send,
  Smile,
  Underline,
  Undo,
} from "lucide-react"

import { EditorLinkOptionsModal } from "@/components/editor-link-options-modal"
import { EmojiSelector } from "@/components/emoji-selector"
import { Hint } from "@/components/hint"
import { Button } from "@/components/ui/button"

import { cn } from "@/lib/utils"

export function EditorToolbar({
  editor,
  handleSend,
  fileRef,
  uploadedFilesCount = 0,
}: {
  editor: Editor
  handleSend: () => void
  fileRef: React.RefObject<HTMLInputElement | null>
  uploadedFilesCount?: number
}) {
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false)

  const openLinkOptions = () => {
    setIsLinkModalOpen(true)
  }

  const handleFileClick = () => {
    if (fileRef?.current) {
      fileRef.current.click()
    }
  }

  // Keyboard shortcuts
  useEffect(() => {
    if (!editor) return

    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl/Cmd + Enter to send
      if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        handleSend()
      }

      // Ctrl/Cmd + K to open link options
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        openLinkOptions()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [editor])

  return (
    <div className="border-border bg-muted/30 flex items-center gap-1 border-b p-2">
      <div className="flex items-center gap-1">
        <Hint label="Bold (Ctrl+B)">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={cn(
              "h-8 w-8 p-0",
              editor.isActive("bold")
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Bold className="h-4 w-4" />
          </Button>
        </Hint>

        <Hint label="Italic (Ctrl+I)">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={cn(
              "h-8 w-8 p-0",
              editor.isActive("italic")
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Italic className="h-4 w-4" />
          </Button>
        </Hint>

        <Hint label="Underline (Ctrl+U)">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={cn(
              "h-8 w-8 p-0",
              editor.isActive("underline")
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Underline className="h-4 w-4" />
          </Button>
        </Hint>

        <Hint
          label={
            uploadedFilesCount >= 5
              ? "Maximum 5 files reached"
              : "Upload Files (Images, PDFs, Documents)"
          }
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={handleFileClick}
            disabled={uploadedFilesCount >= 5}
            className={cn(
              "h-8 w-8 p-0",
              uploadedFilesCount >= 5
                ? "cursor-not-allowed opacity-50"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Paperclip className="h-4 w-4" />
          </Button>
        </Hint>

        <EmojiSelector
          hint="Insert Emoji"
          onEmojiSelect={(emoji) =>
            editor.chain().focus().insertContent(emoji).run()
          }
        >
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Smile className="h-4 w-4" />
          </Button>
        </EmojiSelector>
      </div>

      <div className="bg-border mx-1 h-6 w-px" />

      <div className="flex items-center gap-1">
        <Hint label="Heading 1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            className={cn(
              "h-8 w-8 p-0",
              editor.isActive("heading", { level: 1 })
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Heading1 className="h-4 w-4" />
          </Button>
        </Hint>

        <Hint label="Heading 2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={cn(
              "h-8 w-8 p-0",
              editor.isActive("heading", { level: 2 })
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Heading2 className="h-4 w-4" />
          </Button>
        </Hint>
      </div>

      <div className="bg-border mx-1 h-6 w-px" />

      <div className="flex items-center gap-1">
        <Hint label="Bullet List">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={cn(
              "h-8 w-8 p-0",
              editor.isActive("bulletList")
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <List className="h-4 w-4" />
          </Button>
        </Hint>

        <Hint label="Numbered List">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={cn(
              "h-8 w-8 p-0",
              editor.isActive("orderedList")
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
        </Hint>
      </div>

      <div className="bg-border mx-1 h-6 w-px" />

      <div className="flex items-center gap-1">
        <Hint label="Blockquote">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={cn(
              "h-8 w-8 p-0",
              editor.isActive("blockquote")
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Quote className="h-4 w-4" />
          </Button>
        </Hint>

        <Hint label="Code Block">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={cn(
              "h-8 w-8 p-0",
              editor.isActive("codeBlock")
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Code className="h-4 w-4" />
          </Button>
        </Hint>

        <Hint label="Link Options (Ctrl+K)">
          <Button
            variant="ghost"
            size="sm"
            onClick={openLinkOptions}
            className={cn(
              "h-8 w-8 p-0",
              editor.isActive("link")
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <LinkIcon className="h-4 w-4" />
          </Button>
        </Hint>
      </div>

      <div className="flex-1" />

      <div className="flex items-center gap-1">
        <Hint label="Undo (Ctrl+Z)">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="text-muted-foreground hover:text-foreground h-8 w-8 p-0 disabled:opacity-50"
          >
            <Undo className="h-4 w-4" />
          </Button>
        </Hint>

        <Hint label="Redo (Ctrl+Y)">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="text-muted-foreground hover:text-foreground h-8 w-8 p-0 disabled:opacity-50"
          >
            <Redo className="h-4 w-4" />
          </Button>
        </Hint>
      </div>

      <div className="bg-border mx-1 h-6 w-px" />

      <Hint label="Send message (Ctrl+Enter)">
        <Button
          size="sm"
          onClick={handleSend}
          disabled={!editor.getText().trim() && uploadedFilesCount === 0}
          className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-md px-4 py-2 disabled:opacity-50"
        >
          <Send className="mr-2 h-4 w-4" />
          Send
        </Button>
      </Hint>

      <EditorLinkOptionsModal
        editor={editor}
        isLinkModalOpen={isLinkModalOpen}
        setIsLinkModalOpen={setIsLinkModalOpen}
      />
    </div>
  )
}
