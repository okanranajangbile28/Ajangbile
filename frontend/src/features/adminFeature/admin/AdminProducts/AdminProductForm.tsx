import { ChangeEvent, SyntheticEvent, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FaTrash } from "react-icons/fa";

import { useAppDispatch, useAppSelector } from "../../../../App/hooks";

import {
  changeSideMenuValue,
  clearFormImages,
  createProduct,
  loadFormProduct,
  resetFormProduct,
  setFieldMode,
  setFormImages,
  setShowErrorMessage,
  updateFormProduct,
  updateProduct,
} from "../../adminSlice";

import { fetchSingleProduct } from "../../../productFeature/productSlice";

import { SingleProductType } from "../../../../types/product";

import FormInput from "../../../../components/admin/AdminFormInput";
import FormTextArea from "../../../../components/admin/AdminTextAreaInput";
import { Loading } from "../../../../components/global_components";

import { productCategory } from "../../../../utils/constants";

const AdminProductForm = ({
  type,
}: {
  type: "detail" | "create";
  product?: SingleProductType;
}) => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { loading, error, form } = useAppSelector((state) => state.admin);

  const { tempProduct, images, isValid } = form;

  const { single_product } = useAppSelector((state) => state.product);

  useEffect(() => {
    dispatch(changeSideMenuValue("product"));
  }, [dispatch]);

  useEffect(() => {
    if (id) {
      dispatch(fetchSingleProduct(id));
    } else {
      dispatch(resetFormProduct());
      dispatch(clearFormImages());
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (id && single_product) {
      dispatch(loadFormProduct(single_product));
      dispatch(setFormImages(single_product.images));
    }
  }, [dispatch, id, single_product]);

  useEffect(() => {
    localStorage.setItem("product", JSON.stringify(tempProduct));
  }, [tempProduct]);

  const onChange = (
    e:
      | ChangeEvent<HTMLInputElement>
      | ChangeEvent<HTMLTextAreaElement>
      | ChangeEvent<HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    dispatch(
      updateFormProduct({
        detail: name,
        info: value,
      }),
    );
  };

  const onCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(
      updateFormProduct({
        detail: e.target.name,
        info: e.target.checked,
      }),
    );
  };

  const onSelectFile = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (!files) return;

    const previewImages = Array.from(files).map((file) =>
      URL.createObjectURL(file),
    );

    dispatch(setFormImages([...images, ...previewImages]));
  };

  const deleteImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);

    dispatch(setFormImages(updatedImages));
  };

  const convertBlobToFile = async (image: string, index: number) => {
    const response = await axios.get(image, {
      responseType: "blob",
    });

    return new File([response.data], `product-image-${index}.jpg`, {
      type: response.data.type,
    });
  };

  const handleSubmit = async (e: SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!isValid) {
      dispatch(setShowErrorMessage(true));
      return;
    }

    const formData = new FormData();

    Object.entries(tempProduct).forEach(([key, value]) => {
      if (key !== "images" && key !== "_id") {
        formData.append(key, String(value));
      }
    });

    for (let i = 0; i < images.length; i++) {
      const image = images[i];

      if (image.startsWith("blob:")) {
        const file = await convertBlobToFile(image, i);

        formData.append("images", file);
      } else {
        formData.append("images", image);
      }
    }

    try {
      if (id) {
        await dispatch(
          updateProduct({
            id,
            data: formData,
          }),
        ).unwrap();
      } else {
        await dispatch(createProduct(formData)).unwrap();
      }

      dispatch(clearFormImages());

      dispatch(setFieldMode("fixed"));

      navigate("/admin/product");
    } catch {
      dispatch(setShowErrorMessage(true));
    }
  };
  return loading ? (
    <Loading />
  ) : (
    <div className="bg-[rgba(75,0,130,0.08)] min-h-screen">
      <form
        className="
				flex flex-col 
				gap-[24px]
				pt-[24px]
				px-[20px]
				md:px-[48px]
				pb-[100px]
				md:w-4/5
				"
      >
        <div
          className="
					text-[20px]
					md:text-[32px]
					font-bold
					text-[#4b0082]
					"
        >
          <Link to="/admin" className="text-gray-500 hover:underline">
            Admin
          </Link>

          <span className="mx-2">&gt;</span>

          <Link to="/admin/product" className="text-gray-500 hover:underline">
            Product
          </Link>

          <span className="mx-2">&gt;</span>

          {id ? "Edit Product" : "Create Product"}
        </div>

        <FormInput
          type="text"
          name="productName"
          label="Product Name"
          id="productName"
          placeholder="Enter product name"
          value={tempProduct.productName || ""}
          mode={type}
          required
          onChange={onChange}
        />

        <FormTextArea
          name="description"
          label="Description"
          id="description"
          placeholder="Enter product description"
          value={tempProduct.description || ""}
          mode={type}
          required
          onChange={onChange}
        />

        <div
          className="
					grid
					grid-cols-1
					md:grid-cols-2
					gap-4
					"
        >
          <FormInput
            type="number"
            name="price"
            label="Price"
            id="price"
            placeholder="Product price"
            value={tempProduct.price || ""}
            mode={type}
            required
            onChange={onChange}
          />

          <FormInput
            type="text"
            name="unit"
            label="Price Unit"
            id="unit"
            placeholder="Example: piece, pack"
            value={tempProduct.unit || ""}
            mode={type}
            onChange={onChange}
          />
        </div>

        <div
          className="
					grid
					grid-cols-1
					md:grid-cols-3
					gap-4
					"
        >
          <FormInput
            type="number"
            name="discount"
            label="Discount (%)"
            id="discount"
            value={tempProduct.discount || ""}
            mode={type}
            onChange={onChange}
          />

          <FormInput
            type="number"
            name="totalQuantity"
            label="Stock Quantity"
            id="totalQuantity"
            value={tempProduct.totalQuantity || ""}
            mode={type}
            onChange={onChange}
          />

          <FormInput
            type="text"
            name="priceID"
            label="Stripe Price ID"
            id="priceID"
            value={tempProduct.priceID || ""}
            mode={type}
            onChange={onChange}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            className="
						font-bold
						text-[#4b0082]
						"
          >
            Category
          </label>

          <select
            name="category"
            value={tempProduct.category || ""}
            onChange={onChange}
            className="
						bg-gray-100
						rounded-lg
						p-4
						"
          >
            <option value="">Select Category</option>

            {productCategory.map((item, index) => (
              <option key={index} value={item.value}>
                {item.title}
              </option>
            ))}
          </select>
        </div>

        <div
          className="
					flex
					items-center
					gap-3
					"
        >
          <input
            type="checkbox"
            name="featured"
            checked={tempProduct.featured || false}
            onChange={onCheckboxChange}
          />

          <label className="font-semibold">Featured Product</label>
        </div>

        <FormInput
          type="file"
          name="image"
          label="Product Images"
          id="image"
          accept=".jpg,.png,.webp,.avif"
          multiple
          mode={type}
          onChange={onSelectFile}
        />

        {images.length > 0 && (
          <div
            className="
							grid
							grid-cols-2
							md:grid-cols-4
							gap-4
							"
          >
            {images.map((image, index) => (
              <div
                key={index}
                className="
											relative
											border
											bg-white
											rounded-lg
											p-2
											"
              >
                <img
                  src={image}
                  alt="product"
                  className="
												w-full
												h-[150px]
												object-contain
												"
                />

                <button
                  type="button"
                  onClick={() => deleteImage(index)}
                  className="
												absolute
												top-2
												right-2
												text-red-600
												"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
        )}

        <div
          className="
					flex
					gap-4
					mt-4
					"
        >
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              dispatch(setFieldMode("update"));
            }}
            className="
						bg-gray-200
						text-[#4b0082]
						px-6
						py-3
						rounded-lg
						font-semibold
						"
          >
            Edit Product
          </button>

          <button
            type="submit"
            onClick={handleSubmit}
            className="
						bg-[#4b0082]
						text-white
						px-6
						py-3
						rounded-lg
						font-semibold
						"
          >
            {id ? "Update Product" : "Publish Product"}
          </button>
        </div>

        {error.submit_product && (
          <p className="text-red-600">{error.submit_product}</p>
        )}
      </form>
    </div>
  );
};

export default AdminProductForm;
