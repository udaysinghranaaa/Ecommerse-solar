"use client";

import {
  FiZap,
  FiDollarSign,
  FiTool,
  FiSettings,
  FiSun,
  FiShield
} from "react-icons/fi";

export default function WhyChoose() {
  const features = [
    {
      title: "Reduced Electricity Bills",
      desc: "Generate your own power and significantly cut monthly electricity costs.",
      icon: <FiZap size={20} />
    },
    {
      title: "Low Maintenance",
      desc: "Our solar systems are durable and require minimal maintenance.",
      icon: <FiTool size={20} />
    },
    {
      title: "Easy Installation",
      desc: "Quick and hassle-free installation by our expert team.",
      icon: <FiSettings size={20} />
    },
    {
      title: "Eco Friendly",
      desc: "Reduce carbon footprint and contribute to a cleaner environment.",
      icon: <FiSun size={20} />
    },
    {
      title: "Secure Investment",
      desc: "Long-term savings with reliable and efficient solar systems.",
      icon: <FiShield size={20} />
    },
    {
      title: "Flexible Financing",
      desc: "Affordable payment options to make solar accessible for everyone.",
      icon: <FiDollarSign size={20} />
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">

        {/* 🔥 HEADER */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Why Choose Hans Solar
          </h2>
          <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
            Smart, sustainable, and cost-effective solar solutions designed for modern energy needs.
          </p>
          <div className="w-16 h-1 bg-green-500 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* 🔥 GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">

          {features.map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-4 p-6 border-b border-gray-200 hover:bg-gray-50 transition"
            >
              {/* ICON */}
              <div className="w-12 h-12 flex items-center justify-center bg-green-100 text-green-600 rounded-lg shrink-0">
                {item.icon}
              </div>

              {/* TEXT */}
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-sm mt-1 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}