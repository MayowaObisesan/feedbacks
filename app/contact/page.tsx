// app/contact/page.tsx
import { Button } from "@heroui/button";

export default function ContactPage() {
  return (
    <div className="max-w-7xl mx-auto py-20 px-6">
      <div className="max-w-xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Contact Us</h1>
        <p className="text-foreground/80 mb-8">
          Have questions? We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.
        </p>
        <form className="space-y-6">
          <div>
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label className="block text-sm font-medium mb-2">Name</label>
            <input
              className="w-full p-2 rounded-md border border-foreground/20 bg-background"
              type="text"
              required
            />
          </div>
          <div>
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              className="w-full p-2 rounded-md border border-foreground/20 bg-background"
              type="email"
              required
            />
          </div>
          <div>
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label className="block text-sm font-medium mb-2">Message</label>
            <textarea
              className="w-full p-2 rounded-md border border-foreground/20 bg-background"
              rows={4}
              required
            />
          </div>
          <Button color="primary" type="submit">Send Message</Button>
        </form>
      </div>
    </div>
  );
}
