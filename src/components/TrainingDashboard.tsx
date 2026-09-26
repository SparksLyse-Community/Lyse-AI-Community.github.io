import { useEffect, useRef, useState } from "react";
import { 
  RefreshCw, 
  Maximize2, 
  Minimize2, 
  Terminal, 
  Clock, 
  Cpu, 
  Zap, 
  CheckCircle2, 
  AlertCircle,
  Play,
  Pause,
  Layers
} from "lucide-react";
import Button from "./ui/Button";

interface TrainingDashboardProps {
  imageUrl: string;
  alt: string;
}

interface TrainingStatus {
  timestamp: number;
  type: string;
  epoch: string;
  completion: string;
  loss: number;
  tps: string;
  eta: string;
}

export default function TrainingDashboard({ imageUrl, alt }: TrainingDashboardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [timestamp, setTimestamp] = useState<number>(Date.now());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState<number>(30); // in seconds
  const [isPaused, setIsPaused] = useState(false);
  const [countdown, setCountdown] = useState<number>(30);
  const [activeTab, setActiveTab] = useState<"visual" | "metrics" | "logs">("visual");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const [statusData, setStatusData] = useState<TrainingStatus | null>(null);
  const [apiLoading, setApiLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([
    "[INIT] Connexion au pipeline d'entraînement SparksLyse...",
    "[FETCH] Récupération des données depuis status.json..."
  ]);

  const fetchTrainingStatus = async () => {
    setApiLoading(true);
    try {
      const res = await fetch("https://marvideo.fr/lyseai-api/status.json");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const latest = data[data.length - 1];
          setStatusData(latest);
          
          const nowStr = new Date().toTimeString().split(' ')[0];
          setLogs(prev => [
            ...prev,
            `[${nowStr}] [SYNC] Phase: ${latest.type} | Tokens: ${latest.epoch} | Loss: ${latest.loss} | TPS: ${latest.tps} | ETA: ${latest.eta}`
          ]);
        }
      }
    } catch (err) {
      console.error("Failed to fetch training status JSON:", err);
    } finally {
      setApiLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainingStatus();
  }, []);

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          triggerRefresh();
          return refreshInterval;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [refreshInterval, isPaused]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => {
        console.error("Error attempting to enable fullscreen:", err);
      });
    } else {
      document.exitFullscreen?.().catch((err) => {
        console.error("Error attempting to exit fullscreen:", err);
      });
    }
  };

  const triggerRefresh = () => {
    setIsRefreshing(true);
    setTimestamp(Date.now());
    setImageLoaded(false);
    setImageError(false);
    fetchTrainingStatus();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
    setCountdown(refreshInterval);
  };

  const handleManualRefresh = () => {
    triggerRefresh();
  };

  const src = `${imageUrl}${imageUrl.includes('?') ? '&' : '?'}_t=${timestamp}`;

  return (
    <div 
      ref={containerRef}
      className={`w-full font-sans transition-all duration-300 ${isFullscreen ? "bg-[#0a0a0a] p-4 sm:p-8 overflow-y-auto flex flex-col h-screen" : ""}`}
    >
      {/* Dashboard Top Bar & Controls */}
      <div className="mb-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#e8ff9c]/75 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#e8ff9c]"></span>
          </div>
          <div>
            <h2 className="text-xl font-normal text-white flex items-center gap-3">
              SparksLyse-v1
              <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/5 text-white/50 border border-white/10">
                {statusData ? statusData.type : "Actif"}
              </span>
            </h2>
            <p className="text-sm text-white/45 mt-1">
              Flux télémétrique des clusters de calcul
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Interval Selector */}
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-xs text-white/60">
            <Clock className="w-3.5 h-3.5 opacity-50" />
            <select 
              value={refreshInterval}
              onChange={(e) => {
                const val = Number(e.target.value);
                setRefreshInterval(val);
                setCountdown(val);
              }}
              className="bg-transparent text-white focus:outline-none cursor-pointer"
            >
              <option value={15} className="bg-[#141414]">15s</option>
              <option value={30} className="bg-[#141414]">30s</option>
              <option value={60} className="bg-[#141414]">1m</option>
            </select>
          </div>

          {/* Pause / Resume Auto-refresh */}
          <button
            onClick={() => setIsPaused(!isPaused)}
            className={`flex h-10 w-10 items-center justify-center rounded-full border transition-all ${
              isPaused 
                ? "bg-[#e8ff9c]/10 border-[#e8ff9c]/30 text-[#e8ff9c]" 
                : "bg-white/5 border-white/10 text-white/60 hover:text-white"
            }`}
            title={isPaused ? "Reprendre" : "Pause"}
          >
            {isPaused ? <Play className="w-4 h-4 fill-current" /> : <Pause className="w-4 h-4 fill-current" />}
          </button>

          {/* Manual Refresh Button */}
          <Button
            variant="primary"
            size="sm"
            onClick={handleManualRefresh}
            disabled={isRefreshing || apiLoading}
            className="!min-h-10 px-5 bg-[#e8ff9c] text-black border-0 hover:opacity-90"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-2 ${isRefreshing || apiLoading ? "animate-spin" : ""}`} />
            Actualiser
          </Button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white transition-all"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div class="flex flex-col gap-8">
        {/* Visual Feed Section */}
        <div class="flex flex-col gap-4">
          <div class="flex items-center justify-between px-2">
            <span class="text-[10px] uppercase tracking-[0.2em] text-white/45 font-medium">Visualisation d'état</span>
          </div>
          
          <div class="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-white/2.5 backdrop-blur-sm">
            <div class="h-full w-full flex items-center justify-center p-4">
              {!imageLoaded && !imageError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a0a0a]/50 z-10">
                  <RefreshCw className="w-6 h-6 text-white/40 animate-spin" />
                </div>
              )}
              {imageError ? (
                <div className="flex flex-col items-center text-center gap-4">
                  <AlertCircle className="w-8 h-8 text-white/20" />
                  <p className="text-xs text-white/40">Flux temporairement indisponible</p>
                </div>
              ) : (
                <img
                  src={src}
                  alt={alt}
                  onLoad={() => setImageLoaded(true)}
                  onError={() => {
                    setImageLoaded(true);
                    setImageError(true);
                  }}
                  className={`max-h-full max-w-full object-contain transition-opacity duration-700 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
                />
              )}
            </div>
            
            {/* Overlay info */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
              <div className="px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[9px] uppercase tracking-widest text-white/60">
                Live Feed • {new Date(timestamp).toLocaleTimeString()}
              </div>
              {isRefreshing && (
                <div className="px-3 py-1.5 rounded-full bg-white text-black text-[9px] uppercase tracking-widest font-bold">
                  Synchronisation
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

