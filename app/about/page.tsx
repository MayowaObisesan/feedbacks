import { title } from "@/components/primitives";

export default function AboutPage() {
  return (
    <div>
      <h1 className={title()}>About</h1>

      <div className="max-w-7xl mx-auto py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">About Feedbacks</h1>
          <p className="text-xl text-foreground/80 mb-8">
            We&apos;re on a mission to make feedback collection and management more transparent,
            efficient, and actionable for businesses of all sizes.
          </p>
          <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
              <p className="text-foreground/80">
                To transform how businesses collect, analyze, and act on customer feedback
                using cutting-edge AI technology.
              </p>
            </section>
            <section>
              <h2 className="text-2xl font-bold mb-4">Our Team</h2>
              <p className="text-foreground/80">
                We&apos;re a team of passionate developers, designers, and business professionals
                dedicated to improving the feedback experience.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
