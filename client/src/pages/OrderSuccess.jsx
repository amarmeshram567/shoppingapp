import React from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { CheckCircle2, Package, Truck } from "lucide-react";
import Layout from "../components/layout/Layout";

const steps = [
  { Icon: CheckCircle2, title: "Confirmed", active: true },
  { Icon: Package, title: "Packed", active: false },
  { Icon: Truck, title: "Shipped", active: false }
];

const OrderSuccess = () => {
  const location = useLocation();
  const orderId = location.state?.orderId || "Pending";
  const total = location.state?.total;
  const email = location.state?.email;

  return (
    <Layout>
      <div className="container-luxe mx-auto max-w-2xl py-20 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.8 }}
          className="inline-block"
        >
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-success/10">
            <CheckCircle2 className="h-12 w-12 text-success" />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <p className="mb-3 mt-8 text-xs uppercase tracking-[0.3em] text-accent">Order confirmed</p>
          <h1 className="mb-4 font-display text-4xl md:text-6xl">Thank you.</h1>
          <p className="mb-2 text-lg text-muted-foreground">
            Your order <span className="font-medium text-foreground">#{orderId}</span> has been placed.
          </p>
          <p className="mb-12 text-muted-foreground">
            {email ? `We've sent a confirmation to ${email}.` : "We've sent a confirmation to your email."}
          </p>

          <div className="mx-auto mb-6 max-w-md rounded-2xl border border-border bg-card p-5 text-left">
            <p className="text-sm text-muted-foreground">Status</p>
            <p className="font-medium text-foreground">Pending fulfillment</p>
            {typeof total === "number" ? (
              <>
                <p className="mt-4 text-sm text-muted-foreground">Order total</p>
                <p className="font-display text-2xl text-foreground">${Number(total).toFixed(2)}</p>
              </>
            ) : null}
          </div>

          <div className="mx-auto mb-12 grid max-w-md grid-cols-3 gap-4">
            {steps.map(({ Icon, title, active }) => (
              <div key={title} className="flex flex-col items-center gap-2">
                <div className={`flex h-12 w-12 items-center justify-center rounded-full ${active ? "bg-foreground text-background" : "bg-secondary text-muted-foreground"}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <p className="text-xs">{title}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/dashboard" className="rounded-full bg-foreground px-8 py-4 font-medium text-background">
              Track order
            </Link>
            <Link to="/shop" className="rounded-full border border-border px-8 py-4 font-medium">
              Continue shopping
            </Link>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default OrderSuccess;
