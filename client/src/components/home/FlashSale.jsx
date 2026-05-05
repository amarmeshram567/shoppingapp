import React, { useEffect, useState } from 'react';
import ProductCard from '../ProductCard';
import QuickViewModal from './QuickViewModal';
import { useAppContext } from '../../context/AppContext';
import { ProductCardSkeletonGrid } from '../ProductSkeletons';

const useCountdown = (target) => {
    const [time, setTime] = useState(target - Date.now());

    useEffect(() => {
        const intervalId = setInterval(() => setTime(target - Date.now()), 1000);
        return () => clearInterval(intervalId);
    }, [target]);

    const seconds = Math.max(0, Math.floor(time / 1000));

    return {
        d: Math.floor(seconds / 86400),
        h: Math.floor((seconds % 86400) / 3600),
        m: Math.floor((seconds % 3600) / 60),
        s: Math.floor(seconds % 60)
    };
};

const FlashSale = () => {
    const { featuredProducts, products, loadingStore } = useAppContext();
    const saleProducts = (featuredProducts.length ? featuredProducts : products)
        .filter((product) => product.originalPrice)
        .slice(0, 4);

    const target = useState(Date.now() + 1000 * 60 * 60 * 36)[0];
    const { d, h, m, s } = useCountdown(target);
    const [quick, setQuick] = useState(null);

    return (
        <section className='py-20 lg:py-28 bg-gradient-dark text-background'>
            <div className="container-luxe">
                <div className="flex flex-col lg:flex-row items-end lg:items-center justify-between gap-6 mb-12">
                    <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-accent mb-3">Limited time</p>
                        <h2 className="font-display text-4xl md:text-5xl">Flash Sale - up to 40% off</h2>
                    </div>
                </div>

                <div className="flex gap-3">
                    {[["Days", d], ["Hours", h], ["Min", m], ["Sec", s]].map(([label, value]) => (
                        <div key={label} className="bg-background/10 backdrop-blur rounded-xl py-3 text-center min-w-[70px]">
                            <div className="font-display text-3xl tabular-nums">{String(value).padStart(2, "0")}</div>
                            <div className="text-[10px] uppercase tracking-widest opacity-60">{label}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
                {loadingStore ? (
                    <ProductCardSkeletonGrid
                        count={4}
                        className="col-span-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                    />
                ) : (
                    saleProducts.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            onQuickView={setQuick}
                        />
                    ))
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

export default FlashSale;
