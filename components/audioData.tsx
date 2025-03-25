import Image from "next/image";

export const audioSections = {
  intro: {
    audio: "/audio/intro.mp3",
    content: "Welcome to Feedbank - Where brands and feedback meet.",
    duration: 8, // seconds
    visual: (
      <div className="bg-gray-800/50 p-6 rounded-lg">
        <Image
          alt="Introduction"
          height={300}
          src="/images/intro.jpg"
          width={500}
        />
        <p className="mt-4">
          Discover how Feedbank connects brands and feedback seamlessly.
        </p>
      </div>
    ),
  },
  features: {
    audio: "/audio/features.mp3",
    content:
      "Give and receive structured feedback. Follow brands. Build your brand presence.",
    duration: 12,
    visual: (
      <div className="bg-gray-800/50 p-6 rounded-lg">
        <Image
          alt="Features"
          height={300}
          src="/images/features.jpg"
          width={500}
        />
        <p className="mt-4">
          Explore the features that make feedback management easy and effective.
        </p>
      </div>
    ),
  },
  benefits: {
    audio: "/audio/benefits.mp3",
    content:
      "Real-time feedback tracking. Trending brands analytics. Direct brand engagement.",
    duration: 10,
    visual: (
      <div className="bg-gray-800/50 p-6 rounded-lg">
        <Image
          alt="Benefits"
          height={300}
          src="/images/benefits.jpg"
          width={500}
        />
        <p className="mt-4">
          Learn about the benefits of using Feedbank for your brand.
        </p>
      </div>
    ),
  },
};
