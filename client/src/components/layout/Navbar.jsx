import { AnimatePresence, motion } from 'framer-motion';
import { Heart, Menu, Moon, Search, ShoppingBag, Sun, User, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';


const navlinks = [
    { to: "/shop", label: "Shop", isActive: true },
    { to: "/categories", label: "Categories", isActive: false },
    { to: "/blog", label: "Journal", isActive: false },
    { to: "/about", label: "About", isActive: false },
    { to: "/contact", label: "Contact", isActive: false }
]


const searchOptions = [
    "Leather bags", "Watches", "Sneakers", "Cashmere"
]


const Navbar = () => {

    const { categories, count, ids, theme, toggleTheme } = useAppContext()

    const [scrolled, setScrolled] = useState(false)
    const [open, setOpen] = useState(false)
    const [searchOpen, setSearchOpen] = useState(false)
    const [megaOpen, setMegaOpen] = useState(false)
    const [q, setQ] = useState("")


    const navigate = useNavigate()



    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10)
        onScroll()
        window.addEventListener("scroll", onScroll)
        return () => window.removeEventListener("scroll", onScroll)
    }, [])


    // search fn
    const submitSearch = (e) => {
        e.preventDefault()
        if (q.trim()) {
            navigate(`/shop?q=${q.trim()}`)
            setQ("")
            setSearchOpen(false)
        }
    }


    return (
        <>
            <header className={` sticky top-0 z-40 transition-all duration-500 ${scrolled ? "glass shadow-sm" : "bg-background/0"}`}>
                <div className="container-luxe">
                    <div className="flex items-center justify-between h-16 md:h-20">
                        <div className="flex items-center">
                            <button
                                className='md:hidden -ml-2 p-2'
                                onClick={() => setOpen(true)}
                                aria-label='Menu'
                            >
                                <Menu className='h-5 w-5' />
                            </button>
                            <Link to="/" className='font-display text-2xl tracking-tight'>
                                Lior<span className='text-accent'>.</span>
                            </Link>
                        </div>

                        <nav className='hidden md:flex items-center gap-8'>
                            <button
                                onMouseEnter={() => setMegaOpen(true)}
                                onMouseLeave={() => setMegaOpen(false)}
                                onClick={() => navigate("/shop")}
                                className='relative text-sm font-medium tracking-wide hover:text-primary transition-smooth py-2'
                            >
                                Shop
                                <AnimatePresence>
                                    {megaOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className='absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[640px] glass rounded-2xl shadow-luxe-xl p-6 grid grid-cols-4 gap-4 text-left'
                                        >
                                            {categories.slice(0, 8).map((c) => (
                                                <Link key={c.id} to={`/shop?cat=${encodeURIComponent(c.name.toLowerCase())}`} className='group'>
                                                    <div className='aspect-square rounded-lg overflow-hidden bg-secondary mb-2'>
                                                        <img src={c.image} alt={c.name} className='h-full w-full object-cover group-hover:scale-105 transition-luxe' />
                                                    </div>
                                                    <p className="text-sm font-medium">{c.name}</p>
                                                    <p className="text-xs text-muted-foreground">{c.count} items</p>
                                                </Link>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </button>
                            {
                                navlinks.slice(1).map((l) => (
                                    <NavLink
                                        key={l.to}
                                        to={l.to}
                                        className={`text-sm font-medium tracking-smooth hover:text-primary ${l.isActive && "text-primary"}`}
                                    >
                                        {l.label}
                                    </NavLink>
                                ))
                            }
                        </nav>

                        <div className="flex items-center gap-1 md:gap-2">
                            <button onClick={() => setSearchOpen(true)} className='p-2 hover:text-primary transition-smooth' aria-label='Search'>
                                <Search className='h-5 w-5' />
                            </button>

                            <button onClick={toggleTheme} className='hidden md:block p-2 hover:text-primary transition-smooth' aria-label='Theme'>
                                {theme === "light" ? <Moon className='h-5 w-5' /> : <Sun className='h-5 w-5' />}
                            </button>

                            <Link to="/login" className='hidden md:block p-2 hover:text-primary transition-smooth' aria-label='Account'>
                                <User className='h-5 w-5' />
                            </Link>

                            <Link to='/wishlist' className='relative p-2 hover:text-primary transition-smooth' aria-label='Wishlist'>
                                <Heart className='h-5 w-5' />
                                {ids.length > 0 && (
                                    <span className='absolute top-0 right-0 h-4 w-4 text-[10px] font-semibold bg-accent text-accent-foreground rounded-full flex items-center justify-center'>
                                        {ids.length}
                                    </span>
                                )}
                            </Link>

                            <Link to="/cart" className='relative p-2 hover:text-primary transition-smooth' aria-label='Cart'>
                                <ShoppingBag className='h-5 w-5' />
                                {
                                    count > 0 && (
                                        <span className='absolute top-0 right-0 h-4 w-4 text-[10px] font-semibold bg-primary text-primary-foreground rounded-full flex items-center justify-center'>
                                            {count}
                                        </span>
                                    )
                                }
                            </Link>

                        </div>

                    </div>
                </div>
            </header>

            {/* Search overlay */}
            <AnimatePresence>
                {
                    searchOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className='fixed inset-0 z-50 bg-background/95 backdrop-blur-xl'
                            onClick={() => setSearchOpen(false)}
                        >

                            <motion.div
                                initial={{ y: -20 }}
                                animate={{ y: 0 }}
                                exit={{ y: -20 }}
                                className='container-luxe pt-32'
                                onClick={(e) => e.stopPropagation()}
                            >
                                <button
                                    onClick={() => setSearchOpen(false)}
                                    className='absolute top-6 right-6 p-2'
                                >
                                    <X className='h-6 w-6' />
                                </button>

                                {/* Search section form */}
                                <form onSubmit={submitSearch} className='max-w-2xl mx-auto'>
                                    <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">What are you looking for?</p>
                                    <div className="flex items-center border-b-2 border-foreground pb-2">
                                        <Search className='h-5 w-5 mr-3 text-muted-foreground' />
                                        <input
                                            type="text"
                                            autoFocus
                                            value={q}
                                            onChange={(e) => setQ(e.target.value)}
                                            placeholder='Search products, brands, categories...'
                                            className='flex-1 bg-transparent text-2xl outline-none placeholder:text-muted-foreground'
                                        />
                                    </div>

                                    <div className="mt-8 flex flex-wrap gap-2">
                                        {searchOptions.map((opt) => (
                                            <button
                                                key={opt}
                                                type='button'
                                                onClick={() => { setQ(opt); }}
                                                className='text-xs px-4 py-2 rounded-full border border-border hover:bg-secondary transition-smooth'
                                            >
                                                {opt}
                                            </button>
                                        ))}
                                    </div>

                                </form>

                            </motion.div>

                        </motion.div>
                    )
                }
            </AnimatePresence>


            {/* Mobile drawer */}
            <AnimatePresence>
                {
                    open && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className='fixed inset-0 bg-foreground/40 z-50'
                                onClick={() => setOpen(false)}
                            />

                            <motion.aside
                                initial={{ x: "-100%" }}
                                animate={{ x: 0 }}
                                exit={{ x: "-100%" }}
                                transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.4 }}
                                className='fixed inset-y-0 left-0 w-80 max-w-[85vw] z-50 bg-background p-6 flex flex-col'
                                onClick={() => setOpen(false)}
                            >
                                <div className='flex items-center justify-between mb-8'>
                                    <span className="font-display text-2xl">Lior <span className="text-accent">.</span></span>
                                    <button onClick={() => setOpen(false)} className='p-2'>
                                        <X className='h-5 w-5' />
                                    </button>
                                </div>

                                {/* Mobile navigation */}
                                <nav className='flex flex-col gap-1'>
                                    {navlinks.map((l) => (
                                        <NavLink
                                            key={l.to}
                                            to={l.to}
                                            onClick={() => setOpen(false)}
                                            className={`text-2xl font-display py-3 border-b border-border ${l.isActive && 'text-primary'}`}
                                        >
                                            {l.label}
                                        </NavLink>
                                    ))}
                                </nav>

                                <div className="mt-auto flex gap-3">
                                    <Link
                                        to="/login"
                                        onClick={() => setOpen(false)}
                                        className='flex-1 text-center py-3 rounded-full bg-foreground text-background text-sm font-medium'
                                    >
                                        Sign In
                                    </Link>
                                    <button
                                        onClick={toggleTheme}
                                        className='h-12 w-12 rounded-full border border-border flex items-center justify-center'
                                    >
                                        {theme === "light" ? <Moon className='h-5 w-5' /> : <Sun className='h-5 w-5' />}
                                    </button>
                                </div>

                            </motion.aside>
                        </>
                    )
                }
            </AnimatePresence>
        </>

    );
}

export default Navbar;
