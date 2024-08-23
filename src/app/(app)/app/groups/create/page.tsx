import GroupForm from "@/components/group-form";
import H1 from "@/components/h1";
import { getlistOfCurrencies } from "@/lib/server-utils";
import React from "react";

export default async function page() {
  const currencies = await getlistOfCurrencies();
  const currencylist = currencies.map((item) => {
    return { value: item.code, label: item.name + " - " + item.code };
  });

  return (
    <main className="flex flex-grow flex-col mb-4">
      <div className="max-w-[920px] w-full sm:p-3 mx-auto">
        <div className="px-4 pt-4 pb-2 flex justify-between items-center">
          <H1 className="sm:my-2 text-xl sm:text-2xl">Create a new group </H1>
        </div>
        <GroupForm currencylist={currencylist} />
      </div>
    </main>
  );
}
