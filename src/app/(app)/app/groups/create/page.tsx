import { Combobox } from "@/components/combo-box";
import H1 from "@/components/h1";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import React from "react";

export default function page() {
  const list = [
    {
      value: "USD",
      label: "USD",
    },
    {
      value: "INR",
      label: "INR",
    },
    {
      value: "EUR",
      label: "EUR",
    },
  ];
  return (
    <main className="flex flex-grow flex-col mb-4">
      <div className="max-w-[920px] w-full sm:p-3 mx-auto">
        <div className="px-4 pt-4 pb-2 flex justify-between items-center">
          <H1 className="sm:my-2 text-xl sm:text-2xl">Create a new group </H1>
        </div>
        <form className="flex flex-col bg-white sm:rounded-lg px-5 py-4 sm:my-2 border-b border-black/10">
          <div className="my-3">
            <Input placeholder="Group Name" />
          </div>
          <div className="my-3">
            <Textarea
              id="groupDescription"
              name="groupDescription"
              placeholder="Group Description"
              rows={3}
            />
          </div>
          <div className="my-3 flex justify-left items-center gap-x-3">
            <Label htmlFor="splitEase">Split Ease </Label>
            <Switch
              id="splitEase"
              className="data-[state=checked]:bg-primecolor"
            />
          </div>
          <div className="my-4">
            <Combobox list={list} />
          </div>
          <div className="my-4 flex justify-center items-center">
            <Button className="min-w-56 max-w-96 bg-opacity-85 rounded-md">
              Create group
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
