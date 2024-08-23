"use client";
import React from "react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { ComboBox } from "./combo-box";
import { Button } from "./ui/button";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { groupFormSchema, TGroupForm } from "@/lib/validation";
import { useGroupContext } from "@/lib/hooks";
import Spinner from "./spinner";

type GroupFormProps = {
  currencylist: { value: string; label: string }[];
};
export default function GroupForm({ currencylist }: GroupFormProps) {
  const {
    register,
    trigger,
    control,
    //isSubmitting will work for only On Submit I guess
    formState: { isSubmitting, errors },
    getValues,
    setValue,
  } = useForm<TGroupForm>({
    resolver: zodResolver(groupFormSchema),
    defaultValues: {
      splitEase: true,
      currencyType: "US Dollar - USD",
    },
  });
  const { handleAddGroup } = useGroupContext();
  return (
    <>
      {/* //TODO: cahnge to something else instead of spinner like useFormStatus */}
      {isSubmitting && <Spinner />}
      {!isSubmitting && (
        <form
          className="flex flex-col bg-white sm:rounded-lg px-5 py-4 sm:my-2 border-b border-black/10"
          action={async () => {
            const result = await trigger();
            if (!result) return;
            const groupData = getValues();
            console.log("groupData: ", groupData);
            const res = await handleAddGroup(groupData);
            console.log("res: ", res);
          }}
        >
          <div className="my-3">
            <Input
              id="groupName"
              {...register("groupName")}
              placeholder="Group Name"
            />
            {errors.groupName && (
              <p className="text-red-500/85">{errors.groupName.message}</p>
            )}
          </div>
          <div className="my-3">
            <Textarea
              id="groupDescription"
              {...register("groupDescription")}
              placeholder="Group Description"
              rows={3}
            />
            {errors.groupDescription && (
              <p className="text-red-500/85">
                {errors.groupDescription.message}
              </p>
            )}
          </div>
          <div className="my-3 flex justify-left items-center gap-x-3">
            <Label htmlFor="splitEase">Split Ease </Label>

            {/* <Switch
          id="splitEase"
          {...register("splitEase")}
          className="data-[state=checked]:bg-primecolor"
        /> */}
            <Controller
              control={control}
              name="splitEase"
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="data-[state=checked]:bg-primecolor"
                />
              )}
              //render={({ field }) => <input type="text" {...field} />}
            ></Controller>
            {errors.splitEase && (
              <p className="text-red-500/85">{errors.splitEase.message}</p>
            )}
          </div>

          <div className="my-4">
            <Controller
              control={control}
              name="currencyType"
              render={({ field }) => (
                <ComboBox
                  list={currencylist}
                  field={field}
                  setValue={setValue}
                />
              )}
              //render={({ field }) => <input type="text" {...field} />}
            ></Controller>
            {errors.currencyType && (
              <p className="text-red-500/85">{errors.currencyType.message}</p>
            )}
          </div>
          <div className="my-4 flex justify-center items-center">
            <Button className="min-w-56 max-w-96 bg-opacity-85 rounded-md state-effects">
              Create group
            </Button>
          </div>
        </form>
      )}
    </>
  );
}
