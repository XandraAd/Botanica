import React, { useState } from "react";
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useFetchCategoriesQuery,
} from "../../slices/categorySlice";
import { toast } from "react-toastify";
import CategoryForm from "../../components/CategoryForm";
import Modal from "../../components/Modal";


const CategoryList = () => {
  const { data: categories } = useFetchCategoriesQuery();
  const [name, setName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [updatingName, setUpdatingName] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

 const handleCreateCategory = async (e) => {
  e.preventDefault();
  if (!name.trim()) return toast.error("Category name is required");

  try {
    const result = await createCategory({ name }).unwrap();
    setName("");
    toast.success(`${result?.name || "Category"} created successfully`);
  } catch (error) {
    console.error("Create category error:", error);
    toast.error(error?.data?.message || "Creating category failed, try again.");
  }
};


  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    if (!updatingName) return toast.error("Category name is required");

    try {
      const result = await updateCategory({
        categoryId: selectedCategory._id,
        updatedCategory: { name: updatingName },
      }).unwrap();

     toast.success(`${result?.name || "Category"} created successfully`);

      setSelectedCategory(null);
      setUpdatingName("");
      setModalVisible(false);
    } catch (error) {
      console.error(error);
      toast.error("Updating category failed.");
    }
  };

  const handleDeleteCategory = async () => {
    try {
      const result = await deleteCategory(selectedCategory._id).unwrap();
      toast.success(`${result.name} deleted successfully`);
      setSelectedCategory(null);
      setModalVisible(false);
    } catch (error) {
      console.error(error);
      toast.error("Deleting category failed.");
    }
  };

  return (
   <div className="bg-gray-50 min-h-screen flex">
    

      {/* Main content */}
      <main className="flex-1 ml-64 p-6">
        <h1 className="text-2xl font-bold mb-4">Manage Categories</h1>

        <CategoryForm
          value={name}
          setValue={setName}
          handleSubmit={handleCreateCategory}
        />

        <hr className="my-6" />

        <div className="flex flex-wrap">
          {categories?.map((category) => (
            <button
              key={category._id}
              className="bg-white border border-pink-500 text-pink-500 py-2 px-4 rounded-lg m-2 hover:bg-pink-500 hover:text-white transition"
              onClick={() => {
                setModalVisible(true);
                setSelectedCategory(category);
                setUpdatingName(category.name);
              }}
            >
              {category.name}
            </button>
          ))}
        </div>

        <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
          <CategoryForm
            value={updatingName}
            setValue={setUpdatingName}
            handleSubmit={handleUpdateCategory}
            buttonText="Update"
            handleDelete={handleDeleteCategory}
          />
        </Modal>
      </main>
    </div>
  );
};

export default CategoryList;
