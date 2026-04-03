import React from 'react';
import { motion } from 'framer-motion';

const Skeleton = ({ className, repeat = 1 }) => {
    return (
        <>
            {[...Array(repeat)].map((_, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0.5 }}
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className={`bg-white/10 rounded-xl ${className}`}
                />
            ))}
        </>
    );
};

export default Skeleton;
