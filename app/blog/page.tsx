import { title } from "@/components/primitives";

const posts = [
  {
    title: "Introducing AI-Powered Feedback Analysis",
    excerpt:
      "Learn how our new AI features can help you understand customer feedback better.",
    date: "2024-03-20",
  },
  {
    title: "Best Practices for Collecting Customer Feedback",
    excerpt: "Tips and tricks to maximize your feedback collection efforts.",
    date: "2024-03-15",
  },
];

export default function BlogPage() {
  return (
    <div>
      <h1 className={title()}>Blog</h1>

      <div className="max-w-7xl mx-auto py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Welcome to the Blog</h1>
          <p className="text-xl text-foreground/80 mb-8">
            We&apos;re on a mission to make feedback collection and management
            more transparent, efficient, and actionable for businesses of all
            sizes.
          </p>
          <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
              <p className="text-foreground/80">
                To transform how businesses collect, analyze, and act on
                customer feedback using cutting-edge AI technology.
              </p>
            </section>
            <section>
              <h2 className="text-2xl font-bold mb-4">Our Team</h2>
              <p className="text-foreground/80">
                We&apos;re a team of passionate developers, designers, and
                business professionals dedicated to improving the feedback
                experience.
              </p>
            </section>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-20 px-6">
        <h1 className="text-4xl font-bold text-center mb-12">Latest Posts</h1>
        <div className="grid md:grid-cols-2 gap-8">
          {posts.map((post) => (
            <div
              key={post.title}
              className="p-6 rounded-xl bg-content1 shadow-medium"
            >
              <h2 className="text-2xl font-bold mb-4">{post.title}</h2>
              <p className="text-foreground/80 mb-6">{post.excerpt}</p>
              <p className="text-sm text-foreground/60">{post.date}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
