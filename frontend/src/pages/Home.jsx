import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="pt-32 px-6 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="md:w-1/2 space-y-6"
                >
                    <h1 className="text-6xl font-extrabold leading-tight text-dark">
                        Delicious Food <br />
                        <span className="text-primary">Delivered To You</span>
                    </h1>
                    <p className="text-gray-500 text-lg">
                        Experience the best food delivery service in town. Fresh, fast, and reliable.
                    </p>
                    <div className="flex gap-4">
                        <Link to="/menu" className="btn-primary text-lg px-8 py-3">Order Now</Link>
                        <button className="px-8 py-3 rounded-full border-2 border-gray-300 font-semibold hover:border-dark transition-colors">
                            Learn More
                        </button>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="md:w-1/2 relative"
                >
                    <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl transform -translate-y-10"></div>
                    <img
                        src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                        alt="Delicious Food"
                        className="rounded-3xl shadow-2xl relative z-10 w-full object-cover h-[500px]"
                    />
                </motion.div>
            </div>

            <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 pb-12">
                <FeatureCard
                    title="Fast Delivery"
                    desc="We promise to deliver your food within 30 minutes."
                    img="https://images.unsplash.com/photo-1616036733221-789278f24458?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZmFzdCUyMGRlbGl2ZXJ5fGVufDB8fDB8fHww"
                />
                <FeatureCard
                    title="Fresh Food"
                    desc="Our food is prepared fresh upon order by top chefs."
                    img="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Zm9vZHxlbnwwfHwwfHx8MA%3D%3D"
                />
                <FeatureCard
                    title="Best Quality"
                    desc="We partner with the best restaurants in the city."
                    img="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D"
                />
            </div>
        </div>
    );
};

const FeatureCard = ({ title, desc, img }) => (
    <motion.div
        whileHover={{ y: -10 }}
        className="glass-card p-4 overflow-hidden"
    >
        <img src={img} alt={title} className="w-full h-48 object-cover rounded-xl mb-4" />
        <div className="p-2">
            <h3 className="text-xl font-bold mb-2">{title}</h3>
            <p className="text-gray-500">{desc}</p>
        </div>
    </motion.div>
);

export default Home;
