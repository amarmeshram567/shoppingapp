import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, MessageCircle, Paperclip, Send, Sparkles, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";

const quickQuestions = [
    "Help me place an order",
    "How do I track my order?",
    "Suggest something for daily use",
    "How do I add an address?"
];

const knowledgeBase = [
    {
        keywords: ["order", "place order", "buy", "checkout"],
        answer:
            "Add products to your bag, open Cart, click Proceed to checkout, fill shipping details, choose payment, and place the order.",
        links: [
            { label: "Shop", to: "/shop" },
            { label: "Cart", to: "/cart" }
        ]
    },
    {
        keywords: ["track", "order status", "my order", "orders"],
        answer:
            "Open Dashboard and go to Orders. You can check status, total, and each ordered product there.",
        links: [{ label: "Dashboard", to: "/dashboard" }]
    },
    {
        keywords: ["return", "refund", "exchange"],
        answer:
            "For returns or refunds, open FAQ for policy details or Contact support if you need direct help.",
        links: [
            { label: "FAQ", to: "/faq" },
            { label: "Contact", to: "/contact" }
        ]
    },
    {
        keywords: ["shipping", "delivery"],
        answer:
            "Shipping and tax are shown in Cart and Checkout. Saved addresses from your dashboard can also be reused.",
        links: [
            { label: "Checkout", to: "/checkout" },
            { label: "Addresses", to: "/dashboard" }
        ]
    },
    {
        keywords: ["coupon", "promo", "discount"],
        answer: "Apply your coupon on the Cart page before checkout. The discount will carry into the order summary.",
        links: [{ label: "Open cart", to: "/cart" }]
    },
    {
        keywords: ["login", "register", "account", "google", "sign in"],
        answer:
            "Use Login to sign in, register, or continue with Google. After signing in, your dashboard, orders, addresses, and wishlist will be available.",
        links: [
            { label: "Login", to: "/login" },
            { label: "Register", to: "/register" }
        ]
    },
    {
        keywords: ["address", "save address"],
        answer: "You can add or edit addresses in Dashboard > Addresses, and also select saved addresses during checkout.",
        links: [{ label: "Manage addresses", to: "/dashboard" }]
    },
    {
        keywords: ["help", "support", "talk", "contact"],
        answer: "I can guide you here, and for direct support you can also use the Contact page.",
        links: [{ label: "Contact support", to: "/contact" }]
    }
];

const defaultAssistantReply = {
    text: "I can help with shopping, orders, login, checkout, coupons, shipping, returns, wishlist, and addresses.",
    links: [
        { label: "Shop", to: "/shop" },
        { label: "FAQ", to: "/faq" }
    ]
};

const createAssistantMessage = (text, links = []) => ({
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    role: "assistant",
    text,
    links
});

const createUserMessage = (text) => ({
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    role: "user",
    text
});

const normalize = (value) => value.toLowerCase().trim();

const findBestReply = (input, context) => {
    const question = normalize(input);

    if (!question) return defaultAssistantReply;

    if (question.includes("my name") || question.includes("who am i") || question.includes("account")) {
        if (context.profile?.name || context.profile?.email) {
            return {
                text: `You are signed in as ${context.profile?.name || context.profile?.email}. You can manage your orders, addresses, and wishlist from the dashboard.`,
                links: [{ label: "Open dashboard", to: "/dashboard" }]
            };
        }

        return {
            text: "You are not signed in right now. Login or register to access dashboard, orders, wishlist, and addresses.",
            links: [
                { label: "Login", to: "/login" },
                { label: "Register", to: "/register" }
            ]
        };
    }

    if (question.includes("cart") || question.includes("bag")) {
        return {
            text: `You currently have ${context.count || 0} item${context.count === 1 ? "" : "s"} in your bag.`,
            links: [{ label: "Open cart", to: "/cart" }]
        };
    }

    if (question.includes("wishlist")) {
        return {
            text: `You currently have ${context.wishlistCount || 0} saved item${context.wishlistCount === 1 ? "" : "s"} in wishlist.`,
            links: [{ label: "View wishlist", to: "/wishlist" }]
        };
    }

    if (question.includes("products") || question.includes("catalog")) {
        return {
            text: `There are ${context.productCount || 0} products available to browse right now.`,
            links: [{ label: "Browse products", to: "/shop" }]
        };
    }

    if (question.includes("address")) {
        const addressCount = context.addressCount || 0;
        return {
            text:
                addressCount > 0
                    ? `You already have ${addressCount} saved address${addressCount === 1 ? "" : "es"}.`
                    : "You do not have a saved address yet, but you can add one from your dashboard.",
            links: [
                { label: "Dashboard", to: "/dashboard" },
                { label: "Checkout", to: "/checkout" }
            ]
        };
    }

    const match = knowledgeBase.find((entry) => entry.keywords.some((keyword) => question.includes(keyword)));
    return match ? { text: match.answer, links: match.links } : defaultAssistantReply;
};

const BubbleAvatar = ({ type }) => (
    <div
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold ${type === "assistant" ? "bg-[#f7d94c] text-[#24303d]" : "bg-white/90 text-slate-700"
            }`}
    >
        {type === "assistant" ? <Sparkles className="h-3.5 w-3.5" /> : "You"}
    </div>
);

const FloatingActions = () => {
    const { count, products, profile, wishlist } = useAppContext();
    const [show, setShow] = useState(false);
    const [chat, setChat] = useState(false);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([
        createAssistantMessage(
            "Hi, I'm your Lior assistant. Ask me about orders, checkout, products, shipping, returns, or account help.",
            [{ label: "Shop", to: "/shop" }]
        )
    ]);
    const messagesEndRef = useRef(null);

    const assistantContext = useMemo(
        () => ({
            count,
            productCount: products.length,
            profile,
            wishlistCount: wishlist.length,
            addressCount: profile?.addresses?.length || 0
        }),
        [count, products.length, profile, wishlist.length]
    );

    useEffect(() => {
        const onScroll = () => setShow(window.scrollY > 400);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        if (chat) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [chat, messages]);

    const askQuestion = (question) => {
        const trimmed = question.trim();
        if (!trimmed) return;

        const userMessage = createUserMessage(trimmed);
        const reply = findBestReply(trimmed, assistantContext);
        const assistantMessage = createAssistantMessage(reply.text, reply.links || []);

        setMessages((current) => [...current, userMessage, assistantMessage]);
        setInput("");
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        askQuestion(input);
    };

    return (
        <>
            <div className="fixed bottom-20 right-4 z-30 flex flex-col gap-3 md:bottom-6 md:right-6">
                <AnimatePresence>
                    {show ? (
                        <motion.button
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                            className="flex h-12 w-12 items-center justify-center rounded-full bg-foreground text-background shadow-luxe-xl transition-smooth hover:bg-primary"
                            aria-label="Back to top"
                        >
                            <ArrowUp className="h-5 w-5" />
                        </motion.button>
                    ) : null}
                </AnimatePresence>
                <button
                    onClick={() => setChat(true)}
                    className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground shadow-glow transition-smooth hover:scale-105"
                    aria-label="Open Lior assistant"
                >
                    <MessageCircle className="h-6 w-6" />
                </button>
            </div>

            <AnimatePresence>
                {chat ? (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setChat(false)}
                            className="fixed inset-0 z-40 bg-foreground/25 backdrop-blur-xl text-white"
                        />
                        <motion.div
                            initial={{ y: 40, opacity: 0, scale: 0.98 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: 40, opacity: 0, scale: 0.98 }}
                            transition={{ ease: [0.22, 1, 0.36, 1] }}
                            className="fixed bottom-24 right-4 z-50 flex h-[500px] w-[calc(100vw-2rem)] max-w-[25rem] flex-col overflow-hidden rounded-[28px] border border-white/15 bg-[#6a675d]/90 shadow-[0_30px_80px_rgba(0,0,0,0.28)] backdrop-blur-2xl md:right-6"
                        >
                            <div className="flex items-center justify-between border-b border-white/10 bg-black/10 px-4 py-3 text-white">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f7d94c] text-[#24303d] shadow-sm">
                                        <Sparkles className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="font-display text-[17px] leading-none">Aria</p>
                                        <p className="mt-1 text-xs text-white/75">AI style assistant</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setChat(false)}
                                    className="rounded-full p-2 text-white/75 transition-smooth hover:bg-white/10 hover:text-white"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>

                            <div className="border-b border-white/10 px-4 py-3">
                                <div className="flex flex-col gap-2">
                                    {quickQuestions.map((question) => (
                                        <button
                                            key={question}
                                            onClick={() => askQuestion(question)}
                                            className="rounded-2xl bg-white/10 px-3 py-2 text-left text-xs text-white/92 transition-smooth hover:bg-white/15"
                                        >
                                            {question}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
                                {messages.map((message) => (
                                    <div key={message.id} className={`flex items-end gap-2 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                                        {message.role === "assistant" ? <BubbleAvatar type="assistant" /> : null}
                                        <div
                                            className={`max-w-[78%] rounded-[18px] px-4 py-3 text-[13px] leading-relaxed shadow-sm ${message.role === "user"
                                                ? "rounded-br-md bg-white text-slate-800"
                                                : "rounded-bl-md bg-white text-slate-800"
                                                }`}
                                        >
                                            <p>{message.text}</p>
                                            {message.links?.length ? (
                                                <div className="mt-3 flex flex-wrap gap-2">
                                                    {message.links.map((link) => (
                                                        <Link
                                                            key={`${message.id}-${link.to}`}
                                                            to={link.to}
                                                            onClick={() => setChat(false)}
                                                            className="rounded-full bg-slate-100 px-3 py-1.5 text-[11px] font-medium text-slate-700 transition-smooth hover:bg-slate-200"
                                                        >
                                                            {link.label}
                                                        </Link>
                                                    ))}
                                                </div>
                                            ) : null}
                                        </div>
                                        {message.role === "user" ? <BubbleAvatar type="user" /> : null}
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>

                            <form onSubmit={handleSubmit} className="border-t border-white/10 px-3 py-3">
                                <div className="flex items-center gap-2 rounded-[20px] bg-white px-3 py-2 shadow-sm">
                                    <button
                                        type="button"
                                        className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition-smooth hover:bg-slate-100"
                                        aria-label="Attach"
                                    >
                                        <Paperclip className="h-4 w-4" />
                                    </button>
                                    <input
                                        value={input}
                                        onChange={(event) => setInput(event.target.value)}
                                        className="flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                                        placeholder="Ask anything about shopping..."
                                    />
                                    <button
                                        type="submit"
                                        className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0e3146] text-white transition-smooth hover:bg-[#18465f]"
                                        aria-label="Send question"
                                    >
                                        <Send className="h-4 w-4" />
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </>
                ) : null}
            </AnimatePresence>
        </>
    );
};

export default FloatingActions;
