import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui";
import type { ShowcaseItem } from "../types";

export type ShowcaseDialogProps = {
  item: ShowcaseItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ShowcaseDialog({ item, open, onOpenChange }: ShowcaseDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="lg" className="!p-0 flex max-h-[80vh] flex-col">
        <DialogHeader className="border-foreground/10 border-b p-6">
          <DialogTitle>{item?.name}</DialogTitle>
          <DialogDescription>{item?.description}</DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto p-6">{item?.fullDemo}</div>
      </DialogContent>
    </Dialog>
  );
}
