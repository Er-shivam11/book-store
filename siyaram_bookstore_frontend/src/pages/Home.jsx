import React from "react";
import { useNavigate } from "react-router-dom";
import Books from "./Books";

// images
import s1 from "../assets/images/s1.jpg";
import s2 from "../assets/images/s2.jpg";
import s3 from "../assets/images/s3.jpg";
import heroImg from "../assets/images/hero.jpg";
import painImg from "../assets/images/pain.jpg";
import e from "../assets/images/e.jpg";
import c from "../assets/images/c.jpg";
import l from "../assets/images/l.jpg";
import d from "../assets/images/d.jpg";

const Home = () => {
  const navigate = useNavigate();

  const projects = [
    { name: "E-commerce Backend System", img: e },
    { name: "Real-time Chat App", img: c },
    { name: "LMS Platform", img: l },
    { name: "Admin Dashboard UI", img: d },
  ];

  const testimonials = [
    {
      text: "Got my first internship in 45 days after building these projects.",
      img: s1,
    },
    {
      text: "Interview questions were very similar. Helped me crack backend role.",
      img: s2,
    },
    {
      text: "Before this I was lost. Now I have a clear roadmap and confidence.",
      img: s3,
    },
  ];

  return (
    <div className="bg-white text-gray-900">

      {/* HERO */}
      <section className="px-6 py-20 md:py-28 bg-gradient-to-b from-gray-50 to-white">
  <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">

    {/* LEFT CONTENT */}
    <div>
      <h1 className="text-4xl md:text-6xl font-bold leading-tight">
        Get Your First Developer Job in 60 Days
      </h1>

      <p className="mt-6 text-lg text-gray-600">
        No more confusion. No more random tutorials.  
        Just real projects, interview prep, and a clear roadmap.
      </p>

      <div className="mt-8 flex gap-4 flex-wrap">
        <button
          onClick={() => navigate("/books")}
          className="bg-black text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-gray-800"
        >
          Buy Now & Start Career
        </button>

        <button
          onClick={() => navigate("/books")}
          className="border border-gray-300 px-8 py-3 rounded-full text-sm hover:bg-gray-100"
        >
          View Kits
        </button>
      </div>

      <div className="mt-6 text-sm text-gray-500 flex gap-6 flex-wrap">
        <span>2000+ Students</span>
        <span>Real Projects</span>
        <span>Interview Ready</span>
      </div>
    </div>

    {/* RIGHT IMAGE */}
    <div>
      <img
        src={heroImg}
        alt="developer working"
        className="w-full rounded-xl shadow-lg"
      />
    </div>

  </div>
</section>

      {/* PAIN SECTION */}
      <section className="px-6 py-16">
  <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">

    {/* IMAGE */}
    <div>
      <img
        src={painImg}
        alt="confused student"
        className="w-full max-w-sm h-96 object-cover rounded-xl shadow-lg"
      />
    </div>

    {/* TEXT */}
    <div>
      <h2 className="text-3xl font-semibold mb-6">
        Why You’re Not Getting Interviews
      </h2>

      <div className="text-gray-600 space-y-3">
        <p>❌ Watching tutorials but can’t build projects</p>
        <p>❌ Resume has no strong portfolio</p>
        <p>❌ Don’t know what companies ask</p>
        <p>❌ Applying everywhere but no replies</p>
      </div>

      <p className="mt-6 font-medium">
        This is why most freshers stay stuck for months.
      </p>
    </div>

  </div>
</section>

      {/* SOLUTION / SYSTEM */}
      <section className="px-6 py-20 bg-gray-50 text-center">
        <h2 className="text-3xl font-semibold mb-16">
          A Complete System to Get You Hired Faster
        </h2>

        <div className="relative max-w-3xl mx-auto h-[400px] hidden md:flex items-center justify-center">

          <button
            onClick={() => navigate("/books")}
            className="absolute bg-black text-white px-6 py-4 rounded-full text-sm font-medium shadow-lg hover:bg-gray-800"
          >
            Explore Kits
          </button>

          {[
            "📚 Ebooks",
            "💻 Projects",
            "🎯 Interview Prep",
            "🧑‍🏫 Mentorship",
            "🏢 Internship",
            "💼 Job Support",
          ].map((item, i) => {
            const angle = (i / 6) * 2 * Math.PI;
            const radius = 150;

            const x = radius * Math.cos(angle);
            const y = radius * Math.sin(angle);

            return (
              <div
                key={i}
                className="absolute bg-white px-4 py-2 rounded-full shadow-sm text-sm hover:shadow-md transition"
                style={{ transform: `translate(${x}px, ${y}px)` }}
              >
                {item}
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-2 gap-4 md:hidden mt-10">
          {[
            "📚 Ebooks",
            "💻 Projects",
            "🎯 Interview Prep",
            "🧑‍🏫 Mentorship",
            "🏢 Internship",
            "💼 Job Support",
          ].map((item, i) => (
            <div key={i} className="bg-white p-4 rounded-xl shadow-sm text-center">
              {item}
            </div>
          ))}
        </div>
      </section>

      {/* PROJECTS */}
      <section className="px-6 py-16">
        <h2 className="text-3xl font-semibold text-center mb-4">
          Projects That Get You Selected
        </h2>

        <p className="text-center text-gray-600 mb-10">
          Real-world systems you can confidently explain in interviews.
        </p>

        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-6">
          {projects.map((p, i) => (
            <div key={i} className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition">
              <img
                src={p.img}
                alt={p.name}
                className="h-32 w-full object-cover rounded mb-3"
              />
              <p className="text-sm font-medium text-center">{p.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="px-6 py-16 bg-gray-50">
        <h2 className="text-3xl font-semibold text-center mb-10">
          What Students Say
        </h2>

        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6 text-sm">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-sm text-center">
              <img
                src={t.img}
                alt="student"
                className="w-12 h-12 rounded-full mx-auto mb-3 object-cover"
              />
              <p>“{t.text}”</p>
            </div>
          ))}
        </div>
      </section>

      {/* BOOKS */}
      <section className="px-6 py-16">
        <h2 className="text-3xl font-semibold text-center mb-10">
          Interview Kits & Learning Packs
        </h2>
        <Books />
      </section>

      {/* URGENCY */}
      <section className="px-6 py-16 text-center bg-yellow-50">
        <h2 className="text-2xl font-semibold">
          Limited Time Offer
        </h2>

        <p className="mt-3 text-gray-600">
          Price will increase soon. Early users get full access at lowest price.
        </p>

        <p className="mt-2 font-medium text-red-500">
          Only serious students should join.
        </p>
      </section>

      {/* FINAL CTA */}
      <section className="px-6 py-20 text-center bg-black text-white">
        <h2 className="text-3xl md:text-4xl font-semibold mb-4">
          Stop Watching Tutorials. Start Building Your Career.
        </h2>

        <button
          onClick={() => navigate("/books")}
          className="mt-6 bg-white text-black px-8 py-3 rounded-full hover:bg-gray-200 transition"
        >
          Buy Now & Start Your Career
        </button>
      </section>

    </div>
  );
};

export default Home;