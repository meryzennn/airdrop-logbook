// app/page.tsx
import { auth } from "@/auth";
import LandingHero from "@/components/landing/LandingHero";

export default async function HomePage() {
  const session = await auth();

  return (
    <main className="min-h-screen">
      <LandingHero isAuthed={!!session?.user} />
    </main>
  );
}
