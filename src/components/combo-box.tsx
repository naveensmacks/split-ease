"use client";

import * as React from "react";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ControllerRenderProps, UseFormSetValue } from "react-hook-form";

export function ComboBox({
  list,
  type = "Currency",
  field,
  setValue,
}: {
  list: { value: string; label: string }[];
  type?: string;
  field: ControllerRenderProps<
    {
      groupName: string;
      groupDescription: string;
      currencyType: string;
      splitEase: boolean;
    },
    "currencyType"
  >;
  setValue: UseFormSetValue<{
    groupName: string;
    groupDescription: string;
    splitEase: boolean;
    currencyType: string;
  }>;
}) {
  const getPopularCurrencies = () => {
    const popularCurrencies = [
      {
        value: "USD",
        label: "US Dollar - USD",
      },
      {
        value: "INR",
        label: "Indian Rupee - INR",
      },
      {
        value: "EUR",
        label: "Euro - EUR",
      },
      {
        value: "GBP",
        label: "British Pound - GBP",
      },
    ];

    return (
      <div>
        <span className="text-zinc-500 px-1">Popular</span>
        {popularCurrencies.map((item) => (
          <CommandItem
            key={item.value}
            value={item.label}
            onSelect={(currentValue) => {
              //set "" to unselect item
              setValue(
                "currencyType",
                currentValue === field.value ? "" : currentValue
              );
              setOpen(false);
            }}
          >
            {item.label}
            <CheckIcon
              className={cn(
                "ml-auto h-4 w-4",
                field.value === item.label ? "opacity-100" : "opacity-0"
              )}
            />
          </CommandItem>
        ))}
        <span className="text-zinc-500 px-1">Others</span>
      </div>
    );
  };
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className="w-full justify-between rounded-md opacity-80"
          >
            {field.value ? (
              field.value
            ) : (
              <span className="opacity-60">{`Select ${type}...`}</span>
            )}
            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-min-full p-0">
          <Command>
            <CommandInput placeholder={`Search ${type}...`} className="h-9" />
            <CommandList>
              <CommandEmpty>{`No ${type} found.`}</CommandEmpty>
              <CommandGroup>
                {type === "Currency" && getPopularCurrencies()}
              </CommandGroup>
              <CommandGroup>
                {list.map((item) => (
                  <CommandItem
                    key={item.value}
                    value={item.label}
                    onSelect={(currentValue) => {
                      setValue(
                        "currencyType",
                        currentValue === field.value ? "" : currentValue
                      );
                      setOpen(false);
                    }}
                  >
                    {item.label}
                    <CheckIcon
                      className={cn(
                        "ml-auto h-4 w-4",
                        field.value === item.label ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {/* <input type="hidden" {...field} value={value} /> */}
    </>
  );
}
