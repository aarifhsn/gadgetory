"use server";

async function searchAction(formData) {
  const q = formData.get("q")?.toString().trim();
  const category = formData.get("category");

  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (category && category !== "All") params.set("category", category);

  redirect(`/products?${params.toString()}`);
}
