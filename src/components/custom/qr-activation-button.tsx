"use client";

import React, { useState } from "react";
import { QrCode } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useTranslation } from "@/providers/TranslationsProvider";

export function QrActivationButton() {
  const [open, setOpen] = useState(false);
  const { qrActivation } = useTranslation();

  return (
    <>
      <Button
        className="fixed right-8 bottom-8 z-50"
        size="icon"
        onClick={() => setOpen(true)}
        aria-label={qrActivation.openDialog}
      >
        <QrCode className="size-5" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{qrActivation.title}</DialogTitle>
            <p className="text-muted-foreground text-sm">
              {qrActivation.description}
            </p>
          </DialogHeader>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">
              {qrActivation.codeLabel}
            </label>
            <Input placeholder="XXXXXXXXXX" />
          </div>

          <DialogFooter className="flex gap-2 sm:justify-end">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              aria-label={qrActivation.cancel}
            >
              {qrActivation.cancel}
            </Button>
            <Button aria-label={qrActivation.activate}>
              {qrActivation.activate}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
