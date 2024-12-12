import { ExpenseWithRelations } from "@/lib/types";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { ComboBoxDefault } from "./combo-box-default";
import { Input } from "./ui/input";

type ExpenseSearchFormProps = {
  allExpenses: ExpenseWithRelations[] | undefined;
  expenses: ExpenseWithRelations[] | undefined;
  setExpenses: React.Dispatch<
    React.SetStateAction<ExpenseWithRelations[] | undefined>
  >;
};
type TExpenseSearchForm = {
  searchText: string;
  sortBy: string;
};
export default function ExpenseSearchForm({
  allExpenses,
  expenses,
  setExpenses,
}: ExpenseSearchFormProps) {
  const { control, register, watch, setValue } = useForm<TExpenseSearchForm>({
    defaultValues: {
      searchText: "",
      sortBy: "updatedAtAsc",
    },
  });

  const sortByList = [
    { value: "updatedAtAsc", label: "Date ↑" },
    { value: "updatedAtDsc", label: "Date ↓" },
    { value: "amountAsc", label: "Amount ↑" },
    { value: "amountDsc", label: "Amount ↓" },
  ];

  const getSortedExpenses = (
    filteredExpenses: ExpenseWithRelations[] | undefined,
    sortBy: string
  ) => {
    if (!filteredExpenses) return [];
    return [
      ...filteredExpenses?.sort((a, b) => {
        switch (sortBy) {
          case "updatedAtAsc":
            return b.updatedAt.getTime() - a.updatedAt.getTime();
          case "updatedAtDsc":
            return a.updatedAt.getTime() - b.updatedAt.getTime();
          case "amountAsc":
            return b.amount - a.amount;
          case "amountDsc":
            return a.amount - b.amount;
          default:
            return b.updatedAt.getTime() - a.updatedAt.getTime();
        }
      }),
    ];
  };
  const handleSearch = (searchText: string) => {
    //const searchText = e.target.value;
    const sortBy = watch("sortBy");
    setValue("searchText", searchText);
    if (searchText === "") {
      setExpenses(getSortedExpenses(allExpenses, sortBy));
    } else {
      const filteredExpenses = allExpenses?.filter((expense) => {
        return (
          ("money".includes(searchText.toLowerCase()) &&
            expense.expenseDescription
              .toLowerCase()
              .includes("SettleUp Payment".toLowerCase())) ||
          ("transfer".includes(searchText.toLowerCase()) &&
            expense.expenseDescription
              .toLowerCase()
              .includes("SettleUp Payment".toLowerCase())) ||
          expense.expenseDescription
            .toLowerCase()
            .includes(searchText.toLowerCase()) ||
          expense.paidByUser.firstName
            .toLowerCase()
            .includes(searchText.toLowerCase()) ||
          expense.paidByUser.lastName
            ?.toLowerCase()
            .includes(searchText.toLowerCase()) ||
          expense.expenseType.toLowerCase().includes(searchText.toLowerCase())
        );
      });
      const sortedExpenses = getSortedExpenses(filteredExpenses, sortBy);
      setExpenses(sortedExpenses);
    }
  };

  const onComboBoxChange = (currentValue: string) => {
    setValue("sortBy", currentValue);
    const sortedExpenses = getSortedExpenses(expenses, currentValue);
    setExpenses(sortedExpenses);
  };
  return (
    <form
      className="flex gap-x-2 items-center m-2 sm:m-4 sm:mb-0 sm:w-3/4"
      onSubmit={(e) => e.preventDefault()}
    >
      <div className="flex-grow">
        <Input
          type="text"
          placeholder="Search"
          {...register("searchText")}
          onChange={(e) => handleSearch(e.target.value)}
          //write onChange after register to override default onChange provided my reat hook form register()
          //and dont forget to set the state updates manaually(eg: setValue("searchText", searchText))
        />
      </div>
      <div>
        <Controller
          control={control}
          name="sortBy"
          render={({ field }) => (
            <ComboBoxDefault
              list={sortByList}
              label="Sort By"
              fieldValue={field.value}
              onChange={(currentValue) => onComboBoxChange(currentValue)}
              className="opacity-60"
            />
          )}
        ></Controller>
      </div>
    </form>
  );
}
