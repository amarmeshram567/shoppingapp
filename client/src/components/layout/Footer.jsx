import React from 'react';
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import { Link } from 'react-router-dom';

const cols = [
  { title: "Shop", links: [["New Arrivals", "/shop?cat=new"], ["Bestseller", "/shop"], ["Sale", "/shop?cat=sale"], ["Gift Cards", "/shop"]] },
  { title: "Help", links: [["Contact", "/contact"], ["Shipping", "/faq"], ["Returns", "/faq"], ["Size Guide", "/faq"]] },
  { title: "About", links: [["Our Story", "/about"], ["Craftsmanship", "/about"], ["Sustainability", "/about"], ["Journal", "/blog"]] },
  { title: "Account", links: [["Sign In", "/login"], ["Register", "/register"], ["Orders", "/dashboard"], ["Wishlist", "/wishlist"]] },
]


const icons = [FaFacebook, FaInstagram, FaTwitter, FaYoutube]

const Footer = () => {
  return (
    <footer className='bg-foreground text-background mt-24'>
      <div className="container-luxe py-16 lg:py-20">
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-10">
          <div className='col-span-2'>
            <div className="font-display text-3xl mb-4">
              Lior <span className='text-accent'>.</span>
            </div>
            <p className='text-sm text-background/60 max-w-xs leading-relaxed mb-6'>
              Considered objects for the modern life. Craft in Europe. Shipped worldwide.
            </p>
            <div className="flex gap-3">
              {icons.map((Icon, i) => (
                <a key={i} href="#" className='h-10 w-10 rounded-full border border-background/20 flex items-center justify-center hover:bg-accent hover:text-accent-foreground hover:border-accent transition-smooth'>
                  <Icon className='h-5 w-5' />
                </a>
              ))}
            </div>
          </div>
          {
            cols.map((col) => (
              <div key={col.title}>
                <h4 className="font-display text-lg mb-4">
                  {col.title}
                </h4>
                <ul className='space-y-2.5 text-sm text-background/60'>
                  {
                    col.links.map(([label, href]) => (
                      <li key={label}>
                        <Link to={href} className='hover:text-accent transition-smooth'>
                          {label}
                        </Link>
                      </li>
                    ))
                  }
                </ul>
              </div>
            ))
          }
        </div>
        <div className="border-t border-background/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-background/50">
          <p>© 2026 Lior. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className='hover:text-accent transition-smooth'>
              Privacy
            </a>
            <a href="#" className='hover:text-accent transition-smooth'>
              Terms
            </a>
            <a href="#" className='hover:text-accent transition-smooth'>
              Cookies
            </a>
          </div>
        </div>
      </div>

    </footer>
  );
}

export default Footer;
