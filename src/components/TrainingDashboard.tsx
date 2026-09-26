import { useEffect, useRef, useState } from "react";
import { 
  Activity, 
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
  Layers,
  TrendingUp,
  Hourglass
} from "lucide-react";

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
      className={`w-full max-w-5xl mx-auto font-sans transition-all duration-300 ${isFullscreen ? "bg-[#0a0a0a] p-4 sm:p-8 overflow-y-auto flex flex-col h-screen max-w-none" : ""}`}
    >
      {/* Dashboard Top Bar & Controls */}
      <div className="mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-[#141414] border border-white/10 rounded-2xl p-4 sm:p-5 shadow-xl relative z-10">
        <div className="flex items-center gap-3">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#e8ff9c]/75 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#e8ff9c]"></span>
          </div>
          <div>
            <h2 className="text-base font-medium text-white flex items-center gap-2">
              Modèle SparksLyse 
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#e8ff9c]/10 text-[#e8ff9c] border border-[#e8ff9c]/20">
                {statusData ? statusData.type : "Actif"}
              </span>
            </h2>
            <p className="text-xs text-white/60">
              Suivi de l'apprentissage et des métriques de performance.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full md:w-auto justify-end">
          {/* Interval Selector */}
          <div className="flex items-center gap-1.5 bg-zinc-900 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white/80">
            <Clock className="w-3.5 h-3.5 text-white/50" />
            <span>Mise à jour :</span>
            <select 
              value={refreshInterval}
              onChange={(e) => {
                const val = Number(e.target.value);
                setRefreshInterval(val);
                setCountdown(val);
              }}
              className="bg-transparent text-white focus:outline-none cursor-pointer"
            >
              <option value={15} className="bg-zinc-900">15s</option>
              <option value={30} className="bg-zinc-900">30s</option>
              <option value={60} className="bg-zinc-900">1m</option>
              <option value={300} className="bg-zinc-900">5m</option>
            </select>
          </div>

          {/* Pause / Resume Auto-refresh */}
          <button
            onClick={() => setIsPaused(!isPaused)}
            title={isPaused ? "Reprendre le rafraîchissement" : "Mettre en pause"}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
              isPaused 
                ? "bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20" 
                : "bg-zinc-900 border-white/10 text-white/80 hover:bg-zinc-800"
            }`}
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isPaused ? "En pause" : `${countdown}s`}</span>
          </button>

          {/* Manual Refresh Button */}
          <button
            onClick={handleManualRefresh}
            disabled={isRefreshing || apiLoading}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium bg-[#e8ff9c] text-[#0a0a0a] hover:bg-[#d4eb85] transition-all disabled:opacity-50 cursor-pointer font-semibold shadow-lg"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing || apiLoading ? "animate-spin" : ""}`} />
            <span>Actualiser</span>
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? "Quitter le mode plein écran" : "Mode plein écran"}
            className="p-2 rounded-xl bg-zinc-900 border border-white/10 text-white/80 hover:bg-zinc-800 hover:text-white transition-colors cursor-pointer"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-3 relative z-10 text-sm">
        <button
          onClick={() => setActiveTab("visual")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all cursor-pointer ${
            activeTab === "visual"
              ? "bg-white/10 text-white border border-white/20 shadow-sm"
              : "text-white/60 hover:text-white hover:bg-white/5"
          }`}
        >
          <Activity className="w-4 h-4 text-[#e8ff9c]" />
          <span>État visuel</span>
        </button>

        <button
          onClick={() => setActiveTab("metrics")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all cursor-pointer ${
            activeTab === "metrics"
              ? "bg-white/10 text-white border border-white/20 shadow-sm"
              : "text-white/60 hover:text-white hover:bg-white/5"
          }`}
        >
          <Cpu className="w-4 h-4 text-[#e8ff9c]" />
          <span>Indicateurs</span>
        </button>

        <button
          onClick={() => setActiveTab("logs")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all cursor-pointer ${
            activeTab === "logs"
              ? "bg-white/10 text-white border border-white/20 shadow-sm"
              : "text-white/60 hover:text-white hover:bg-white/5"
          }`}
        >
          <Terminal className="w-4 h-4 text-[#e8ff9c]" />
          <span>Données brutes</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="bg-[#141414] border border-white/10 rounded-2xl overflow-hidden shadow-xl relative z-10">
        {/* Simple Header */}
        <div className="bg-[#1a1a1a] px-4 py-3 border-b border-white/10 flex items-center justify-between text-xs text-white/70">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[#e8ff9c] font-medium">STATUT API</span>
            <span>marvideo.fr/lyseai-api/status.json</span>
          </div>
          <div className="flex items-center gap-2 text-[#e8ff9c]">
            <span className="w-2 h-2 rounded-full bg-[#e8ff9c] animate-pulse"></span>
            <span>Dernière synchro : {new Date(timestamp).toLocaleTimeString()}</span>
          </div>
        </div>

        {/* Tab 1: Visual Feed */}
        {activeTab === "visual" && (
          <div className="p-4 sm:p-6 flex flex-col items-center justify-center min-h-[420px] relative">
            {!imageLoaded && !imageError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#141414]/80 backdrop-blur-sm z-10 gap-3">
                <RefreshCw className="w-6 h-6 text-[#e8ff9c] animate-spin" />
                <p className="text-sm text-white/70">Chargement de l'état actuel...</p>
              </div>
            )}

            {imageError ? (
              <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
                <div className="p-3 rounded-full bg-red-500/10 border border-red-500/20 text-red-400">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-white font-medium text-sm">Impossible de charger l'image</p>
                  <p className="text-xs text-white/50 mt-1">Le serveur distant est temporairement injoignable.</p>
                </div>
                <button
                  onClick={handleManualRefresh}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors cursor-pointer"
                >
                  Réessayer
                </button>
              </div>
            ) : (
              <div className="relative group w-full flex justify-center items-center">
                <img
                  src={src}
                  alt={alt}
                  onLoad={() => setImageLoaded(true)}
                  onError={() => {
                    setImageLoaded(true);
                    setImageError(true);
                  }}
                  className={`max-h-[65vh] w-auto object-contain rounded-xl shadow-lg border border-white/10 transition-opacity duration-500 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
                />
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Metrics */}
        {activeTab === "metrics" && (
          <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Metric Card 1: Loss */}
            <div className="bg-zinc-900/60 border border-white/10 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-white/50 uppercase tracking-wider">Loss (Perte)</span>
                <Activity className="w-4 h-4 text-[#e8ff9c]" />
              </div>
              <div className="text-2xl font-normal text-white mb-1">
                {statusData ? statusData.loss : "3.0901"}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[#e8ff9c]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Phase : {statusData ? statusData.type : "Pre Training"}</span>
              </div>
            </div>

            {/* Metric Card 2: Completion & Tokens */}
            <div className="bg-zinc-900/60 border border-white/10 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-white/50 uppercase tracking-wider">Progression ({statusData ? statusData.completion : "40.08%"})</span>
                <TrendingUp className="w-4 h-4 text-[#e8ff9c]" />
              </div>
              <div className="text-2xl font-normal text-white mb-1">
                {statusData ? statusData.epoch : "3.81B/9.50B"}
              </div>
              <div className="text-xs text-white/50">Tokens traités / Objectif</div>
            </div>

            {/* Metric Card 3: Speed & ETA */}
            <div className="bg-zinc-900/60 border border-white/10 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-white/50 uppercase tracking-wider">Vitesse & ETA</span>
                <Hourglass className="w-4 h-4 text-[#e8ff9c]" />
              </div>
              <div className="text-2xl font-normal text-white mb-1">
                {statusData ? `${statusData.tps} tps` : "9,016 tps"}
              </div>
              <div className="text-xs text-white/50">Temps estimé : {statusData ? statusData.eta : "175.4 h"}</div>
            </div>

            {/* Detailed Cluster Specs */}
            <div className="md:col-span-3 bg-zinc-900/30 border border-white/10 rounded-xl p-6">
              <h3 className="text-sm font-medium text-white mb-4 flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#e8ff9c]" />
                <span>Paramètres actuels du modèle</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs text-white/70">
                <div className="bg-zinc-950 p-3 rounded-lg border border-white/5">
                  <span className="text-white/40 block mb-1">Phase</span>
                  <span className="text-white font-medium">{statusData ? statusData.type : "Pre Training"}</span>
                </div>
                <div className="bg-zinc-950 p-3 rounded-lg border border-white/5">
                  <span className="text-white/40 block mb-1">Tokens</span>
                  <span className="text-white font-medium">{statusData ? statusData.epoch : "3.81B/9.50B"}</span>
                </div>
                <div className="bg-zinc-950 p-3 rounded-lg border border-white/5">
                  <span className="text-white/40 block mb-1">Vitesse</span>
                  <span className="text-white font-medium">{statusData ? statusData.tps : "9,016"} tokens/s</span>
                </div>
                <div className="bg-zinc-950 p-3 rounded-lg border border-white/5">
                  <span className="text-white/40 block mb-1">ETA</span>
                  <span className="text-white font-medium">{statusData ? statusData.eta : "175.4 h"}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Terminal Logs */}
        {activeTab === "logs" && (
          <div className="p-4 sm:p-6 bg-zinc-950 text-xs text-white/80 min-h-[380px] max-h-[480px] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10 text-white/40">
              <span>Historique des points de données (status.json)</span>
              <span>UTF-8</span>
            </div>
            <div className="space-y-2">
              {logs.map((log, index) => {
                const isSync = log.includes("SYNC") || log.includes("INIT");
                return (
                  <div 
                    key={index} 
                    className={`p-2.5 rounded ${
                      isSync 
                        ? "bg-[#e8ff9c]/10 text-[#e8ff9c] border border-[#e8ff9c]/20" 
                        : "bg-zinc-900/60 text-white/70"
                    }`}
                  >
                    {log}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
