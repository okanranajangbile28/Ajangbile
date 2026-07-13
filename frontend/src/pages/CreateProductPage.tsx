import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { Save, ImagePlus } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const categories = [
  "Books",
  "Herbs",
  "Spiritual Materials",
  "Jewelry",
  "Clothing",
  "Accessories",
];

const emptyForm = {
  productName: "",
  description: "",
  price: "",
  discount: "",
  category: "Books",
  totalQuantity: "",
  unit: "",
  featured: false,
  priceID: "",
};

const CreateProductPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState(emptyForm);

  const [images, setImages] = useState<File[]>([]);

  const [existingImages, setExistingImages] = useState<string[]>([]);

  // LOAD PRODUCT FOR EDIT

  useEffect(() => {
    const getProduct = async () => {
      if (!id) return;

      try {
        setLoading(true);

        const res = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/products/${id}`,
        );

        const product = res.data.data;

        setForm({
          productName: product.productName || "",
          description: product.description || "",
          price: String(product.price || ""),
          discount: String(product.discount || ""),
          category: product.category || "Books",
          totalQuantity: String(product.totalQuantity || ""),
          unit: product.unit || "",
          featured: product.featured || false,
          priceID: product.priceID || "",
        });

        setExistingImages(product.images || []);
      } catch (error) {
        console.error(error);
        alert("Unable to load product.");
      } finally {
        setLoading(false);
      }
    };

    getProduct();
  }, [id]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleImages = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (!files) return;

    const selectedFiles = Array.from(files);

    console.log("Selected images:", selectedFiles);

    setImages(selectedFiles);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        data.append(key, String(value));
      });

      images.forEach((image) => {
        data.append("images", image);
      });
      console.log("FORM DATA CHECK");

      for (const item of data.entries()) {
        console.log(item[0], item[1]);
      }
      const token = localStorage.getItem("token");

      if (isEditMode) {
        await axios.put(
          `${import.meta.env.VITE_SERVER_URL}/api/products/${id}`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          },
        );

        alert("Product updated successfully.");
      } else {
        await axios.post(
          `${import.meta.env.VITE_SERVER_URL}/api/products`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          },
        );

        alert("Product created successfully.");
      }

      navigate("/admin/products");
    } catch (error) {
      console.error(error);

      alert(
        isEditMode ? "Unable to update product." : "Unable to create product.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-yellow-50 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <h1 className="text-5xl font-black text-purple-950">
            {isEditMode ? "Edit Product" : "Create New Product"}
          </h1>

          <p className="mt-3 text-lg text-gray-600">
            Manage products for the Ajangbile Heritage store.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl shadow-2xl border overflow-hidden"
        >
          <div className="border-b bg-purple-950 px-10 py-6">
            <h2 className="text-2xl font-bold text-white">
              Product Information
            </h2>
          </div>

          <div className="p-10 space-y-10">
            <div className="grid lg:grid-cols-2 gap-8">
              {[
                { name: "productName", label: "Product Name" },
                { name: "price", label: "Price (₦)" },
                { name: "discount", label: "Discount (%)" },
                { name: "totalQuantity", label: "Quantity" },
                { name: "unit", label: "Unit" },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block font-bold mb-2">{field.label}</label>

                  <input
                    name={field.name}
                    value={form[field.name as keyof typeof form] as string}
                    onChange={handleChange}
                    className="w-full rounded-2xl border px-5 py-4"
                  />
                </div>
              ))}

              <div>
                <label className="block font-bold mb-2">Category</label>

                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full rounded-2xl border px-5 py-4"
                >
                  {categories.map((category) => (
                    <option key={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold mb-2">Description</label>

              <textarea
                rows={6}
                name="description"
                value={form.description}
                onChange={handleChange}
                className="w-full rounded-2xl border px-5 py-4"
              />
            </div>

            <div>
              <label className="block font-bold mb-2">Stripe Price ID</label>

              <input
                name="priceID"
                value={form.priceID}
                onChange={handleChange}
                className="w-full rounded-2xl border px-5 py-4"
              />
            </div>

            <div>
              <label className="block font-bold mb-4">Product Images</label>

              <label className="border-2 border-dashed rounded-3xl h-64 flex flex-col justify-center items-center cursor-pointer">
                <ImagePlus size={60} />

                <h3 className="mt-4 text-xl font-bold">Upload Images</h3>

                <input
                  hidden
                  multiple
                  accept="image/*"
                  type="file"
                  onChange={handleImages}
                />
              </label>
              {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  {images.map((image, index) => (
                    <img
                      key={index}
                      src={URL.createObjectURL(image)}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-40 object-cover rounded-xl border"
                    />
                  ))}
                </div>
              )}
              {existingImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-6">
                  {existingImages.map((img) => (
                    <img
                      key={img}
                      src={img}
                      className="h-40 w-full object-cover rounded-xl"
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-4 bg-purple-50 rounded-2xl p-5">
              <input
                type="checkbox"
                name="featured"
                checked={form.featured}
                onChange={handleChange}
              />

              <span className="font-semibold">Featured Product</span>
            </div>

            <button
              disabled={loading}
              className="flex items-center gap-3 bg-purple-900 text-white px-10 py-4 rounded-2xl font-bold"
            >
              <Save size={22} />

              {loading
                ? "Saving..."
                : isEditMode
                  ? "Update Product"
                  : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProductPage;
