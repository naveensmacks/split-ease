import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import SettleUpForm from "./settle-up-form";
import { flushSync } from "react-dom";

type SettleUpBtnProps = {
  actionType: "add" | "edit";
  payerId: string;
  recepientId: string;
  amount: number;
  settleUpDescription?: string;
  settleUpDate?: Date;
  children: React.ReactNode;
};
export default function SettleUpBtn({
  actionType,
  payerId,
  recepientId,
  amount,
  settleUpDescription,
  settleUpDate,
  children,
}: SettleUpBtnProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  return (
    <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
      <DialogTrigger asChild>
        {actionType === "add" ? (
          <Button size={"sm"} type="button">
            {children}
          </Button>
        ) : (
          <Button variant={"realGhost"} asChild>
            {children}
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="py-6 px-3 rounded-md">
        <DialogHeader>
          <DialogTitle>
            {actionType === "add"
              ? "Record a payment"
              : "Edit the payment record"}
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <SettleUpForm
          onFormSubmission={() => {
            flushSync(() => setIsFormOpen(false));
          }}
          payerId={payerId}
          recepientId={recepientId}
          amount={amount}
          actionType={actionType}
          settleUpDescription={settleUpDescription}
          settleUpDate={settleUpDate}
        />
      </DialogContent>
    </Dialog>
  );
}
