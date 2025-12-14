"use client";

import Image from "next/image";

export function HeroSection() {
    // Using Unsplash for reliable hero image
    const heroImageUrl = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920&h=600&fit=crop";

    return (
        <section className="relative w-full h-48 md:h-56 overflow-hidden">
            {/* Background Image */}
            <Image
                src={heroImageUrl}
                alt="Delicious Indonesian Food"
                fill
                className="object-cover"
                priority
            />

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/50" />

            {/* Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 md:px-6 text-white z-10">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight font-headline italic drop-shadow-lg">
                    Wargital
                </h1>
                <p className="mt-2 max-w-2xl text-sm md:text-base text-gray-100 drop-shadow-md">
                    Rasa otentik masakan rumahan Indonesia, diantar langsung ke depan pintu Anda.
                </p>
            </div>
        </section>
    );
}
