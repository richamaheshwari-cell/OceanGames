import { redirect } from "next/navigation";

export default async function EditorRedirectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  redirect(`/authors/${id}`);
}
