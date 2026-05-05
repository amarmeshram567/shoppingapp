import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Layout from "../components/layout/Layout";
import { CategoryGridSkeleton } from "../components/ProductSkeletons";
import { useAppContext } from "../context/AppContext";

const Categories = () => {
  const { categories, loadingStore } = useAppContext();

  return (
    <Layout>
      <section className="bg-gradient-warm py-16">
        <div className="container-luxe text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-accent">Browse</p>
          <h1 className="font-display text-5xl md:text-6xl">All categories</h1>
          <p className="mx-auto mt-3 max-w-md text-muted-foreground">
            Explore our live catalogue, grouped by the collections your backend is serving right now.
          </p>
        </div>
      </section>

      {loadingStore ? (
        <CategoryGridSkeleton />
      ) : (
        <div className="container-luxe grid grid-cols-1 gap-6 py-16 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <Link to={`/shop?cat=${category.name.toLowerCase()}`} className="group block">
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-secondary">
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition-luxe duration-700 group-hover:scale-110"
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/10 to-transparent" />
                  <div className="absolute inset-0 flex flex-col justify-end p-6 text-background">
                    <p className="text-xs uppercase tracking-widest opacity-70">{category.count} pieces</p>
                    <h3 className="font-display text-3xl">{category.name}</h3>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </Layout>
  );
};

export default Categories;
