
import React, { useState, useCallback } from 'react';
import ImagePicker from './components/ImagePicker';
import { mergeImagesWithAI } from './services/geminiService';
import { GenerationState } from './types';

const DEFAULT_PROMPT = `Make a photo taken with a Polaroid camera. The photo shoot should look like an ordinary photograph, without an explicit subject or priority. The photo should have a slight blur and a consistent light source, like a flash from a dark room, scattered throughout the photo. Don’t change the face, Change the background behind those two people with white curtains. With that boy Put his arm on my shoulder.`;

const App: React.FC = () => {
  const [youngImage, setYoungImage] = useState<{ data: string, preview: string } | null>(null);
  const [oldImage, setOldImage] = useState<{ data: string, preview: string } | null>(null);
  const [prompt, setPrompt] = useState(DEFAULT_PROMPT);
  const [state, setState] = useState<GenerationState>({
    isLoading: false,
    error: null,
    resultUrl: null
  });

  const handleMerge = async () => {
    if (!youngImage || !oldImage) {
      setState(prev => ({ ...prev, error: "Please upload both photos first." }));
      return;
    }

    setState({ isLoading: true, error: null, resultUrl: null });

    try {
      const result = await mergeImagesWithAI(youngImage.data, oldImage.data, prompt);
      setState({ isLoading: false, error: null, resultUrl: result });
    } catch (err: any) {
      setState({ 
        isLoading: false, 
        error: err.message || "An unexpected error occurred during generation.", 
        resultUrl: null 
      });
    }
  };

  const handleDownload = () => {
    if (state.resultUrl) {
      const link = document.createElement('a');
      link.href = state.resultUrl;
      link.download = 'ai-memory.png';
      link.click();
    }
  };

  const reset = () => {
    setYoungImage(null);
    setOldImage(null);
    setState({ isLoading: false, error: null, resultUrl: null });
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col items-center">
      {/* Header */}
      <header className="max-w-4xl w-full text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 mb-4">
          Time Machine Memory
        </h1>
        <p className="text-slate-400 text-lg md:text-xl">
          احضن نفسك القديمة! ارفع صورة ليك وأنت صغير وصورة وأنت كبير وهنعملك صورة "بولارويد" تجمعكم سوا.
        </p>
      </header>

      <main className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Input Section */}
        <div className="lg:col-span-5 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ImagePicker 
              label="صورتك وأنت صغير" 
              icon="fa-solid fa-baby" 
              preview={youngImage?.preview || null}
              onImageSelect={(data, name) => setYoungImage({ data, preview: data })}
            />
            <ImagePicker 
              label="صورتك حالياً" 
              icon="fa-solid fa-person" 
              preview={oldImage?.preview || null}
              onImageSelect={(data, name) => setOldImage({ data, preview: data })}
            />
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-300">
              تعديل البرومبت (اختياري)
            </label>
            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full h-32 px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all custom-scrollbar resize-none"
              placeholder="وصف الصورة النهائية..."
            />
          </div>

          <button
            onClick={handleMerge}
            disabled={state.isLoading || !youngImage || !oldImage}
            className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all transform active:scale-95 flex items-center justify-center gap-3
              ${(state.isLoading || !youngImage || !oldImage) 
                ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500'}`}
          >
            {state.isLoading ? (
              <>
                <div className="loader"></div>
                <span>جاري دمج الذكريات...</span>
              </>
            ) : (
              <>
                <i className="fa-solid fa-wand-magic-sparkles"></i>
                <span>دمج الصور بالذكاء الاصطناعي</span>
              </>
            )}
          </button>

          {state.error && (
            <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-xl text-red-400 text-sm flex items-start gap-3">
              <i className="fa-solid fa-circle-exclamation mt-1"></i>
              <span>{state.error}</span>
            </div>
          )}
        </div>

        {/* Output Section */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="polaroid-container w-full max-w-md">
            {state.isLoading ? (
              <div className="polaroid-card animate-pulse flex flex-col items-center">
                <div className="w-full aspect-[3/4] bg-slate-800 rounded mb-4 flex items-center justify-center">
                  <i className="fa-solid fa-image text-6xl text-slate-700"></i>
                </div>
                <div className="h-4 w-3/4 bg-slate-800 rounded mb-2"></div>
                <div className="h-4 w-1/2 bg-slate-800 rounded"></div>
              </div>
            ) : state.resultUrl ? (
              <div className="polaroid-card">
                <img 
                  src={state.resultUrl} 
                  alt="Generated memory" 
                  className="w-full h-auto object-cover rounded shadow-inner"
                />
                <div className="mt-8 text-slate-800 text-center font-handwriting italic text-xl">
                  Memories through time...
                </div>
              </div>
            ) : (
              <div className="polaroid-card flex flex-col items-center border-slate-200 border">
                 <div className="w-full aspect-[3/4] bg-slate-100 rounded mb-4 flex flex-col items-center justify-center p-8 text-center">
                  <i className="fa-solid fa-camera-retro text-7xl text-slate-300 mb-6"></i>
                  <p className="text-slate-400 font-medium">النتيجة هتظهر هنا</p>
                  <p className="text-slate-300 text-sm mt-2">ارفع الصور ودوس دمج عشان تبدأ السحر</p>
                </div>
                <div className="h-4 w-3/4 bg-slate-100 rounded mb-2"></div>
                <div className="h-4 w-1/2 bg-slate-100 rounded"></div>
              </div>
            )}
          </div>

          {state.resultUrl && !state.isLoading && (
            <div className="mt-8 flex gap-4">
              <button 
                onClick={handleDownload}
                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-full font-semibold transition-colors flex items-center gap-2"
              >
                <i className="fa-solid fa-download"></i>
                تحميل الصورة
              </button>
              <button 
                onClick={reset}
                className="px-6 py-3 bg-white hover:bg-slate-100 text-slate-900 rounded-full font-semibold transition-colors flex items-center gap-2"
              >
                <i className="fa-solid fa-rotate-left"></i>
                ابدأ من جديد
              </button>
            </div>
          )}
        </div>
      </main>

      <footer className="mt-20 py-8 text-slate-500 text-sm border-t border-slate-800 w-full text-center">
        Powered by Gemini AI • Made for your memories
      </footer>
    </div>
  );
};

export default App;
