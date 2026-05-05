import React from 'react';
import { useAppContext } from '../context/AppContext';
import Layout from '../components/layout/Layout';
import { Heart, ShoppingBag, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const Wishlist = () => {
    const { wishlist, removeFromWishlist, addToCart } = useAppContext()
    const list = wishlist;

    return (
        <Layout>
            <div className="container-luxe py-12">
                <h1 className="font-display text-4xl md:text-5xl mb-2">Wishlist</h1>
                <p className="text-muted-foreground mb-10">{list.length} saved {list.length === 1 ? "piece" : "pieces"}</p>

                {list.length === 0 ? (
                    <div className="text-center py-24">
                        <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-6" />
                        <p className="font-display text-2xl mb-2">Your wishlist is empty</p>
                        <p className="text-muted-foreground mb-6">Save the pieces you love.</p>
                        <Link to="/shop" className="inline-block px-8 py-4 rounded-full bg-foreground text-background font-medium">Browse shop</Link>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {list.map((p) => (
                            <div key={p.id} className="group bg-card rounded-2xl overflow-hidden border border-border">
                                <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
                                    <Link to={`/product/${p.id}`}><img src={p.image} alt={p.name} className="h-full w-full object-cover group-hover:scale-105 transition-luxe duration-700" /></Link>
                                    <button onClick={() => removeFromWishlist(p.id)} className="absolute top-3 right-3 h-9 w-9 rounded-full glass flex items-center justify-center"><X className="h-4 w-4" /></button>
                                </div>
                                <div className="p-5">
                                    <p className="text-xs uppercase tracking-widest text-muted-foreground">{p.brand}</p>
                                    <Link to={`/product/${p.id}`}><h3 className="font-display text-xl my-1">{p.name}</h3></Link>
                                    <div className="flex justify-between items-center mt-3">
                                        <span className="font-display text-lg">${p.price}</span>
                                        <button onClick={() => addToCart(p)} className="px-4 py-2 rounded-full bg-foreground text-background text-xs font-medium flex items-center gap-1.5 hover:bg-primary transition-smooth">
                                            <ShoppingBag className="h-3 w-3" /> Add
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default Wishlist;
