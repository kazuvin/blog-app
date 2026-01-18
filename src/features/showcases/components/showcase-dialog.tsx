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
      <DialogContent size="lg" className="flex max-h-[80vh] flex-col">
        <DialogHeader>
          <DialogTitle>{item?.name}</DialogTitle>
          <DialogDescription>{item?.description}</DialogDescription>
        </DialogHeader>
        <div className="mt-4 flex-1 overflow-y-auto">{item?.fullDemo}</div>
      </DialogContent>
    </Dialog>
  );
}
