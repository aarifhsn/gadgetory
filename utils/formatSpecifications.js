// utils/formatSpecifications.js
export function formatSpecifications(specifications = {}) {
  if (!specifications || typeof specifications !== "object") return [];

  const { otherSpecs, ...mainSpecs } = specifications;

  const formattedSpecs = Object.entries(mainSpecs)
    .filter(([, value]) => value)
    .map(([key, value]) => {
      const label = key
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (c) => c.toUpperCase());

      return {
        label,
        value,
      };
    });

  const extraSpecs =
    typeof otherSpecs === "string"
      ? otherSpecs
          .split("|")
          .map((spec) => spec.trim())
          .filter(Boolean)
          .map((spec) => ({
            label: null,
            value: spec,
          }))
      : [];

  return [...formattedSpecs, ...extraSpecs];
}
