const fs = require('fs');
let content = fs.readFileSync('src/LandingPage.tsx', 'utf8');

content = content.replace(
  'const Hero = ({ productPrice }: { productPrice: number }) => {',
  'const Hero = ({ productPrice, productOldPrice }: { productPrice: number, productOldPrice?: number }) => {'
);

content = content.replace(
  '<span className="text-slate-400 line-through text-lg font-medium">السعر الأصلي: {productPrice + 900} د.ج</span>',
  '<span className="text-slate-400 line-through text-lg font-medium">السعر الأصلي: {productOldPrice || (productPrice + 900)} د.ج</span>'
);

content = content.replace(
  'const CheckoutForm = ({ productPrice, onPurchase }: { productPrice: number, onPurchase: (p: number) => void }) => {',
  'const CheckoutForm = ({ productPrice, productOldPrice, onPurchase }: { productPrice: number, productOldPrice?: number, onPurchase: (p: number) => void }) => {'
);

content = content.replace(
  '<span className="text-slate-400 line-through text-sm">{productPrice + 900} د.ج</span>',
  '<span className="text-slate-400 line-through text-sm">{productOldPrice || (productPrice + 900)} د.ج</span>'
);

content = content.replace(
  'export default function LandingPage({ productPrice, onPurchase }: { productPrice: number, onPurchase: (p: number) => void }) {',
  'export default function LandingPage({ productPrice, productOldPrice, onPurchase }: { productPrice: number, productOldPrice?: number, onPurchase: (p: number) => void }) {'
);

content = content.replace(
  '<Hero productPrice={productPrice} />',
  '<Hero productPrice={productPrice} productOldPrice={productOldPrice} />'
);

content = content.replace(
  '<CheckoutForm productPrice={productPrice} onPurchase={onPurchase} />',
  '<CheckoutForm productPrice={productPrice} productOldPrice={productOldPrice} onPurchase={onPurchase} />'
);

// Fix loading texts
content = content.replace(
  "جاري تسجيل الطلب...",
  "Enregistrement de la commande..."
);

content = content.replace(
  "تأكيد الطلب الآن",
  "Confirmer la commande maintenant"
);

fs.writeFileSync('src/LandingPage.tsx', content);
