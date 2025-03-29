
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex gap-6">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Find Your Perfect Vacation Rental
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Discover beautiful vacation homes, cozy cabins, and luxury 
                    resorts. Book your next getaway with ease and comfort.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/login">
                    <button className="border-[1px] flex flex-row items-center p-2 rounded-lg hover:bg-black hover:text-white transition">
                      Explore Rentals <ArrowRight className="ml-2 h-4 w-4" />
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
