import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Search,
  SlidersHorizontal,
  MapPin,
  X,
} from "lucide-react";
import { supabase } from "../lib/supabase";

export default function Home() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [category, setCategory] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    async function fetchItems() {
      const { data, error } = await supabase
        .from("lostandfound")
        .select("*")
        .order("product_id", { ascending: true });

      if (error) {
        console.error("Supabase error:", error);
      } else {
        setItems(data || []);
      }

      setLoading(false);
    }

    fetchItems();
  }, []);

  const categories = useMemo(() => {
    const values = items
      .map((item) => item.category)
      .filter(Boolean);

    return ["all", ...new Set(values)];
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const name = item.product_name?.toLowerCase() || "";
      const location = item.location?.toLowerCase() || "";
      const query = search.toLowerCase();

      const matchesSearch =
        name.includes(query) ||
        location.includes(query);

      const matchesStatus =
        status === "all" ||
        item.status?.toLowerCase() === status;

      const matchesCategory =
        category === "all" ||
        item.category === category;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesCategory
      );
    });
  }, [items, search, status, category]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f5f3ee]">
        <section className="mx-auto max-w-6xl px-5 py-20 lg:px-8">
          <div className="animate-pulse">
            <div className="h-4 w-24 rounded bg-black/10" />
            <div className="mt-4 h-14 w-80 rounded bg-black/10" />
            <div className="mt-3 h-5 w-96 max-w-full rounded bg-black/10" />

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-[470px] rounded-[2rem] bg-white"
                />
              ))}
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f3ee]">

      {/* HERO / BOARD HEADER */}
      <section className="mx-auto max-w-6xl px-5 pb-8 pt-12 lg:px-8">

        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">

          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2">
              <span className="h-2 w-2 rounded-full bg-[#ff5c35]" />

              <span className="text-xs font-black uppercase tracking-wider">
                Your campus reunion board
              </span>
            </div>

            <p className="mt-7 text-xs font-black uppercase tracking-[0.25em] text-[#ff5c35]">
              THE BOARD
            </p>

            <h1 className="mt-2 text-5xl font-black tracking-[-0.055em] sm:text-6xl">
              Recent signals
            </h1>

            <p className="mt-3 max-w-xl text-base leading-7 text-black/50">
              Things reported by people around you.
              Search the board and help bring lost things home.
            </p>
          </div>

          <div className="rounded-[1.5rem] bg-[#171717] px-6 py-5 text-white lg:min-w-[190px]">
            <div className="text-3xl font-black">
              {items.length}
            </div>

            <div className="mt-1 text-xs font-bold uppercase tracking-widest text-white/50">
              Active signals
            </div>
          </div>

        </div>
      </section>

      {/* SEARCH + FILTERS */}
      <section className="mx-auto max-w-6xl px-5 lg:px-8">

        <div className="rounded-[2rem] border border-black/10 bg-white p-3">

          <div className="flex flex-col gap-3 md:flex-row">

            {/* SEARCH */}
            <div className="relative flex-1">
              <Search
                size={20}
                className="absolute left-5 top-1/2 -translate-y-1/2 text-black/30"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search item or location..."
                className="h-14 w-full rounded-2xl bg-[#f5f3ee] pl-14 pr-5 text-sm font-medium outline-none transition focus:ring-2 focus:ring-black/10"
              />
            </div>

            {/* FILTER BUTTON */}
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`flex h-14 items-center justify-center gap-2 rounded-2xl px-6 text-sm font-black transition ${
                showFilters
                  ? "bg-[#171717] text-white"
                  : "bg-[#f5f3ee] text-black"
              }`}
            >
              <SlidersHorizontal size={18} />
              Filters
            </button>

          </div>

          {/* FILTER AREA */}
          {showFilters && (
            <div className="mt-3 border-t border-black/10 pt-4">

              <div className="flex flex-wrap gap-2">

                <FilterButton
                  active={status === "all"}
                  onClick={() => setStatus("all")}
                >
                  All
                </FilterButton>

                <FilterButton
                  active={status === "lost"}
                  onClick={() => setStatus("lost")}
                >
                  Lost
                </FilterButton>

                <FilterButton
                  active={status === "found"}
                  onClick={() => setStatus("found")}
                >
                  Found
                </FilterButton>

                {categories
                  .filter((item) => item !== "all")
                  .map((item) => (
                    <FilterButton
                      key={item}
                      active={category === item}
                      onClick={() => setCategory(item)}
                    >
                      {item}
                    </FilterButton>
                  ))}
              </div>

              {(search || status !== "all" || category !== "all") && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setStatus("all");
                    setCategory("all");
                  }}
                  className="mt-4 inline-flex items-center gap-2 text-xs font-black text-[#ff5c35]"
                >
                  <X size={14} />
                  Clear filters
                </button>
              )}

            </div>
          )}

        </div>
      </section>

      {/* RESULTS */}
      <section className="mx-auto max-w-6xl px-5 pb-20 pt-10 lg:px-8">

        <div className="mb-5 flex items-center justify-between">

          <div>
            <h2 className="text-lg font-black">
              {filteredItems.length}{" "}
              {filteredItems.length === 1
                ? "signal"
                : "signals"}
            </h2>

            <p className="text-sm text-black/40">
              Browse reported items
            </p>
          </div>

        </div>

        {filteredItems.length === 0 ? (
          <div className="rounded-[2rem] bg-white px-6 py-20 text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f5f3ee]">
              <Search size={24} className="text-black/40" />
            </div>

            <h2 className="mt-5 text-2xl font-black">
              No signals found
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-black/45">
              Try another search term or remove your filters.
            </p>

          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

            {filteredItems.map((item) => (
              <ItemCard
                key={item.product_id}
                item={item}
              />
            ))}

          </div>
        )}

      </section>
    </main>
  );
}


/* ------------------------------------------------ */
/* ITEM CARD */
/* ------------------------------------------------ */

function ItemCard({ item }) {
  const isLost =
    item.status?.toLowerCase() === "lost";

  return (
    <Link
      to={`/item/${item.product_id}`}
      className="group block overflow-hidden rounded-[2rem] border border-black/10 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
    >

      {/* IMAGE */}
      <div className="relative h-[270px] overflow-hidden bg-[#e9e6de]">

        {item.img_url ? (
          <img
            src={item.img_url}
            alt={item.product_name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-black/30">
            No image
          </div>
        )}

        {/* STATUS */}
        <div
          className={`absolute left-4 top-4 rounded-full px-3 py-1.5 text-[11px] font-black uppercase tracking-wider ${
            isLost
              ? "bg-[#ffebe6] text-[#e84a25]"
              : "bg-[#e8f5eb] text-[#26733c]"
          }`}
        >
          {item.status || "reported"}
        </div>

        {/* MATCH / ID */}
        <div className="absolute right-4 top-4 rounded-full bg-black px-3 py-1.5 text-xs font-black text-white">
          #{item.product_id}
        </div>

      </div>

      {/* CARD CONTENT */}
      <div className="p-6">

        <div className="flex items-center justify-between">

          <span className="text-[10px] font-black uppercase tracking-[0.18em] text-black/35">
            {item.category || "Item"}
          </span>

        </div>

        <h2 className="mt-2 text-xl font-black tracking-tight">
          {item.product_name}
        </h2>

        {/* LOCATION */}
        {item.location && (
          <div className="mt-3 flex items-center gap-2 text-sm text-black/45">
            <MapPin size={15} />
            <span>{item.location}</span>
          </div>
        )}

        {/* CONTACT */}
        {item.user_phno && (
          <p className="mt-2 text-xs text-black/35">
            Contact available
          </p>
        )}

        <div className="mt-5 flex items-center justify-between border-t border-black/10 pt-5">

          <span className="text-xs font-bold text-black/35">
            View signal
          </span>

          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#171717] text-white transition group-hover:bg-[#ff5c35]">
            <ArrowRight size={16} />
          </span>

        </div>

      </div>
    </Link>
  );
}


/* ------------------------------------------------ */
/* FILTER BUTTON */
/* ------------------------------------------------ */

function FilterButton({ children, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-2.5 text-xs font-black transition ${
        active
          ? "bg-[#171717] text-white"
          : "bg-[#f5f3ee] text-black/60 hover:bg-black/10 hover:text-black"
      }`}
    >
      {children}
    </button>
  );
}