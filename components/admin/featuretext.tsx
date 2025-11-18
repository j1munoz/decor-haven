"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function FeatureInput({
  features,
  setFeatures,
}: {
  features: string[];
  setFeatures: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const [featureText, setFeatureText] = useState("");

  const addFeature = () => {
    const trimmed = featureText.trim();
    if (trimmed !== "" && !features.includes(trimmed)) {
      setFeatures((prev) => [...prev, trimmed]);
      setFeatureText("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addFeature();
    }
  };

  const removeFeature = (feature: string) => {
    setFeatures((prev) => prev.filter((f) => f !== feature));
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Type a feature (e.g. Stainless Steel Blade)"
          value={featureText}
          onChange={(e) => setFeatureText(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1"
        />
        <Button
          type="button"
          onClick={addFeature}
          className="bg-decor-olive-600 hover:bg-decor-olive-400 text-decor-beige-100"
        >
          Add
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {features.map((feature) => (
          <Badge
            key={feature}
            className="cursor-pointer bg-decor-olive-600 text-decor-beige-100 hover:bg-decor-olive-400"
            onClick={() => removeFeature(feature)}
          >
            {feature} ✕
          </Badge>
        ))}
      </div>
    </div>
  );
}
