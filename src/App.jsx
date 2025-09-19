import { useState } from 'react';
import './App.css';

function App() {
  const [appName, setAppName] = useState('');
  const [appDesc, setAppDesc] = useState('');
  const [features, setFeatures] = useState(['', '']);
  const [language, setLanguage] = useState('ar');
  const [platform, setPlatform] = useState('instagram');
  const [posterUrl, setPosterUrl] = useState(null);

  const addFeature = () => {
    setFeatures([...features, '']);
  };

  const updateFeature = (index, value) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    setFeatures(newFeatures);
  };

  const generatePoster = async () => {
    try {
      const response = await fetch('https://y.posterly-backend.workers.dev/generate-poster', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          app_name: appName,
          app_desc: appDesc,
          features: features.filter(f => f.trim() !== ''),
          language,
          platform
        })
      });

      if (!response.ok) throw new Error('فشل في توليد البوستر');

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setPosterUrl(url);
    } catch (error) {
      alert("حدث خطأ: " + error.message);
    }
  };

  const isArabic = language === 'ar';

  return (
    <div className={`min-h-screen bg-gray-50 p-6 ${isArabic ? 'font-tajawal text-right' : 'font-poppins text-left'}`}>
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
        
        {/* نموذج الإدخال */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h1 className="text-2xl font-bold text-indigo-700 mb-2">🎨 بوسترلي</h1>
          <p className="text-gray-600 mb-6">صمم بوسترك بذكاء، بلمسة واحدة!</p>

          <div className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">اسم التطبيق</label>
              <input
                type="text"
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                className="w-full p-3 border rounded-lg"
                placeholder={isArabic ? "أدخل اسم التطبيق..." : "Enter app name..."}
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">وصف التطبيق</label>
              <textarea
                value={appDesc}
                onChange={(e) => setAppDesc(e.target.value)}
                className="w-full p-3 border rounded-lg h-24"
                placeholder={isArabic ? "صف تطبيقك هنا..." : "Describe your app here..."}
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">المميزات</label>
              {features.map((feature, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => updateFeature(index, e.target.value)}
                    className="flex-1 p-3 border rounded-lg"
                    placeholder={isArabic ? `ميزة ${index + 1}` : `Feature ${index + 1}`}
                  />
                </div>
              ))}
              <button
                onClick={addFeature}
                className="text-indigo-600 hover:text-indigo-800 font-medium"
              >
                + إضافة ميزة أخرى
              </button>
            </div>

            <div>
              <label className="block mb-1 font-medium">اللغة</label>
              <div className="flex gap-4">
                <label>
                  <input
                    type="radio"
                    value="ar"
                    checked={language === 'ar'}
                    onChange={() => setLanguage('ar')}
                  /> {isArabic ? "العربية" : "Arabic"}
                </label>
                <label>
                  <input
                    type="radio"
                    value="id"
                    checked={language === 'id'}
                    onChange={() => setLanguage('id')}
                  /> Bahasa Indonesia
                </label>
              </div>
            </div>

            <div>
              <label className="block mb-1 font-medium">المنصة</label>
              <div className="flex gap-4 flex-wrap">
                {[
                  { key: 'instagram', label: 'إنستغرام' },
                  { key: 'facebook', label: 'فيسبوك' },
                  { key: 'tiktok', label: 'تيك توك' }
                ].map(plat => (
                  <label key={plat.key}>
                    <input
                      type="radio"
                      value={plat.key}
                      checked={platform === plat.key}
                      onChange={() => setPlatform(plat.key)}
                    /> {plat.label}
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={generatePoster}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition"
            >
              🚀 أنشئ البوستر الآن
            </button>
          </div>
        </div>

        {/* معاينة البوستر */}
        <div className="bg-white p-6 rounded-xl shadow-md flex flex-col">
          <h2 className="text-xl font-bold mb-4">📊 معاينة البوستر</h2>
          <div className="bg-gray-100 rounded-lg flex-1 flex items-center justify-center">
            {posterUrl ? (
              <img src={posterUrl} alt="Generated Poster" className="max-w-full max-h-96 object-contain" />
            ) : (
              <p className="text-gray-500">سيظهر البوستر هنا بعد التوليد...</p>
            )}
          </div>
          {posterUrl && (
            <a
              href={posterUrl}
              download="posterly-poster.jpg"
              className="mt-4 bg-green-600 text-white py-2 rounded-lg text-center font-medium hover:bg-green-700"
            >
              ⬇️ حمل البوستر
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;