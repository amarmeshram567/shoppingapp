import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Heart, Star, ArrowRight, Minus, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

const QuickViewModal = ({ product, open, onClose }) => {
    const { addToCart, toggleWishlist, hasInWishlist } = useAppContext()

    // console.log(product);

    const [imgIdx, setImgIdx] = useState(0);
    const [qty, setQty] = useState(1);
    const [color, setColor] = useState(product?.colors?.[0]?.name ?? null);
    const [size, setSize] = useState(product?.sizes?.[0] ?? null);


    useEffect(() => {
        if (!open || !product) return;
        setImgIdx(0);
        setQty(1);
        setColor(product.colors?.[0]?.name ?? null);
        setSize(product.sizes?.[0] ?? null);

        const onKey = (e) => e.key === 'Escape' && onClose();
        document.addEventListener('keydown', onKey);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = '';
        }
    }, [open, product, onClose]);


    if (!product) return null;

    const discount = product.originalPrice
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;

    return (
        <AnimatePresence>
            {open && product && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className='fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6'
                    onClick={onClose}
                >
                    <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" />
                    <motion.div
                        initial={{ opacity: 0, y: 30, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.97 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        onClick={(e) => e.stopPropagation()}
                        className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl bg-background shadow-2xl border border-border"
                    >
                        <button onClick={onClose} className="absolute right-4 top-4 z-10 h-10 w-10 rounded-full glass flex items-center justify-center hover:bg-background transition-smooth" aria-label="Close">
                            <X className="h-4 w-4" />
                        </button>

                        <div className="grid md:grid-cols-2 gap-0">
                            <div className="bg-secondary p-6 md:p-8">
                                <div className="aspect-square rounded-xl overflow-hidden bg-background mb-4">
                                    <motion.img key={imgIdx} initial={{ opacity: 0 }} animate={{ opacity: 1 }} src={product.images[imgIdx]} alt={product.name} className="h-full w-full object-cover" />
                                </div>
                                <div className="flex gap-2">
                                    {product.images.map((img, i) => (
                                        <button key={i} onClick={() => setImgIdx(i)} className={`h-16 w-16 rounded-lg overflow-hidden border-2 transition-smooth ${i === imgIdx ? "border-foreground" : "border-transparent opacity-60 hover:opacity-100"}`}>
                                            <img src={img} alt="" className="h-full w-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="p-6 md:p-8 flex flex-col">
                                <p className="text-[11px] uppercase tracking-[0.3em] text-accent mb-2">{product.brand}</p>
                                <h2 className="font-display text-2xl md:text-3xl mb-3">{product.name}</h2>

                                <div className="flex items-center gap-3 mb-4">
                                    <div className="flex gap-0.5">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <Star key={i} className={`h-3.5 w-3.5  ${i < Math.round(product.rating) ? "fill-accent text-accent" : "text-muted"}`} />
                                        ))}
                                    </div>
                                    <span className="text-xs text-muted-foreground">{product.rating} · {product.reviews} reviews</span>
                                </div>

                                <div className="flex items-baseline gap-3 mb-5">
                                    <span className="font-display text-3xl">${product.price}</span>
                                    {product.originalPrice && (
                                        <>
                                            <span className="text-base text-muted-foreground line-through">${product.originalPrice}</span>
                                            {discount > 0 && <span className="text-xs font-medium text-destructive">-{discount}%</span>}
                                        </>
                                    )}
                                </div>

                                <p className="text-sm text-muted-foreground leading-relaxed mb-5 line-clamp-3">{product.description}</p>

                                {product.colors?.length > 0 && (
                                    <div className="mb-4">
                                        <p className="text-xs font-medium mb-2">Color: <span className="text-muted-foreground">{color}</span></p>
                                        <div className="flex gap-2">
                                            {product.colors.map((c) => (
                                                <button key={c.name} onClick={() => setColor(c.name)} className={`h-8 w-8 rounded-full border-2 transition-smooth ${color === c.name ? "border-foreground scale-110" : "border-border"}`} style={{ backgroundColor: c.hex }} aria-label={c.name} />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {product.sizes?.length > 0 && (
                                    <div className="mb-5">
                                        <p className="text-xs font-medium mb-2">Size</p>
                                        <div className="flex flex-wrap gap-2">
                                            {product.sizes.map((s) => (
                                                <button key={s} onClick={() => setSize(s)} className={`min-w-[44px] h-10 px-3 rounded-lg border text-xs font-medium transition-smooth ${size === s ? "border-foreground bg-foreground text-background" : "border-border hover:border-foreground"}`}>{s}</button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center gap-3 mb-5">
                                    <div className="flex items-center border border-border rounded-full">
                                        <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-2.5" aria-label="Decrease"><Minus className="h-3.5 w-3.5" /></button>
                                        <span className="w-8 text-center text-sm font-medium">{qty}</span>
                                        <button onClick={() => setQty(qty + 1)} className="p-2.5" aria-label="Increase"><Plus className="h-3.5 w-3.5" /></button>
                                    </div>
                                    {product.inStock && <span className="text-xs text-success font-medium">● In stock</span>}
                                </div>

                                <div className="flex gap-2 mt-auto">
                                    <button onClick={() => {
                                        addToCart(product,
                                            { color, size, quantity: qty });
                                        onClose();
                                    }
                                    } className="flex-1 h-12 rounded-full bg-foreground text-background text-sm font-medium flex items-center justify-center gap-2 hover:bg-primary transition-smooth">
                                        <ShoppingBag className="h-4 w-4" /> Add to bag
                                    </button>
                                    <button onClick={() => toggleWishlist(product)} className="h-12 w-12 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-smooth" aria-label="Wishlist">
                                        <Heart className={`h-4 w-4 ${hasInWishlist(product.id) && "fill-destructive text-destructive"}`} />
                                    </button>
                                </div>

                                <Link to={`/product/${product.id}`} onClick={onClose} className="mt-3 text-xs uppercase tracking-widest text-foreground/80 hover:text-foreground transition-smooth flex items-center gap-1.5 justify-center">
                                    View full details <ArrowRight className="h-3 w-3" />
                                </Link>
                            </div>

                        </div>

                    </motion.div>


                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default QuickViewModal;



/*
  <motion.div
                className="fixed inset-0 z-[100] backdrop-blur-sm flex items-center justify-center p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            >
                <motion.div
                    className="relative bg-background rounded-2xl overflow-hidden w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 shadow-2xl"
                    initial={{ opacity: 0, scale: 0.96, y: 16 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96, y: 16 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    onClick={(e) => e.stopPropagation()}
                >
                   
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 z-10 h-8 w-8 rounded-full bg-background/80 flex items-center justify-center hover:bg-secondary transition-smooth"
                        aria-label="Close quick view"
                    >
                        <X className="h-4 w-4" />
                    </button>

                   
                    <div className="aspect-[4/5] md:aspect-auto bg-secondary overflow-hidden">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="h-full w-full object-cover"
                        />
                    </div>

                   
                    <div className="flex flex-col gap-5 p-7 overflow-y-auto max-h-[80vh]">
                        <div>
                            <p className="text-[11px] uppercase tracking-widest text-muted-foreground mb-1">
                                {product.brand}
                            </p>
                            <h2 className="font-display text-2xl leading-snug">{product.name}</h2>

                            <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
                                <Star className="h-3 w-3 fill-accent text-accent" />
                                <span className="font-medium text-foreground">{product.rating}</span>
                                <span>({product.reviews} reviews)</span>
                            </div>
                        </div>

                       
                        <div className="flex items-center gap-2">
                            <span className="font-display text-2xl">${product.price}</span>
                            {product.originalPrice && (
                                <span className="text-sm text-muted-foreground line-through">
                                    ${product.originalPrice}
                                </span>
                            )}
                            {discount > 0 && (
                                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-destructive/10 text-destructive">
                                    -{discount}%
                                </span>
                            )}
                        </div>

                        
                        {product.colors?.length > 0 && (
                            <div>
                                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2.5">
                                    Color — <span className="text-foreground normal-case tracking-normal">{selectedColor?.name}</span>
                                </p>
                                <div className="flex gap-2 flex-wrap">
                                    {product.colors.map((c) => (
                                        <button
                                            key={c.name}
                                            onClick={() => setSelectedColor(c)}
                                            title={c.name}
                                            className={`h-6 w-6 rounded-full border-2 transition-smooth ${selectedColor?.name === c.name
                                                ? 'border-foreground scale-110'
                                                : 'border-transparent hover:border-muted-foreground'
                                                }`}
                                            style={{ backgroundColor: c.hex }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        
                        {product.sizes?.length > 0 && (
                            <div>
                                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2.5">Size</p>
                                <div className="flex gap-2 flex-wrap">
                                    {product.sizes.map((s) => (
                                        <button
                                            key={s}
                                            onClick={() => setSelectedSize(s)}
                                            className={`h-9 min-w-[2.5rem] px-3 rounded-md text-sm border transition-smooth ${selectedSize === s
                                                ? 'border-foreground bg-foreground text-background'
                                                : 'border-border hover:border-foreground'
                                                }`}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        
                        <div className="flex gap-3 mt-auto pt-2">
                            <button className="flex-1 h-12 rounded-full bg-foreground text-background text-sm font-medium flex items-center justify-center gap-2 hover:bg-primary transition-smooth">
                                <ShoppingBag className="h-4 w-4" /> Add to bag
                            </button>
                            <button
                                className="h-12 w-12 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-smooth"
                                aria-label="Add to wishlist"
                            >
                                <Heart className="h-4 w-4" />
                            </button>
                        </div>

                        
                        <Link
                            to={`/product/${product.id}`}
                            onClick={onClose}
                            className="text-center text-xs text-muted-foreground hover:text-foreground underline underline-offset-4 transition-smooth"
                        >
                            View full details
                        </Link>
                    </div>
                </motion.div>
            </motion.div>
*/
