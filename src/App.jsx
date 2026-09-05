import { useState } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Upload,
  Image as ImageIcon,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";

import Navbar from "./components/NavbarTemp";
import Home from "./pages/Home";
import ItemDetail from "./pages/ItemDetail";
import { supabase } from "./lib/supabase";


function ReportPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    product_name: "",
    status: "lost",
    category: "Personal",
    user_phno: "",
    location: "",
    description: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  }

  function handleImageChange(e) {
    const file = e.target.files?.[0];

    if (!file) return;

    // Allow common image formats
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    // Maximum 5 MB
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be smaller than 5 MB.");
      return;
    }

    setImageFile(file);
    setPreview(URL.createObjectURL(file));
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setSuccess("");

    // Required field validation
    if (!form.product_name.trim()) {
      setError("Please enter the item name.");
      return;
    }

    if (!form.user_phno.trim()) {
      setError("Please enter your contact number.");
      return;
    }

    if (!form.location.trim()) {
      setError("Please enter the location.");
      return;
    }

    if (!form.description.trim()) {
      setError("Please describe the item.");
      return;
    }

    try {
      setLoading(true);

      let imageUrl = null;

      // --------------------------------
      // 1. Upload image to Supabase
      // --------------------------------
      if (imageFile) {
        const fileExtension =
          imageFile.name.split(".").pop()?.toLowerCase() || "jpg";

        const fileName = `${Date.now()}-${Math.random()
          .toString(36)
          .substring(2, 10)}.${fileExtension}`;

        const filePath = `reports/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("images")
          .upload(filePath, imageFile, {
            cacheControl: "3600",
            upsert: false,
            contentType: imageFile.type,
          });

        if (uploadError) {
          throw new Error(
            `Image upload failed: ${uploadError.message}`
          );
        }

        // --------------------------------
        // 2. Get public image URL
        // --------------------------------
        const { data: publicUrlData } = supabase.storage
          .from("images")
          .getPublicUrl(filePath);

        imageUrl = publicUrlData.publicUrl;
      }

      // --------------------------------
      // 3. Generate product ID
      // --------------------------------
      const productId = Date.now();

      // --------------------------------
      // 4. Insert report into database
      // --------------------------------
      const { error: insertError } = await supabase
        .from("lostandfound")
        .insert([
          {
            product_id: productId,
            product_name: form.product_name.trim(),
            user_phno: Number(form.user_phno),
            img_url: imageUrl,
            status: form.status,
            category: form.category,
            location: form.location.trim(),
            description: form.description.trim(),
          },
        ]);

      if (insertError) {
        throw new Error(
          `Could not save report: ${insertError.message}`
        );
      }

      // --------------------------------
      // 5. Success
      // --------------------------------
      setSuccess("Your item has been reported successfully!");

      setForm({
        product_name: "",
        status: "lost",
        category: "Personal",
        user_phno: "",
        location: "",
        description: "",
      });

      setImageFile(null);
      setPreview("");

      // Give the user a moment to see success message
      setTimeout(() => {
        navigate("/");
      }, 1200);
    } catch (err) {
      console.error("Report error:", err);

      setError(
        err?.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="min-h-screen bg-[#f5f3ee] px-5 py-12 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-3xl">

        {/* Back button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-bold text-black/45 transition hover:text-black"
        >
          <ArrowLeft size={17} />
          Back to signals
        </Link>

        {/* Main card */}
        <div className="mt-8 overflow-hidden rounded-[2rem] border border-black/5 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.06)]">

          {/* Header */}
          <div className="border-b border-black/5 px-6 py-8 sm:px-10 sm:py-10">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-[#ff5c35]">
              TRACE
            </p>

            <h1 className="mt-3 text-4xl font-black tracking-tight text-[#171717] sm:text-5xl">
              Report an item
            </h1>

            <p className="mt-4 max-w-xl text-base leading-7 text-black/50">
              Lost something or found something? Add the details below
              so the right person can find it.
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-7 px-6 py-8 sm:px-10 sm:py-10"
          >

            {/* Item name */}
            <div>
              <label className="text-sm font-black text-[#171717]">
                Item name <span className="text-[#ff5c35]">*</span>
              </label>

              <input
                type="text"
                name="product_name"
                value={form.product_name}
                onChange={handleChange}
                placeholder="e.g. Black Casio Watch"
                className="mt-2 h-14 w-full rounded-2xl border border-black/10 bg-[#f5f3ee] px-5 text-base outline-none transition focus:border-black focus:bg-white"
              />
            </div>

            {/* Status */}
            <div>
              <label className="text-sm font-black text-[#171717]">
                Status <span className="text-[#ff5c35]">*</span>
              </label>

              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="mt-2 h-14 w-full rounded-2xl border border-black/10 bg-[#f5f3ee] px-5 text-base outline-none transition focus:border-black focus:bg-white"
              >
                <option value="lost">Lost</option>
                <option value="found">Found</option>
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="text-sm font-black text-[#171717]">
                Category <span className="text-[#ff5c35]">*</span>
              </label>

              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="mt-2 h-14 w-full rounded-2xl border border-black/10 bg-[#f5f3ee] px-5 text-base outline-none transition focus:border-black focus:bg-white"
              >
                <option value="Electronics">Electronics</option>
                <option value="Bags">Bags</option>
                <option value="Cards">Cards</option>
                <option value="Accessories">Accessories</option>
                <option value="Personal">Personal</option>
                <option value="Wallets">Wallets</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Contact */}
            <div>
              <label className="text-sm font-black text-[#171717]">
                Contact number <span className="text-[#ff5c35]">*</span>
              </label>

              <input
                type="tel"
                name="user_phno"
                value={form.user_phno}
                onChange={handleChange}
                placeholder="e.g. 9876543210"
                inputMode="numeric"
                className="mt-2 h-14 w-full rounded-2xl border border-black/10 bg-[#f5f3ee] px-5 text-base outline-none transition focus:border-black focus:bg-white"
              />
            </div>

            {/* Location */}
            <div>
              <label className="text-sm font-black text-[#171717]">
                Location <span className="text-[#ff5c35]">*</span>
              </label>

              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="e.g. Central Library"
                className="mt-2 h-14 w-full rounded-2xl border border-black/10 bg-[#f5f3ee] px-5 text-base outline-none transition focus:border-black focus:bg-white"
              />
            </div>

            {/* Description */}
            <div>
              <label className="text-sm font-black text-[#171717]">
                Description <span className="text-[#ff5c35]">*</span>
              </label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe the item, color, identifying marks, etc."
                rows={5}
                className="mt-2 w-full resize-none rounded-2xl border border-black/10 bg-[#f5f3ee] p-5 text-base outline-none transition focus:border-black focus:bg-white"
              />
            </div>

            {/* Image upload */}
            <div>
              <label className="text-sm font-black text-[#171717]">
                Item image
              </label>

              <div className="mt-2">

                {preview ? (
                  <div className="relative overflow-hidden rounded-2xl border border-black/10 bg-[#f5f3ee]">

                    <img
                      src={preview}
                      alt="Selected item"
                      className="h-64 w-full object-cover"
                    />

                    <label className="absolute bottom-4 right-4 cursor-pointer rounded-full bg-[#171717] px-4 py-2.5 text-sm font-bold text-white shadow-lg transition hover:bg-[#ff5c35]">
                      Change image

                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                ) : (
                  <label className="flex min-h-48 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-black/10 bg-[#f5f3ee] px-5 text-center transition hover:border-[#ff5c35] hover:bg-white">

                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm">
                      <Upload size={22} />
                    </div>

                    <p className="mt-4 text-sm font-black text-[#171717]">
                      Upload an image
                    </p>

                    <p className="mt-1 text-xs text-black/40">
                      JPG, PNG or WEBP · Maximum 5 MB
                    </p>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-3 rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-600">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="flex items-start gap-3 rounded-2xl bg-green-50 p-4 text-sm font-semibold text-green-700">
                <CheckCircle className="mt-0.5 h-5 w-5 shrink-0" />
                <span>{success}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#171717] text-sm font-black text-white transition hover:bg-[#ff5c35] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <ImageIcon className="h-5 w-5" />
                  Submit report
                </>
              )}
            </button>

            <p className="text-center text-xs text-black/35">
              Your report will appear on the TRACE board after submission.
            </p>

          </form>
        </div>
      </div>
    </section>
  );
}


function App() {
  return (
    <div className="min-h-screen bg-[#f5f3ee] text-[#171717]">

      <Navbar />

      <main>
        <Routes>

          {/* Home / Board */}
          <Route
            path="/"
            element={<Home />}
          />

          {/* Item details */}
          <Route
            path="/item/:id"
            element={<ItemDetail />}
          />

          {/* Report item */}
          <Route
            path="/report"
            element={<ReportPage />}
          />

        </Routes>
      </main>

    </div>
  );
}

export default App;