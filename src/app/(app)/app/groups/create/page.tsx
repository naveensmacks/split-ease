import GroupForm from "@/components/group-form";
import H1 from "@/components/h1";
import { getlistOfCurrencies } from "@/lib/server-utils";

export default async function page() {
  const currencies = await getlistOfCurrencies();
  const currencylist = currencies.map((item) => {
    return { value: item.code, label: item.name + " - " + item.code };
  });

  return (
    <>
      <div className="px-4 py-2 flex justify-between items-center">
        <H1 className="sm:my-2 text-xl sm:text-2xl text-white">
          Create a new group
        </H1>
      </div>
      <GroupForm currencylist={currencylist} type="create" />
    </>
  );
}
