import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import hero1 from '../../assets/hero-1.jpg';
import hero2 from "../../assets/hero-2.jpg"
import hero3 from '../../assets/hero-3.jpg';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';



const slides = [
    { image: hero1, eyebrow: "Spring Edit 2026", title: "Quiet Luxury,\nLoudly Crafted.", desc: "Discover our new arrivals — pieces designed to outlast trends.", cta: "Shop the edit", to: "/shop" },
    { image: hero2, eyebrow: "New in footwear", title: "Step into\nthe season.", desc: "Italian-made silhouettes for the modern wardrobe.", cta: "Explore footwear", to: "/shop?cat=footwear" },
    { image: hero3, eyebrow: "Watches & accessories", title: "Time, considered.", desc: "Swiss movements. Sustainable materials. Lifetime warranty.", cta: "Shop watches", to: "/shop?cat=watches" },
];


const HeroCarousel = () => {
    const [item, setItem] = useState(0)

    useEffect(() => {
        const time = setInterval(() => setItem((prev) => (prev + 1) % slides.length), 6500);
        return () => clearInterval(time);
    }, [])

    const slide = slides[item];

    return (
        <section className='relative h-[88vh] min-h-[600px] overflow-hidden bg-gradient-hero'>
            {slides.map((sl, idx) => (
                <motion.div
                    key={idx}
                    initial={false}
                    animate={{ opacity: idx === item ? 1 : 0 }}
                    transition={{ duration: 1.2 }}
                    className='absolute inset-0'
                >
                    <img src={sl.image} alt="" className='absolute inset-0 h-full w-full object-cover object-right' />
                    <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />

                </motion.div>
            ))}

            <div className="relative container-luxe h-full flex items-center">
                <motion.div
                    key={item}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className='max-w-xl'
                >

                    <p className="text-xs uppercase tracking-[0.3rem] text-accent font-medium mb-6 flex items-center gap-2">
                        <Sparkles className='h-3 w-3' /> {slide.eyebrow}
                    </p>

                    <h1 className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.95] mb-6 whitespace-pre-line text-balance">
                        {slide.title}
                    </h1>

                    <p className='text-lg text-muted-foreground mb-8 max-w-md'>
                        {slide.desc}
                    </p>

                    <div className="flex flex-wrap gap-3">
                        <Link to={slide.to} className='group inline-flex items-center gap-2 px-8 py-4 rounded-full bg-foreground text-background font-medium tracking-wide hover:bg-primary transition-smooth'>
                            {slide.cta}
                            <ArrowRight className='h-4 w-4 group-hover:translate-x-1 transition-transform' />
                        </Link>
                        <Link to="/about" className='inline-flex items-center gap-2 px-8 py-4 rounded-full border border-foreground/20 hover:bg-foreground/5 transition-smooth font-medium'>
                            Our story
                        </Link>
                    </div>

                </motion.div>
            </div>

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 z-10">
                <button
                    onClick={() => setItem((p) => (p - 1 + slides.length) % slides.length)}
                    className='h-10 w-10 rounded-full glass flex items-center justify-center'
                >
                    <ChevronLeft className='h-4 w-4' />
                </button>
                <div className="flex gap-1.5">
                    {
                        slides.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setItem(idx)}
                                className={`h-1 rounded-full transition-all ${idx === item ? "w-10 bg-foreground" : "w-5 bg-foreground/30"}`}
                            />
                        ))
                    }
                </div>

                <button
                    onClick={() => setItem((p) => (p + 1) % slides.length)}
                    className='h-10 w-10 rounded-full glass flex items-center justify-center'
                >
                    <ChevronRight className='h-4 w-4' />
                </button>
            </div>


        </section>
    )
}


export default HeroCarousel;
