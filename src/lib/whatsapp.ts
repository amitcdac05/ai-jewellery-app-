export function buildWhatsAppUrl(product: { name: string; price?: number }) {
  const number = process.env.WHATSAPP_NUMBER || "919770603235";
  const priceLine = product.price !== undefined ? `\n\nPrice:\n₹${product.price}` : "";
  const message = `Hello,\n\nI'm interested in this jewellery.\n\nProduct:\n${product.name}${priceLine}\n\nPlease share more details.`;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
