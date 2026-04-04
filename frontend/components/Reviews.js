export default function Reviews() {
  const reviews = [
    {
      id: 1,
      name: "Rahul Sharma",
      feedback: "Great quality solar panels! My electricity bill reduced a lot.",
    },
    {
      id: 2,
      name: "Priya Verma",
      feedback: "Amazing service and fast installation. Highly recommended!",
    },
    {
      id: 3,
      name: "Amit Singh",
      feedback: "Very reliable products and good customer support.",
    },
  ];

  return (
    <section className="py-10 px-5 bg-gray-100">
      <h2 className="text-2xl font-bold text-center mb-6">
        Customer Reviews
      </h2>

      <div className="grid md:grid-cols-3 gap-6">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="bg-white p-5 rounded-2xl shadow-md hover:shadow-lg transition"
          >
            <h3 className="font-semibold text-lg mb-2">
              {review.name}
            </h3>
            <p className="text-gray-600">
              "{review.feedback}"
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}