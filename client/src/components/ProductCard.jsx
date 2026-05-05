import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Eye, Heart, ShoppingBag, Star } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const ProductCard = ({ product, onQuickView }) => {

    const { addToCart, toggleWishlist, hasInWishlist } = useAppContext()

    const [hover, setHover] = useState(false)
    const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
    const displayImage = product.image || product.images?.[0] || "";
    const hoverImage = product.hoverImage || product.images?.[1] || displayImage;
    const hasHoverImage = Boolean(hoverImage && hoverImage !== displayImage);


    const handleQuickView = () => {
        if (onQuickView) onQuickView(product);
        else setQuickOpen(true);
    };

    // console.log(product);


    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className='group'
        >
            <div
                className="relative aspect-[4/5] overflow-hidden rounded-xl bg-secondary"
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
            >
                <Link
                    to={`/product/${product.id}`}
                    className='absolute inset-0'
                >
                    {hasHoverImage ? (
                        <>
                            <img
                                src={hoverImage}
                                alt={product.name}
                                className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ${hover ? "scale-105 opacity-100" : "scale-100 opacity-0"}`}
                            />
                            <img
                                src={displayImage}
                                alt={product.name}
                                className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ${hover ? "scale-105 opacity-0" : "scale-100 opacity-100"}`}
                            />
                        </>
                    ) : (
                        <img
                            src={displayImage}
                            alt={product.name}
                            className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ${hover ? "scale-105" : "scale-100"}`}
                        />
                    )}
                </Link>

                {/* Badges */}
                <div className="absolute left-3 top-3 flex flex-col gap-2 z-10">
                    {product.badge && (
                        <span className={`
                            px-2.5 py-1 text-[10px] font-medium tracking-widest uppercase rounded-full 
                        ${product.badge === "Sale" && "bg-destructive text-destructive-foreground",
                            product.badge === "New" && "bg-primary text-primary-foreground",
                            product.badge === "Bestseller" && "bg-accent text-accent-foreground",
                            product.badge === "Limited Edition" && "bg-foreground text-background"
                            }
                        `
                        }>
                            {product.badge}
                        </span>
                    )}
                    {discount > 0 && (
                        <span className='px-2.5 py-1 text-[10px] font-semibold rounded-full bg-background/90 text-foreground'>
                            -{discount}%
                        </span>
                    )}
                </div>

                {/* Wishlist btn */}
                <button
                    onClick={(e) => { e.preventDefault(); toggleWishlist(product); }}
                    className='absolute right-3 top-3 z-10 h-9 w-9 rounded-full glass flex items-center justify-center transition-smooth hover:bg-background'
                    aria-label='Toggle wishlist'
                >
                    <Heart
                        className={`
                            h-4 w-4 transition-smooth 
                            ${hasInWishlist(product.id) ? "fill-destructive text-destructive" : "text-foreground"

                            }`
                        }
                    />
                </button>

                {/* Hover actions */}
                <div className={`absolute inset-x-3 bottom-3 z-10 flex gap-2 transition-all duration-500 ${hover ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}>
                    <button
                        onClick={() => addToCart(product)}
                        className='flex-1 h-10 rounded-full bg-foreground text-background text-xs font-medium tracking-wide flex items-center justify-center gap-2 hover:bg-primary transition-smooth'
                    >
                        <ShoppingBag className='h-3.5 w-3.5' /> Add to bag
                    </button>
                    {
                        onQuickView && (
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleQuickView();
                                }}
                                className='h-10 w-10 rounded-full border border-white/30 bg-background/90 text-foreground shadow-sm backdrop-blur flex items-center justify-center hover:bg-background transition-smooth'
                                aria-label='Quick view'
                            >
                                <Eye className='h-4 w-4' />
                            </button>
                        )
                    }
                </div>
            </div>
            <div className="mt-4 space-y-1.5">
                <p className="text-[11px] uppercase tracking-widest text-muted-foreground">
                    {product.brand}
                </p>
                <Link to={`/product/${product.id}`} className='block'>
                    <h3 className="font-display text-lg leading-snug hover:text-primary transition-smooth">
                        {product.name}
                    </h3>
                </Link>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Star className='h-3 w-3 fill-accent text-accent' />
                    <span className='font-medium text-foreground'>
                        {product.rating}
                    </span>
                    <span>({product.reviews})</span>
                </div>
                <div className="flex items-center gap-2 pt-1">
                    <span className="font-display text-lg">
                        ${product.price}
                    </span>
                    {product.originalPrice && (
                        <span className='text-sm text-muted-foreground line-through'>
                            ${product.originalPrice}
                        </span>
                    )}
                </div>
                <div className="flex gap-1.5 pt-1">
                    {product.colors.slice(0, 4).map((c) => (
                        <span key={c.name} className='h-3 w-3 rounded-full border border-border' style={{
                            backgroundColor: c.hex
                        }} title={c.name} />
                    ))}
                </div>
            </div>

        </motion.div>
    );
}

export default ProductCard;
