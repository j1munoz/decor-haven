"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
  CommandEmpty,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";

type Tag = { id: number; name: string };

export default function TagSelector({
  selectedTags,
  setSelectedTags,
}: {
  selectedTags: string[];
  setSelectedTags: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const supabase = createClient();
  const [tags, setTags] = useState<Tag[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchTags = async () => {
      const { data } = await supabase.from("tags").select("name, id");
      if (data) setTags(data);
    };
    fetchTags();
  }, [supabase]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  return (
    <div className="flex flex-col gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          asChild
          className="bg-decor-beige-100 hover:bg-decor-olive-600"
        >
          <Button variant="outline" className="w-1/2 justify-between">
            {selectedTags.length > 0
              ? `${selectedTags.length} tag(s) selected`
              : "Select tags"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[250px] p-0">
          <Command>
            <CommandInput placeholder="Search tags..." />
            <CommandList>
              <CommandEmpty>No tags found.</CommandEmpty>
              {tags.map((tag) => (
                <CommandItem
                  key={tag.id}
                  onSelect={() => toggleTag(tag.name)}
                  className={
                    selectedTags.includes(tag.name)
                      ? "bg-green-100 text-green-700"
                      : ""
                  }
                >
                  {tag.name}
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <div className="flex flex-wrap gap-2">
        {selectedTags.map((tag) => (
          <Badge
            key={tag}
            className="cursor-pointer bg-decor-olive-600 text-decor-beige-100 hover:bg-decor-olive-400"
            onClick={() => toggleTag(tag)}
          >
            {tag} ✕
          </Badge>
        ))}
      </div>
    </div>
  );
}
