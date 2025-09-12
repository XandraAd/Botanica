import React, { useEffect, useState } from "react";
import DecorSpace from "./DecorSpace";
import { DECOR_URL } from "../store/constants";

const ShowDecorSpace = () => {
  const [decorItems, setDecorItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
  const fetchDecor = async () => {
  try {
    const res = await fetch(DECOR_URL);
    if (!res.ok) throw new Error("Failed to fetch decor inspirations");
    const data = await res.json();
    console.log("Fetched decor:", data); // 👀 should be an array
    setDecorItems(Array.isArray(data) ? data : []); // ✅ safeguard
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

    fetchDecor();
  }, []);

  if (loading) return <p className="text-center">Loading inspirations...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <section className="w-full bg-lime-50 py-16">
      <div className="w-[95%] mx-auto px-6 sm:px-8 lg:px-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-10">
          Show us how you <span className="text-green-600">#BotanicaYourSpace</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {decorItems.map((decor) => (
            <DecorSpace key={decor._id} collection={decor} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShowDecorSpace;
