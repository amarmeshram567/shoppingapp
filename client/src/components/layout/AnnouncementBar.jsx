import React from 'react';

const AnnouncementBar = () => {
    return (
        <div className="bg-foreground text-background overflow-hidden">
            <div className="container-luxe py-2.5 flex items-center justify-between text-xs tracking-wide">
                <span className="hidden sm:block opacity-70">Complimentary shipping on orders over $200</span>
                <div className="flex-1 sm:flex-none text-center font-medium">
                    <span className="text-accent">★</span> Spring Edit · Up to 30% off selected pieces <span className="text-accent">★</span>
                </div>
                <span className="hidden sm:block opacity-70">EN / USD</span>
            </div>
        </div>
    );
}

export default AnnouncementBar;
