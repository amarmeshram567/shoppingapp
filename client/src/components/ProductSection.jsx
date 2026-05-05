import { ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import QuickViewModal from './home/QuickViewModal';
import { ProductCardSkeletonGrid } from './ProductSkeletons';

const ProductSection = ({ title, eyebrow, list, loading = false }) => {
    const [quick, setQuick] = useState(null);

    return (
        <section className="py-20 lg:py-28">
            <div className="container-luxe">
                <div className="flex items-end justify-between mb-12">
                    <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-accent mb-3">{eyebrow}</p>
                        <h2 className="font-display text-4xl md:text-5xl">{title}</h2>
                    </div>
                    <Link to="/shop" className="hidden md:flex items-center gap-2 text-sm story-link">
                        Shop all <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>

                {loading ? (
                    <ProductCardSkeletonGrid count={4} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8" />
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                        {list.slice(0, 4).map((p) => (
                            <ProductCard
                                key={p.id}
                                product={p}
                                onQuickView={setQuick}
                            />
                        ))}
                    </div>
                )}
            </div>

            <QuickViewModal
                product={quick}
                open={!!quick}
                onClose={() => setQuick(null)}
            />
        </section>
    );
};

export default ProductSection;
