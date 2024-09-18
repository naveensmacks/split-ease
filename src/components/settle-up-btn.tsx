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
  payerId: string;
  recepientId: string;
  amount: number;
  children: React.ReactNode;
};
export default function SettleUpBtn({
  payerId,
  recepientId,
  amount,
  children,
}: SettleUpBtnProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  return (
    <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
      <DialogTrigger asChild>
        <Button size={"sm"} type="button">
          {children}
        </Button>
      </DialogTrigger>

      <DialogContent className="py-6 px-3 rounded-md">
        <DialogHeader>
          <DialogTitle>Record a payment</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <SettleUpForm
          onFormSubmission={() => {
            flushSync(() => setIsFormOpen(false));
          }}
          payerId={payerId}
          recepientId={recepientId}
          amount={amount}
        />
      </DialogContent>
    </Dialog>
  );
}
