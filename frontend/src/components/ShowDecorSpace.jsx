import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchDecor } from "../slices/decorSlice";
import DecorSpace from "./DecorSpace";

const ShowDecorSpace = () => {
  const dispatch = useDispatch();
  const { items: decorItems, loading, error } = useSelector(state => state.decor);

  useEffect(() => { dispatch(fetchDecor()); }, [dispatch]);

  if (loading) return <p>Loading inspirations...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <section className="w-full bg-lime-50 py-16">
      <div className="w-[95%] mx-auto px-6 sm:px-8 lg:px-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-10">
          Show us how you <span className="text-green-600">#BotanicaYourSpace</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {decorItems.map(decor => <DecorSpace key={decor._id} collection={decor} />)}
        </div>
      </div>
    </section>
  );
};

export default ShowDecorSpace;
