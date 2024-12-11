"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

// const frameworks = [
//     {
//         value: "next.js",
//         label: "Next.js",
//     },
//     {
//         value: "sveltekit",
//         label: "SvelteKit",
//     },
//     {
//         value: "nuxt.js",
//         label: "Nuxt.js",
//     },
//     {
//         value: "remix",
//         label: "Remix",
//     },
//     {
//         value: "astro",
//         label: "Astro",
//     },
//     {
//       value: "next.js1",
//       label: "Next.js",
//   },
//   {
//       value: "sveltekit1",
//       label: "SvelteKit",
//   },
//   {
//       value: "nuxt.js1",
//       label: "Nuxt.js",
//   },
//   {
//       value: "remix1",
//       label: "Remix",
//   },
//   {
//       value: "astro1",
//       label: "Astro",
//   },
// ]

type Option = {
  label: string;
  value: string;
}

type MultipleSelectorProps = {
  options: Option[]; // Array of options with label and value
  value: string[]; // Array of selected values
  setValue: React.Dispatch<React.SetStateAction<(string)[]>>; // State setter for selected values
};

export function MultipleSelector({options, value, setValue}:MultipleSelectorProps) {
    const [open, setOpen] = React.useState(false)

    const handleSetValue = (val: string) => {
        if (value.includes(val)) {
            value.splice(value.indexOf(val), 1);
            setValue(value.filter((item) => item !== val));
        } else {
            setValue(prevValue => [...prevValue, val]);
        }
    }

    return (
      <div>

        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="justify-between"
                    style={{width:"100%", height:"fit-content"}}
                >
                    <div className="flex flex-wrap gap-2 justify-start w-full">
                        {value?.length ?
                            value.map((val, i) => (
                                <div key={i} className="px-2 py-1 rounded-xl border bg-slate-200 text-xs font-medium ">
                                  {options.find((opiton:Option) => opiton.value === val)?.label}
                                </div>
                            ))
                            : "Select options..."}
                    </div>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0">
                <Command>
                    <CommandInput placeholder="Search options..." />
                    <CommandEmpty>No framework found.</CommandEmpty>
                    <CommandGroup>
                        <CommandList>
                            {options.map((opiton:Option) => (
                                <CommandItem
                                    key={opiton.value}
                                    value={opiton.value}
                                    onSelect={() => {
                                        handleSetValue(opiton.value)
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value.includes(opiton.value) ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {opiton.label}
                                </CommandItem>
                            ))}
                        </CommandList>
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
      </div>

    )
}
