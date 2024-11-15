import GroupForm from "@/components/group-form";
import H1 from "@/components/h1";
import { getlistOfCurrencies } from "@/lib/server-utils";

type EditGroupInfoProps = {
  params: { slug: string };
};

export default async function EditGroupInfo({ params }: EditGroupInfoProps) {
  const slug = params.slug;
  const currencies = await getlistOfCurrencies();
  const currencylist = currencies.map((item) => {
    return { value: item.code, label: item.name + " - " + item.code };
  });

  return (
    <>
      <div className="px-4 py-2 flex justify-between items-center">
        <H1 className="sm:my-2 text-xl sm:text-2xl text-white">
          Edit Group Info
        </H1>
      </div>
      <GroupForm currencylist={currencylist} groupId={slug} type="edit" />
    </>
  );
}
