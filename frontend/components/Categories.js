export default function Categories() {
  const categories = ["Panels", "Inverters", "Batteries", "Accessories"];

  return (
    <div className="p-6">
      <h2 className="text-2xl mb-4">Shop by Category</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((c, i) => (
          <div key={i} className="p-6 bg-gray-100 rounded text-center">
            {c}
          </div>
        ))}
      </div>
    </div>
  );
}