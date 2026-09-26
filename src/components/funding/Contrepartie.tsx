
export default function Contrepartie({ price, text } : { price: number, text: string }) {
  return (
    <article className="border border-white/10 bg-white/3 p-5 hover:border-white/25 hover:text-white">
      <p className="text-2xl font-medium text-[#e8ff9c]">${price} €</p>
      <p className="mt-3 text-sm leading-6 text-white/75">
        {text}
      </p>
    </article>
  );
}
