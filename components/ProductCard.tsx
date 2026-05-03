export function ProductCard({ product }: ProductCardProps) {
  const firstImage = product.images?.find((image) => image.trim().length > 0);
  const productImage =
    firstImage ??
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200&auto=format&fit=crop";

  return (
    <Link href={/product/${product.id}}>
      <article className="relative overflow-hidden bg-white">

        {/* Image full square */}
        <div className="relative w-full aspect-square">
          <Image
            src={productImage}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>

        {/* Price overlay bottom */}
        <div className="absolute bottom-0 left-0 w-full bg-white/80 backdrop-blur px-2 py-1">
          <span className="text-sm font-bold text-black">
            ৳ {product.price.toFixed(2)}
          </span>
        </div>

      </article>
    </Link>
  );
}