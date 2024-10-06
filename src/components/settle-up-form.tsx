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

type PetFormProps = {
  onFormSubmission: () => void;
  payerId: string;
  recepientId: string;
  amount: number;
};

export default function SettleUpForm({
  onFormSubmission,
  payerId,
  recepientId,
  amount,
}: PetFormProps) {
  const { selectedGroup } = useGroupContext();
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

  /*
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newPet = {
      name: formData.get("name") as string,
      ownerName: formData.get("ownerName") as string,
      imageUrl:
        (formData.get("imageUrl") as string) ||
        "https://bytegrad.com/course-assets/react-nextjs/pet-placeholder.png",
      age: +(formData.get("age") as string),
      notes: formData.get("notes") as string,
    };
    if (isEditing) {
      const editedPet = { ...newPet, id: selectedPet?.id as string };
      handleEditPet(editedPet);
    } else {
      handleAddPet(newPet);
    }
  };
  */

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
    defaultValues: {
      payerId,
      recepientId,
      amount,
      settleUpDate: new Date(),
    },
  });
  return (
    <form
      action={async () => {
        //trigger validation of all fields since no arg is passed, if array of fieldNames is passed it will validate only those
        const result = await trigger();
        if (!result) return;

        onFormSubmission();

        const petData = getValues();
        // petData.imageUrl = petData.imageUrl || DEFAULT_PET_IMAGE;
        // if (isEditing) {
        //   await handleEditPet(selectedPet!.id, petData);
        // } else {
        //   await handleAddPet(petData);
        // }
      }}
      className="flex flex-col space-y-3"
    >
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
          {errors.payerId && (
            <p className="text-red-500/85">{errors.payerId.message}</p>
          )}
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
          {errors.recepientId && (
            <p className="text-red-500/85">{errors.recepientId.message}</p>
          )}
        </div>
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
