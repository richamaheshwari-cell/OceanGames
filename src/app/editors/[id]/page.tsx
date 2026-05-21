import { redirect } from "next/navigation";

export default async function EditorRedirectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // You need to fetch the editor's name by id here, then redirect
  const editor = await getEditorById(id); // Implement this function to fetch editor by id
  if (editor && editor.name) {
    redirect(`/authors/${encodeURIComponent(editor.name)}`);
  } else {
    notFound();
  }
}
