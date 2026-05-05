import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import { AnimatePresence, motion } from "framer-motion"
import { ChevronDown, ChevronRight } from 'lucide-react';


const faqs = [
    { q: "How long does shipping take?", a: "Standard shipping is 3–5 business days within the US. International orders take 7–14 days. Express options are available at checkout." },
    { q: "What is your return policy?", a: "We offer free returns within 30 days of delivery. Items must be unused with original packaging. Sale items are final sale." },
    { q: "Are your products ethically made?", a: "Yes. All Lior products are made in small workshops across Europe, with full traceability. We are LWG-certified for our leather goods." },
    { q: "Do you offer a warranty?", a: "All leather goods come with a lifetime craftsmanship warranty. Electronics carry a 2-year warranty against manufacturing defects." },
    { q: "How do I find my size?", a: "Each product page includes a detailed size guide. Our concierge team is also available to help via live chat." },
    { q: "Can I gift a Lior product?", a: "Absolutely. We offer complimentary gift wrapping at checkout, plus digital gift cards in any amount." },
    { q: "How do I track my order?", a: "Once shipped, you'll receive an email with tracking. You can also see live updates in your dashboard." },
];


const FAQ = () => {

    const [open, setOpen] = useState(0)

    return (
        <Layout>
            <section className="bg-gradient-warm py-20 text-center">
                <div className="container-luxe">
                    <p className="text-xs uppercase tracking-[0.3em] text-accent mb-3">Help center</p>
                    <h1 className="font-display text-5xl md:text-6xl">Frequently asked</h1>
                </div>
            </section>

            <div className="container-luxe py-16 max-w-3xl">
                <div className="space-y-3">
                    {faqs.map((f, i) => (
                        <motion.div
                            key={f.q}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="border border-border rounded-xl overflow-hidden bg-card"
                        >
                            <button
                                onClick={() => setOpen(open === i ? null : i)}
                                className='w-full px-6 py-5 flex justify-between items-center text-left'
                            >
                                <span className="font-display text-lg">
                                    {f.q}
                                </span>
                                <ChevronDown className={`h-5 w-5 transition-transform ${open === i && "rotate-180"}`} />
                            </button>

                            <AnimatePresence>
                                {open === i && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <p className="px-6 pb-5 text-muted-foreground leading-relaxed">
                                            {f.a}
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            </div>
        </Layout>
    );
}

export default FAQ;
