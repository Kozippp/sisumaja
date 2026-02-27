'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, Edit, Trash2, Image as ImageIcon, Type, Upload, Check } from 'lucide-react';
import { Database } from '@/types/database.types';
import Image from 'next/image';

type ClientLogo = Database['public']['Tables']['client_logos']['Row'];

export default function ClientLogosPage() {
  const [logos, setLogos] = useState<ClientLogo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    logo_url: '',
    is_mock: true,
    display_order: 0,
    logo_scale: 100,
    logo_position_x: 50,
    logo_position_y: 50
  });
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const router = useRouter();

  const fetchLogos = async () => {
    const { data } = await supabase
      .from('client_logos')
      .select('*')
      .order('display_order', { ascending: true });

    if (data) {
      setLogos(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/admin/login');
        return;
      }
      fetchLogos();
    };
    checkUser();
  }, [router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadFile = async (file: File): Promise<string | null> => {
    try {
      setUploading(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `client-logos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('client-logos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('client-logos')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Upload error:', error);
      alert('Pildi üleslaadimine ebaõnnestus: ' + (error as Error).message);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let logoUrl = formData.logo_url;

    if (!formData.is_mock && selectedFile) {
      const uploadedUrl = await uploadFile(selectedFile);
      if (!uploadedUrl) {
        return;
      }
      logoUrl = uploadedUrl;
    }

    if (editingId) {
      const { error } = await supabase
        .from('client_logos')
        .update({
          ...formData,
          logo_url: logoUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingId);

      if (error) {
        alert('Viga: ' + error.message);
        return;
      }
    } else {
      const maxOrder = logos.length > 0 ? Math.max(...logos.map(l => l.display_order)) : 0;
      const { error } = await supabase
        .from('client_logos')
        .insert({
          ...formData,
          logo_url: logoUrl,
          display_order: maxOrder + 1
        });

      if (error) {
        alert('Viga: ' + error.message);
        return;
      }
    }

    setFormData({ name: '', logo_url: '', is_mock: true, display_order: 0, logo_scale: 100, logo_position_x: 50, logo_position_y: 50 });
    setSelectedFile(null);
    setPreviewUrl('');
    setShowAddForm(false);
    setEditingId(null);
    fetchLogos();
  };

  const handleEdit = (logo: ClientLogo) => {
    setFormData({
      name: logo.name,
      logo_url: logo.logo_url || '',
      is_mock: logo.is_mock,
      display_order: logo.display_order,
      logo_scale: (logo.logo_scale as number) || 100,
      logo_position_x: (logo.logo_position_x as number) || 50,
      logo_position_y: (logo.logo_position_y as number) || 50
    });
    setEditingId(logo.id);
    setShowAddForm(true);
    if (logo.logo_url) {
      setPreviewUrl(logo.logo_url);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Oled kindel, et soovid seda klienti kustutada?')) {
      const { error } = await supabase
        .from('client_logos')
        .delete()
        .eq('id', id);

      if (error) {
        alert('Viga: ' + error.message);
        return;
      }

      fetchLogos();
    }
  };

  const handleCancel = () => {
    setFormData({ name: '', logo_url: '', is_mock: true, display_order: 0, logo_scale: 100, logo_position_x: 50, logo_position_y: 50 });
    setSelectedFile(null);
    setPreviewUrl('');
    setShowAddForm(false);
    setEditingId(null);
  };

  if (loading) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-white">Laen...</div>;
  }

  return (
    <div className="min-h-screen bg-black pt-32 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <Link 
              href="/admin/dashboard"
              className="p-2 rounded-lg bg-neutral-900 text-gray-400 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-3xl font-bold text-white uppercase">Klientide Logod</h1>
          </div>
          
          {!showAddForm && (
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-primary text-white px-6 py-2 rounded-lg font-bold hover:bg-fuchsia-700 transition-colors flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Lisa uus klient
            </button>
          )}
        </div>

        {showAddForm && (
          <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-8 mb-8">
            <h2 className="text-xl font-bold text-white mb-6">
              {editingId ? 'Muuda klienti' : 'Lisa uus klient'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Kliendi nimi *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-fuchsia-500"
                  placeholder="nt. Swedbank"
                  required
                />
              </div>

              <div>
                <label className="flex items-center gap-2 mb-4">
                  <input
                    type="checkbox"
                    checked={formData.is_mock}
                    onChange={(e) => setFormData({ ...formData, is_mock: e.target.checked })}
                    className="w-5 h-5 rounded border-gray-600 text-fuchsia-500 focus:ring-fuchsia-500 focus:ring-offset-gray-900"
                  />
                  <span className="text-white font-medium">
                    Kasuta mock lahendust (ainult tekst, pole pilti)
                  </span>
                </label>
              </div>

              {!formData.is_mock && (
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Logo pilt
                  </label>
                  
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-white/10 rounded-lg p-6 hover:border-fuchsia-500/50 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="logo-upload"
                      />
                      <label
                        htmlFor="logo-upload"
                        className="cursor-pointer flex flex-col items-center gap-2"
                      >
                        <Upload className="w-8 h-8 text-gray-400" />
                        <span className="text-white font-medium">
                          {selectedFile ? selectedFile.name : 'Vali pilt või lohista siia'}
                        </span>
                        <span className="text-xs text-gray-500">
                          PNG, JPG, SVG, WEBP kuni 2MB
                        </span>
                      </label>
                    </div>

                    <div className="text-center text-gray-500 text-sm">või</div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Logo URL (kui soovid kasutada välislinki)
                      </label>
                      <input
                        type="url"
                        value={formData.logo_url}
                        onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                        className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-fuchsia-500"
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                  
                  {(previewUrl || formData.logo_url) && (
                    <div className="mt-6 space-y-6">
                      <div className="p-6 bg-black/50 rounded-lg border border-white/10">
                        <p className="text-sm font-medium text-gray-400 mb-4">Logo seadistused</p>
                        
                        <div className="space-y-6">
                          {/* Zoom / Scale Control */}
                          <div>
                            <div className="flex justify-between items-center mb-3">
                              <label className="text-sm text-gray-300">
                                Zoom (suurus)
                              </label>
                              <span className="text-sm font-mono text-fuchsia-400">
                                {formData.logo_scale}%
                              </span>
                            </div>
                            <input
                              type="range"
                              min="50"
                              max="400"
                              step="5"
                              value={formData.logo_scale}
                              onChange={(e) => setFormData({ ...formData, logo_scale: parseInt(e.target.value) })}
                              className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer slider-thumb"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                              <span>50% (väiksem)</span>
                              <span>400% (suurem)</span>
                            </div>
                          </div>

                          {/* Position X Control */}
                          <div>
                            <div className="flex justify-between items-center mb-3">
                              <label className="text-sm text-gray-300">
                                Horisontaalne positsioon
                              </label>
                              <span className="text-sm font-mono text-fuchsia-400">
                                {formData.logo_position_x}%
                              </span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              step="5"
                              value={formData.logo_position_x}
                              onChange={(e) => setFormData({ ...formData, logo_position_x: parseInt(e.target.value) })}
                              className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer slider-thumb"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                              <span>Vasak</span>
                              <span>Keskele</span>
                              <span>Parem</span>
                            </div>
                          </div>

                          {/* Position Y Control */}
                          <div>
                            <div className="flex justify-between items-center mb-3">
                              <label className="text-sm text-gray-300">
                                Vertikaalne positsioon
                              </label>
                              <span className="text-sm font-mono text-fuchsia-400">
                                {formData.logo_position_y}%
                              </span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              step="5"
                              value={formData.logo_position_y}
                              onChange={(e) => setFormData({ ...formData, logo_position_y: parseInt(e.target.value) })}
                              className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer slider-thumb"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                              <span>Üles</span>
                              <span>Keskele</span>
                              <span>Alla</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-black/50 rounded-lg border border-white/10">
                        <p className="text-sm text-gray-400 mb-3">Eelvaade (nii nagu avalehel näeb):</p>
                        <div className="relative h-32 w-full bg-white/5 rounded-lg overflow-hidden">
                          <div 
                            className="absolute inset-0 flex items-center justify-center"
                            style={{
                              transform: `scale(${formData.logo_scale / 100})`,
                            }}
                          >
                            <div 
                              className="relative w-full h-full"
                              style={{
                                objectPosition: `${formData.logo_position_x}% ${formData.logo_position_y}%`
                              }}
                            >
                              <Image 
                                src={previewUrl || formData.logo_url} 
                                alt="Preview"
                                fill
                                className="object-contain"
                                style={{
                                  objectPosition: `${formData.logo_position_x}% ${formData.logo_position_y}%`
                                }}
                              />
                            </div>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          Seadista zoom ja positsioon nii, et logo oleks hästi nähtav
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={uploading}
                  className="bg-fuchsia-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-fuchsia-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? (
                    <>
                      <div className="w-4 h-4 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Laen üles...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      {editingId ? 'Salvesta muudatused' : 'Lisa klient'}
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={uploading}
                  className="bg-neutral-800 text-gray-400 px-6 py-3 rounded-lg font-bold hover:text-white hover:bg-neutral-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Tühista
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-neutral-950 text-gray-400 border-b border-neutral-800">
              <tr>
                <th className="px-6 py-4 font-medium">Eelvaade</th>
                <th className="px-6 py-4 font-medium">Nimi</th>
                <th className="px-6 py-4 font-medium">Tüüp</th>
                <th className="px-6 py-4 font-medium">Järjekord</th>
                <th className="px-6 py-4 font-medium text-right">Tegevused</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {logos.map((logo) => (
                <tr key={logo.id} className="text-gray-300 hover:bg-neutral-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="w-24 h-12 bg-white/5 rounded-lg flex items-center justify-center overflow-hidden">
                      {logo.is_mock || !logo.logo_url ? (
                        <Type className="w-5 h-5 text-gray-600" />
                      ) : (
                        <div className="relative w-full h-full">
                          <Image 
                            src={logo.logo_url} 
                            alt={logo.name}
                            fill
                            className="object-contain"
                          />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-white">{logo.name}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${
                      logo.is_mock 
                        ? 'bg-gray-500/10 text-gray-500' 
                        : 'bg-green-500/10 text-green-500'
                    }`}>
                      {logo.is_mock ? (
                        <><Type className="w-3 h-3" /> Mock</>
                      ) : (
                        <><ImageIcon className="w-3 h-3" /> Pilt</>
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400">{logo.display_order}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(logo)}
                        className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(logo.id)}
                        className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {logos.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    Ühtegi klienti pole veel lisatud.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-8 p-6 bg-neutral-900/50 rounded-xl border border-neutral-800">
          <h3 className="text-lg font-bold text-white mb-3">Kuidas lisada logo pilte?</h3>
          <ol className="space-y-2 text-gray-400 text-sm">
            <li>1. Eemalda "Mock lahendus" checkbox</li>
            <li>2. Lohista või vali fail üleslaadimisväljas</li>
            <li>3. Vaata eelvaadet ja kinnita</li>
            <li>4. Pilt laaditakse automaatselt Supabase Storage&apos;sse</li>
          </ol>
          <p className="mt-3 text-xs text-gray-500">
            Võid ka kasutada välist URL-i, kui pilt on juba kusagil hostitud.
          </p>
        </div>
      </div>
    </div>
  );
}
