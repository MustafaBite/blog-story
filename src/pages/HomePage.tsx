import { Hero } from "../components/home/Hero";
import { FeaturedStories } from "../components/home/FeaturedStories";
import { FeaturedArtworks } from "../components/home/FeaturedArtworks";

export function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedStories />
      <FeaturedArtworks />
    </>
  );
}
