import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Phone,
  Share2,
} from "lucide-react";
import { supabase } from "../lib/supabase";

export default function ItemDetail() {
  const { id } = useParams();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const handleShare = async () => {
  const shareData = {
    title: item?.product_name || "Lost & Found Item",
    text: `Check out this item: ${item?.product_name || "Lost & Found Item"}`,
    url: window.location.href,
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      await navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  } catch (error) {
    // User cancelled the share dialog
    if (error.name !== "AbortError") {
      console.error("Share failed:", error);
    }
  }
};

  useEffect(() => {
    fetchItem();
  }, [id]);

  async function fetchItem() {
    const { data, error } = await supabase
      .from("lostandfound")
      .select("*")
      .eq("product_id", id)
      .single();

    if (error) {
      console.error("Item error:", error);
      setItem(null);
    } else {
      setItem(data);
    }

    setLoading(false);
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f5f3ee] px-5 py-20 text-center">
        <p className="text-black/50">
          Loading item...
        </p>
      </main>
    );
  }

  if (!item) {
    return (
      <main className="min-h-screen bg-[#f5f3ee] px-5 py-20 text-center">
        <h1 className="text-3xl font-black">
          Item not found
        </h1>

        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-black px-5 py-3 text-sm font-bold text-white"
        >
          <ArrowLeft size={17} />
          Back to signals
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f3ee] px-5 py-10 lg:px-8">

      <div className="mx-auto max-w-6xl">

        {/* BACK */}
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-black/50 hover:text-black"
        >
          <ArrowLeft size={17} />
          Back to signals
        </Link>

        {/* CARD */}
        <div className="grid overflow-hidden rounded-[2rem] border border-black/10 bg-white lg:grid-cols-2">

          {/* IMAGE */}
          <div className="relative flex min-h-[550px] items-center justify-center overflow-hidden bg-[#e9e6de] p-8">

            <div className="absolute left-10 top-10 h-56 w-56 rounded-full border-[40px] border-white/30" />

            <div className="absolute bottom-10 right-10 h-72 w-72 rounded-full border-[50px] border-black/5" />

            <img
              src={item.img_url}
              alt={item.product_name}
              className="relative z-10 max-h-[480px] w-full max-w-[500px] rounded-[2rem] object-contain drop-shadow-2xl"
            />

            {/* STATUS */}
            <div className="absolute left-6 top-6 z-20 rounded-full bg-black px-4 py-2 text-xs font-black uppercase tracking-widest text-white">
              FOUND
            </div>

          </div>

          {/* DETAILS */}
          <div className="p-7 sm:p-10">

            <div className="flex items-center justify-between">

              <span className="rounded-full bg-[#ffebe6] px-4 py-2 text-xs font-black uppercase text-[#e84a25]">
                Found
              </span>

              <button
  type="button"
  onClick={handleShare}
  className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f5f3ee] text-black hover:bg-black hover:text-white transition"
  aria-label="Share item"
>
  <Share2 className="w-5 h-5" />
</button>

            </div>

            <div className="mt-8">

              <p className="text-xs font-black uppercase tracking-[0.2em] text-black/35">
                PRODUCT
              </p>

              <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">
                {item.product_name}
              </h1>

            </div>

            {/* INFO */}
            <div className="mt-9 grid grid-cols-1 gap-3 sm:grid-cols-2">

              <div className="rounded-2xl bg-[#f5f3ee] p-5">

                <div className="flex items-center gap-2 text-black/35">
                  <MapPin size={17} />

                  <span className="text-[10px] font-black uppercase tracking-widest">
                    Product ID
                  </span>
                </div>

                <p className="mt-3 text-lg font-black">
                  {item.product_id}
                </p>

              </div>

              <div className="rounded-2xl bg-[#f5f3ee] p-5">

                <div className="flex items-center gap-2 text-black/35">
                  <Phone size={17} />

                  <span className="text-[10px] font-black uppercase tracking-widest">
                    Contact
                  </span>
                </div>

                <p className="mt-3 text-lg font-black">
                  {item.user_phno}
                </p>

              </div>

            </div>

            {/* ACTION */}
            <div className="mt-8 border-t border-black/10 pt-8">

              <a
                href={`tel:${item.user_phno}`}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#171717] py-4 text-sm font-black text-white transition hover:bg-[#ff5c35]"
              >
                <Phone size={18} />
                Contact owner
              </a>

              <p className="mt-4 text-center text-xs leading-5 text-black/35">
                Confirm identifying details privately before arranging a handoff.
              </p>

            </div>

          </div>

        </div>

      </div>

    </main>
  );
}