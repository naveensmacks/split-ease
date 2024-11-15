"use client";
import { useGroupContext } from "@/lib/hooks";
import React, { useMemo } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { settleUpFormSchema, TSettleUpForm } from "@/lib/validation";
import DisplayInitials from "./display-initials";
import { ThickArrowRightIcon } from "@radix-ui/react-icons";
import { ComboBox } from "./combo-box";
import { DatePicker } from "./date-picker";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { setServerFieldErrors } from "@/lib/utils";

type SettleUpFormProps = {
  actionType: "add" | "edit";
  onFormSubmission: () => void;
  payerId: string;
  recepientId: string;
  amount: number;
  settleUpDescription?: string;
  settleUpDate?: Date;
};

export default function SettleUpForm({
  actionType,
  onFormSubmission,
  payerId,
  recepientId,
  amount,
  settleUpDescription,
  settleUpDate,
}: SettleUpFormProps) {
  const { selectedGroup, handleAddPayment, handleEditPayment } =
    useGroupContext();
  const isEditing = actionType === "edit";
  const payer = selectedGroup?.users.find((user) => user.userId === payerId);

  const recepient = selectedGroup?.users.find(
    (user) => user.userId === recepientId
  );

  const memberList = useMemo(
    () => (selectedGroup ? selectedGroup.users : []),
    [selectedGroup]
  );

  const memberListOptions = memberList.map((user) => ({
    value: user.userId,
    label: user.firstName + " " + user.lastName,
  }));

  const {
    register,
    control,
    trigger,
    getValues,
    setValue,
    handleSubmit,
    setError,
    formState: { isSubmitting, errors },
  } = useForm<TSettleUpForm>({
    resolver: zodResolver(settleUpFormSchema),
    defaultValues: isEditing
      ? { payerId, recepientId, amount, settleUpDate, settleUpDescription }
      : {
          payerId,
          recepientId,
          amount,
          settleUpDate: new Date(),
        },
  });

  const onSubmit = async () => {
    const result = await trigger();
    if (!result) return;
    let paymentData = getValues();
    console.log("PaymentData: ", paymentData);
    let actionData;
    if (isEditing) {
      actionData = await handleEditPayment(paymentData);
    } else {
      actionData = await handleAddPayment(paymentData);
    }

    console.log("actionData: ", actionData);
    if (actionData.isSuccess && "data" in actionData && actionData.data) {
      if (isEditing) {
        toast.success("Edited the payment successfully");
      } else {
        toast.success("Recorded a payment successfully");
      }
      // router.push(`/app/group/${selectedGroup?.groupId}/expenses`);
      onFormSubmission();
    } else if (!actionData.isSuccess) {
      if ("fieldErrors" in actionData && actionData.fieldErrors) {
        setServerFieldErrors(actionData.fieldErrors, setError);
      } else if ("message" in actionData && actionData.message) {
        toast.error(actionData.message);
      }
    }
  };

  return (
    <form className="flex flex-col space-y-3" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex space-x-3 justify-center items-center">
        {payer && (
          <DisplayInitials
            firstName={payer?.firstName}
            lastName={payer?.lastName}
          />
        )}
        {/* <DoubleArrowRightIcon className="w-16 h-16" /> */}
        <ThickArrowRightIcon className="w-16 h-16" />
        {recepient && (
          <DisplayInitials
            firstName={recepient?.firstName}
            lastName={recepient?.lastName}
          />
        )}
      </div>
      <div className="flex items-center justify-between sm:justify-center space-x-2">
        <div className="space-y-1 w-[150px]">
          <Controller
            control={control}
            name="payerId"
            render={({ field }) => (
              <ComboBox
                list={memberListOptions}
                type="payerId"
                label="payer"
                field={field}
                setValue={setValue}
                className="text-xs"
              />
            )}
          ></Controller>
        </div>
        <span className="text-primecolor">{" paid "}</span>
        <div className="space-y-1 w-[150px]">
          <Controller
            control={control}
            name="recepientId"
            render={({ field }) => (
              <ComboBox
                list={memberListOptions}
                type="recepientId"
                label="recepient"
                field={field}
                setValue={setValue}
                className="text-xs"
              />
            )}
          ></Controller>
        </div>
      </div>
      <div>
        {errors.payerId && (
          <p className="text-red-500/85">{errors.payerId.message}</p>
        )}
        {errors.recepientId && (
          <p className="text-red-500/85">{errors.recepientId.message}</p>
        )}
      </div>
      <div className="space-y-1">
        <Label htmlFor="amount">Amount</Label>
        <div className="flex gap-2 justify-between items-center">
          <Input
            id="amount"
            {...register("amount")}
            type="number"
            step={0.01}
            placeholder="0.00"
          />
          <span className="text-black/50">{selectedGroup?.currencyType}</span>
        </div>
        {errors.amount && (
          <p className="text-red-500/85">{errors.amount.message}</p>
        )}
      </div>

      <div className="space-y-1 flex flex-col">
        <Label htmlFor="settleUpDate">Paid on</Label>
        <Controller
          name="settleUpDate"
          control={control}
          render={({ field }) => (
            <DatePicker value={field.value} onChange={field.onChange} />
          )}
        />
        {errors.settleUpDate && (
          <p className="text-red-500/85">{errors.settleUpDate.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="settleUpDescription">Notes</Label>
        <Input
          id="settleUpDescription"
          {...register("settleUpDescription")}
          placeholder="e.g. Paid through cash"
        />
        {errors.settleUpDescription && (
          <p className="text-red-500/85">
            {errors.settleUpDescription.message}
          </p>
        )}
      </div>

      <Button className="mt-5 self-end" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Recording a payment..." : "Save"}
      </Button>
    </form>
  );
}
