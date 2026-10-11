import React from 'react';
import { StatusStamp } from './StatusStamp';
import { ChevronRight, PackageX } from 'lucide-react';

export const ProductLedgerTable = ({ products, loading, onSelectProduct }) => {
  if (loading && (!products || products.length === 0)) {
    return (
      <div className="p-16 text-center text-[#555555] font-normal">
        <div className="animate-spin inline-block w-6 h-6 border-2 border-[#111111] border-t-transparent rounded-full mb-3" />
        <div className="text-xs">Loading catalog ledger...</div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="p-16 text-center text-[#555555] space-y-2 bg-white">
        <PackageX className="w-10 h-10 mx-auto text-[#999999] mb-2" />
        <div className="font-medium text-base text-[#111111]">No catalog items found</div>
        <p className="text-xs text-[#777777] max-w-sm mx-auto">
          Upload products using the "Bulk CSV Upload" button to populate your canonical listing ledger.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white">
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="bg-[#FAFAFA] border-b border-[#E5E7EB] text-[#555555] font-mono text-[11px] uppercase tracking-wider">
            <th className="py-3.5 px-4 font-semibold w-40">SKU Code</th>
            <th className="py-3.5 px-4 font-semibold">Product Title &amp; Brand</th>
            <th className="py-3.5 px-4 font-semibold w-44">Category</th>
            <th className="py-3.5 px-4 font-semibold w-28 text-right">MRP (INR)</th>
            <th className="py-3.5 px-4 font-semibold w-28 text-right">Selling Price</th>
            <th className="py-3.5 px-4 font-semibold w-20 text-center">Stock</th>
            <th className="py-3.5 px-4 font-semibold w-36 text-center">Flipkart Status</th>
            <th className="py-3.5 px-4 font-semibold w-16 text-center">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#E5E7EB]">
          {products.map((product) => (
            <tr
              key={product.id}
              onClick={() => onSelectProduct(product)}
              className="hover:bg-[#F8FAFC] cursor-pointer transition-colors group"
            >
              {/* SKU */}
              <td className="py-3 px-4 font-mono text-[11px] font-medium text-[#111111]">
                {product.sku}
              </td>

              {/* Title & Brand */}
              <td className="py-3 px-4">
                <div className="font-medium text-[13px] text-[#111111] line-clamp-1 group-hover:text-blue-600 transition-colors">
                  {product.title}
                </div>
                {product.brand && (
                  <div className="text-[11px] text-[#777777] mt-0.5">
                    Brand: <span className="text-[#333333] font-medium">{product.brand}</span>
                  </div>
                )}
              </td>

              {/* Category */}
              <td className="py-3 px-4 text-[#555555] text-xs">
                {product.category}
              </td>

              {/* MRP */}
              <td className="py-3 px-4 font-mono text-xs text-right text-[#888888] line-through">
                ₹{Number(product.mrp).toFixed(2)}
              </td>

              {/* Selling Price */}
              <td className="py-3 px-4 font-mono text-xs font-semibold text-right text-[#111111]">
                ₹{Number(product.sellingPrice).toFixed(2)}
              </td>

              {/* Stock */}
              <td className="py-3 px-4 font-mono text-xs text-center font-medium text-[#333333]">
                {product.stock}
              </td>

              {/* Status Stamp */}
              <td className="py-3 px-4 text-center">
                <StatusStamp status={product.status} />
              </td>

              {/* Action chevron */}
              <td className="py-3 px-4 text-center text-[#999999] group-hover:text-[#111111] transition-colors">
                <ChevronRight className="w-4 h-4 mx-auto" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
