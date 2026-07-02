const Card = ({ title, description, image, price, onClick }) => {
  return (
    <div
      className="border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer bg-white"
      onClick={onClick}
    > this is card component
      {/* Image */}
      {image && (
        <img
          src={image}
          alt={title}
          className="w-full h-48 object-cover"
        />
      )}

      {/* Content */}
      <div className="p-4">
        <h2 className="text-lg font-semibold">{title}</h2>

        {description && (
          <p className="text-sm text-gray-600 mt-1">
            {description}
          </p>
        )}

        {price && (
          <p className="mt-3 font-bold text-green-600">
            ${price}
          </p>
        )}
      </div>
    </div>
  );
};

export default Card;