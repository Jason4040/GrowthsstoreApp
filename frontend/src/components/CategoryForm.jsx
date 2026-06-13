const CategoryForm = ({
  value,
  setValue,
  handleSubmit,
  buttonText = "Submit",
  handleDelete,
}) => {
  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          className="w-full p-4 bg-gray-50 dark:bg-[#101010] border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all placeholder-gray-500"
          placeholder="Write category name"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />

        <div className="flex justify-between gap-4">
          <button className="flex-1 bg-gradient-to-r from-orange-600 to-purple-600 text-gray-900 dark:text-white py-3 px-6 rounded-xl font-medium hover:from-orange-500 hover:to-purple-500 hover:shadow-lg hover:shadow-orange-500/30 transition-all active:scale-95">
            {buttonText}
          </button>

          {handleDelete && (
            <button
              type="button"
              onClick={handleDelete}
              className="flex-1 bg-gradient-to-r from-red-600 to-rose-600 text-gray-900 dark:text-white py-3 px-6 rounded-xl font-medium hover:from-red-500 hover:to-rose-500 hover:shadow-lg hover:shadow-red-500/30 transition-all active:scale-95"
            >
              Delete
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;
