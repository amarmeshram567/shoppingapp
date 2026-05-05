import React from 'react';


import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Layout from '../components/layout/Layout';
import { blogPosts } from '../data/data';


const allPosts = [
    ...blogPosts,
    ...blogPosts.map(p => ({ ...p, id: p.id + "x", title: p.title + " (Part II)" })),
];

const Blog = () => (
    <Layout>
        <section className="bg-gradient-warm py-20">
            <div className="container-luxe text-center">
                <p className="text-xs uppercase tracking-[0.3em] text-accent mb-3">The Lior Journal</p>
                <h1 className="font-display text-5xl md:text-7xl">Stories, ideas & inspiration</h1>
                <p className="text-muted-foreground mt-4 max-w-xl mx-auto">A slow read on craft, design, and the considered life.</p>
            </div>
        </section>

        <div className="container-luxe py-16">
            {/* Featured */}
            <Link to="#" className="group block mb-16">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-secondary">
                        <img src={blogPosts[0].image} alt="" className="h-full w-full object-cover group-hover:scale-105 transition-luxe duration-700" />
                    </div>
                    <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-accent mb-3">Featured · {blogPosts[0].category}</p>
                        <h2 className="font-display text-4xl md:text-5xl mb-4 group-hover:text-primary transition-smooth">{blogPosts[0].title}</h2>
                        <p className="text-muted-foreground text-lg mb-6">{blogPosts[0].excerpt}</p>
                        <span className="inline-flex items-center gap-2 text-sm story-link">Read article <ArrowRight className="h-4 w-4" /></span>
                    </div>
                </div>
            </Link>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {allPosts.map((p, i) => (
                    <motion.article key={p.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: (i % 3) * 0.1 }} className="group">
                        <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-secondary mb-5">
                            <img src={p.image} alt={p.title} className="h-full w-full object-cover group-hover:scale-105 transition-luxe duration-700" />
                        </div>
                        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">{p.category} · {p.date}</p>
                        <h3 className="font-display text-2xl leading-snug mb-2 group-hover:text-primary transition-smooth">{p.title}</h3>
                        <p className="text-muted-foreground">{p.excerpt}</p>
                    </motion.article>
                ))}
            </div>
        </div>
    </Layout>
);


export default Blog;
