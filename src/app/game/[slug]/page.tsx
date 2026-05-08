import { redirect } from "next/navigation";

export default async function LegacyGameDetailRedirect({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  redirect(`/games/${slug}`);
}
