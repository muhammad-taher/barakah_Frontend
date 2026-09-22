
import { Link } from 'react-router-dom';
import type { Category } from '../../types';

export default function CategoryCard({ category }: { category: Category }) {
  return (
    <Link to={`/shop?category=${category.slug}`} className="group relative block aspect-[3/4] overflow-hidden rounded-xl">
      <img 
        src={category.image} 
        alt={category.name} 
        className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full p-6">
        <h3 className="text-white font-semibold text-xl tracking-wide">{category.name}</h3>
        <span className="text-white/80 text-sm mt-2 inline-block relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-px after:bottom-0 after:left-0 after:bg-white after:origin-bottom-right after:transition-transform after:duration-300 group-hover:after:scale-x-100 group-hover:after:origin-bottom-left">
          Shop Now
        </span>
      </div>
    </Link>
  );
}
