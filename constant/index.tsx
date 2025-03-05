import brandsABI from "../abis/brandsTestnet.abi.json";
import eventsABI from "../abis/eventsTestnet.abi.json";
import feedbacksABI from "../abis/feedbacksTestnet.abi.json";
import productsABI from "../abis/productsTestnet.abi.json";
import { ReactNode } from "react";

export const FEEDBACKS_URL =
  process.env.NODE_ENV === "development" ? process.env.FEEDBACKS_DEV_URL : process.env.FEEDBACKS_PROD_URL;

export const APIKEY_PREFIX = "fdb_";

export const FEEDBACK_MAINNET_ADDRESS =
  "0xae778C70c611EF36C04D0CF91D53534Ea7ECAD76";

const BRAND_TESTNET_ADDRESS = "0x8eb01c23Bc12210606565d04B4aDff84400D1468";
const EVENT_TESTNET_ADDRESS = "0xFCEc150fc9D2E2cCBdC35056e9305E703205048b";
const FEEDBACK_TESTNET_ADDRESS = "0xC83364f078bd64bb7ec6B226aE7dc0d2ac27D670";
const PRODUCT_TESTNET_ADDRESS = "0x030e59386fe36C0bA15c449373f9Cf6F51938468";

// CONTRACT ADDRESSES
export const BRAND_ADDRESS = BRAND_TESTNET_ADDRESS;
export const EVENT_ADDRESS = EVENT_TESTNET_ADDRESS;
export const FEEDBACK_ADDRESS = FEEDBACK_TESTNET_ADDRESS;
export const PRODUCT_ADDRESS = PRODUCT_TESTNET_ADDRESS;

// CONTRACT ABIs
export const BRAND_ABI = brandsABI;
export const EVENT_ABI = eventsABI;
export const FEEDBACKS_ABI = feedbacksABI;
export const PRODUCT_ABI = productsABI;

export const BRAND_CATEGORIES = [
  "Apparel & Fashion",
  "Automotive",
  "Beauty & Personal Care",
  "Consumer Electronics",
  "Food & Beverages",
  "Home & Garden",
  "Health & Wellness",
  "Jewelry & Accessories",
  "Sports & Outdoors",
  "Toys & Games",
  "Travel & Tourism",
  "Pets & Animals",
  "Books & Media",
  "Office Supplies",
  "Fitness & Gym",
  "Entertainment",
  "Luxury Goods",
  "Software & Apps",
  "Home Appliances",
  "Furniture & Decor"
];

export const brandCategories: Record<string, string[]> = {
  technology: [
    "Software & SaaS",
    "Hardware & Gadgets",
    "AI & Machine Learning",
    "Blockchain & Cryptocurrency",
    "Mobile & Telecommunications",
    "Cybersecurity"
  ],

  finance: [
    "Traditional Banking",
    "Fintech & Digital Payments",
    "Investment & Wealth Management",
    "Insurance",
    "Accounting & Tax Services",
    "Cryptocurrency & DeFi"
  ],

  retail: [
    "Fashion & Apparel",
    "Beauty & Cosmetics",
    "Luxury & Jewelry",
    "Home & Living",
    "Marketplace Platforms",
    "Subscription Services",
    "Consumer Goods"
  ],

  food_beverage: [
    "Restaurants & Cafés",
    "Fast Food & QSR",
    "Packaged Foods & Snacks",
    "Beverages (Alcoholic & Non-Alcoholic)",
    "Plant-Based & Organic Foods",
    "Meal Delivery & Meal Kits"
  ],

  health_wellness: [
    "Healthcare & Pharmaceuticals",
    "Fitness & Sports",
    "Mental Health & Therapy",
    "Nutritional Supplements",
    "Personal Care & Hygiene",
    "Medical Devices"
  ],

  travel_hospitality: [
    "Hotels & Resorts",
    "Airlines & Transportation",
    "Travel Agencies & Booking Platforms",
    "Cruises & Tours",
    "Short-Term Rentals & Home Stays"
  ],

  automotive: [
    "Car Manufacturers",
    "Electric Vehicles & Clean Energy Mobility",
    "Car Rentals & Ridesharing",
    "Auto Parts & Accessories",
    "Logistics & Delivery Services"
  ],

  media_entertainment: [
    "Streaming & Digital Media",
    "Film & TV Production",
    "Music & Podcasts",
    "Gaming & Esports",
    "Publishing & Magazines"
  ],

  education: [
    "Schools & Universities",
    "Online Learning Platforms",
    "EdTech & Learning Tools",
    "Test Prep & Tutoring",
    "Research & Development"
  ],

  real_estate: [
    "Residential & Commercial Real Estate",
    "PropTech (Property Technology)",
    "Home Improvement & Renovation",
    "Architecture & Interior Design",
    "Smart Homes & IoT"
  ],

  energy_sustainability: [
    "Renewable Energy (Solar, Wind, Hydro)",
    "Oil & Gas",
    "Electric Vehicles & Battery Tech",
    "Recycling & Waste Management",
    "Environmental Solutions"
  ],

  b2b_services: [
    "Marketing & Advertising",
    "Consulting & Strategy",
    "Legal & Compliance",
    "Human Resources & Recruitment",
    "IT & Cloud Services"
  ],

  home_furniture: [
    "Home Décor & Furnishings",
    "Kitchen & Dining",
    "Bedding & Mattresses",
    "Outdoor & Garden"
  ],

  social_media: [
    "Social Networks",
    "Content Creation & Creator Economy",
    "Influencer Marketing",
    "Community & Forums"
  ],

  pets_animals: [
    "Pet Food & Supplies",
    "Veterinary & Pet Health",
    "Pet Grooming & Services",
    "Pet Tech & Wearables"
  ],

  nonprofit: [
    "NGOs & Charities",
    "Advocacy & Human Rights",
    "Environmental & Sustainability Causes",
    "Education & Child Welfare"
  ],

  industrial_manufacturing: [
    "Heavy Machinery",
    "Aerospace & Defense",
    "Robotics & Automation",
    "Supply Chain & Logistics"
  ],

  government: [
    "Public Administration",
    "Law Enforcement & Security",
    "Postal & Courier Services",
    "Public Transport & Infrastructure"
  ],

  events_experiences: [
    "Event Planning & Management",
    "Concerts & Festivals",
    "Trade Shows & Conferences",
    "Weddings & Private Events"
  ],

  toys_hobbies: [
    "Board Games & Puzzles",
    "Collectibles & Memorabilia",
    "Action Figures & Dolls",
    "Arts & Crafts Supplies"
  ],

  military_defense: [
    "Defense Contractors",
    "Firearms & Tactical Gear",
    "Military Technology",
    "Private Security Firms"
  ],

  agriculture: [
    "AgTech & Smart Farming",
    "Organic & Sustainable Farming",
    "Livestock & Dairy",
    "Fishing & Aquaculture"
  ],

  religion_spirituality: [
    "Religious Institutions & Churches",
    "Spiritual & Wellness Retreats",
    "Meditation & Mindfulness",
    "Faith-Based Nonprofits"
  ],

  diy_maker: [
    "Tools & Hardware",
    "Home Improvement & Repair",
    "3D Printing & Prototyping",
    "Hobbyist & DIY Kits"
  ],

  extreme_sports: [
    "Adventure Tourism",
    "Rock Climbing & Mountaineering",
    "Scuba Diving & Water Sports",
    "Motorsports & Racing"
  ],

  paranormal_mystery: [
    "UFO & Conspiracy Research",
    "Ghost Hunting & Paranormal Investigation",
    "Cryptozoology",
    "Mystery Subscription Boxes"
  ]
};

export const getBrandCategoriesKey = (): string[] => Object.keys(brandCategories);

export const formatCategoryKey = (category: string): string => {
  return category
    .split("_") // Split by underscore
    .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
    .join(" & "); // Join with " & "
};

export const formatCategoryKeys = (): string[] => {
  return Object.keys(brandCategories).map(key =>
    key
      .split("_") // Split by underscore
      .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
      .join(" & ") // Join with " & "
  );
};

// Nine is a platform for developers to showcase the apps and products that they build without worrying about showcasing the apps that they build.

export const categoryListObject = (): { name: string, startContent: ReactNode }[] => (
  [...formatCategoryKeys().map((eachCategory) => (
    { name: eachCategory, startContent: <></> }
  ))]
);
