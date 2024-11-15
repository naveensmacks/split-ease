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
import {
  ControllerRenderProps,
  UseFormSetValue,
  FieldValues,
  Path,
  PathValue,
} from "react-hook-form";
export function ComboBox<TFieldValues extends FieldValues>({
  list,
  type,
  label,
  field,
  setValue,
  className,
}: {
  list: { value: string; label: string }[];
  type: Path<TFieldValues>;
  label: string;
  field: ControllerRenderProps<TFieldValues, Path<TFieldValues>>;
  setValue: UseFormSetValue<TFieldValues>;
  className?: string;
}) {
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
  const getPopularCurrencies = () => {
    return (
      <div>
        <span className="text-zinc-500 px-1">Popular</span>
        {popularCurrencies.map((item) => (
          <CommandItem
            key={item.value}
            value={item.value}
            onSelect={(currentValue) => {
              const newValue = currentValue === field.value ? "" : currentValue;
              //set "" to unselect item
              setValue(
                type,
                newValue as PathValue<TFieldValues, Path<TFieldValues>>
              );
              setOpen(false);
            }}
            keywords={[item.label]}
          >
            {item.label}
            <CheckIcon
              className={cn(
                "ml-auto h-4 w-4",
                field.value === item.value ? "opacity-100" : "opacity-0"
              )}
            />
          </CommandItem>
        ))}
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
            className={cn(
              "w-full justify-between rounded-md opacity-80",
              className
            )}
          >
            {field.value ? (
              <span className="truncate">
                {list.find((item) => item.value === field.value)
                  ? list.find((item) => item.value === field.value)?.label
                  : popularCurrencies.find((item) => item.value === field.value)
                      ?.label}
              </span>
            ) : (
              <span className="opacity-60">{`Select ${label}...`}</span>
            )}

            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-min-full p-0">
          <Command
            filter={(_, search, keywords) => {
              const labelValue = keywords?.join(" ");
              if (labelValue?.toLowerCase().includes(search.toLowerCase())) {
                return 1;
              }
              return 0;
            }}
          >
            <CommandInput placeholder={`Search ${label}...`} className="h-9" />
            <CommandList>
              <CommandEmpty>{`No ${label} found.`}</CommandEmpty>
              {type === "currencyType" && (
                <CommandGroup>{getPopularCurrencies()}</CommandGroup>
              )}
              <CommandGroup>
                {type === "currencyType" && (
                  <span className="text-zinc-500 px-1">Others</span>
                )}
                {list.map((item) => (
                  <CommandItem
                    key={item.value}
                    value={item.value}
                    onSelect={(currentValue) => {
                      const newValue =
                        currentValue === field.value ? "" : currentValue;
                      console.log("newValue: ", newValue);
                      setValue(
                        type,
                        newValue as PathValue<TFieldValues, Path<TFieldValues>>
                      );
                      setOpen(false);
                    }}
                    keywords={[item.label]}
                  >
                    {item.label}
                    <CheckIcon
                      className={cn(
                        "ml-auto h-4 w-4",
                        field.value === item.value ? "opacity-100" : "opacity-0"
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
