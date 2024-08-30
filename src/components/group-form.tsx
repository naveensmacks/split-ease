"use client";
import React from "react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { ComboBox } from "./combo-box";
import { Button } from "./ui/button";
import { Controller, Path, useForm, UseFormSetError } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { groupFormSchema, TGroupForm } from "@/lib/validation";
import { useGroupContext } from "@/lib/hooks";
import Spinner from "./spinner";
import { useRouter } from "next/navigation";
import { setServerFieldErrors } from "@/lib/utils";
import { toast } from "sonner";

type GroupFormProps = {
  currencylist: { value: string; label: string }[];
  groupId?: string;
  type: "create" | "edit";
};
export default function GroupForm({
  currencylist,
  groupId,
  type,
}: GroupFormProps) {
  const isEditing = type === "edit";

  let groupInfo;
  if (isEditing && groupId) {
    const { getGroupFromList } = useGroupContext();
    groupInfo = getGroupFromList(groupId);
  }
  const {
    register,
    trigger,
    control,
    handleSubmit,
    setError,
    //isSubmitting will work for only On Submit I guess
    formState: { isSubmitting, errors },
    getValues,
    setValue,
  } = useForm<TGroupForm>({
    resolver: zodResolver(groupFormSchema),
    defaultValues: isEditing
      ? {
          groupName: groupInfo?.groupName,
          groupDescription: groupInfo?.groupDescription
            ? groupInfo?.groupDescription
            : undefined,
          currencyType: groupInfo?.currencyType,
          splitEase: groupInfo?.splitEase,
        }
      : {
          splitEase: true,
          currencyType: "US Dollar - USD",
        },
  });
  const { handleAddGroup } = useGroupContext();
  const router = useRouter();
  const onSubmit = async () => {
    console.log("isSubmitting: ", isSubmitting);
    const result = await trigger();
    if (!result) return;
    let groupData = getValues();
    console.log("groupData: ", groupData);
    const actionData = await handleAddGroup(groupData);
    console.log("isSubmitting: ", isSubmitting);
    if (actionData.isSuccess && actionData.data) {
      router.push(`/app/groups/create/${actionData.data.groupId}`);
      toast.success(
        isEditing
          ? "Group Info updated successfully"
          : "Group created successfully"
      );
    } else if (!actionData.isSuccess) {
      if (actionData.fieldErrors) {
        setServerFieldErrors(actionData.fieldErrors, setError);
      } else {
        toast.error(actionData.message);
      }
    }
  };
  return (
    <>
      <form
        className="relative flex flex-col bg-white sm:rounded-lg px-5 py-4 sm:my-2 border-b border-black/10 min-h-40"
        onSubmit={handleSubmit(onSubmit)}
      >
        {isSubmitting && <Spinner />}
        {!isSubmitting && (
          <>
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
              <Label htmlFor="splitEase" className="text-black">
                Split Ease{" "}
              </Label>

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
              <Button
                className="min-w-56 max-w-96 bg-opacity-85 rounded-md state-effects"
                disabled={isSubmitting}
              >
                {isEditing ? "Update group" : "Create group"}
              </Button>
            </div>
          </>
        )}
      </form>
    </>
  );
}
