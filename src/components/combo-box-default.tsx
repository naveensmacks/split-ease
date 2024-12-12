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
export function ComboBoxDefault({
  list,
  label,
  fieldValue,
  onChange,
  className,
}: {
  list: { value: string; label: string }[];
  label: string;
  fieldValue: string;
  onChange: (currentValue: string) => void;
  className?: string;
}) {
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
            {fieldValue ? (
              <span className="truncate">
                {list.find((item) => item.value === fieldValue)?.label}
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
              <CommandGroup>
                {list.map((item) => (
                  <CommandItem
                    key={item.value}
                    value={item.value}
                    onSelect={(currentValue) => {
                      const isChanged = !(currentValue === fieldValue);
                      if (isChanged) {
                        onChange(currentValue);
                        setOpen(false);
                      }
                    }}
                    keywords={[item.label]}
                  >
                    {item.label}
                    <CheckIcon
                      className={cn(
                        "ml-auto h-4 w-4",
                        fieldValue === item.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  );
}
