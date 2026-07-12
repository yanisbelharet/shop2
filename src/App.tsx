import React, { useState, useEffect } from 'react';
import { ShoppingCart, CheckCircle2, ShieldCheck, Clock, Plane, Smartphone, Check, Star, Shield, AlertCircle, Timer } from 'lucide-react';
import { motion } from 'motion/react';
import { WILAYAS, DELIVERY_PRICES } from './data';
import { getCommunesByWilayaId } from 'algeria-locations';
import { Analytics } from '@vercel/analytics/react';

// --- Components ---

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState(24 * 60 * 60); // 24 hours

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="flex items-center justify-center gap-2 text-rose-600 bg-rose-50 px-4 py-2 rounded-full font-bold text-sm mb-6 border border-rose-100">
      <Timer size={18} />
      <span>ينتهي العرض الترويجي خلال:</span>
      <span className="font-mono text-lg" dir="ltr">
        {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    </div>
  );
};

const Hero = () => {
  return (
    <section className="relative pt-12 pb-16 px-4 overflow-hidden bg-slate-50 border-b border-slate-100">
      <div className="max-w-xl mx-auto text-center relative z-10 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 text-emerald-700 font-bold uppercase tracking-widest text-sm bg-emerald-100 px-5 py-2 rounded-full border border-emerald-200"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          عرض حصري لفترة محدودة
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-black text-slate-900 leading-tight"
        >
          منبه الدواء <span className="text-emerald-600">الذكي</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg md:text-xl text-slate-600 font-medium"
        >
          تخلص من القلق ونظم أدويتك بكل سهولة! حافظة ذكية مزودة بـ 4 منبهات قوية لتذكيرك في الوقت المحدد.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="relative mt-8 mb-8"
        >
          <img 
            src="https://cdn.youcan.shop/stores/defae844a0bbda3e5af90b6e7c10442b/others/7UDcKpzGFzchMMbeTwAB3UJZsYDCHWRiLTfg2A3T.jpg" 
            alt="حافظة الأدوية الذكية" 
            className="w-full h-auto rounded-[40px] shadow-2xl border border-slate-100 object-cover"
          />
          {/* Badge */}
          <div className="absolute -bottom-4 -left-4 bg-rose-500 text-white w-24 h-24 rounded-full flex flex-col items-center justify-center font-black shadow-lg shadow-rose-200 transform -rotate-12 border-4 border-white">
            <span className="text-sm uppercase tracking-wider">تخفيض</span>
            <span className="text-2xl">-900</span>
            <span className="text-xs">د.ج</span>
          </div>
        </motion.div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mt-8 mb-6">
          <div className="flex flex-col items-center justify-center gap-1">
            <span className="text-slate-400 line-through text-lg font-medium">السعر الأصلي: 2900 د.ج</span>
            <div className="flex items-baseline gap-2">
              <span className="text-slate-800 text-xl font-bold">السعر المخفض:</span>
              <span className="text-5xl font-black text-emerald-600">2000</span>
              <span className="text-emerald-600 font-bold">د.ج فقط</span>
            </div>
          </div>
        </div>

        <CountdownTimer />

        <a 
          id="hero-cta"
          href="#checkout" 
          className="inline-flex items-center justify-center w-full max-w-sm gap-3 py-4 px-8 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-xl shadow-xl shadow-emerald-200 transform hover:scale-105 transition-all"
        >
          <ShoppingCart size={24} />
          <span>اطلب الآن - الدفع عند الاستلام</span>
        </a>
      </div>
    </section>
  );
};

const Features = () => {
  return (
    <section className="py-16 bg-white px-4">
      <div className="max-w-xl mx-auto space-y-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
            لماذا تحتاج إلى هذه الحافظة؟
          </h2>
          <p className="text-lg text-slate-600 font-medium">
            تصميم يجمع بين الأناقة والعملية لضمان سلامتك وراحتك.
          </p>
        </div>

        <div className="bg-slate-50 rounded-[40px] p-6 shadow-lg shadow-slate-200/50 border border-slate-100 flex flex-col gap-6">
          <img 
            src="https://cdn.youcan.shop/stores/defae844a0bbda3e5af90b6e7c10442b/others/K7xCrltppCNd4UVbJGSOqObap2IJ85nFDeub8El2.jpg" 
            alt="منبه إلكتروني دقيق" 
            className="w-full h-64 object-cover rounded-3xl border border-slate-200/50"
          />
          <div className="px-2">
            <h3 className="text-2xl font-black text-slate-900 mb-3 flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shrink-0">
                <Clock size={22} />
              </div>
              منبه إلكتروني دقيق
            </h3>
            <p className="text-slate-600 text-lg leading-relaxed font-medium">
              شاشة رقمية مدمجة تتيح لك ضبط حتى <strong className="text-emerald-700">4 مواعيد تنبيه مختلفة</strong> يومياً. صوت التنبيه واضح ومسموع لضمان عدم تفويت أي جرعة دواء مهما كنت مشغولاً.
            </p>
          </div>
        </div>

        <div className="bg-slate-50 rounded-[40px] p-6 shadow-lg shadow-slate-200/50 border border-slate-100 flex flex-col gap-6">
          <img 
            src="https://cdn.youcan.shop/stores/defae844a0bbda3e5af90b6e7c10442b/others/GrJtr5SCJuOFaXIMfq64G6JQ2Csh05L4tVhE9gIH.jpg" 
            alt="تصميم مقسم لـ 7 خانات" 
            className="w-full h-64 object-cover rounded-3xl border border-slate-200/50"
          />
          <div className="px-2">
            <h3 className="text-2xl font-black text-slate-900 mb-3 flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shrink-0">
                <ShieldCheck size={22} />
              </div>
              تصميم عملي بـ 7 خانات
            </h3>
            <p className="text-slate-600 text-lg leading-relaxed font-medium">
              مقسمة بذكاء لتنظيم أدوية أسبوع كامل بسهولة تامة. تتميز بغطاء محكم الغلق يمنع تسرب الرطوبة أو الهواء، مما يحاف�� على جودة وفعالية أدويتك لأطول فترة ممكنة.
            </p>
          </div>
        </div>

        <div className="bg-slate-50 rounded-[40px] p-6 shadow-lg shadow-slate-200/50 border border-slate-100 flex flex-col gap-6">
          <img 
            src="https://cdn.youcan.shop/stores/defae844a0bbda3e5af90b6e7c10442b/others/IAhDSWpHBrDd7Rz5sIx4K1KFqeaK2m2D0JXU76OA.jpg" 
            alt="حجم محمول وخفيف" 
            className="w-full h-auto object-cover rounded-3xl border border-slate-200/50"
          />
          <div className="px-2">
            <h3 className="text-2xl font-black text-slate-900 mb-3 flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shrink-0">
                <Smartphone size={22} />
              </div>
              حجم محمول وخفيف
            </h3>
            <p className="text-slate-600 text-lg leading-relaxed font-medium">
              تصميم مدمج وأنيق يسهل حمله في الجيب أو الحقيبة أينما ذهبت. مصنوعة من بلاستيك طبي عالي الجودة وخالي من المواد السامة (BPA Free).
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

const Testimonials = () => {
  const reviews = [
    "https://cdn.youcan.shop/stores/ba86712f261c8f3eed78e0e12a689855/others/DjPMzDRJA0wqz9GjGZan9K83GKdvL9Lk1eGE9N6M.jpg",
    "https://cdn.youcan.shop/stores/ba86712f261c8f3eed78e0e12a689855/others/KK7qazHegt3JM9Aq9FwtLPAzgw90yER4qQwhChhI.jpg",
    "https://cdn.youcan.shop/stores/ba86712f261c8f3eed78e0e12a689855/others/M35up3JUQRdRyZds8iIxZ4FoFiaVe5DB5XMDooXD.jpg",
    "https://cdn.youcan.shop/stores/ba86712f261c8f3eed78e0e12a689855/others/rKNm0kQKDxKqAFrKBnqY2p0eAmeTrgoT6MIwBxJZ.jpg",
    "https://cdn.youcan.shop/stores/ba86712f261c8f3eed78e0e12a689855/others/qEzjLoBUwKkAawTPh8RnBMvBkO5VCbiY4zQzx4Re.jpg"
  ];

  return (
    <section className="py-16 bg-slate-50 px-4 border-y border-slate-100">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-slate-900 mb-4">
            آراء زبائننا الكرام
          </h2>
          <p className="text-slate-600 font-medium">أكثر من 100 زبون راضي عن منتجنا</p>
        </div>
        
        <div className="space-y-6">
          {reviews.map((imgSrc, i) => (
            <div key={i} className="rounded-3xl overflow-hidden shadow-md border border-slate-100">
              <img src={imgSrc} alt={`رأي زبون ${i + 1}`} className="w-full h-auto object-cover" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CheckoutForm = () => {
  const [formData, setFormData] = useState<{
    name: string;
    phone: string;
    wilaya: string;
    commune: string;
    deliveryType: 'home' | 'desk';
  }>({
    name: '',
    phone: '',
    wilaya: '',
    commune: '',
    deliveryType: 'home',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const wilayaPrice = formData.wilaya ? DELIVERY_PRICES[formData.wilaya] : null;
  const deliveryPrice = wilayaPrice ? wilayaPrice[formData.deliveryType] : 0;
  const productPrice = 2000;
  const totalPrice = productPrice + deliveryPrice;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('/api/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          price: totalPrice
        }),
      });
      
      if (response.ok) {
        setSuccess(true);
      } else {
        alert('حدث خطأ أثناء إرسال الطلب، يرجى المحاولة مرة أخرى.');
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('حدث خطأ أثناء إرسال الطلب، يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-emerald-50 border-2 border-emerald-500 rounded-[40px] p-8 text-center shadow-xl shadow-emerald-100/50">
        <div className="w-20 h-20 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-200">
          <Check size={40} />
        </div>
        <h3 className="text-3xl font-black text-emerald-800 mb-3">تم تسجيل طلبك بنجاح!</h3>
        <p className="text-lg text-emerald-600 font-medium leading-relaxed">
          شكراً لثقتكم بنا.<br/>
          سنتصل بك في غضون 24 ساعة لتأكيد طلبيتك قبل الشحن.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-[40px] p-6 md:p-8 shadow-2xl shadow-slate-200/50 border border-slate-100 relative">
      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-emerald-50 border border-emerald-100 text-emerald-700 px-6 py-2 rounded-full font-bold text-sm shadow-sm whitespace-nowrap flex items-center gap-2">
        <CheckCircle2 size={16} />
        الدفع عند الاستلام متوفر
      </div>
      
      <div className="mb-6 bg-rose-50 border border-rose-100 rounded-2xl p-4 flex items-start gap-3">
        <AlertCircle className="text-rose-500 shrink-0 mt-0.5" size={20} />
        <div>
          <h4 className="font-bold text-rose-800 mb-1">الكمية محدودة جداً!</h4>
          <p className="text-sm text-rose-600 font-medium">يرجى تعبئة الاستمارة بسرعة لحجز طلبيتك قبل نفاد المخزون (تبقى 5 قطع فقط).</p>
        </div>
      </div>

      <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 mb-8">
        <div className="flex justify-between items-center mb-4">
          <span className="text-slate-600 font-bold">سعر المنتج:</span>
          <div className="flex items-center gap-2">
            <span className="text-slate-400 line-through text-sm">2900 د.ج</span>
            <span className="text-2xl font-black text-emerald-600">2000 د.ج</span>
          </div>
        </div>
        <div className="text-center border-t border-slate-200/70 pt-4 mt-2">
          <span className="inline-block bg-rose-100 text-rose-700 px-4 py-1.5 rounded-full text-sm font-bold">
            لقد وفرت 900 د.ج مع هذا العرض! 🎉
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <input 
            type="text" 
            required
            placeholder="الاسم الكامل" 
            className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all placeholder-slate-400 font-medium"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
        </div>
        <div>
          <input 
            type="tel" 
            required
            dir="ltr"
            placeholder="رقم الهاتف" 
            className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl px-5 py-4 text-right focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all placeholder-slate-400 font-medium"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
          />
        </div>
        <div>
          <select 
            required
            className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all appearance-none font-medium"
            value={formData.wilaya}
            onChange={(e) => setFormData({...formData, wilaya: e.target.value, commune: ''})}
          >
            <option value="" disabled>الولاية</option>
            {WILAYAS.map(w => <option key={w} value={w}>{w}</option>)}
          </select>
        </div>
        <div>
          <select 
            required
            className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all appearance-none font-medium disabled:opacity-50"
            value={formData.commune}
            onChange={(e) => setFormData({...formData, commune: e.target.value})}
            disabled={!formData.wilaya}
          >
            <option value="" disabled>البلدية</option>
            {formData.wilaya && getCommunesByWilayaId(parseInt(formData.wilaya, 10)).map(c => (
              <option key={c.id} value={c.name_ar}>{c.name_ar}</option>
            ))}
          </select>
        </div>
        
        {formData.wilaya && wilayaPrice && (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 mt-6">
            <h4 className="font-bold text-slate-700">طريقة التوصيل:</h4>
            <div className="flex flex-col gap-3">
              <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.deliveryType === 'home' ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                <div className="flex items-center gap-3">
                  <input 
                    type="radio" 
                    name="deliveryType" 
                    value="home" 
                    checked={formData.deliveryType === 'home'}
                    onChange={() => setFormData({...formData, deliveryType: 'home'})}
                    className="w-5 h-5 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="font-bold text-slate-800">التوصيل لباب المنزل</span>
                </div>
                <span className="font-black text-emerald-600">{wilayaPrice.home} د.ج</span>
              </label>
              
              <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.deliveryType === 'desk' ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                <div className="flex items-center gap-3">
                  <input 
                    type="radio" 
                    name="deliveryType" 
                    value="desk" 
                    checked={formData.deliveryType === 'desk'}
                    onChange={() => setFormData({...formData, deliveryType: 'desk'})}
                    className="w-5 h-5 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="font-bold text-slate-800">التوصيل للمكتب (Stop Desk)</span>
                </div>
                <span className="font-black text-emerald-600">{wilayaPrice.desk} د.ج</span>
              </label>
            </div>
          </div>
        )}

        {formData.wilaya && wilayaPrice && (
          <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100 mt-6 shadow-inner">
            <div className="flex justify-between items-center mb-3 text-emerald-800 font-medium">
              <span>سعر التوصيل:</span>
              <span className="font-bold">{deliveryPrice} د.ج</span>
            </div>
            <div className="flex justify-between items-center text-xl font-black text-slate-900 border-t border-emerald-200/50 pt-3">
              <span>المبلغ الإجمالي المطلوب:</span>
              <span className="text-emerald-700 text-2xl">{totalPrice} د.ج</span>
            </div>
            <p className="text-xs text-center text-emerald-600/70 mt-3 font-medium">
              * لن تدفع أي شيء الآن. الدفع يكون عند استلام المنتج.
            </p>
          </div>
        )}

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xl py-5 rounded-2xl shadow-xl shadow-emerald-200 transform transition-all active:scale-95 flex justify-center items-center gap-3 mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? 'جاري تسجيل الطلب...' : 'تأكيد الطلب الآن'}
        </button>
      </div>
    </form>
  );
};

export default function App() {
  const [showStickyButton, setShowStickyButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const heroCta = document.getElementById('hero-cta');
      const checkoutForm = document.getElementById('checkout');
      
      let pastHero = false;
      let beforeCheckout = true;

      if (heroCta) {
        pastHero = heroCta.getBoundingClientRect().bottom < 0;
      } else {
        pastHero = window.scrollY > 400;
      }

      if (checkoutForm) {
        // Hide button when checkout top reaches viewport
        beforeCheckout = checkoutForm.getBoundingClientRect().top > window.innerHeight;
      }

      setShowStickyButton(pastHero && beforeCheckout);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial check after a short delay to ensure layout is ready
    setTimeout(handleScroll, 100);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 pb-24 font-sans text-slate-800" dir="rtl">
      <div className="max-w-2xl mx-auto bg-white shadow-2xl min-h-screen overflow-hidden">
        <Hero />
        <Features />
        <Testimonials />

        <section id="checkout" className="py-16 bg-white px-4 border-t border-slate-100">
          <div className="max-w-xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-black text-slate-900 mb-3">
                خطوة أخيرة للحصول على المنتج!
              </h2>
              <p className="text-slate-500 font-medium text-lg">
                أدخل معلوماتك أدناه وسنقوم بالاتصال بك لتأكيد طلبك وتوصيله في أقرب وقت.
              </p>
            </div>
            <CheckoutForm />
          </div>
        </section>

        <footer className="text-center py-10 bg-slate-50 text-slate-500 font-medium border-t border-slate-100">
          <p className="mb-2">جميع الحقوق محفوظة &copy; 2024</p>
          <div className="flex justify-center gap-4 text-sm opacity-70">
            <a href="#" className="hover:text-slate-800">سياسة الخصوصية</a>
            <a href="#" className="hover:text-slate-800">شروط الاستخدام</a>
          </div>
        </footer>
      </div>

      {/* Sticky Bottom CTA */}
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: showStickyButton ? 0 : 100 }}
        className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-10px_30px_rgba(0,0,0,0.1)] z-50 flex justify-center items-center gap-4"
      >
        <div className="w-full max-w-2xl mx-auto flex items-center justify-between gap-4 px-2">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">سارع بالطلب</span>
            <span className="text-rose-600 font-black text-sm">تبقى 5 قطع فقط!</span>
          </div>
          <a 
            href="#checkout" 
            className="flex-1 flex items-center justify-center gap-3 py-3.5 px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-xl shadow-lg shadow-emerald-200 active:scale-95 transition-all"
          >
            <ShoppingCart size={22} />
            <span>اطلب واغتنم التخفيض</span>
          </a>
        </div>
      </motion.div>
      <Analytics />
    </div>
  );
}
