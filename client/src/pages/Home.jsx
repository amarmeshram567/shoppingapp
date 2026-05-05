import { ArrowRight, RefreshCw, ShieldCheck, Sparkles, Star, Truck } from "lucide-react";
import { motion } from "framer-motion"
import HeroCarousel from "../components/home/HeroCarousel";
import Layout from "../components/layout/Layout";
import FeaturedCategories from "../components/home/FeaturedCategories";
import FlashSale from "../components/home/FlashSale";
import { Link } from "react-router-dom";
import { blogPosts, testimonials } from "../data/data";
import hero1 from "../assets/hero-1.jpg"
import hero2 from "../assets/hero-2.jpg"
import hero3 from "../assets/hero-3.jpg"
import { useEffect, useState } from "react";
import ProductSection from "../components/ProductSection";
import { useAppContext } from "../context/AppContext";

const features = () => [
    { Icon: Truck, t: "Free shipping", d: "Orders over $200" },
    { Icon: ShieldCheck, t: "Lifetime warranty", d: "On all leather goods" },
    { Icon: RefreshCw, t: "30-day returns", d: "No questions asked" },
    { Icon: Sparkles, t: "Concierge service", d: "Personal stylists" },
]

const ValueProps = () => (
    <section className="py-12 border-y border-border">
        <div className="container-luxe grid grid-cols-3 md:grid-cols-4 gap-8 text-center">
            {features().map(({ Icon, t, d }) => (
                <div key={t} className="flex flex-col items-center gap-2">
                    <Icon className='h-6 w-6 text-primary' />
                    <p className="font-medium text-sm">{t}</p>
                    <p className="text-xs text-muted-foreground">{d}</p>
                </div>
            ))}
        </div>
    </section>
)

const PromoBanners = () => {
    const promo = [
        { t: "Free shipping over $200", d: "Worldwide express delivery", img: hero2 },
        { t: "Lifetime craftsmanship", d: "Guaranteed on every leather piece", img: hero3 }
    ]

    return (
        <section className="py-12">
            <div className="container-luxe grid md:grid-cols-2 gap-6">
                {promo.map((b, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: i * 0.1 }}
                        className="relative aspect-[2/1] rounded-2xl overflow-hidden group"
                    >
                        <img src={b.img} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-luxe duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-r from-foreground/70 to-transparent " />
                        <div className="relative h-full p-8 lg:p-12 flex flex-col justify-end text-background">
                            <h3 className="font-display text-3xl lg:text-4xl mb-2">{b.t}</h3>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    )
}

const Brands = () => {
    const brands = ["VOGUE", "GQ", "Wallpaper*", "Monocle", "FT Weekend", "Architectural Digest"]

    return (
        <section className="py-16 border-y border-border">
            <div className="container-luxe">
                <p className="text-center text-xs uppercase tracking-[0.3em] text-muted-foreground mb-8">
                    As featured in
                </p>
                <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6 opacity-60">
                    {brands.map((b) => (
                        <span key={b} className="font-display text-2xl md:text-3xl tracking-tight">{b}</span>
                    ))}
                </div>
            </div>
        </section>
    )
}

const Testimonials = () => {
    const [item, setItem] = useState(0);

    useEffect(() => {
        const time = setInterval(() => setItem((prev) =>
            (prev + 1) % testimonials.length
        ), 5000)
        return () => clearInterval(time)
    }, [])

    return (
        <section className="py-20 lg:py-28 bg-secondary">
            <div className="container-luxe text-center max-w-3xl mx-auto">
                <p className="text-xs uppercase tracking-[0.3em] text-accent mb-6">
                    Loved by thousands
                </p>
                <motion.div
                    key={item}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex justify-center gap-0.5 mb-6">
                        {Array.from({ length: testimonials[item].length }).map((_, k) => (
                            <Star key={k} className="h-5 w-5 fill-accent text-accent" />
                        ))}
                    </div>
                    <blockquote className="font-display text-2xl md:text-4xl leading-tight mb-8 text-balance">
                        "{testimonials[item].quote}"
                    </blockquote>
                    <p className="font-medium">{testimonials[item].name}</p>
                    <p className="text-sm text-muted-foreground">{testimonials[item].role}</p>
                </motion.div>
                <div className="flex justify-center gap-1.5 mt-10">
                    {testimonials.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setItem(idx)}
                            className={`h-1 rounded-full transition-all ${idx === item ? "w-10 bg-foreground" : "w-5 bg-foreground/20"}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}

const BlogPreview = () => (
    <section className="py-20 lg:py-28">
        <div className="container-luxe">
            <div className="flex items-end justify-between mb-12">
                <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-accent mb-3">Journal</p>
                    <h2 className="font-display text-4xl md:text-5xl">Stories & ideas</h2>
                </div>
                <Link to="/blog" className="hidden md:flex items-center gap-2 text-sm story-link">
                    All articles
                    <ArrowRight className="h-4 w-4" />
                </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
                {blogPosts.map((post, i) => (
                    <motion.article
                        key={post.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: i * 0.1 }}
                        className="group"
                    >
                        <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-secondary mb-5">
                            <img
                                src={post.image}
                                alt={post.title}
                                loading="lazy"
                                className="h-full w-full object-cover group-hover:scale-105 transition-luxe duration-700"
                            />
                        </div>
                        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">{post.category} · {post.date}</p>
                        <h3 className="font-display text-2xl leading-snug mb-2 group-hover:text-primary transition-smooth">
                            {post.title}
                        </h3>
                        <p className="text-muted-foreground">{post.excerpt}</p>
                    </motion.article>
                ))}
            </div>
        </div>
    </section>
)

const Newsletter = () => (
    <section className="py-20 lg:py-28">
        <div className="container-luxe">
            <div className="bg-gradient-primary text-primary-foreground rounded-3xl p-10 lg:p-20 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
                <div className="relative">
                    <p className="text-xs uppercase tracking-[0.3em] opacity-70 mb-4">The Lior Letter</p>
                    <h2 className="font-display text-4xl md:text-6xl mb-4 text-balance">Stay in the know.</h2>
                    <p className="opacity-80 max-w-md mx-auto mb-8">Get early access to new collections, private events, and 10% off your first order.</p>
                    <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                        <input type="email" required placeholder="your@email.com" className="flex-1 px-5 py-4 rounded-full bg-background/10 border border-background/20 placeholder:text-background/50 outline-none focus:bg-background/20 transition-smooth" />
                        <button className="px-7 py-4 rounded-full bg-accent text-accent-foreground font-medium hover:scale-105 transition-smooth">Subscribe</button>
                    </form>
                </div>
            </div>
        </div>
    </section>
);

const InstagramGrid = () => {
    const { products } = useAppContext()
    const images = [hero1, hero2, hero3, ...products.slice(0, 3).map(p => p.image)]

    return (
        <section className="py-20">
            <div className="container-luxe text-center mb-10">
                <p className="text-xs uppercase tracking-[0.3em] text-accent mb-3">@lior.store</p>
                <h2 className="font-display text-3xl md:text-4xl">Follow the story</h2>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2 px-2">
                {images.map((img, i) => (
                    <a key={i} href="#" className="relative aspect-square overflow-hidden bg-secondary group">
                        <img src={img} alt="" loading="lazy" className="h-full w-full object-cover group-hover:scale-110 transition-luxe duration-700" />
                        <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/40 transition-smooth" />
                    </a>
                ))}
            </div>
        </section>
    )
}

const Home = () => {
    const { products, featuredProducts, loadingStore } = useAppContext()

    return (
        <Layout>
            <HeroCarousel />
            <ValueProps />
            <FeaturedCategories />
            <FlashSale />
            <ProductSection title="Trending now" eyebrow="What's hot" list={featuredProducts.length ? featuredProducts : products} loading={loadingStore} />
            <PromoBanners />
            <ProductSection title="Best sellers" eyebrow="Customer favorites" list={[...products].sort((a, b) => b.reviews - a.reviews)} loading={loadingStore} />
            <Brands />
            <ProductSection title="New arrivals" eyebrow="Fresh in" list={[...products].reverse()} loading={loadingStore} />
            <Testimonials />
            <BlogPreview />
            <Newsletter />
            <InstagramGrid />
        </Layout>
    );
}

export default Home;
