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
      <DialogContent size="lg">
        <DialogHeader>
          <DialogTitle>{item?.name}</DialogTitle>
          <DialogDescription>{item?.description}</DialogDescription>
        </DialogHeader>
        <div className="mt-4">{item?.fullDemo}</div>
      </DialogContent>
    </Dialog>
  );
}
