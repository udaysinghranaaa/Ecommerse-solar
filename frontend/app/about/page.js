"use client";

import { motion } from "framer-motion";
import { FiSun, FiZap, FiShield, FiUsers, FiMapPin } from "react-icons/fi";

export default function About() {
  return (
    <div className="bg-white">

      {/* 🔥 HERO SECTION */}
      <section className="bg-gradient-to-r from-green-700 to-green-900 text-white py-24 text-center">
        <h1 className="text-4xl md:text-5xl font-bold">
          Hans Solar Renewable Energy
        </h1>
        <p className="mt-4 text-lg max-w-2xl mx-auto opacity-90">
          Powering India with clean, affordable & sustainable solar solutions since 2015
        </p>
      </section>

      {/* 🔥 COMPANY OVERVIEW */}
      <section className="py-16 max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-10 items-center">
        
        <img
          src="https://images.unsplash.com/photo-1509395176047-4a66953fd231"
          className="rounded-2xl shadow-xl"
        />

        <div>
          <h2 className="text-3xl font-bold mb-4">
            Who We Are
          </h2>

          <p className="text-gray-600 leading-relaxed">
            Hans Solar Renewable Energy India Private Limited is a trusted solar
            solutions provider based in Bulandshahr, Uttar Pradesh. Established
            in 2015, we specialize in delivering reliable and cost-effective
            solar energy systems for homes and businesses.
          </p>

          <p className="text-gray-600 mt-4">
            Our goal is to reduce electricity costs and promote clean energy
            adoption across India. With a strong focus on quality and service,
            we ensure seamless installation and long-term support.
          </p>
        </div>
      </section>

      {/* 🔥 COMPANY DETAILS */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">

          <h2 className="text-3xl font-bold text-center mb-10">
            Company Information
          </h2>

          <div className="grid md:grid-cols-2 gap-6 text-gray-700">

            <div className="bg-white p-6 rounded-xl shadow">
              <p><strong>Company Name:</strong> Hans Solar Renewable Energy India Pvt Ltd</p>
              <p><strong>CIN:</strong> U52100UP2015PTC073929</p>
              <p><strong>Incorporation:</strong> 16 October 2015</p>
              <p><strong>Status:</strong> Active</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <p><strong>Directors:</strong> Gajendra Singh Rana, Reeta Rana</p>
              <p><strong>Authorized Capital:</strong> ₹1,00,000</p>
              <p><strong>Paid-up Capital:</strong> ₹1,00,000</p>
              <p><strong>Registrar:</strong> ROC Kanpur</p>
            </div>

          </div>
        </div>
      </section>

      {/* 🔥 SERVICES */}
      <section className="py-16 max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-10">
          What We Do
        </h2>

        <div className="grid md:grid-cols-4 gap-6">

          {[
            "Solar Panel Installation",
            "EPC Projects",
            "Solar Product Supply",
            "Maintenance & Support",
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
            >
              <FiSun className="text-green-600 text-3xl mb-3 mx-auto" />
              <p className="font-semibold">{item}</p>
            </motion.div>
          ))}

        </div>
      </section>

      {/* 🔥 WHY CHOOSE US */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-6xl mx-auto px-4 text-center">

          <h2 className="text-3xl font-bold mb-10">
            Why Choose Hans Solar
          </h2>

          <div className="grid md:grid-cols-4 gap-6">

            {[
              { icon: <FiZap />, text: "Reduce Electricity Bills" },
              { icon: <FiSun />, text: "Clean Energy Solutions" },
              { icon: <FiShield />, text: "Trusted Local Brand" },
              { icon: <FiUsers />, text: "Expert Team Support" },
            ].map((item, i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow">
                <div className="text-green-600 text-3xl mb-3">
                  {item.icon}
                </div>
                <p>{item.text}</p>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* 🔥 LOCATION */}
      <section className="py-16 max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-6">
          Our Location
        </h2>

        <p className="text-gray-600 flex justify-center items-center gap-2">
          <FiMapPin /> Bulandshahr, Uttar Pradesh, India
        </p>

        <p className="text-gray-500 mt-2">
          Near Roadways Bus Stand, Sheetal Ganj
        </p>
      </section>

      {/* 🔥 CTA */}
      <section className="py-16 bg-green-700 text-white text-center">
        <h2 className="text-3xl font-bold">
          Start Saving with Solar Today
        </h2>
        <p className="mt-3 opacity-90">
          Switch to solar and reduce your electricity bills
        </p>

        <a
          href="/shop"
          className="inline-block mt-6 bg-white text-green-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100"
        >
          Explore Products →
        </a>
      </section>

    </div>
  );
}