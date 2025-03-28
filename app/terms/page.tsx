// app/terms/page.tsx
export default function TermsPage() {
  return (
    <div className="max-w-7xl mx-auto py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">1. Terms of Use</h2>
            <p className="text-foreground/80">
              By accessing and using Feedbacks, you accept and agree to be bound by these terms...
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-bold mb-4">2. Privacy Policy</h2>
            <p className="text-foreground/80">
              Your privacy is important to us. Please review our Privacy Policy...
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
