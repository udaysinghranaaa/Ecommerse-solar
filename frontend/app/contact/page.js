"use client";

import React, { useState } from "react";
import { Phone, Mail, MapPin, Send } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form);
    alert("Message Sent Successfully 🚀");
  };

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* HERO */}
      <section className="bg-blue-600 text-white py-16 text-center">
        <h1 className="text-4xl font-bold">Contact Us</h1>
        <p className="mt-2">We’d love to hear from you</p>
      </section>

      {/* MAIN */}
      <div className="max-w-6xl mx-auto px-4 py-12 grid md:grid-cols-2 gap-10">

        {/* LEFT - CONTACT INFO */}
        <div className="space-y-6">

          <div className="bg-white p-5 rounded-xl shadow">
            <div className="flex items-center gap-3">
              <Phone className="text-green-500" />
              <div>
                <p className="font-semibold">Call Us</p>
                <p>+91 9358622621</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl shadow">
            <div className="flex items-center gap-3">
              <Mail className="text-blue-500" />
              <div>
                <p className="font-semibold">Email</p>
                <p>hanssolarenergy@gmail.com</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl shadow">
            <div className="flex items-center gap-3">
              <MapPin className="text-red-500" />
              <div>
                <p className="font-semibold">Location</p>
                <p>Bulandshahr, Uttar Pradesh</p>
              </div>
            </div>
          </div>

          {/* WhatsApp CTA */}
          <a
            href="https://wa.me/919358622621"
            target="_blank"
            className="block text-center bg-green-500 text-white py-3 rounded-xl font-semibold"
          >
            Chat on WhatsApp
          </a>
        </div>

        {/* RIGHT - FORM */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-xl shadow space-y-4"
        >
          <h2 className="text-2xl font-bold">Send Message</h2>

          <input
            type="text"
            placeholder="Your Name"
            className="w-full border p-3 rounded-lg"
            required
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <input
            type="email"
            placeholder="Your Email"
            className="w-full border p-3 rounded-lg"
            required
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          <textarea
            placeholder="Your Message"
            className="w-full border p-3 rounded-lg"
            rows="5"
            required
            onChange={(e) =>
              setForm({ ...form, message: e.target.value })
            }
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg flex items-center justify-center gap-2"
          >
            <Send size={16} /> Send Message
          </button>
        </form>
      </div>

      {/* GOOGLE MAP */}
      <div className="max-w-6xl mx-auto px-4 pb-12">
        <iframe
          src="https://maps.google.com/maps?q=Bulandshahr&t=&z=13&ie=UTF8&iwloc=&output=embed"
          className="w-full h-80 rounded-xl border"
          loading="lazy"
        ></iframe>
      </div>
    </div>
  );
}