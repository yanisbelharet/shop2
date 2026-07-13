import React, { useState, useEffect } from 'react';
import { Lock, Settings, Save, LogOut } from 'lucide-react';

export default function Dashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [config, setConfig] = useState({
    productPrice: 2000,
    fbPixelId: '',
    tiktokPixelId: ''
  });
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    // Check if we can fetch config to verify authentication
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        // We will assume authenticated if we can post to config
        // But for now, we just fetch public config
      });
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      
      if (res.ok) {
        setIsAuthenticated(true);
        fetchConfig();
      } else {
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          const data = await res.json();
          setError(data.error || 'Mot de passe incorrect');
        } else {
          const text = await res.text();
          setError(`Error ${res.status}: ${text.substring(0, 50)}`);
        }
      }
    } catch (err: any) {
      setError(`Erreur de connexion : ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setIsAuthenticated(false);
  };

  const fetchConfig = async () => {
    try {
      const res = await fetch('/api/config');
      if (res.ok) {
        const data = await res.json();
        setConfig(data);
      }
    } catch (err) {
      console.error('Failed to fetch config', err);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveMessage('');
    
    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      
      if (res.ok) {
        setSaveMessage('Enregistré avec succès');
        setTimeout(() => setSaveMessage(''), 3000);
      } else {
        if (res.status === 401) {
          setIsAuthenticated(false);
        } else {
          setSaveMessage('Erreur lors de la sauvegarde');
        }
      }
    } catch (err) {
      setSaveMessage('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4" dir="ltr">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
              <Lock size={32} />
            </div>
          </div>
          <h1 className="text-2xl font-black text-center text-slate-900 mb-8">Connexion Administration</h1>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Mot de passe</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 focus:bg-white transition-all text-left"
                dir="ltr"
                required
              />
            </div>
            
            {error && <p className="text-red-500 text-sm font-medium text-center">{error}</p>}
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-all disabled:opacity-70"
            >
              {loading ? 'Vérification...' : 'Se connecter'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8" dir="ltr">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
              <Settings size={24} />
            </div>
            <h1 className="text-2xl font-black text-slate-900">Tableau de bord</h1>
          </div>
          
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-slate-500 hover:text-slate-700 hover:bg-slate-200 bg-slate-100 rounded-lg transition-colors font-medium text-sm"
          >
            <LogOut size={16} />
            <span>Se déconnecter</span>
          </button>
        </div>
        
        <div className="bg-white rounded-3xl shadow-md border border-slate-100 p-6 md:p-8">
          <form onSubmit={handleSave} className="space-y-8">
            
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-slate-800 border-b pb-2">Paramètres du Produit</h2>
              
                            <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Prix avant promo (DA)</label>
                <input 
                  type="number" 
                  value={config.productOldPrice || ''}
                  onChange={(e) => setConfig({...config, productOldPrice: Number(e.target.value)})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-mono"
                  dir="ltr"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Prix après promo (DA)</label>
                <input 
                  type="number" 
                  value={config.productPrice}
                  onChange={(e) => setConfig({...config, productPrice: Number(e.target.value)})}
                  className="w-full md:w-1/2 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white transition-all font-mono"
                  dir="ltr"
                  required
                />
                <p className="text-xs text-slate-500 mt-2">Ce prix sera affiché sur la page de destination et sera envoyé comme valeur lors de l'achat (sans le prix de livraison).</p>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-lg font-bold text-slate-800 border-b pb-2">Paramètres de Suivi (Pixels)</h2>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Facebook Pixel ID (séparez par des virgules pour plusieurs)</label>
                <input 
                  type="text" 
                  value={config.fbPixelId}
                  onChange={(e) => setConfig({...config, fbPixelId: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white transition-all font-mono"
                  dir="ltr"
                  placeholder="e.g. 123456789012345"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">TikTok Pixel ID (séparez par des virgules pour plusieurs)</label>
                <input 
                  type="text" 
                  value={config.tiktokPixelId}
                  onChange={(e) => setConfig({...config, tiktokPixelId: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white transition-all font-mono"
                  dir="ltr"
                  placeholder="e.g. C1234567890ABCDEF"
                />
              </div>
            </div>
            
            <div className="pt-4 flex items-center justify-between border-t border-slate-100">
              <button 
                type="submit" 
                disabled={saving}
                className="flex items-center gap-2 py-3 px-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all disabled:opacity-70 shadow-lg shadow-indigo-200"
              >
                <Save size={18} />
                <span>{saving ? 'Enregistrement...' : 'Enregistrer les modifications'}</span>
              </button>
              
              {saveMessage && (
                <span className={`font-medium ${saveMessage.includes('succès') ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {saveMessage}
                </span>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
