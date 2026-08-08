import { ReactNode } from "react";

type InterviewLayoutProps = {
  sidebar: ReactNode;
  content: ReactNode;
};

export default function InterviewLayout({
  sidebar,
  content,
}: InterviewLayoutProps) {
  return (
    <main className="min-h-screen bg-[#050816] p-8 text-white">

      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-3">

        <aside className="space-y-6">
          {sidebar}
        </aside>

        <section className="space-y-6 lg:col-span-2">
          {content}
        </section>

      </div>

    </main>
  );
}