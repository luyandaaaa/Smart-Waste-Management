import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Scan.css'; // Make sure to use this CSS file
import RecyclingBanner from '../assets/Recycling-banner.webp';

const wasteClasses = {
  en: ['Plastic', 'Paper', 'Metal', 'Glass', 'Organic', 'E-waste'],
  zu: ['Ipulasitiki', 'Iphepha', 'Insimbi', 'Ingilazi', 'Okwemvelo', 'I-e-waste'],
  af: ['Plastiek', 'Papier', 'Metaal', 'Glas', 'Organies', 'E-afval'],
};

// Map Hugging Face classifications to our waste categories
const classificationMap = {
  'cardboard': 'Paper',
  'glass': 'Glass',
  'metal': 'Metal',
  'paper': 'Paper',
  'plastic': 'Plastic',
  'trash': 'Organic'
};

const wasteDetails = {
  Plastic: {
    description: "Recyclable plastic container",
    disposal: "Yellow recycling bin",
    icon: "♻️",
    color: "#3498db",
    tips: ["Rinse before recycling", "Remove caps and lids", "Flatten containers to save space"],
    features: ["Varied colors", "Smooth texture", "Manufactured shapes"]
  },
  Paper: {
    description: "Paper or cardboard material",
    disposal: "Blue recycling bin",
    icon: "📄",
    color: "#e74c3c",
    tips: ["Flatten cardboard boxes", "Remove any plastic packaging", "Keep dry and clean"],
    features: ["White/light colors", "Fibrous texture", "Rectangular forms"]
  },
  Metal: {
    description: "Metal can or container",
    disposal: "Green recycling bin",
    icon: "🥫",
    color: "#95a5a6",
    tips: ["Rinse cans before recycling", "Remove paper labels if possible", "Crush aluminum cans to save space"],
    features: ["High reflectivity", "Silvery tones", "Smooth surfaces"]
  },
  Glass: {
    description: "Glass bottle or jar",
    disposal: "Purple glass bin",
    icon: "🍾",
    color: "#9b59b6",
    tips: ["Rinse thoroughly", "Remove metal caps and lids", "Don't mix with other recyclables"],
    features: ["Transparency", "Smoothness", "Blue-green tints"]
  },
  Organic: {
    description: "Food waste or compostable material",
    disposal: "Brown compost bin",
    icon: "🍎",
    color: "#27ae60",
    tips: ["No plastic in compost", "Collect in compostable bags", "Mix with yard waste"],
    features: ["Natural colors", "Irregular shapes", "Rough textures"]
  },
  "E-waste": {
    description: "Electronic waste or batteries",
    disposal: "Special e-waste facility",
    icon: "🔋",
    color: "#f39c12",
    tips: ["Never put in regular bins", "Check for drop-off locations", "Remove batteries if possible"],
    features: ["Complex shapes", "Mixed materials", "Metallic components"]
  }
};

export default function Scan() {
  // Mock translation functions for demo
  const t = (key) => {
    const translations = {
      'back': 'Back',
      'scan_title': 'AI Waste Scanner',
      'camera_error': 'Camera access denied',
      'classification_error': 'Classification failed',
      'disposal_logged': 'Disposal logged',
      'initializing': 'Initializing...',
      'quality_analysis': 'Quality analysis...',
      'color_analysis': 'Color analysis...',
      'texture_analysis': 'Texture analysis...',
      'shape_analysis': 'Shape analysis...',
      'finalizing': 'Finalizing...',
      'camera_not_started': 'Camera not started',
      'camera_instructions': 'Start camera or upload image',
      'camera_active': 'Camera Active',
      'start_camera': 'Start Camera',
      'upload_image': 'Upload Image',
      'scan_ai': 'Scan with AI',
      'analyze_ai': 'Analyze with AI',
      'scanning': 'Scanning...',
      'analyzing': 'Analyzing...',
      'points_earned': 'Points Earned',
      'confidence': 'Confidence',
      'description': 'Description',
      'material_features': 'Material Features',
      'disposal_tips': 'Disposal Tips',
      'log_disposal': 'Log Disposal',
      'points': 'Points',
      'how_to_use': 'How to Use AI Waste Scanner',
      'scan_step_1': 'Take a photo or upload an image of your waste item',
      'scan_step_2': 'Our AI will analyze and classify the material type',
      'scan_step_3': 'Follow the disposal instructions',
      'scan_step_4': 'Earn points for proper waste disposal',
      'quality_tips': 'For Best Results',
      'quality_tip_desc': 'Follow these tips for accurate classification:',
      'quality_tip_1': 'Ensure good lighting',
      'quality_tip_2': 'Hold camera steady',
      'quality_tip_3': 'Get close to the item',
      'quality_tip_4': 'Use a plain background',
      'plastic': 'Plastic',
      'paper': 'Paper',
      'metal': 'Metal',
      'glass': 'Glass'
    };
    return translations[key] || key;
  };
  
  const i18n = {
    language: 'en',
    changeLanguage: (lang) => console.log('Language changed to:', lang)
  };
  
  const videoRef = useRef();
  const canvasRef = useRef();
  const fileInputRef = useRef();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cameraStarted, setCameraStarted] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [scanProgress, setScanProgress] = useState(0);
  const [showScanAnimation, setShowScanAnimation] = useState(false);
  const [currentStep, setCurrentStep] = useState('');
  
  // Using your provided Hugging Face API token
  const apiKey = import.meta.env.VITE_HF_API_TOKEN;

  // Function to convert image to base64
  const imageToBase64 = (imageElement) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions to match image
    canvas.width = imageElement.width || imageElement.videoWidth || 300;
    canvas.height = imageElement.height || imageElement.videoHeight || 300;
    
    // Draw image to canvas
    ctx.drawImage(imageElement, 0, 0, canvas.width, canvas.height);
    
    // Convert to base64
    return canvas.toDataURL('image/jpeg', 0.8);
  };

  // Function to classify using Hugging Face API
  const classifyWithHuggingFace = async (imageBase64) => {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/yangy50/garbage-classification",
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          inputs: imageBase64.split(',')[1] // Remove data:image/jpeg;base64, prefix
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Hugging Face API error: ${response.status}`);
    }

    return await response.json();
  };

  // Enhanced classification function
  const analyzeWasteWithAI = async (imageSource) => {
    try {
      setLoading(true);
      setError(null);
      setResult(null);
      setShowScanAnimation(true);
      setScanProgress(0);
      setCurrentStep(t('initializing'));

      // Convert image to base64
      const imageElement = imageSource === 'camera' ? videoRef.current : 
        document.querySelector('.scanner-image');
      
      if (!imageElement) {
        throw new Error('No image source available');
      }

      const base64Image = imageToBase64(imageElement);
      
      setCurrentStep(t('connecting_ai'));
      setScanProgress(20);
      await new Promise(resolve => setTimeout(resolve, 500));

      let classificationResult = null;
      let confidence = 0;
      let detectedClass = '';

      try {
        // Use Hugging Face specialized model
        setCurrentStep(t('analyzing_model'));
        setScanProgress(40);
        
        const hfResult = await classifyWithHuggingFace(base64Image);
        
        if (hfResult && hfResult.length > 0) {
          // Find the prediction with the highest confidence score
          const topPrediction = hfResult.reduce((maxItem, currentItem) => 
            currentItem.score > maxItem.score ? currentItem : maxItem, hfResult[0]);
            
          confidence = Math.round(topPrediction.score * 100);
          detectedClass = classificationMap[topPrediction.label.toLowerCase()] || 'Organic';
          classificationResult = { source: 'HuggingFace', data: hfResult };
        }
      } catch (hfError) {
        console.error('Hugging Face classification failed:', hfError);
        throw new Error(t('classification_error'));
      }

      setCurrentStep(t('processing_results'));
      setScanProgress(80);
      await new Promise(resolve => setTimeout(resolve, 500));

      setCurrentStep(t('finalizing'));
      setScanProgress(100);
      await new Promise(resolve => setTimeout(resolve, 300));

      if (!detectedClass) {
        throw new Error('Could not classify the waste item');
      }

      // Get localized class name
      const language = i18n.language || 'en';
      const availableClasses = wasteClasses[language] || wasteClasses.en;
      const englishIndex = wasteClasses.en.indexOf(detectedClass);
      const localizedClass = englishIndex >= 0 ? availableClasses[englishIndex] : detectedClass;

      // Generate analysis breakdown based on AI results
      const analysisBreakdown = {
        aiModel: classificationResult.source,
        confidence: confidence,
        rawData: classificationResult.data
      };

      setResult({
        type: localizedClass,
        englishClass: detectedClass,
        confidence: confidence,
        points: Math.floor(confidence / 10) + 5, // Points based on confidence
        ...wasteDetails[detectedClass],
        analysis: analysisBreakdown,
        aiPowered: true
      });

      setShowScanAnimation(false);
      setLoading(false);

    } catch (err) {
      console.error('AI Classification error:', err);
      setError(`${t('classification_error')}: ${err.message}`);
      setLoading(false);
      setShowScanAnimation(false);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: 640, 
          height: 480,
          facingMode: 'environment'
        } 
      });
      videoRef.current.srcObject = stream;
      setCameraStarted(true);
      setError(null);
      setUploadedImage(null);
    } catch (err) {
      console.error('Camera error:', err);
      setError(t('camera_error'));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (videoRef.current?.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      setCameraStarted(false);
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setUploadedImage(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const captureFromCamera = () => {
    if (cameraStarted) {
      analyzeWasteWithAI('camera');
    }
  };

  const analyzeUploadedImage = () => {
    if (uploadedImage) {
      analyzeWasteWithAI('upload');
    }
  };

  const logDisposal = () => {
    if (result) {
      console.log('Logging disposal:', result);
      alert(`${t('disposal_logged')}: ${result.type} → ${result.disposal}`);
      setResult(null);
    }
  };

  // Cleanup camera stream on unmount
  useEffect(() => {
    const videoElement = videoRef.current;
    return () => {
      if (videoElement?.srcObject) {
        const tracks = videoElement.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="rewards-container" style={{
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('${RecyclingBanner}')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      minHeight: '100vh',
      position: 'relative',
      overflowX: 'hidden'
    }}>
      {/* Header - Updated to match Municipal/Rewards page */}
      <header className="app-header">
        <div className="header-content">
          <div className="municipal-header">
            <Link to="/" className="back-btn">
              &larr; {t('back')}
            </Link>
            <div className="municipal-title">
              <h1 className="app-title">{t('scan_title')}</h1>
            </div>
            <div className="header-controls">
              <select 
                onChange={(e) => i18n.changeLanguage(e.target.value)}
                className="language-selector"
              >
                <option value="en">🇺🇸 English</option>
                <option value="zu">🇿🇦 isiZulu</option>
                <option value="af">🇿🇦 Afrikaans</option>
              </select>
            </div>
          </div>
        </div>
      </header>
      
      <div className="scanner-content">
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        
        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}

        {/* Camera/Upload Section - Fixed structure */}
        <div className="video-container">
          {uploadedImage ? (
            <div className="relative">
              <div className="image-preview-container">
                <img 
                  src={uploadedImage} 
                  alt="Uploaded waste item" 
                  className="scanner-image"
                />
                {showScanAnimation && (
                  <div className="scan-animation">
                    <div className="scan-line" style={{ top: `${scanProgress}%` }}></div>
                    <div className="scan-progress">
                      <div className="scan-step">{currentStep}</div>
                      <div>{scanProgress}%</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : cameraStarted ? (
            <div className="relative">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted
                className="scanner-video"
              />
              
              {showScanAnimation && (
                <div className="scan-animation">
                  <div className="scan-line" style={{ top: `${scanProgress}%` }}></div>
                  <div className="scan-progress">
                    <div className="scan-step">{currentStep}</div>
                    <div>{scanProgress}%</div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="camera-placeholder">
              
            </div>
          )}
          
          {/* Controls */}
          <div className="camera-controls">
            <button 
              onClick={startCamera}
              className={`camera-btn ${cameraStarted ? 'active' : ''}`}
              disabled={cameraStarted || uploadedImage}
            >
              {cameraStarted ? '📸 ' + t('camera_active') : '📸 ' + t('start_camera')}
            </button>
            
            <button 
              onClick={() => fileInputRef.current.click()}
              className="upload-btn"
              disabled={loading}
            >
              📁 {t('upload_image')}
            </button>
            
            {cameraStarted && (
              <button 
                onClick={captureFromCamera}
                className={`classify-btn ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {loading ? t('scanning') : '🔍 ' + t('scan_ai')}
              </button>
            )}
            
            {uploadedImage && (
              <button 
                onClick={analyzeUploadedImage}
                className={`classify-btn ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {loading ? t('analyzing') : '🤖 ' + t('analyze_ai')}
              </button>
            )}

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              style={{ display: 'none' }}
            />
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className="result-card" style={{ borderColor: result.color }}>
            <div className="result-header">
              <div className="result-icon" style={{ backgroundColor: `${result.color}20` }}>
                {result.icon}
              </div>
              <div>
                <div className="result-type" style={{ color: result.color }}>
                  {result.type} → {result.disposal}
                </div>
                <p className="points-earned">+{result.points} {t('points_earned')}</p>
              </div>
            </div>
            
            <div className="result-details">
              <div className="detail-item">
                <span className="detail-label">{t('confidence')}:</span>
                <span className="detail-value">{result.confidence}%</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">{t('description')}:</span>
                <span className="detail-value">{result.description}</span>
              </div>
            </div>
            
            <div className="material-features">
              <h4>{t('material_features')}</h4>
              <ul>
                {result.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
            
            <div className="disposal-tips">
              <h4>{t('disposal_tips')}</h4>
              <ul>
                {result.tips.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </div>
            
            <button 
              onClick={logDisposal}
              className="log-btn"
            >
              📋 {t('log_disposal')} +{result.points} {t('points')}
            </button>
          </div>
        )}

        {/* Instructions */}
        {!result && !loading && (
          <div className="scan-guide">
            <h3>{t('how_to_use')}</h3>
            <ol>
              <li>{t('scan_step_1')}</li>
              <li>{t('scan_step_2')}</li>
              <li>{t('scan_step_3')}</li>
              <li>{t('scan_step_4')}</li>
            </ol>
            
            <div className="quality-warning">
              <h4>{t('quality_tips')}</h4>
              <p>{t('quality_tip_desc')}</p>
              <ul>
                <li>{t('quality_tip_1')}</li>
                <li>{t('quality_tip_2')}</li>
                <li>{t('quality_tip_3')}</li>
                <li>{t('quality_tip_4')}</li>
              </ul>
            </div>
            
            <div className="examples-grid">
              <div className="example">
                <div className="example-icon">🥤</div>
                <span>{t('plastic')}</span>
              </div>
              <div className="example">
                <div className="example-icon">📦</div>
                <span>{t('paper')}</span>
              </div>
              <div className="example">
                <div className="example-icon">🥫</div>
                <span>{t('metal')}</span>
              </div>
              <div className="example">
                <div className="example-icon">🍾</div>
                <span>{t('glass')}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}