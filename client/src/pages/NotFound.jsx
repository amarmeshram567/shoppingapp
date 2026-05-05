

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Home } from "lucide-react";

const NotFound = () => (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero p-6">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-md">
            <p className="font-display text-[160px] md:text-[220px] leading-none text-primary/20">404</p>
            <p className="text-xs uppercase tracking-[0.3em] text-accent mb-3">Page not found</p>
            <h1 className="font-display text-4xl md:text-5xl mb-4">Lost in the maison.</h1>
            <p className="text-muted-foreground mb-8">The page you're looking for has moved, been renamed, or simply doesn't exist.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-foreground text-background font-medium"><Home className="h-4 w-4" /> Back home</Link>
                <Link to="/shop" className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border font-medium"><ArrowLeft className="h-4 w-4" /> Browse shop</Link>
            </div>
        </motion.div>
    </div>
);

export default NotFound;
