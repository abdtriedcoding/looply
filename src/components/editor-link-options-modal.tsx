"use client"

import { useEffect, useState } from "react"

import { Editor } from "@tiptap/react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface LinkOptionsModalProps {
  editor: Editor
  isLinkModalOpen: boolean
  setIsLinkModalOpen: (open: boolean) => void
}

const isValidUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

const ensureProtocol = (url: string): string => {
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    return `https://${url}`
  }
  return url
}

export function EditorLinkOptionsModal({
  editor,
  isLinkModalOpen,
  setIsLinkModalOpen,
}: LinkOptionsModalProps) {
  const [linkUrl, setLinkUrl] = useState("")
  const [linkText, setLinkText] = useState("")

  const isLinkActive = editor.isActive("link")
  const currentLinkHref = editor.getAttributes("link").href || ""

  useEffect(() => {
    if (isLinkModalOpen) {
      const { from, to } = editor.state.selection
      const selectedText = editor.state.doc.textBetween(from, to, " ")

      if (isLinkActive) {
        // For existing links, use stored attributes
        setLinkUrl(currentLinkHref)
        setLinkText(selectedText)
      } else {
        // For new links, use selected text
        setLinkText(selectedText)
        setLinkUrl("")
      }
    }
  }, [isLinkModalOpen, editor, isLinkActive, currentLinkHref])

  const handleClose = () => {
    setLinkUrl("")
    setLinkText("")
    setIsLinkModalOpen(false)
  }

  const handleSubmit = () => {
    if (!linkUrl.trim()) {
      toast.error("URL is required")
      return
    }

    const urlWithProtocol = ensureProtocol(linkUrl.trim())

    if (!isValidUrl(urlWithProtocol)) {
      toast.error("Please enter a valid URL")
      return
    }

    const displayText = linkText.trim() || urlWithProtocol

    const { from, to } = editor.state.selection

    editor.chain().focus()

    if (isLinkActive) {
      editor
        .chain()
        .deleteRange({ from, to })
        .insertContent({
          type: "text",
          text: displayText,
          marks: [
            {
              type: "link",
              attrs: {
                href: urlWithProtocol,
                target: "_blank",
                rel: "noopener noreferrer",
              },
            },
          ],
        })
        .run()
    } else {
      editor
        .chain()
        .insertContent({
          type: "text",
          text: displayText,
          marks: [
            {
              type: "link",
              attrs: {
                href: urlWithProtocol,
                target: "_blank",
                rel: "noopener noreferrer",
              },
            },
          ],
        })
        .run()
    }

    handleClose()
  }

  const handleRemoveLink = () => {
    editor.chain().focus().unsetLink().run()
    handleClose()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <Dialog open={isLinkModalOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isLinkActive ? "Edit Link" : "Add Link"}</DialogTitle>
          <DialogDescription>
            {isLinkActive
              ? "Update the link URL and text."
              : "Enter the URL and optional link text."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="link-text" className="text-right">
              Text
            </Label>
            <Input
              id="link-text"
              value={linkText}
              onChange={(e) => setLinkText(e.target.value)}
              placeholder="Link text (optional)"
              className="col-span-3"
              onKeyDown={handleKeyDown}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="link-url" className="text-right">
              URL
            </Label>
            <Input
              id="link-url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://example.com"
              className="col-span-3"
              onKeyDown={handleKeyDown}
            />
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          {isLinkActive && (
            <Button
              variant="destructive"
              onClick={handleRemoveLink}
              className="mr-auto"
            >
              Remove Link
            </Button>
          )}
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {isLinkActive ? "Update Link" : "Add Link"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
