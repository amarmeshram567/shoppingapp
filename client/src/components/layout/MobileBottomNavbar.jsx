import { Heart, Home, Search, ShoppingBag, User } from 'lucide-react';
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';




const items = [
    { to: '/', icon: Home, label: 'Home' },
    { to: "/shop", icon: Search, label: 'Shop' },
    { to: "/wishlist", icon: Heart, label: 'Saved', badgeKey: 'wish' },
    { to: "/cart", icon: ShoppingBag, label: 'Bag', badgeKey: 'cart' },
    { to: "/dashboard", icon: User, label: 'Me' },
]

const MobileBottomNavbar = () => {

    const { count, ids } = useAppContext()

    // console.log(count);

    return (
        <nav className='md:hidden fixed bottom-0 inset-x-0 z-30 glass border-t border-border'>
            <ul className='grid grid-cols-5'>
                {
                    items.map((it) => {
                        const Icon = it.icon
                        const badge = it.badgeKey === 'cart' ? count : it.badgeKey === 'wish' ? ids.length : 0;

                        return (
                            <li key={it.to}>
                                <NavLink to={it.to} end={it.to === "/"} className={({ isActive }) => `flex flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-medium relative ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                                    <div className="relative">
                                        <Icon className='h-5 w-5' />
                                        {badge > 0 &&
                                            <span className='absolute -top-1 -right-2 h-4 w-4 text-[9px] font-bold bg-accent text-accent-foreground rounded-full flex items-center justify-center'>
                                                {badge}
                                            </span>}
                                    </div>
                                    {it.label}
                                </NavLink>
                            </li>
                        )
                    })
                }
            </ul>

        </nav>
    );
}

export default MobileBottomNavbar;
