import React from 'react';
import Layout from '../components/layout/Layout';
import { motion } from 'framer-motion'
import { toast } from 'sonner';
import { Mail, MapPin, Phone, Send } from 'lucide-react';



const contacts = [
    { Icon: Mail, t: "Email us", v: "concierge@lior-maison.com", s: "Reply within 24h" },
    { Icon: Phone, t: "Call us", v: "+1 (800) 555-0123", s: "Mon–Fri, 9am–6pm EST" },
    { Icon: MapPin, t: "Visit our flagship", v: "550 Madison Avenue, NYC", s: "Open daily, 10am–8pm" },
]


const Contact = () => {


    const handleSubmit = (e) => {
        e.preventDefault();
        toast.success("Message sent — we'll be in touch shortly.");
    }

    return (
        <Layout>
            <section className='bg-gradient-warm py-20'>
                <div className="container-luxe text-center">
                    <p className="text-xs uppercase tracking-[0.3em] text-accent mb-3">
                        Get in touch
                    </p>
                    <h1 className="font-display text-5xl md:text-6xl">
                        We'd love to hear from you
                    </h1>
                    <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
                        Questions, feedback, or just want to say hello? Our team is here.
                    </p>
                </div>
            </section>

            <div className="container-luxe py-20 grid lg:grid-cols-2 gap-12">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className="font-display text-3xl mb-8">
                        Send us a message
                    </h2>

                    <form onSubmit={handleSubmit} className='space-y-4'>
                        <div className="grid md:grid-cols-2 gap-4">
                            <input
                                placeholder='Name'
                                required
                                className='px-4 py-3 rounded-lg bg-card border border-border outline-none focus:border-foreground transition-smooth'
                            />
                            <input
                                placeholder='Email'
                                type='email'
                                required
                                className='px-4 py-3 rounded-lg bg-card border border-border outline-none focus:border-foreground transition-smooth'
                            />
                        </div>
                        <input
                            placeholder='Subject'
                            className='w-full px-4 py-3 rounded-lg bg-card border border-border outline-none focus:border-foreground transition-smooth'
                        />
                        <textarea
                            placeholder='Your message...'
                            rows={6}
                            className='w-full px-4 py-3 rounded-lg bg-card border border-border outline-none focus:border-foreground transition-smooth resize-none'
                        />

                        <button
                            className='px-8 py-4 rounded-full bg-foreground text-background flex items-center gap-2'
                        >
                            <Send className='h-4 w-4' /> Send message
                        </button>
                    </form>
                </motion.div>


                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className='space-y-6'
                >
                    {contacts.map(({ Icon, t, v, s }) => (
                        <div key={t} className='p-6 bg-card rounded-2xl border border-border flex gap-4'>
                            <div className="h-12 w-12 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground flex-shrink-0">
                                <Icon className='h-5 w-5' />
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-widest text-accent">{t}</p>
                                <p className="font-display text-xl mt-1">{v}</p>
                                <p className="text-sm text-muted-foreground">{s}</p>
                            </div>
                        </div>
                    ))}

                    <div className="aspect-video rounded-2xl bg-gradient-primary overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center text-primary-foreground">
                            <MapPin className="h-12 w-12 opacity-50" />
                        </div>
                    </div>

                </motion.div>

            </div>
        </Layout>
    );
}

export default Contact;
