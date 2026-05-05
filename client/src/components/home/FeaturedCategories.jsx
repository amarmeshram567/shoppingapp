import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

const FeaturedCategories = () => {
    const { categories, loadingStore } = useAppContext();

    return (
        <section className='py-16 lg:py-28'>
            <div className="container-luxe">
                <div className="mb-8 flex flex-col gap-4 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
                    <div className="max-w-xl">
                        <p className="text-xs uppercase tracking-[0.3em] text-accent mb-3">Curated</p>
                        <h2 className="font-display text-3xl leading-tight sm:text-4xl md:text-5xl">Shop by category</h2>
                    </div>
                    <Link to="/categories" className='hidden md:flex items-center gap-2 text-sm story-link'>
                        View all <ArrowRight className='h-4 w-4' />
                    </Link>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 md:grid-cols-4 md:gap-6">
                    {loadingStore ? (
                        Array.from({ length: 4 }).map((_, index) => (
                            <div key={index} className="aspect-[1.2/1] animate-pulse rounded-2xl bg-secondary sm:aspect-[4/5]" />
                        ))
                    ) : (
                        categories.slice(0, 4).map((category, index) => (
                            <motion.div
                                key={category.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                            >
                                <Link to={`/shop?cat=${category.name.toLowerCase()}`} className='group block'>
                                    <div className="relative aspect-[1.2/1] overflow-hidden rounded-2xl bg-secondary sm:aspect-[4/5]">
                                        <img src={category.image} alt={category.name} loading='lazy' className='absolute inset-0 h-full w-full object-cover group-hover:scale-110 transition-luxe duration-700' />
                                        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
                                        <div className="absolute inset-x-0 bottom-0 p-4 text-background sm:p-5">
                                            <h3 className="font-display text-xl leading-tight sm:text-2xl">{category.name}</h3>
                                            <p className="mt-1 text-sm opacity-80">{category.count} pieces</p>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))
                    )}
                </div>

                <div className="mt-6 md:hidden">
                    <Link to="/categories" className='inline-flex items-center gap-2 text-sm story-link'>
                        View all <ArrowRight className='h-4 w-4' />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default FeaturedCategories;
