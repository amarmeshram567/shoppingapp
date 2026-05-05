import React from 'react';
import { motion } from "framer-motion"
import Layout from '../components/layout/Layout';
import hero from '../assets/hero-1.jpg'
import hero2 from '../assets/hero-2.jpg'
import hero3 from '../assets/hero-3.jpg'


const stats = [
    ["12", "Years"],
    ["48", "Artisan workshops"],
    ["180k", "Happy customers"],
    ["94%", "Repeat rate"]
]


const About = () => {
    return (
        <Layout>
            <section
                className='relative h-[70vh] min-h-[500px] overflow-hidden bg-gradient-hero'
            >
                <img src={hero} alt="" className='absolute inset-0 h-full w-full object-cover opacity-50' />
                <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-transparent" />
                <div className="relative container-luxe h-full flex items-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className='max-w-2xl'
                    >
                        <p className="text-xs uppercase tracking-[0.3em] text-accent mb-4">
                            Our story
                        </p>
                        <h1 className="font-display text-5xl md:text-7xl leading-[0.95] mb-6">
                            Designed for those who notice.
                        </h1>
                        <p className="text-lg text-muted-foreground">Founded in 2019, Lior is a maison built on three principles: timeless design, ethical craft, and considered service.</p>
                    </motion.div>
                </div>
            </section>

            <section className="container-luxe py-24 grid md:grid-cols-2 gap-12 items-center">
                <motion.img initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }} src={hero2} alt="" className="aspect-[4/5] rounded-2xl object-cover" />
                <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-accent mb-3">
                        Craft
                    </p>
                    <h2 className="font-display text-4xl md:text-5xl mb-6">Made by hand,<br />made to last.</h2>
                    <p className="text-muted-foreground mb-4 leading-relaxed">Every Lior piece is made in small workshops across Italy, Portugal, and France — often by artisans who have practiced their craft for generations.</p>
                    <p className="text-muted-foreground leading-relaxed">We believe in slow design. In materials that age beautifully. In the quiet confidence of pieces that don't need to shout to be heard.</p>
                </div>
            </section>

            <section className="bg-secondary py-24">
                <div className="container-luxe text-center">
                    <p className="text-xs uppercase tracking-[0.3em] text-accent mb-3">
                        By the numbers
                    </p>
                    <h2 className="font-display text-4xl mb-12">
                        A community of makers and wearers.
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map(([n, l]) => (
                            <div key={l}>
                                <p className="font-display text-5xl md:text-6xl text-primary">{n}</p>
                                <p className="text-sm uppercase tracking-widest text-muted-foreground mt-2">{l}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className='container-luxe py-24 grid md:grid-cols-2 gap-12 items-center'>
                <div className="md:order-2">
                    <p className="text-xs uppercase tracking-[0.3em] text-accent mb-3">Sustainability</p>
                    <h2 className="font-display text-4xl md:text-5xl mb-6">A lighter footprint.</h2>
                    <p className="text-muted-foreground mb-4 leading-relaxed">We use only LWG-certified leather, organic cottons, recycled metals, and FSC packaging. Our carbon footprint is independently audited each year.</p>
                    <p className="text-muted-foreground leading-relaxed">Lifetime repairs are included with every purchase, because the most sustainable product is the one you keep.</p>
                </div>
                <motion.img initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }} src={hero3} alt="" className="md:order-1 aspect-[4/5] rounded-2xl object-cover" />
            </section>
        </Layout>
    );
}

export default About;
