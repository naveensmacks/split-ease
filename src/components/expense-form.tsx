"use client";
import { useGroupContext } from "@/lib/hooks";
import { expenseSchema, TExpenseForm } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { ComboBox } from "./combo-box";
import { ExpenseType } from "@prisma/client";
import { DatePicker } from "./date-picker";
import { Button } from "./ui/button";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import H1 from "./h1";
import Decimal from "decimal.js";
import { toast } from "sonner";
import { setServerFieldErrors } from "@/lib/utils";

type ExpenseFormProps = {
  type: "create" | "edit";
};

export default function ExpenseForm({ type }: ExpenseFormProps) {
  const isEditing = type === "edit";
  const {
    selectedExpenseId,
    selectedGroup,
    getExpenseFromList,
    handleAddExpense,
  } = useGroupContext();
  const router = useRouter();
  let expenseinfo;
  if (isEditing && selectedExpenseId) {
    expenseinfo = getExpenseFromList(selectedExpenseId);
  }

  const expenseTypelist = Object.keys(ExpenseType).map((key) => ({
    value: key,
    label: key.charAt(0) + key.slice(1).toLowerCase(),
  }));

  const groupMemberList = selectedGroup
    ? selectedGroup.users.map((user) => ({
        value: user.userId,
        label: user.firstName + " " + user.lastName,
      }))
    : [];

  const memberList = selectedGroup ? selectedGroup.users : [];
  const defaultShares =
    memberList.length > 0
      ? memberList.map((user) => ({
          paidToId: user.userId,
          share: 1.0,
          amount: 0.0,
        }))
      : [];

  const {
    register,
    trigger,
    watch,
    control,
    handleSubmit,
    setError,
    //isSubmitting will work for only On Submit I guess
    formState: { isSubmitting, errors },
    getValues,
    setValue,
    reset,
  } = useForm<TExpenseForm>({
    resolver: zodResolver(expenseSchema),
    defaultValues:
      isEditing && expenseinfo
        ? {
            //prepopulate for edit scenario
          }
        : {
            expenseType: ExpenseType.PETROL,
            expenseDescription: "",
            expenseDate: new Date(),
            isSplitEqually: true,
            //when component re-renders default values will not be set again so need to use useffect
            //to set the values, because first time the memberList will be empty[] as it is async data fetching I guess
            shares: defaultShares,
          },
  });

  useEffect(() => {
    // useEffect hook to watch for changes in the memberList and reinitialize the form values when it updates
    if (memberList.length > 0) {
      const updatedShares = memberList.map((user) => ({
        paidToId: user.userId,
        share: 1,
        amount: 0.0,
      }));

      // Update the form values using setValue or reset
      reset({ shares: updatedShares });
    }
  }, [memberList, reset]);

  const handleIncrementShare = (index: number) => {
    const shares = watch("shares");
    const updatedShares = [...shares];
    updatedShares[index].share = Number(updatedShares[index].share) + 1;
    setValue("shares", updatedShares);
    recalculateShares();
  };

  const handleDecrementShare = (index: number) => {
    const shares = watch("shares");
    const updatedShares = [...shares];
    updatedShares[index].share = Math.max(0, updatedShares[index].share - 1); // Prevent going below 0
    updatedShares[index].amount = 0.0;
    setValue("shares", updatedShares);
    recalculateShares();
  };

  const recalculateShares = (
    shares = [...watch("shares")],
    totalAmount?: string
  ) => {
    let totalAmountDec;
    if (totalAmount) {
      totalAmountDec = new Decimal(totalAmount);
    } else {
      totalAmountDec = new Decimal(watch("amount"));
    }
    //console.log("totalAmountDec: ", totalAmountDec.toNumber());
    const isSplitEqually = watch("isSplitEqually");
    let unEqualShareAmounts = new Decimal(0);
    if (!isSplitEqually) {
      unEqualShareAmounts = shares.reduce((prevValue, share) => {
        if (share.amount && share.share === 0) {
          return prevValue.plus(new Decimal(share.amount));
        }
        return prevValue;
      }, new Decimal(0));
    }
    const totalShares = shares.reduce(
      (prevValue, share) => prevValue + share.share,
      0
    );
    //console.log("totalShares: ", totalShares);
    // Distribute amounts and round to 2 decimal places
    let i = 0;
    const newShares = shares.map((share) => {
      return {
        ...share,
        amount: share.share
          ? Number(
              new Decimal(share.share)
                .div(totalShares)
                .mul(new Decimal(totalAmountDec).minus(unEqualShareAmounts))
                .toDecimalPlaces(2)
            )
          : share.amount,
      };
    });
    //console.log("newShares: ", newShares);
    // Check if the total matches the original amount
    const sumOfShares = newShares.reduce(
      (sum, share) => sum.plus(share.amount),
      new Decimal(0)
    );
    //console.log("sumOfShares: ", sumOfShares.toNumber());
    const diff = totalAmountDec.minus(sumOfShares);
    //console.log("diff: ", diff.toNumber());
    // Adjust one share to account for rounding discrepancy
    if (!diff.isZero()) {
      for (const share of newShares) {
        if (share.share && share.amount) {
          share.amount = Number(
            new Decimal(share.amount).plus(diff).toDecimalPlaces(2)
          );
          //console.log("share.amount: ", share.amount);
          break;
        }
      }
    }

    setValue("shares", newShares);
  };

  const splitEqually = () => {
    const shares = watch("shares");
    const totalAmount = watch("amount");
    const eachAmount = totalAmount / shares.length;
    const newShares = shares.map((share) => ({
      ...share,
      share: 1,
      amount: eachAmount,
    }));
    setValue("shares", newShares);
  };

  const noOfMembersInvolved = () => {
    const shares = watch("shares");
    return shares.reduce((prevval, share) => {
      let involved = share.amount ? 1 : 0;
      return prevval + involved;
    }, 0);
  };

  const onSubmit = async () => {
    const result = await trigger();
    if (!result) return;
    let expenseData = getValues();
    console.log("expenseData: ", expenseData);
    let actionData;
    if (isEditing) {
      actionData = await handleAddExpense(expenseData);
    } else {
      actionData = await handleAddExpense(expenseData);
    }
    console.log("actionData: ", actionData);
    if (actionData.isSuccess && actionData.data) {
      toast.success(
        isEditing
          ? "Expense updated successfully"
          : "Expense added successfully"
      );
      //go back if editing
      if (isEditing) {
        router.back();
      } else {
        router.push(`/app/group/${selectedGroup?.groupId}/expenses`);
      }
    } else if (!actionData.isSuccess) {
      if (actionData.fieldErrors) {
        setServerFieldErrors(actionData.fieldErrors, setError);
      } else {
        toast.error(actionData.message);
      }
    }
  };

  console.log("errors: ", errors);

  return (
    <form
      className="flex flex-col p-4 rounded-lg bg-white border-b border-black/10 text-black gap-3"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="space-y-1">
        <Label htmlFor="expenseType">Expense Type</Label>
        <Controller
          control={control}
          name="expenseType"
          render={({ field }) => (
            <ComboBox
              list={expenseTypelist}
              type="expenseType"
              field={field}
              setValue={setValue}
            />
          )}
        ></Controller>
        {errors.expenseType && (
          <p className="text-red-500/85">{errors.expenseType.message}</p>
        )}
      </div>
      <div className="space-y-1">
        <Label htmlFor="expenseDescription">Expense Description</Label>
        <Input
          id="expenseDescription"
          {...register("expenseDescription")}
          placeholder="e.g. Dinner with friends"
        />
        {errors.expenseDescription && (
          <p className="text-red-500/85">{errors.expenseDescription.message}</p>
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
            onChange={(e) => {
              recalculateShares(undefined, e.target.value);
            }}
          />
          <span className="text-black/50">{selectedGroup?.currencyType}</span>
        </div>
        {errors.amount && (
          <p className="text-red-500/85">{errors.amount.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="paidById">Paid by</Label>
        <Controller
          control={control}
          name="paidById"
          render={({ field }) => (
            <ComboBox
              list={groupMemberList}
              type="paidById"
              field={field}
              setValue={setValue}
            />
          )}
        ></Controller>
        {errors.paidById && (
          <p className="text-red-500/85">{errors.paidById.message}</p>
        )}
      </div>
      <div className="space-y-1 flex flex-col">
        <Label htmlFor="expenseDate">Expense Date</Label>
        <Controller
          name="expenseDate"
          control={control}
          render={({ field }) => (
            <DatePicker value={field.value} onChange={field.onChange} />
          )}
        />
        {errors.expenseDate && (
          <p className="text-red-500/85">{errors.expenseDate.message}</p>
        )}
      </div>

      <div className="my-2 flex items-center gap-x-3">
        <Label htmlFor="isSplitEqually" className="text-black">
          Split Equally
        </Label>
        <Controller
          control={control}
          name="isSplitEqually"
          render={({ field }) => (
            <Switch
              checked={field.value}
              onCheckedChange={(e) => {
                field.onChange(e);
                if (e) {
                  splitEqually();
                }
              }}
              className="data-[state=checked]:bg-primecolor"
            />
          )}
        ></Controller>
        {errors.isSplitEqually && (
          <p className="text-red-500/85">{errors.isSplitEqually.message}</p>
        )}
      </div>

      <H1 className="text-black text-xl">
        Shares {noOfMembersInvolved() ? `(${noOfMembersInvolved()})` : ""}
      </H1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 ">
        {memberList.length > 0 &&
          memberList?.map((member, index) => (
            <div key={member.userId} className="flex flex-col">
              <div className="flex flex-col p-2 gap-2">
                <Label htmlFor="" className="w-full truncate">
                  {member.firstName + " " + member.lastName}
                </Label>
                <input
                  type="hidden"
                  {...register(`shares.${index}.paidToId`)}
                />
                <div className="flex">
                  <Input
                    {...register(`shares.${index}.amount`)}
                    type="number"
                    step={0.01}
                    placeholder="0.00"
                    onChange={(e) => {
                      if (watch("isSplitEqually")) {
                        setValue("isSplitEqually", false);
                      }
                      const amount = Number(e.target.value);
                      const shares = watch("shares");
                      shares[index].amount = amount;
                      shares[index].share = 0;
                      recalculateShares(shares);
                    }}
                  />
                  <div className="flex ml-2 justify-center items-center">
                    <Button
                      type="button"
                      size="icon"
                      className="w-6 h-6"
                      variant={"outline"}
                      onClick={() => {
                        handleDecrementShare(index);
                      }}
                    >
                      -
                    </Button>

                    <input
                      type="hidden"
                      {...register(`shares.${index}.share`)}
                    />
                    <div className="w-8 flex justify-center">
                      {watch(`shares.${index}.share`)
                        ? watch(`shares.${index}.share`) + "x"
                        : ""}
                    </div>

                    <Button
                      type="button"
                      size="icon"
                      className="w-6 h-6"
                      variant={"outline"}
                      onClick={() => {
                        handleIncrementShare(index);
                      }}
                    >
                      +
                    </Button>
                  </div>
                </div>
                {errors.shares &&
                  errors.shares[index] &&
                  errors.shares[index].amount && (
                    <p className="text-red-500/85">
                      {errors.shares[index].amount.message}
                    </p>
                  )}
              </div>
            </div>
          ))}
      </div>
      <Button className="rounded-lg mx-auto w-1/2" type="submit">
        Save
      </Button>
    </form>
  );
}
